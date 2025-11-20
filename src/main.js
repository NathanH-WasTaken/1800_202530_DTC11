import { db } from "./firebaseConfig.js";
import { doc, onSnapshot, collection, deleteDoc, addDoc } from "firebase/firestore";
import { onAuthReady } from "./authentication";
import { XPManager } from "./xpManager.js";

function loadPastExercises(user) {
  const list = document.getElementById("pastExerciseList");
  const template = document.getElementById("pastExerciseTemplate");

  const ref = collection(db, "users", user.uid, "pastExercises");

  onSnapshot(ref, (snapshot) => {
    list.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const w = docSnap.data();
      const id = docSnap.id;

      const card = template.content.cloneNode(true);

      card.querySelector(".workoutTitle").textContent = w.name;
      card.querySelector(".workoutImg").src = `./images/${w.code}.png`;

      const pastRemoveBtn = card.querySelector(".pastRemoveBtn");
      pastRemoveBtn.addEventListener("click", async () => {
        const sure = confirm("Are you sure you want to remove this from history?");
        if (!sure) return;

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
        const pastRef = collection(db, "users", user.uid, "pastExercises");

        // Save to past exercises
        await addDoc(pastRef, {
          name: w.name,
          code: w.code,
          finishedAt: new Date(),
        });

        // Remove from current exercises
        await deleteDoc(doc(db, "users", user.uid, "currentExercises", id));
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

readQuote(today);
showDashboard();
