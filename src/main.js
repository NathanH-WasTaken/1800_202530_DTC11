import { db } from "./firebaseConfig.js";
import {
  doc,
  onSnapshot,
  collection,
  deleteDoc,
  addDoc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthReady } from "./authentication";
import { XPManager } from "./xpManager.js";

function loadPastExercises(user) {
  const list = document.getElementById("pastExerciseList");
  const template = document.getElementById("pastExerciseTemplate");

  const ref = collection(db, "users", user.uid, "pastExercises");

  onSnapshot(ref, (snapshot) => {
    list.innerHTML = "";

    snapshot.forEach((docSnap) => {
      //Get the name of the workout and it's id
      const w = docSnap.data();
      const id = docSnap.id;

      const card = template.content.cloneNode(true);

      card.querySelector(".workoutTitle").textContent = w.name; // Generate a card of the workout
      card.querySelector(".workoutImg").src = `./images/${w.code}.png`;

      const pastRemoveBtn = card.querySelector(".pastRemoveBtn"); //Remove from past exercises
      pastRemoveBtn.addEventListener("click", async () => {
        const sure = confirm(
          "Are you sure you want to remove this from history?"
        );
        if (!sure) return;

        await deleteDoc(doc(db, "users", user.uid, "pastExercises", id));
      });

      const addBtn = card.querySelector(".addBtn"); //Add to current exercises
      addBtn.addEventListener("click", async () => {
        const currentRef = collection(
          db,
          "users",
          user.uid,
          "currentExercises"
        );

        await addDoc(currentRef, {
          name: w.name,
          code: w.code,
          addedAt: new Date(),
        });

        await deleteDoc(doc(db, "users", user.uid, "pastExercises", id));
      });

      list.appendChild(card);
    });
  });
}

function loadCurrentExercises(user) {
  const list = document.getElementById("currentExerciseList");
  const template = document.getElementById("currentExerciseTemplate");

  const ref = collection(db, "users", user.uid, "currentExercises");

  onSnapshot(ref, (snapshot) => {
    list.innerHTML = "";

    snapshot.forEach((docSnap) => {
      //Get the name of the workout and it's id
      const w = docSnap.data();
      const id = docSnap.id;

      // Clone the original card
      const card = template.content.cloneNode(true);

      // Insert data
      card.querySelector(".workoutTitle").textContent = w.name;
      card.querySelector(".workoutImg").src = `./images/${w.code}.png`;

      //Remove Button
      const removeBtn = card.querySelector(".removeBtn");
      removeBtn.addEventListener("click", async () => {
        const sure = confirm("Are you sure you want to remove this exercise?");
        if (!sure) return;

        await deleteDoc(doc(db, "users", user.uid, "currentExercises", id));
      });

      const finishBtn = card.querySelector(".finishBtn");
      finishBtn.addEventListener("click", async () => {
        try {
          const pastRef = collection(db, "users", user.uid, "pastExercises");

          // Save to past exercises using the same ID
          await setDoc(doc(pastRef, id), {
            name: w.name,
            code: w.code,
            finishedAt: new Date(),
          });

          // Increment lifetime completions
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);

          if (!snap.exists() || snap.data().totalCompletions === undefined) {
            await setDoc(
              userRef,
              { totalCompletions: 1, totalTimeSpent: 0 },
              { merge: true }
            );
          } else {
            await updateDoc(userRef, { totalCompletions: increment(1) });
          }

          // Remove from current exercises
          await deleteDoc(doc(db, "users", user.uid, "currentExercises", id));
        } catch (err) {
          console.error("Error finishing exercise:", err);
        }
      });

      list.appendChild(card);
    });
  });
}

function showDashboard() {
  const nameElement = document.getElementById("user-name");

  onAuthReady(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    loadCurrentExercises(user);
    loadPastExercises(user);

    // Code block below is for the total completed exercises
    const userRef = doc(db, "users", user.uid);
    const totalCompleted = document.getElementById("totalCompletions");
    if (totalCompleted) {
      onSnapshot(userRef, (snap) => {
        const data = snap.data();
        totalCompleted.textContent = `Lifetime Completed Exercises: ${
          data?.totalCompletions ?? 0
        }`;
      });
    }

    const name = user.displayName || user.email;
    if (nameElement) {
      nameElement.textContent = `${name}!`;
    }

    const xp = new XPManager(user);
    await xp.init();
    window.xpManager = xp;

    // Add finished workout to database
    window.saveWorkoutToFirebase = async (duration, earnedXP) => {
      try {
        const workoutsRef = collection(db, "users", user.uid, "workouts");
        await addDoc(workoutsRef, {
          title: document.getElementById("workoutTitle").textContent,
          duration,
          earnedXP,
          createdAt: serverTimestamp(),
        });
        console.log("Workout saved to Firestore:", {
          title: document.getElementById("workoutTitle").textContent,
          duration,
          earnedXP,
        });
      } catch (error) {
        console.error("Error saving workout:", error);
      }
    };

    // Placeholder for gaining XP
    const gainXPButton = document.getElementById("gainXPButton");
    if (gainXPButton) {
      gainXPButton.addEventListener("click", () => {
        xp.gainXP(50);
      });
    }
  });
}

