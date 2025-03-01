class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load any assets needed for the loading screen
        this.load.image('loadingBar', 'assets/loadingBar.png');
        // If you don't have this asset, you can create a simple loading bar graphic
    }

    create() {
        // Go to preloader scene
        this.scene.start('PreloaderScene');
    }
}