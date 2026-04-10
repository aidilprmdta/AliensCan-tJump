export class Obstacle {
    constructor(container, type = 'ground') {
        this.element = document.createElement('div');
        this.type = type;

        if (type === 'ground') {
            // Rintangan bawah (Meteor) - Naik ke bottom-[80px]
            this.element.className = "absolute bottom-[90px] w-10 h-10 text-4xl flex items-center justify-center drop-shadow-[0_0_10px_#ef4444]";
            this.element.innerHTML = '<img src="/src/assets/alien_stand.png" alt="Meteor" class="w-full h-full object-contain">';
        } else {
            // Rintangan terbang (UFO) - Naik ke bottom-[120px]
            // Jika alien berdiri, akan kena. Jika merunduk (scale-y-50), akan lolos.
            this.element.className = "absolute bottom-[120px] w-20 h-20 text-4xl flex items-center justify-center drop-shadow-[0_0_15px_#a855f7]";
            this.element.innerHTML = '<img src="/src/assets/ufo.png" alt="UFO" class="w-full h-full object-contain">';
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