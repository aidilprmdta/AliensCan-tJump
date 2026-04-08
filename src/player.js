export class Player {
  constructor(elementId) {
    this.element = document.getElementById(elementId);

    // === POSISI & PHYSICS ===
    this.groundY = 300;           // posisi Y tanah (sesuaikan dengan game-mu)
    this.y = this.groundY;        // posisi Y saat ini
    this.velocityY = 0;           // kecepatan vertikal
    this.gravity = 0.6;           // gravitasi per frame
    this.jumpForce = -14;         // kekuatan lompat (negatif = ke atas)

    // === STATE ===
    this.isJumping = false;
    this.isDucking = false;

    // === KALKULASI APEX (untuk collision obstacle) ===
    // Waktu ke puncak = -jumpForce / gravity  →  14 / 0.6 ≈ 23 frame
    this.timeToApex = Math.ceil(-this.jumpForce / this.gravity);
    // Tinggi maksimal dari tanah
    this.jumpHeight = Math.abs(
      (this.jumpForce * this.timeToApex) +
      (0.5 * this.gravity * this.timeToApex * this.timeToApex)
    );
    // Total waktu di udara (apex × 2 karena simetris)
    this.totalAirTime = this.timeToApex * 2;

    console.log(`[Player] jumpHeight: ${this.jumpHeight.toFixed(1)}px`);
    console.log(`[Player] timeToApex: ${this.timeToApex} frames`);
    console.log(`[Player] totalAirTime: ${this.totalAirTime} frames`);
  }

  jump() {
    if (this.isJumping || this.isDucking) return;

    this.isJumping = true;
    this.velocityY = this.jumpForce;
  }

  duck(isDucking) {
    if (this.isJumping) return; // Cegah merunduk di udara
    this.isDucking = isDucking;

    if (isDucking) {
      this.element.classList.add('ducking');
    } else {
      this.element.classList.remove('ducking');
    }
  }

  // Dipanggil setiap frame dari game loop (requestAnimationFrame)
  update() {
    if (this.isJumping) {
      // Terapkan fisika
      this.velocityY += this.gravity;
      this.y += this.velocityY;

      // Cek landing
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
      }

      // Update posisi DOM langsung (tanpa CSS transition = zero delay)
      this.element.style.transform = `translateY(${this.y - this.groundY}px)`;
    }
  }

  // =====================================================
  // UNTUK DIHUBUNGKAN KE OBSTACLE
  // Kembalikan bounding box player saat ini untuk collision check
  // =====================================================
  getBounds() {
    const rect = this.element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
    };
  }

  // Prediksi apakah player akan melewati obstacle pada frame ke-N
  // Gunakan ini untuk AI atau spawn obstacle yang fair
  getYAtFrame(frameOffset) {
    if (!this.isJumping) return this.groundY;

    let simY = this.y;
    let simVelocity = this.velocityY;

    for (let i = 0; i < frameOffset; i++) {
      simVelocity += this.gravity;
      simY += simVelocity;
      if (simY >= this.groundY) return this.groundY;
    }
    return simY;
  }
}