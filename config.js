// Game configuration
const config = {
    type: Phaser.CANVAS,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [BootScene, PreloaderScene, Blackjack]
};