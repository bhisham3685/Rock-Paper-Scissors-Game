let userScore = 0;
let computerScore = 0;

let soundOn = true;
let musicOn = false;

let audioContext = null;
let musicTimer = null;
let musicStep = 0;

// Game Options
const choices = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};

// Audio Start
function startAudio() {
    if (!audioContext) {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

// Sound Effect
function playTone(frequency, duration, type = "sine") {

    if (!soundOn) return;

    startAudio();

    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.15, audioContext.currentTime);

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// Winner Sound
function winnerSound() {
    playTone(523, 0.15);
    setTimeout(() => playTone(659, 0.15), 150);
    setTimeout(() => playTone(784, 0.3), 300);
}

// Loser Sound
function loserSound() {
    playTone(300, 0.25, "triangle");
    setTimeout(() => playTone(200, 0.4, "triangle"), 250);
}

// Draw Sound
function drawSound() {
    playTone(440, 0.2);
    setTimeout(() => playTone(440, 0.2), 200);
}

// Game Function
function playGame(userChoice) {

    startAudio();

    const options = ["rock", "paper", "scissors"];

    // Computer Random Choice
    const computerChoice =
        options[Math.floor(Math.random() * options.length)];

    // Display Hands
    document.getElementById("user-hand").textContent =
        choices[userChoice];

    document.getElementById("computer-hand").textContent =
        choices[computerChoice];

    // Display Choices
    document.getElementById("user-choice").textContent =
        "You selected: " + userChoice;

    document.getElementById("computer-choice").textContent =
        "Computer selected: " + computerChoice;

    // Hand Animation
    const userHand = document.getElementById("user-hand");
    const computerHand = document.getElementById("computer-hand");

    userHand.classList.remove("animate");
    computerHand.classList.remove("animate");

    void userHand.offsetWidth;

    userHand.classList.add("animate");
    computerHand.classList.add("animate");

    // Result Calculation
    const result = document.getElementById("result");
    const message = document.getElementById("message");

    if (userChoice === computerChoice) {

        result.textContent = "🤝 It's a Draw!";
        message.textContent = "Both selected the same option.";

        drawSound();

    }

    else if (

        (userChoice === "rock" && computerChoice === "scissors") ||

        (userChoice === "paper" && computerChoice === "rock") ||

        (userChoice === "scissors" && computerChoice === "paper")

    ) {

        userScore++;

        result.textContent = "🎉 You Win!";
        message.textContent = "Great! You defeated the computer.";

        winnerSound();

    }

    else {

        computerScore++;

        result.textContent = "😢 Computer Wins!";
        message.textContent = "Computer defeated you. Try again!";

        loserSound();

    }

    // Update Score
    document.getElementById("user-score").textContent =
        userScore;

    document.getElementById("computer-score").textContent =
        computerScore;

}

// Reset Game
function resetGame() {

    userScore = 0;
    computerScore = 0;

    document.getElementById("user-score").textContent = 0;
    document.getElementById("computer-score").textContent = 0;

    document.getElementById("user-hand").textContent = "✊";
    document.getElementById("computer-hand").textContent = "✊";

    document.getElementById("user-choice").textContent =
        "Waiting...";

    document.getElementById("computer-choice").textContent =
        "Waiting...";

    document.getElementById("result").textContent =
        "Let's Play!";

    document.getElementById("message").textContent =
        "Choose Rock, Paper or Scissors";

}

// Sound ON/OFF
function toggleSound() {

    soundOn = !soundOn;

    const button = document.getElementById("sound-btn");

    button.textContent = soundOn
        ? "🔊 Sound ON"
        : "🔇 Sound OFF";
}

// Background Music
function playMusicNote() {

    if (!musicOn || !audioContext) return;

    const notes = [
        523, 659, 784, 659,
        587, 698, 880, 698,
        523, 659, 784, 1046
    ];

    const frequency = notes[musicStep % notes.length];

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.04, audioContext.currentTime);

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.35
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.35);

    musicStep++;
}

// Music ON/OFF
function toggleMusic() {

    const button = document.getElementById("music-btn");

    if (!musicOn) {

        startAudio();

        if (!audioContext) return;

        musicOn = true;

        playMusicNote();

        musicTimer = setInterval(playMusicNote, 400);

        button.textContent = "🎵 Music ON";

    } else {

        musicOn = false;

        clearInterval(musicTimer);

        button.textContent = "🎵 Music OFF";

    }

}