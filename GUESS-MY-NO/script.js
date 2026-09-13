'use strict';

///////////////////////////////////////
// GAME CONFIGURATION & STATE
///////////////////////////////////////
const DIFFICULTIES = {
  easy: { min: 1, max: 10, startScore: 10 },
  normal: { min: 1, max: 20, startScore: 20 },
  hard: { min: 1, max: 50, startScore: 15 },
  extreme: { min: 1, max: 100, startScore: 10 },
};

let currentDifficulty = 'normal';
let secretNumber;
let score;
let highscore = 0;
let previousGuesses = [];
let soundEnabled = true;
let isGameOver = false;

///////////////////////////////////////
// DOM ELEMENTS SELECTION
///////////////////////////////////////
const bodyEl = document.body;
const messageEl = document.querySelector('.message');
const numberEl = document.querySelector('.number');
const scoreEl = document.querySelector('.score');
const highscoreEl = document.querySelector('.highscore');
const guessInput = document.querySelector('.guess');
const checkBtn = document.querySelector('.check');
const againBtn = document.querySelector('.again');
const selectDifficulty = document.querySelector('#difficulty');
const rangeMinEl = document.querySelector('.range-min');
const rangeMaxEl = document.querySelector('.range-max');
const proximityHintEl = document.querySelector('#proximityHint');
const historyChipsEl = document.querySelector('#historyChips');
const btnSound = document.querySelector('#btnSound');
const btnResetHighscore = document.querySelector('#btnResetHighscore');
const confettiCanvas = document.querySelector('#confettiCanvas');

///////////////////////////////////////
// RETRO 8-BIT AUDIO SYNTHESIZER (Web Audio API)
///////////////////////////////////////
let audioCtx;
const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
};

const playTone = (freq, type, duration, delay = 0) => {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  setTimeout(() => {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
      );

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, delay);
};

const playSound = type => {
  if (!soundEnabled) return;
  initAudio();

  if (type === 'click') {
    playTone(400, 'square', 0.05);
  } else if (type === 'high') {
    playTone(550, 'sine', 0.15);
  } else if (type === 'low') {
    playTone(280, 'sine', 0.15);
  } else if (type === 'wrong') {
    playTone(180, 'sawtooth', 0.25);
  } else if (type === 'win') {
    // Triumphant retro arpeggio (C5 -> E5 -> G5 -> C6)
    playTone(523.25, 'triangle', 0.15, 0);
    playTone(659.25, 'triangle', 0.15, 120);
    playTone(783.99, 'triangle', 0.15, 240);
    playTone(1046.5, 'triangle', 0.4, 360);
  } else if (type === 'loss') {
    // Game over descending buzz
    playTone(240, 'sawtooth', 0.2, 0);
    playTone(180, 'sawtooth', 0.2, 180);
    playTone(120, 'sawtooth', 0.4, 360);
  }
};

///////////////////////////////////////
// CONFETTI CELEBRATION ANIMATION
///////////////////////////////////////
let confettiParticles = [];
let confettiAnimId;

const initConfetti = () => {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const ctx = confettiCanvas.getContext('2d');

  confettiParticles = [];
  const colors = ['#f1c40f', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#fff'];

  for (let i = 0; i < 150; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 150 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngleInc: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });
  }

  let startTime = Date.now();
  const renderConfetti = () => {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach(p => {
      p.tiltAngle += p.tiltAngleInc;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.d);
      p.tilt = Math.sin(p.tiltAngle) * 15;

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
      ctx.stroke();
    });

    // Run for 3 seconds
    if (Date.now() - startTime < 3500) {
      confettiAnimId = requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  };

  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  renderConfetti();
};

