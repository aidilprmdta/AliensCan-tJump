export class Obstacle {
  constructor(container, type = "ground") {
    this.element = document.createElement("div");
    this.type = type;

    // Kita pakai ukuran Pixel tetap agar hitbox akurat, tapi posisinya yang responsif
    if (type === "ground") {
      // Rintangan bawah (Meteor) - Sama persis dengan pijakan alien: bottom-[15%]
      this.element.className =
        "absolute bottom-[calc(20%+28px)] w-[50px] h-[50px] flex items-center justify-center drop-shadow-[0_0_10px_#ef4444]";
      this.element.innerHTML =
        '<img src="src/assets/alien_stand.png" alt="Meteor" class="w-full h-full object-contain">';
    } else {
      // Rintangan terbang (UFO) - Selalu melayang 70px di atas batas tanah 15%
      this.element.className =
        "absolute bottom-[calc(20%+80px)] w-[80px] h-[80px] flex items-center justify-center drop-shadow-[0_0_15px_#a855f7]";
      this.element.innerHTML =
        '<img src="src/assets/ufo.png" alt="UFO" class="w-full h-full object-contain">';
    }
    
    // Responsive posisi awal obstacle
    this.position = container.offsetWidth;
    this.element.style.left = this.position + "px";
    container.appendChild(this.element);
  }

  move(speed) {
    this.position -= speed;
    this.element.style.left = this.position + "px";
  }

  getBounds() {
    return this.element.getBoundingClientRect();
  }

  remove() {
    this.element.remove();
  }
}