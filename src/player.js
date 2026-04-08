export class Player {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.isJumping = false;
        this.isDucking = false; // Tambahkan state merunduk
    }

    jump() {
        if (this.isJumping || this.isDucking) return; // Cegah lompat saat merunduk
        
        this.isJumping = true;
        this.element.classList.add('-translate-y-32', 'duration-300', 'ease-out');
        
        setTimeout(() => {
            this.element.classList.remove('-translate-y-32', 'ease-out');
            this.element.classList.add('ease-in');
            
            setTimeout(() => {
                this.element.classList.remove('ease-in');
                this.isJumping = false;
            }, 300);
        }, 300);
    }

    duck(isDucking) {
        if (this.isJumping) return; // Cegah merunduk di udara
        
        this.isDucking = isDucking;
        if (isDucking) {
            // Merunduk: Perkecil tinggi jadi 50%, dengan poros di bawah
            this.element.classList.add('scale-y-50', 'origin-bottom');
        } else {
            // Berdiri lagi
            this.element.classList.remove('scale-y-50', 'origin-bottom');
        }
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }
}