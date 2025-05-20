class Hand {
  constructor(scene, x, y, openTexture, closedTexture, pointingTexture) {
    this.sprite = scene.add.image(x, y, openTexture);

    this.sprite.setDepth(70);

    this.handFX = this.sprite.postFX.addShadow(1, 1, 0.05, 1, 0x000000, 4);

    this.heldObject = null;

    this.targetX = x;
    this.targetY = y;

    this.hit = null

    this.setupCursorEvents(scene, pointingTexture, openTexture);
    this.pointerMechanics(scene, openTexture, closedTexture, pointingTexture);
    this.setupDragMechanics(scene);
  }

  pointerMechanics(scene, openTexture, closedTexture, pointingTexture) {
    // Hand follows cursor smoothly
    scene.input.on("pointermove", (pointer) => {
      this.targetX = pointer.worldX - -100;
      this.targetY = pointer.worldY + 750;
    });

    // Hand closed on click
    scene.input.on("pointerdown", (pointer, gameObject, Object) => {
      if (this.heldObject == null) {
        this.sprite.setTexture(pointingTexture)
        this.sprite.setScale(0.95)
      } else {
        this.sprite.setTexture(closedTexture);
      }
    });

    // Hand open on release
    scene.input.on("pointerup", () => {
      this.sprite.setScale(1)
      this.heldObject = null; // Release chip when mouse is released
    });
  }

  setupCursorEvents(scene, pointingTexture, openTexture) {
    scene.input.on("gameobjectover", (pointer, gameObject) => {
        if (this.heldObject == null) {
            this.sprite.setTexture(pointingTexture);
        }
    });

    scene.input.on("gameobjectout", (pointer, gameObject) => {
        if (this.heldObject == null) {
            this.sprite.setTexture(openTexture);
        }
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
