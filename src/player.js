export class Player {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.isJumping = false;
        this.isDucking = false;
        this.image = this.element.querySelector('img');
    }

    jump() {
        if (this.isJumping || this.isDucking) return; 
        
        this.image.src = 'src/assets/run1.png'; 
        
        // 1. TAMBAHAN: Paksa perbesar gambar khusus saat lompat
        // Angka 1.3 artinya diperbesar 130%. Kamu bisa ubah jadi 1.4 atau 1.5 jika masih kurang besar.
        this.image.classList.add('scale-[1.3]'); 

        this.isJumping = true;
        this.element.classList.add('-translate-y-32', 'duration-300', 'ease-out');
        
        setTimeout(() => {
            this.element.classList.remove('-translate-y-32', 'ease-out');
            this.element.classList.add('ease-in');
            
            setTimeout(() => {
                this.element.classList.remove('ease-in');
                this.isJumping = false;

                // 2. TAMBAHAN: Hapus efek perbesar saat mendarat agar kembali normal
                this.image.classList.remove('scale-[1.3]');

                if (!this.isDucking) {
                    this.image.src = 'src/assets/Standing.png'; 
                } else {
                    this.image.src = 'src/assets/knee.png'; 
                }
            }, 300);
        }, 300);
    }

    duck(isDucking) {
        if (this.isJumping) return; 
        
        this.isDucking = isDucking;
        if (isDucking) {
            this.image.src = 'src/assets/knee.png'; 
            this.element.classList.add('scale-y-50', 'origin-bottom');
        } else {
            this.image.src = 'src/assets/Standing.png'; 
            this.element.classList.remove('scale-y-50', 'origin-bottom');
        }
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }
}