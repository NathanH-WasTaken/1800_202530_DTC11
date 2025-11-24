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
  const earnedXP = Math.floor(totalSeconds / 5);

  if (window.xpManager && earnedXP > 0) {
    window.xpManager.gainXP(earnedXP);
    alert(`Workout complete! You earned ${earnedXP} XP`);
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
