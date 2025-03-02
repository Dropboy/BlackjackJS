class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('PreloaderScene');
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        // Loading event listeners
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
        
        // Set base URL for assets
        this.load.setBaseURL(
            "https://raw.githubusercontent.com/Dropboy/BlackjackJS/refs/heads/main/assets/"
        );

        this.load.spritesheet("chips", "chips.png", {
            frameWidth: 96,
            frameHeight: 95,
            endFrame: 8
        });

        this.load.spritesheet("cards", "cards.png", {
            frameWidth: 50, // width of each card
            frameHeight: 70, // height of each card
            endFrame: 65 // total number of frames (52 cards + extras)
        });

        this.load.image(TEXTURES.CHIPS.TEN, "gameAssets_chipTen.png");
        this.load.image(TEXTURES.HANDS.OPEN, "gameAssets_Hand.png");
        this.load.image(TEXTURES.HANDS.CLOSED, "gameAssets_HandClosed.png");
        this.load.image(TEXTURES.HANDS.POINTING, "gameAssets_HandPointing.png");
        this.load.image(TEXTURES.BUTTONS.HIT, "gameAssets_HitButton.png");
        this.load.image(TEXTURES.BUTTONS.STAND, "gameAssets_StandButton.png");
        this.load.image("bg", "gameAssets_Table.png");
    }

    create() {
        this.scene.start('Blackjack');
    }
}