const clearConfetti = () => {
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  if (confettiCanvas) {
    const ctx = confettiCanvas.getContext('2d');
    ctx?.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
};

window.addEventListener('resize', () => {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
});

///////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////
const displayMessage = message => {
  messageEl.textContent = message;
};

const displayProximityHint = (diff, isWin = false) => {
  if (isWin) {
    proximityHintEl.textContent = '🎯 SPOT ON!';
    proximityHintEl.className = 'proximity-hint hint--boiling';
    return;
  }

  if (diff <= 2) {
    proximityHintEl.textContent = '🔥 SCORCHING HOT!';
    proximityHintEl.className = 'proximity-hint hint--boiling';
  } else if (diff <= 5) {
    proximityHintEl.textContent = '♨️ WARM...';
    proximityHintEl.className = 'proximity-hint hint--warm';
  } else if (diff <= 10) {
    proximityHintEl.textContent = '🧊 CHILLY...';
    proximityHintEl.className = 'proximity-hint hint--cold';
  } else {
    proximityHintEl.textContent = '🥶 FREEZING COLD!';
    proximityHintEl.className = 'proximity-hint hint--freezing';
  }
};

const updateHistoryChips = (guess, type) => {
  if (previousGuesses.length === 1) {
    historyChipsEl.innerHTML = '';
  }

  const chip = document.createElement('span');
  chip.classList.add('chip', `chip--${type}`);
  chip.textContent = `${guess} (${type === 'high' ? 'HIGH' : type === 'low' ? 'LOW' : 'WIN'})`;
  historyChipsEl.appendChild(chip);
};

const triggerShake = () => {
  guessInput.classList.remove('shake');
  void guessInput.offsetWidth; // trigger reflow
  guessInput.classList.add('shake');
  playSound('wrong');
};

const getSavedHighscore = diff => {
  return Number(localStorage.getItem(`guess_highscore_${diff}`) || 0);
};

const saveHighscore = (diff, score) => {
  localStorage.setItem(`guess_highscore_${diff}`, score);
};

///////////////////////////////////////
// GAME INITIALIZATION / RESET
///////////////////////////////////////
const initGame = (difficultyChanged = false) => {
  const config = DIFFICULTIES[currentDifficulty];

  secretNumber = Math.trunc(Math.random() * (config.max - config.min + 1)) + config.min;
  score = config.startScore;
  previousGuesses = [];
  isGameOver = false;

  // Retrieve highscore for current level
  highscore = getSavedHighscore(currentDifficulty);
  highscoreEl.textContent = highscore;
  scoreEl.textContent = score;

  // Range info
  rangeMinEl.textContent = config.min;
  rangeMaxEl.textContent = config.max;
  guessInput.min = config.min;
  guessInput.max = config.max;
  guessInput.value = '';
  guessInput.disabled = false;
  checkBtn.disabled = false;

  // UI Resets
  displayMessage('Start guessing...');
  proximityHintEl.textContent = '';
  proximityHintEl.className = 'proximity-hint';
  numberEl.textContent = '?';
  historyChipsEl.innerHTML = '<span class="history-empty">None yet</span>';

  bodyEl.classList.remove('win-state', 'gameover-state');
  clearConfetti();
  guessInput.focus();
};

///////////////////////////////////////
// CHECK GUESS HANDLER
///////////////////////////////////////
const handleCheck = () => {
  if (isGameOver) return;

  const guess = Number(guessInput.value);
  const config = DIFFICULTIES[currentDifficulty];

  // 1. When there is no input
  if (!guessInput.value || isNaN(guess)) {
    displayMessage('⛔️ No number!');
    triggerShake();
    return;
  }

  // 2. When input is out of range
  if (guess < config.min || guess > config.max) {
    displayMessage(`⚠️ Must be between ${config.min} and ${config.max}!`);
    triggerShake();
    return;
  }

  // 3. When player already guessed this number
  if (previousGuesses.includes(guess)) {
    displayMessage(`🔁 Already guessed ${guess}! Try another.`);
    triggerShake();
    return;
  }

  // Add to previous guesses
  previousGuesses.push(guess);
  const diff = Math.abs(secretNumber - guess);

  // 4. When player wins
  if (guess === secretNumber) {
    isGameOver = true;
    displayMessage('🎉 Correct Number!');
    displayProximityHint(diff, true);
    numberEl.textContent = secretNumber;
    bodyEl.classList.add('win-state');
    updateHistoryChips(guess, 'win');

    playSound('win');
    initConfetti();

    guessInput.disabled = true;
    checkBtn.disabled = true;

    // Check & save highscore
    if (score > highscore) {
      highscore = score;
      highscoreEl.textContent = highscore;
      saveHighscore(currentDifficulty, highscore);
    }
  }

  // 5. When guess is wrong
  else {
    displayProximityHint(diff, false);

    if (score > 1) {
      const isHigh = guess > secretNumber;
      displayMessage(isHigh ? '📈 Too high!' : '📉 Too low!');
      updateHistoryChips(guess, isHigh ? 'high' : 'low');
      playSound(isHigh ? 'high' : 'low');

      score--;
      scoreEl.textContent = score;
    } else {
      // Game over
      isGameOver = true;
      scoreEl.textContent = 0;
      displayMessage('💥 You lost the game!');
      proximityHintEl.textContent = `Secret number was ${secretNumber}`;
      proximityHintEl.className = 'proximity-hint hint--boiling';
      numberEl.textContent = secretNumber;
      bodyEl.classList.add('gameover-state');
      playSound('loss');

      guessInput.disabled = true;
      checkBtn.disabled = true;
    }
  }

  guessInput.value = '';
  guessInput.focus();
};

///////////////////////////////////////
// EVENT LISTENERS
///////////////////////////////////////
checkBtn.addEventListener('click', handleCheck);

// Press Enter to submit guess
guessInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleCheck();
});

// Again! Reset button
againBtn.addEventListener('click', () => {
  playSound('click');
  initGame();
});

// Difficulty selector
selectDifficulty.addEventListener('change', function () {
  currentDifficulty = this.value;
  playSound('click');
  initGame(true);
});

// Reset Highscore button
btnResetHighscore.addEventListener('click', () => {
  if (confirm(`Reset best score for ${currentDifficulty.toUpperCase()} mode?`)) {
    localStorage.removeItem(`guess_highscore_${currentDifficulty}`);
    highscore = 0;
    highscoreEl.textContent = 0;
    playSound('click');
  }
});

// Sound toggle button
const savedSound = localStorage.getItem('guess_sound_enabled');
if (savedSound !== null) {
  soundEnabled = savedSound === 'true';
  btnSound.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
}

btnSound.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('guess_sound_enabled', soundEnabled);
  btnSound.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  if (soundEnabled) playSound('click');
});

// Global keyboard shortcuts (Esc to restart, M for mute)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    initGame();
  } else if ((e.key === 'm' || e.key === 'M') && document.activeElement !== guessInput) {
    btnSound.click();
  }
});

///////////////////////////////////////
// INITIAL START
///////////////////////////////////////
initGame();
