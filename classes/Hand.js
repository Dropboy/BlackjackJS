// Hand Class
class Hand {
    constructor(scene, x, y, openTexture, closedTexture) {
        this.sprite = scene.add.image(x, y, openTexture);

        this.sprite.setDepth(70);
        this.heldObject = null;

        this.targetX = x;
        this.targetY = y;

        this.pointerMechanics(scene, this.sprite, openTexture, closedTexture);
        this.setupDragMechanics(scene);
    }

    pointerMechanics(scene, sprite, openTexture, closedTexture) {
        // Hand follows cursor smoothly
        scene.input.on("pointermove", (pointer) => {
            this.targetX = pointer.worldX - 45;
            this.targetY = pointer.worldY + 500;
        });

        // Hand closed on click
        scene.input.on("pointerdown", (pointer, gameObject, Object) => {
            this.sprite.setTexture(closedTexture);
        });

        // Hand open on release
        scene.input.on("pointerup", () => {
            this.sprite.setTexture(openTexture);
            this.heldObject = null; // Release chip when mouse is released
        });
    }

    setupDragMechanics(scene) {
        scene.input.on("dragstart", (pointer, gameObject, object) => {
            this.heldObject = gameObject;
            gameObject.setDepth(60);
            // if my data object is empty
            if (gameObject.data) {
                console.log(gameObject.data.list);
            }
        });

        scene.input.on("dragend", (pointer, gameObject) => {
            this.heldObject = null; // Assign the dragged object
            gameObject.setDepth(2);
        });
    }
}