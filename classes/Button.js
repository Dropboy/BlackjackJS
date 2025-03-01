class Button {
    constructor(scene, x, y, width, height, texture, mechanic, ...args) {
        this.sprite = scene.add.image(x, y, texture).setInteractive();
        this.buttonType(this.sprite, mechanic, ...args);
    }

    // passes the right mechanic to use depending what argument is used
    buttonType(sprite, mechanic, ...args) {
        sprite.on("pointerdown", () => {
            mechanic(...args);
        });
    }
}