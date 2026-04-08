import { Player } from './player.js';
import { Obstacle } from './obtacle.js';

// === INISIALISASI ===
const player = new Player('player');  // sesuaikan ID elemen HTML-mu
const obstacles = [];

let gameRunning = false;
let animationId = null;
let score = 0;
let frameCount = 0;

// Interval spawn obstacle (dalam frame) — semakin lama semakin cepat
let spawnInterval = 120;
const MIN_SPAWN_INTERVAL = 60;

// === GAME LOOP ===
function gameLoop() {
    if (!gameRunning) return;

    frameCount++;
    score++;

    // Update player
    player.update();

    // Spawn obstacle secara berkala
    if (frameCount % spawnInterval === 0) {
        obstacles.push(new Obstacle('obstacle-container')); // sesuaikan

        // Percepat spawn seiring waktu
        if (spawnInterval > MIN_SPAWN_INTERVAL) {
            spawnInterval -= 2;
        }
    }

    // Update & cek collision setiap obstacle
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.update();

        // Hapus obstacle yang sudah keluar layar (kiri)
        if (obstacle.isOffScreen()) {
            obstacle.destroy();
            obstacles.splice(i, 1);
            continue;
        }

        // Collision detection AABB
        const p = player.getBounds();
        const o = obstacle.getBounds();

        const hit =
            p.right  > o.x     + 4 &&  // +4/-4: toleransi pixel agar tidak terlalu ketat
            p.x      < o.right - 4 &&
            p.bottom > o.y     + 4 &&
            p.y      < o.bottom - 4;

        if (hit) {
            gameOver();
            return;  // hentikan loop
        }
    }

    // Update score UI
    document.getElementById('score').textContent = `Score: ${score}`;

    animationId = requestAnimationFrame(gameLoop);
}

// === GAME OVER ===
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);

    // Bersihkan semua obstacle
    obstacles.forEach(o => o.destroy());
    obstacles.length = 0;

    // Tampilkan UI game over
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;

    console.log(`Game Over! Score: ${score}`);
}

// === START / RESTART ===
function startGame() {
    // Reset semua state
    score = 0;
    frameCount = 0;
    spawnInterval = 120;
    gameRunning = true;

    // Reset player ke posisi awal
    player.y = player.groundY;
    player.velocityY = 0;
    player.isJumping = false;
    player.isDucking = false;
    player.element.style.transform = 'translateY(0)';

    // Sembunyikan layar game over
    document.getElementById('game-over').style.display = 'none';

    animationId = requestAnimationFrame(gameLoop);
}

// === INPUT ===
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!gameRunning) {
            startGame();   // Space saat game over = restart
        } else {
            player.jump();
        }
    }

    if (e.code === 'ArrowDown') {
        e.preventDefault();
        player.duck(true);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
        player.duck(false);
    }
});

// Touch support (mobile)
document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!gameRunning) {
        startGame();
    } else {
        player.jump();
    }
}, { passive: false });

// === MULAI GAME PERTAMA KALI ===
startGame();