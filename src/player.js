export class Player {
    constructor(elementId) {
        this.element = document.getElementById(elementId);

        // Fisika
        this.groundY    = 0;        // diset dari main.js setelah DOM siap
        this.y          = 0;
        this.velocityY  = 0;
        this.gravity    = 0.55;
        this.jumpForce  = -13;

        // State
        this.isJumping  = false;
        this.isDucking  = false;
    }

    jump() {
        if (this.isJumping || this.isDucking) return;
        this.isJumping = true;
        this.velocityY = this.jumpForce;
    }

    duck(isDucking) {
        if (this.isJumping) return;
        this.isDucking = isDucking;
        this.element.classList.toggle('scale-y-50', isDucking);
        this.element.classList.toggle('origin-bottom', isDucking);
    }

    // Dipanggil tiap frame dari main.js
    update() {
        if (!this.isJumping) return;

        this.velocityY += this.gravity;
        this.y         += this.velocityY;

        if (this.y >= this.groundY) {
            this.y         = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Update DOM langsung — zero delay
        this.element.style.transform = `translateY(${this.y - this.groundY}px)`;
    }

    // Bounding box yang akurat (dipanggil saat collision check)
    getBounds() {
        return this.element.getBoundingClientRect();
    }
}