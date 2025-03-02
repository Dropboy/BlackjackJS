class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, suit, rank, value, frameIndex) {
        super(scene, x, y, "cards", frameIndex); // The sprite texture and frame index

        this.name = "card";
        this.frameIndex = frameIndex;
        this.setData("rank", rank);
        this.setData("value", value);
        this.setData("suit", suit);
        this.setData("isCard", true);
        this.setScale(4.5);

        // Add the sprite to the scene
        scene.add.existing(this);
    }
}a