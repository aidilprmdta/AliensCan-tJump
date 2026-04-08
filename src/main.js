import { Player   } from './player.js';
import { Obstacle } from './obtacle.js';

// ── DOM ──────────────────────────────────────────────
const gameContainer = document.getElementById('game-container');
const scoreEl       = document.getElementById('score');
const gameOverEl    = document.getElementById('game-over');
const finalScoreEl  = document.getElementById('final-score');

// ── PLAYER ───────────────────────────────────────────
const player = new Player('alien');

// groundY = 0 karena transform translateY(0) = posisi awal di tanah
// Jika alien-mu punya offset CSS bottom, sesuaikan di sini
player.groundY = 0;
player.y       = 0;

// ── AUDIO ────────────────────────────────────────────
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, type = 'sine', duration = 0.2) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type              = type;
    osc.frequency.value   = frequency;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
}

// ── STATE ────────────────────────────────────────────
let obstacles       = [];
let gameActive      = false;
let animationId     = null;
let score           = 0;
let distanceScore   = 0;
let speed           = 6;
let lastLevelUp     = 0;
let frameCount      = 0;

// ── GAME LOOP ────────────────────────────────────────
function gameLoop() {
    if (!gameActive) return;

    frameCount++;

    // Score
    distanceScore += 0.15;
    score = Math.floor(distanceScore);
    scoreEl.textContent = `Score: ${score}`;

    // Player physics update
    player.update();

    // Spawn obstacle — cek jarak aman dari obstacle terakhir
    const lastObs = obstacles[obstacles.length - 1];
    const safeDist = gameContainer.offsetWidth - 300;
    if (Math.random() < 0.015 && (!lastObs || lastObs.x < safeDist)) {
        const type = Math.random() < 0.5 ? 'ground' : 'flying';
        obstacles.push(new Obstacle(gameContainer, type));
    }

    // Update obstacle — iterasi mundur agar splice aman
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.update(speed);

        // Buang yang sudah keluar layar
        if (obs.isOffScreen()) {
            obs.destroy();
            obstacles.splice(i, 1);
            continue;
        }

        // Collision AABB dengan toleransi 5px (kurangi false positive)
        const p = player.getBounds();
        const o = obs.getBounds();
        const hit =
            p.right  - 5 > o.left   + 5 &&
            p.left   + 5 < o.right  - 5 &&
            p.bottom - 5 > o.top    + 5 &&
            p.top    + 5 < o.bottom - 5;

        if (hit) {
            gameOver();
            return;
        }
    }

    // Level up tiap 100 poin
    if (score > 0 && score % 100 === 0 && score !== lastLevelUp) {
        speed      += 0.5;
        lastLevelUp = score;
        playSound(600, 'triangle', 0.2);
    }

    animationId = requestAnimationFrame(gameLoop);
}

// ── GAME OVER ────────────────────────────────────────
function gameOver() {
    gameActive = false;
    cancelAnimationFrame(animationId);

    playSound(150, 'sawtooth', 0.5);

    // Bersihkan semua obstacle
    obstacles.forEach(o => o.destroy());
    obstacles = [];

    gameContainer.classList.add('animate-shake');
    gameOverEl.style.display  = 'block';
    finalScoreEl.textContent  = score;
}

// ── START / RESTART ──────────────────────────────────
function startGame() {
    // Reset state
    obstacles     = [];
    score         = 0;
    distanceScore = 0;
    speed         = 6;
    lastLevelUp   = 0;
    frameCount    = 0;
    gameActive    = true;

    // Reset player
    player.y          = player.groundY;
    player.velocityY  = 0;
    player.isJumping  = false;
    player.isDucking  = false;
    player.element.style.transform = 'translateY(0)';
    player.element.classList.remove('scale-y-50', 'origin-bottom');

    // Reset UI
    gameContainer.classList.remove('animate-shake');
    gameOverEl.style.display = 'none';

    animationId = requestAnimationFrame(gameLoop);
}

// ── INPUT ────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!gameActive) {
            startGame();
        } else {
            player.jump();
            playSound(400, 'sine', 0.1);
        }
    }
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        player.duck(true);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') player.duck(false);
});

// Touch support
document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!gameActive) startGame(); else player.jump();
}, { passive: false });

// ── INIT ─────────────────────────────────────────────
startGame();