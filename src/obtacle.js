export class Obstacle {
    constructor(container, type = 'ground') {
        this.element = document.createElement('div');
        this.type = type;

        if (type === 'ground') {
            // Rintangan bawah (Meteor)
            this.element.className = "absolute bottom-0 w-12 h-12 text-4xl flex items-center justify-center drop-shadow-[0_0_10px_#ef4444]";
            this.element.innerText = "☄️";
        } else {
            // Rintangan terbang (UFO) - Posisinya dinaikkan ke 'bottom-10'
            // Jika alien berdiri, akan kena. Jika merunduk (scale-y-50), akan lolos.
            this.element.className = "absolute bottom-10 w-12 h-12 text-4xl flex items-center justify-center drop-shadow-[0_0_15px_#a855f7]";
            this.element.innerText = "🛸";
        }
        
        this.position = container.offsetWidth; 
        this.element.style.left = this.position + 'px';
        container.appendChild(this.element);
    }

    move(speed) {
        this.position -= speed;
        this.element.style.left = this.position + 'px';
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    remove() {
        this.element.remove();
    }
}