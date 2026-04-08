import { Player } from './player.js';
import { Obstacle } from './obtacle.js'; // Pastikan nama filemu benar (sebelumnya obtacle.js)

const gameContainer = document.getElementById('game-container');
const player = new Player('alien');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let obstacles = [];
let gameActive = true;
let score = 0;
let distanceScore = 0;
let speed = 6; 
let lastLevelUpScore = 0; // Tambahan: Untuk mencegah bug suara/kecepatan berkali-kali

// --- 1. KONTROL KEYBOARD DIPERBAIKI ---
document.addEventListener('keydown', (event) => {
    if (!gameActive) return;

    if (event.code === 'Space' || event.code === 'ArrowUp') {
        player.jump();
        playSound(400, 'sine', 0.1); 
    }
    
    // Typo dan titik koma dihapus, parameter diubah jadi true
    if (event.code === "ArrowDown") {
        player.duck(true);
    }
});

// Tambahan: Event saat tombol dilepas agar alien berdiri lagi
document.addEventListener('keyup', (event) => {
    if (event.code === "ArrowDown") {
        player.duck(false);
    }
});


// --- 2. GAME LOOP UTAMA ---
function gameLoop() {
    if (!gameActive) return;

    distanceScore += 0.15;
    score = Math.floor(distanceScore);
    window.dispatchEvent(new CustomEvent('update-score', { detail: score }));
    
    if (Math.random() < 0.015) {
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].position < gameContainer.offsetWidth - 300) {
            const type = Math.random() < 0.5 ? 'ground' : 'flying'; 
            obstacles.push(new Obstacle(gameContainer, type));
        }
    }

    obstacles.forEach((obs, index) => {
        obs.move(speed);

        const playerBounds = player.getBounds();
        const obsBounds = obs.getBounds();

        if (
            playerBounds.left < obsBounds.right &&
            playerBounds.right > obsBounds.left &&
            playerBounds.top < obsBounds.bottom &&
            playerBounds.bottom > obsBounds.top
        ) {
            gameOver();
        }

        if (obs.position < -50) {
            obs.remove(); 
            obstacles.splice(index, 1);
        }
    });
    
    // --- 3. PERBAIKAN LOGIKA LEVEL UP ---
    // Pastikan skor kelipatan 100 DAN belum pernah di-level-up di angka tersebut
    if (score > 0 && score % 100 === 0 && score !== lastLevelUpScore) {
        speed += 0.5; // Naikkan speed sedikit lebih terasa
        playSound(600, "triangle", 0.2);
        lastLevelUpScore = score; // Kunci agar tidak terpanggil 60x per detik
    }

    requestAnimationFrame(gameLoop);
}

// Fungsi pembuat suara 8-bit
function playSound(frequency, type = 'sine', duration = 0.2) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type; 
    oscillator.frequency.value = frequency;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
}

function gameOver() {
    gameActive = false;
    playSound(150, 'sawtooth', 0.5);

    const container = document.getElementById('game-container');
    container.classList.add('animate-shake');
    
    window.dispatchEvent(new CustomEvent('game-over'));
}

gameLoop();