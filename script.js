let timeLeft = 25 * 60; // 25 minutes in seconds
let timer;
let isRunning = false;
let currentMode = "focus";

let focusTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;

const timerDisplay = document.getElementById("time-left");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const shortBreakBtn = document.getElementById("shortBreak");
const longBreakBtn = document.getElementById("longBreak");
const focusBtn = document.getElementById("focus");
const customTimeBtn = document.getElementById("customTime");

const customTimeModal = document.getElementById("customTimeModal");
const customTimeForm = document.getElementById("customTimeForm");
const resetCustomTimeBtn = document.getElementById("resetSettings");
const closeModal = document.querySelector(".close");

const customizeColorsBtn = document.getElementById("customizeColors");
const colorCustomizationModal = document.getElementById("colorCustomizationModal");
const colorCustomizationForm = document.getElementById("colorCustomizationForm");
const resetColorsBtn = document.getElementById("resetColors");

const backgroundColorInput = document.getElementById("background-color");
const fontColorInput = document.getElementById("font-color");

function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent = `${hours > 0 ? hours + ":" : ""}${hours > 0 && minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updateStartPauseButton(isRunning) {
    startPauseBtn.innerHTML = isRunning ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function startPauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        updateStartPauseButton(false);
        isRunning = false;
    } else {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                showNotification("Time's up! Take a break.");
                updateStartPauseButton(false);
                isRunning = false;
            }
        }, 1000);
        updateStartPauseButton(true);
        isRunning = true;
    }
}

function resetTimer() {
    isRunning = false;
    updateStartPauseButton(isRunning);
    clearInterval(timer);

    if (currentMode === "focus") {
        timeLeft = focusTime * 60;
    } else if (currentMode === "shortBreak") {
        timeLeft = shortBreakTime * 60;
    } else if (currentMode === "longBreak") {
        timeLeft = longBreakTime * 60;
    }

    updateDisplay();
}

function highlightActiveMode() {
    shortBreakBtn.classList.remove("active-mode");
    longBreakBtn.classList.remove("active-mode");
    focusBtn.classList.remove("active-mode");

    if (currentMode === "shortBreak") {
        shortBreakBtn.classList.add("active-mode");
    } else if (currentMode === "longBreak") {
        longBreakBtn.classList.add("active-mode");
    } else if (currentMode === "focus") {
        focusBtn.classList.add("active-mode");
    }
}

function setTimer(minutes, mode) {
    clearInterval(timer);
    timeLeft = minutes * 60;
    currentMode = mode;
    highlightActiveMode();
    updateDisplay();
    updateStartPauseButton(false);
    isRunning = false;
}

function showNotification(message) {
    const notificationPopup = document.getElementById("notificationPopup");
    const notificationMessage = document.getElementById("notificationMessage");

    notificationMessage.textContent = message;
    notificationPopup.classList.remove("hidden");
    notificationPopup.classList.add("show");

    setTimeout(() => {
        notificationPopup.classList.remove("show");
        notificationPopup.classList.add("hidden");
    }, 3000);
}

function applyUserPreferences() {
    const savedBackgroundColor = localStorage.getItem('backgroundColor');
    const savedFontColor = localStorage.getItem('fontColor');
    const savedFocusTime = localStorage.getItem('focusTime');
    const savedShortBreakTime = localStorage.getItem('shortBreakTime');
    const savedLongBreakTime = localStorage.getItem('longBreakTime');

    if (savedBackgroundColor) {
        document.documentElement.style.setProperty('--warna1', savedBackgroundColor);
    }

    if (savedFontColor) {
        document.documentElement.style.setProperty('--warna2', savedFontColor);
    }

    if (savedFocusTime) {
        focusTime = parseInt(savedFocusTime, 10);
        document.getElementById("focusTime").value = focusTime;
    }

    if (savedShortBreakTime) {
        shortBreakTime = parseInt(savedShortBreakTime, 10);
        document.getElementById("shortBreakTime").value = shortBreakTime;
    }

    if (savedLongBreakTime) {
        longBreakTime = parseInt(savedLongBreakTime, 10);
        document.getElementById("longBreakTime").value = longBreakTime;
    }
    resetTimer();
}

shortBreakBtn.addEventListener("click", () => setTimer(shortBreakTime, "shortBreak"));
longBreakBtn.addEventListener("click", () => setTimer(longBreakTime, "longBreak"));
focusBtn.addEventListener("click", () => setTimer(focusTime, "focus"));
startPauseBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);

customTimeBtn.addEventListener("click", () => {
    customTimeModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    customTimeModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === customTimeModal) {
        customTimeModal.style.display = "none";
    }
});

customTimeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    focusTime = parseInt(document.getElementById("focusTime").value, 10);
    shortBreakTime = parseInt(document.getElementById("shortBreakTime").value, 10);
    longBreakTime = parseInt(document.getElementById("longBreakTime").value, 10);

    localStorage.setItem('focusTime', focusTime);
    localStorage.setItem('shortBreakTime', shortBreakTime);
    localStorage.setItem('longBreakTime', longBreakTime);

    customTimeModal.style.display = "none";
    resetTimer();
    showNotification("Settings saved!");
});

resetCustomTimeBtn.addEventListener("click", () => {
    focusTime = 25;
    shortBreakTime = 5;
    longBreakTime = 15;

    document.getElementById("focusTime").value = focusTime;
    document.getElementById("shortBreakTime").value = shortBreakTime;
    document.getElementById("longBreakTime").value = longBreakTime;

    localStorage.setItem('focusTime', focusTime);
    localStorage.setItem('shortBreakTime', shortBreakTime);
    localStorage.setItem('longBreakTime', longBreakTime);

    resetTimer();
    showNotification("Settings reset to default!");
});

resetColorsBtn.addEventListener("click", () => {
    document.getElementById("background-color").value = "#1d1d1d";
    document.getElementById("font-color").value = "#00ff00";

    localStorage.setItem('backgroundColor', "#1d1d1d");
    localStorage.setItem('fontColor', "#00ff00");

    document.documentElement.style.setProperty('--warna1', '#1d1d1d');
    document.documentElement.style.setProperty('--warna2', '#00ff00');

    showNotification("Colors reset to default!");
});

colorCustomizationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const backgroundColor = document.getElementById("background-color").value;
    const fontColor = document.getElementById("font-color").value;

    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('fontColor', fontColor);

    document.documentElement.style.setProperty('--warna1', backgroundColor);
    document.documentElement.style.setProperty('--warna2', fontColor);

    showNotification("Colors saved!");
    colorCustomizationModal.style.display = "none";
});

customizeColorsBtn.addEventListener("click", () => {
    colorCustomizationModal.style.display = "block";
});

colorCustomizationModal.querySelector(".close").addEventListener("click", () => {
    colorCustomizationModal.style.display = "none";
});

applyUserPreferences();
highlightActiveMode();
updateDisplay();