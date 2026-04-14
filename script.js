const passages = [
  "Learning to code gets easier when you can see your ideas turn into something real in just a few minutes.",
  "A great demo app does not need to be huge. It just needs to be clear, fun, and easy to understand.",
  "Typing quickly is useful, but typing accurately is what really keeps your ideas moving forward.",
  "Small projects are powerful because they help students practice logic, design, debugging, and creativity all at once.",
  "The web is a great place to build because you can write a little HTML, CSS, and JavaScript and share it instantly."
];

const promptEl = document.getElementById("prompt");
const inputEl = document.getElementById("typingInput");
const timeLeftEl = document.getElementById("timeLeft");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartButton = document.getElementById("restartButton");

let timerId = null;
let timeLeft = 60;
let started = false;
let currentPassage = "";

function randomPassage() {
  const index = Math.floor(Math.random() * passages.length);
  return passages[index];
}

function renderPrompt(userInput = "") {
  promptEl.innerHTML = "";

  currentPassage.split("").forEach((char, index) => {
    const charSpan = document.createElement("span");
    charSpan.textContent = char;

    if (index < userInput.length) {
      charSpan.className = userInput[index] === char ? "correct" : "incorrect";
    } else if (index === userInput.length) {
      charSpan.className = "current";
    }

    promptEl.appendChild(charSpan);
  });
}

function updateStats() {
  const typed = inputEl.value;
  const elapsedSeconds = 60 - timeLeft;
  let correctChars = 0;

  typed.split("").forEach((char, index) => {
    if (char === currentPassage[index]) {
      correctChars += 1;
    }
  });

  const wordsTyped = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
  const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;

  wpmEl.textContent = String(wpm);
  accuracyEl.textContent = `${accuracy}%`;
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function resetGame() {
  stopTimer();
  timeLeft = 60;
  started = false;
  currentPassage = randomPassage();
  inputEl.value = "";
  inputEl.disabled = false;
  timeLeftEl.textContent = `${timeLeft}s`;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  renderPrompt();
  inputEl.focus();
}

function startTimer() {
  if (started) {
    return;
  }

  started = true;
  timerId = setInterval(() => {
    timeLeft -= 1;
    timeLeftEl.textContent = `${timeLeft}s`;
    updateStats();

    if (timeLeft <= 0) {
      stopTimer();
      inputEl.disabled = true;
      renderPrompt(inputEl.value);
    }
  }, 1000);
}

inputEl.addEventListener("input", () => {
  if (!started && inputEl.value.length > 0) {
    startTimer();
  }

  renderPrompt(inputEl.value);
  updateStats();

  if (inputEl.value === currentPassage) {
    stopTimer();
    inputEl.disabled = true;
  }
});

restartButton.addEventListener("click", resetGame);

resetGame();
