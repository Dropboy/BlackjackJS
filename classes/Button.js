class Button {
    constructor(scene, x, y, width, height, texture, mechanic, ...args) {
        this.sprite = scene.add.image(x, y, texture)
            .setInteractive()
            .setScale(0.4)
            .setOrigin(0.5, 0.5)

        this.ButtonFX = this.sprite.postFX.addShadow(0.5, 1, 0.05, 1, 0x000000, 4);

        this.buttonType(this.sprite, mechanic, ...args);

    }

    // passes the right mechanic to use depending what argument is used
    buttonType(sprite, mechanic, ...args) {
        sprite.on("pointerdown", () => {
            mechanic(...args);
        });
    }
}