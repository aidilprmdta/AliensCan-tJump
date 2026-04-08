export class Obstacle {
    constructor(container, type = 'ground') {
        this.container = container;
        this.type      = type;
        this.element   = document.createElement('div');

        if (type === 'ground') {
            this.element.className = 
                'absolute bottom-0 w-12 h-12 text-4xl ' +
                'flex items-center justify-center ' +
                'drop-shadow-[0_0_10px_#ef4444]';
            this.element.innerText = '☄️';
        } else {
            this.element.className = 
                'absolute bottom-10 w-12 h-12 text-4xl ' +
                'flex items-center justify-center ' +
                'drop-shadow-[0_0_15px_#a855f7]';
            this.element.innerText = '🛸';
        }

        // Mulai dari sisi kanan container
        this.x = container.offsetWidth;
        this.element.style.left = this.x + 'px';
        container.appendChild(this.element);
    }

    // speed dikirim dari main.js agar bisa dinaikkan dinamis
    update(speed) {
        this.x -= speed;
        this.element.style.left = this.x + 'px';
    }

    isOffScreen() {
        return this.x + this.element.offsetWidth < 0;
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    destroy() {
        this.element.remove();
    }
}