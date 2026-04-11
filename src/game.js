import { Player   } from './player.js';
import { Obstacle } from './obtacle.js';

export class Game {
    constructor(containerId, playerId) {
        this.container = document.getElementById(containerId);
        this.player    = new Player(playerId);

        // Fisika player
        this.player.groundY = 0;
        this.player.y       = 0;





        
        // State
        this.obstacles   = [];
        this.active      = false;
        this.animationId = null;
        this.score       = 0;
        this.distance    = 0;
        this.speed       = 6;
        this.lastLevelUp = 0;
    }

    // ── START / RESTART ──────────────────────────────
    start() {
        // Bersihkan sisa obstacle lama jika restart
        this.obstacles.forEach(o => o.destroy());

        // Reset semua state
        this.obstacles   = [];
        this.active      = true;
        this.score       = 0;
        this.distance    = 0;
        this.speed       = 6;
        this.lastLevelUp = 0;

        // Reset player
        this.player.y         = this.player.groundY;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        this.player.isDucking = false;
        this.player.element.style.transform = 'translateY(0)';
        this.player.element.classList.remove('scale-y-50', 'origin-bottom');

        // Reset UI
        this.container.classList.remove('animate-shake');
        document.getElementById('game-over').style.display = 'none';

        this.animationId = requestAnimationFrame(() => this._loop());
    }

    stop() {
        this.active = false;
        cancelAnimationFrame(this.animationId);
    }

    // ── GAME LOOP (private) ───────────────────────────
    _loop() {
        if (!this.active) return;

        // Score
        this.distance += 0.15;
        this.score     = Math.floor(this.distance);
        document.getElementById('score').textContent = `Score: ${this.score}`;

        // Update player
        this.player.update();

        // Spawn obstacle
        this._spawnObstacle();

        // Update & collision
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.update(this.speed);

            if (obs.isOffScreen()) {
                obs.destroy();
                this.obstacles.splice(i, 1);
                continue;
            }

            if (this._checkCollision(obs)) {
                this._gameOver();
                return;
            }
        }

        // Level up tiap 100 poin
        if (this.score > 0 && this.score % 100 === 0 && this.score !== this.lastLevelUp) {
            this.speed      += 0.5;
            this.lastLevelUp = this.score;
            // Kirim event ke main.js untuk bunyi / efek visual
            window.dispatchEvent(new CustomEvent('level-up', { detail: this.speed }));
        }

        this.animationId = requestAnimationFrame(() => this._loop());
    }

    // ── SPAWN ─────────────────────────────────────────
    _spawnObstacle() {
        const last    = this.obstacles[this.obstacles.length - 1];
        const safeDist = this.container.offsetWidth - 300;

        if (Math.random() < 0.015 && (!last || last.x < safeDist)) {
            const type = Math.random() < 0.5 ? 'ground' : 'flying';
            this.obstacles.push(new Obstacle(this.container, type));
        }
    }

    // ── COLLISION ─────────────────────────────────────
    _checkCollision(obs) {
        const p = this.player.getBounds();
        const o = obs.getBounds();
        return (
            p.right  - 5 > o.left   + 5 &&
            p.left   + 5 < o.right  - 5 &&
            p.bottom - 5 > o.top    + 5 &&
            p.top    + 5 < o.bottom - 5
        );
    }

    // ── GAME OVER ─────────────────────────────────────
    _gameOver() {
        this.stop();
        this.obstacles.forEach(o => o.destroy());
        this.obstacles = [];

        this.container.classList.add('animate-shake');
        document.getElementById('game-over').style.display  = 'block';
        document.getElementById('final-score').textContent  = this.score;

        // Kirim event ke main.js untuk bunyi
        window.dispatchEvent(new CustomEvent('game-over', { detail: this.score }));
    }
}