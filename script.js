/* ============================================================
   BIRTHDAY COUNTDOWN SCRIPT — Mish's Day
   ============================================================ */

// ─── CONFIGURATION ───────────────────────────────────────────
// Set Sonia's birthday here: year, month (0-indexed), day, hour, minute
// Example below: July 15, 2025 at 00:00
const BIRTHDAY = new Date(2026, 3, 12, 0, 0, 0); // Month is 0-indexed (6 = July)

// ─── DOM REFERENCES ──────────────────────────────────────────
const countdownSection = document.getElementById('countdown-section');
const revealSection = document.getElementById('reveal-section');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const surpriseBtn = document.getElementById('surprise-btn');
const secretMessage = document.getElementById('secret-message');
const bgMusic = document.getElementById('bg-music');
const confettiBurst = document.getElementById('confetti-burst');

// ─── UTILITIES ───────────────────────────────────────────────
function pad(n) {
    return String(n).padStart(2, '0');
}

function animateTick(el) {
    el.classList.remove('tick');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add('tick');
}

// ─── PARTICLES ───────────────────────────────────────────────
function createParticles() {
    const container = document.getElementById('particles');
    const count = 28;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');

        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 14 + 10;
        const delay = Math.random() * 12;
        const opacity = Math.random() * 0.5 + 0.2;

        p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

        container.appendChild(p);
    }
}

// ─── COUNTDOWN LOGIC ─────────────────────────────────────────
let prevSeconds = -1;
let prevMinutes = -1;
let prevHours = -1;
let prevDays = -1;

function updateCountdown() {
    const now = new Date();
    const diff = BIRTHDAY - now;

    if (diff <= 0) {
        // Birthday has arrived!
        clearInterval(countdownInterval);
        triggerReveal();
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.floor(totalSeconds / 86400);

    // Update with tick animation on change
    if (seconds !== prevSeconds) {
        secondsEl.textContent = pad(seconds);
        animateTick(secondsEl);
        prevSeconds = seconds;
    }
    if (minutes !== prevMinutes) {
        minutesEl.textContent = pad(minutes);
        animateTick(minutesEl);
        prevMinutes = minutes;
    }
    if (hours !== prevHours) {
        hoursEl.textContent = pad(hours);
        animateTick(hoursEl);
        prevHours = hours;
    }
    if (days !== prevDays) {
        daysEl.textContent = pad(days);
        animateTick(daysEl);
        prevDays = days;
    }
}

// ─── REVEAL TRANSITION ───────────────────────────────────────
function triggerReveal() {
    // Fade out countdown
    countdownSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    countdownSection.style.opacity = '0';
    countdownSection.style.transform = 'scale(0.96)';

    setTimeout(() => {
        countdownSection.classList.add('hidden');

        // Show reveal section
        revealSection.classList.remove('hidden');
        revealSection.classList.add('fade-in');

        // Launch confetti
        launchConfetti();

        // Try autoplay music
        tryPlayMusic();
    }, 850);
}

// ─── CONFETTI ────────────────────────────────────────────────
const CONFETTI_COLORS = [
    '#c084fc', '#e879f9', '#f0abfc',
    '#a855f7', '#d946ef', '#fde68a',
    '#fbcfe8', '#bfdbfe'
];

function launchConfetti() {
    const count = 60;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');

            const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const duration = Math.random() * 2.5 + 1.5;
            const delay = Math.random() * 0.5;
            const isCircle = Math.random() > 0.5;

            piece.style.cssText = `
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: 0;
        border-radius: ${isCircle ? '50%' : '2px'};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

            confettiBurst.appendChild(piece);

            // Clean up after animation
            setTimeout(() => {
                if (piece.parentNode) piece.parentNode.removeChild(piece);
            }, (duration + delay) * 1000 + 200);

        }, i * 55);
    }

    // Repeat confetti after a pause
    setTimeout(launchConfetti, 4500);
}

// ─── SURPRISE BUTTON ─────────────────────────────────────────
surpriseBtn.addEventListener('click', () => {
    secretMessage.classList.remove('hidden-msg');
    secretMessage.style.display = 'block';

    // Scroll into view smoothly
    setTimeout(() => {
        secretMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // Hide button with fade
    surpriseBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    surpriseBtn.style.opacity = '0';
    surpriseBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        surpriseBtn.style.display = 'none';
    }, 400);

    // Try to play music if not already playing
    tryPlayMusic();
});

// ─── MUSIC ───────────────────────────────────────────────────
let musicStarted = false;

function tryPlayMusic() {
    if (!bgMusic || musicStarted) return;

    // Only try if a src is set
    if (!bgMusic.currentSrc && bgMusic.children.length === 0) return;

    bgMusic.volume = 0.4;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => { musicStarted = true; })
            .catch(() => {
                // Autoplay blocked — will try again on next interaction
                console.log('Autoplay blocked. Music will start on next user interaction.');
            });
    }
}

// Fallback: start music on any first interaction
function onFirstInteraction() {
    tryPlayMusic();
    document.removeEventListener('click', onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);
}

document.addEventListener('click', onFirstInteraction, { once: true });
document.addEventListener('keydown', onFirstInteraction, { once: true });
document.addEventListener('touchstart', onFirstInteraction, { once: true });

// ─── DEV HELPER ──────────────────────────────────────────────
// Uncomment the line below to immediately test the reveal state
// without waiting for the real birthday:

//window.addEventListener('DOMContentLoaded', () => { triggerReveal(); });

// ─── INIT ────────────────────────────────────────────────────
createParticles();
updateCountdown(); // Run immediately so there's no blank flash

const countdownInterval = setInterval(updateCountdown, 1000);