class Chip {
    constructor(scene, x, y, texture, value) {
        this.sprite = scene.physics.add
            .image(x, y, texture)
            .setInteractive({ draggable: true });

        // Chip data
        this.sprite.value = value;
        this.sprite.isChip = true;
        this.sprite.inBetZone = false;
        this.sprite.setDepth(1);
    }
}