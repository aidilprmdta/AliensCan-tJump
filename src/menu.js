export class Menu {
    constructor() {
        // State awal
        this.isStarted = false;
        this.volume = localStorage.getItem('alien_volume') || 50;

        // Ambil elemen DOM (sesuai ID di HTML nanti)
        this.menuContainer = document.getElementById('main-menu');
        this.settingsOverlay = document.getElementById('settings-menu');
        this.playBtn = document.getElementById('play-button');
        this.settingsBtn = document.getElementById('settings-button');
        this.backBtn = document.getElementById('back-button');
        this.volumeSlider = document.getElementById('volume-slider');

        this.init();
    }

    // Method untuk inisialisasi Event Listeners
    init() {
        // Set volume awal di slider
        if (this.volumeSlider) this.volumeSlider.value = this.volume;

        // Event: Tombol Play diklik
        this.playBtn?.addEventListener('click', () => this.startGame());

        // Event: Tombol Settings diklik
        this.settingsBtn?.addEventListener('click', () => this.showSettings());

        // Event: Tombol Back (di settings) diklik
        this.backBtn?.addEventListener('click', () => this.hideSettings());

        // Event: Slider Volume digeser
        this.volumeSlider?.addEventListener('input', (e) => this.handleVolumeChange(e.target.value));
    }

    showSettings() {
        this.settingsOverlay.classList.remove('hidden');
    }

    hideSettings() {
        this.settingsOverlay.classList.add('hidden');
    }

    startGame() {
        this.isStarted = true;
        this.menuContainer.classList.add('hidden');
        
        // Kirim sinyal ke Game Engine (main.js) bahwa game dimulai
        window.dispatchEvent(new CustomEvent('start-game'));
    }

    handleVolumeChange(val) {
        this.volume = val;
        localStorage.setItem('alien_volume', val);
        
        // Kirim sinyal perubahan volume
        window.dispatchEvent(new CustomEvent('update-volume', { detail: val }));
    }
}