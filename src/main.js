import { Game } from './game.js';

// ── INIT ─────────────────────────────────────────────
const game = new Game('game-container', 'alien');

// ── AUDIO ────────────────────────────────────────────
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, type = 'sine', duration = 0.2) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type            = type;
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
}

// ── INPUT ────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!game.active) {
            game.start();
        } else {
            game.player.jump();
            playSound(400, 'sine', 0.1);
        }
    }
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        game.player.duck(true);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') game.player.duck(false);
});

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!game.active) game.start(); else game.player.jump();
}, { passive: false });

// ── EVENT DARI GAME ───────────────────────────────────
window.addEventListener('game-over', () => {
    playSound(150, 'sawtooth', 0.5);
});

window.addEventListener('level-up', () => {
    playSound(600, 'triangle', 0.2);
});

// ── START ─────────────────────────────────────────────
game.start();