function readQuote(day) {
  const quoteDocRef = doc(db, "quotes", day); // Get a reference to the document

  onSnapshot(
    quoteDocRef,
    (docSnap) => {
      // Listen for real-time updates
      if (docSnap.exists()) {
        document.getElementById("quote-goes-here").innerHTML =
          docSnap.data().quote;
      } else {
        console.log("No such document!");
      }
    },
    (error) => {
      console.error("Error listening to document: ", error);
    }
  );
}

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const today = dayNames[new Date().getDay()];

// Event listeners for timer buttons
const exerciseList = document.getElementById("currentExerciseList");
exerciseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("startBtn")) {
    start(e.target.closest(".exerciseCard"));
  }
  if (e.target.classList.contains("pauseBtn")) {
    pause(e.target.closest(".exerciseCard"));
  }
  if (e.target.classList.contains("finishBtn")) {
    finishWorkout(e.target.closest(".exerciseCard"));
  }
});

// create timer variables
function initCard(card) {
  if (!card._timerInitialized) {
    card.display = card.querySelector(".exerciseTimer");
    card.timer = null;
    card.startTime = 0;
    card.elapsedTime = 0;
    card.isRunning = false;
    card._timerInitialized = true;
  }
}

// start timer
function start(card) {
  initCard(card);

  const startBtn = card.querySelector(".startBtn");
  const pauseBtn = card.querySelector(".pauseBtn");

  if (!card.isRunning) {
    card.startTime = Date.now() - card.elapsedTime;
    card.timer = setInterval(() => update(card), 10);
    card.isRunning = true;

    startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
  }
}

// pause timer
function pause(card) {
  initCard(card);

  const startBtn = card.querySelector(".startBtn");
  const pauseBtn = card.querySelector(".pauseBtn");

  if (card.isRunning) {
    clearInterval(card.timer);
    card.elapsedTime = Date.now() - card.startTime;
    card.isRunning = false;

    pauseBtn.classList.add("hidden");
    startBtn.classList.remove("hidden");
  }
}

// finish timer and save to db
function finishWorkout(card) {
  initCard(card);

  clearInterval(card.timer);
  card.isRunning = false;

  const startBtn = card.querySelector(".startBtn");
  const pauseBtn = card.querySelector(".pauseBtn");

  pauseBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");

  const totalSeconds = Math.floor(card.elapsedTime / 1000);
  // XP earned per sec of exercise
  const earnedXP = Math.floor(totalSeconds * 2);

  if (window.xpManager && earnedXP > 0) {
    window.xpManager.gainXP(earnedXP);
    // Show workout completion modal
    document.getElementById("completedWorkoutName").textContent =
      card.querySelector(".workoutTitle").textContent;
    document.getElementById("earnedXPValue").textContent = earnedXP;
    document.getElementById("workoutCompleteModal").classList.remove("hidden");
    document.getElementById("workoutCompleteModal").classList.add("flex");
  }

  if (window.saveWorkoutToFirebase) {
    window.saveWorkoutToFirebase(totalSeconds, earnedXP);
  }

  card.elapsedTime = 0;
  card.startTime = 0;
  card.display.textContent = "00:00:00:00";
  card.timer = null;
}

// update timer
function update(card) {
  initCard(card);

  card.elapsedTime = Date.now() - card.startTime;

  let hours = Math.floor(card.elapsedTime / (1000 * 60 * 60));
  let minutes = Math.floor((card.elapsedTime / (1000 * 60)) % 60);
  let seconds = Math.floor((card.elapsedTime / 1000) % 60);
  let miliseconds = Math.floor((card.elapsedTime % 1000) / 10);

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  miliseconds = String(miliseconds).padStart(2, "0");

  card.display.textContent = `${hours}:${minutes}:${seconds}:${miliseconds}`;
}

const closeWorkoutCompleteBtn = document.getElementById(
  "closeWorkoutCompleteBtn"
);
const workoutCompleteModal = document.getElementById("workoutCompleteModal");

// Close button
closeWorkoutCompleteBtn.addEventListener("click", () => {
  workoutCompleteModal.classList.add("hidden");
  workoutCompleteModal.classList.remove("flex");
});

// Clicking outside modal closes it
workoutCompleteModal.addEventListener("click", (e) => {
  if (e.target === workoutCompleteModal) {
    workoutCompleteModal.classList.add("hidden");
    workoutCompleteModal.classList.remove("flex");
  }
});

readQuote(today);
showDashboard();
