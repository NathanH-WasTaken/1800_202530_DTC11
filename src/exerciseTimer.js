const display = document.getElementById("exerciseTimer");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

function start() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(update, 10);
    isRunning = true;
  }
}
function pause() {
  if (isRunning) {
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
  }
}
function finish() {
  clearInterval(timer);
  isRunning = false;

  const totalSeconds = Math.floor(elapsedTime / 1000);

  console.log(`Workout finished! Duration: ${totalSeconds} seconds`);

  const earnedXP = Math.floor(totalSeconds / 5);

  if (window.xpManager && earnedXP > 0) {
    window.xpManager.gainXP(earnedXP);
    alert(`Workout complete! You earned ${earnedXP} XP`);
  }

  if (window.saveWorkoutToFirebase) {
    window.saveWorkoutToFirebase(totalSeconds, earnedXP);
  }

  elapsedTime = 0;
  startTime = 0;
  display.textContent = "00:00:00:00";
  timer = null;
  isRunning = false;
}
function update() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;

  let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  let seconds = Math.floor((elapsedTime / 1000) % 60);
  let miliseconds = Math.floor((elapsedTime % 1000) / 10);

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  miliseconds = String(miliseconds).padStart(2, "0");

  display.textContent = `${hours}:${minutes}:${seconds}:${miliseconds}`;
}
