import { Obstacle } from './obtacle.js';

const bgMusic = new Audio('../assets/backsound.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

const obstacles = [];
function gameLoop() {
    if (Math.random() < 0.02) {
        obstacles.push(new Obstacle());
    }
    
    obstacles.forEach(obs => obs.move());
    requestAnimationFrame(gameLoop);
}

gameLoop();