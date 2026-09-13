# 🎯 Guess My Number! (Retro Arcade Edition)

An enhanced, modern retro-arcade version of the classic number-guessing game built with **Vanilla JavaScript (ES6+)**, **HTML5**, and **CSS3**.

---

## 🚀 Play Online & Repository

- **Repository**: [https://github.com/KavyeGupta/GUESS-MY-NO](https://github.com/KavyeGupta/GUESS-MY-NO)
- **Author**: [Kavye Gupta](https://github.com/KavyeGupta)

---

## 🎮 What's New & Enhanced

1. **4 Difficulty Modes**:
   - **Easy**: Numbers `1 – 10` (10 starting attempts)
   - **Normal**: Numbers `1 – 20` (20 starting attempts)
   - **Hard**: Numbers `1 – 50` (15 starting attempts)
   - **Extreme**: Numbers `1 – 100` (10 starting attempts)

2. **Hot & Cold Proximity Hints**:
   - Real-time heat feedback based on how close your guess is:
     - 🔥 **Scorching Hot!** (within 2)
     - ♨️ **Warm...** (within 5)
     - 🧊 **Chilly...** (within 10)
     - 🥶 **Freezing Cold!** (more than 10 away)

3. **Previous Guesses Tracker**:
   - Visual chip history showing every number you have already guessed with color-coded tags (`HIGH`, `LOW`, `WIN`).
   - Duplicate prevention prevents losing attempts if you guess the same number twice.

4. **Built-in 8-Bit Retro Audio (Web Audio API)**:
   - Procedurally generated retro sound effects without external audio files:
     - Click blips
     - High/Low indicator tones
     - Error buzz with shake animation
     - Triumphant 4-note victory fan-fare
     - Game-over descending tone
   - Mute / Unmute toggle button with saved preference.

5. **Celebration Confetti**:
   - Dynamic canvas confetti explosion whenever you win!

6. **Persistent Highscores**:
   - Highscores are tracked and saved in `localStorage` independently for each difficulty level.
   - Includes a "Reset Highscore" option.

7. **Keyboard Support**:
   - Press <kbd>Enter</kbd> to submit a guess.
   - Press <kbd>Esc</kbd> to start a new round.
   - Press <kbd>M</kbd> to toggle audio.

8. **Fully Responsive Layout**:
   - Cleanly scales across mobile devices, tablets, and desktop displays.

---

## 📁 Project Structure

```text
GUESS-MY-NO/
├── index.html        # Enhanced semantic HTML layout
├── style.css         # Retro arcade styles, animations & responsive media queries
├── script.js         # Game engine, Web Audio synth, confetti & localStorage
└── README.md         # Documentation
```

---

## 💻 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/KavyeGupta/GUESS-MY-NO.git
   ```
2. Double-click `index.html` to open and play immediately in any web browser.

---

## 🛠️ Built With

- **HTML5 Canvas & Semantic Elements**
- **CSS3 Flexbox, Grid, Custom Keyframe Animations**
- **Vanilla JavaScript (ES6+)**
- **Web Audio API**
- **Web Storage API (`localStorage`)**
