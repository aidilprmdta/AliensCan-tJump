import { Obstacle } from './obtacle.js';

const obstacles = [];

function gameLoop() {
    if (Math.random() < 0.02) {
        obstacles.push(new Obstacle());
    }
    
    obstacles.forEach(obs => obs.move());
    requestAnimationFrame(gameLoop);
}

gameLoop();