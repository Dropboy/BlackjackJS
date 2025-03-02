class DropZone {
	constructor(scene, x, y, width, height, betText) {
		// Create a zone, then convert to a drop zone
		this.zone = scene.add
			.zone(x, y, width, height)
			.setRectangleDropZone(width, height)
			.setInteractive();

		// Create a graphics object to display the drop zone's boundaries
		this.graphics = scene.add.graphics();

		this.graphics.lineStyle(10, 0xff0000);
		// this.drawZone();

		this.chipsInZone = 0;

		this.placeMechanics(scene, this.zone, this.graphics, betText);
	}

	// debug zone drawing methods
	drawZone() {	
		this.graphics.strokeRect(
			this.zone.x - this.zone.width / 2,
			this.zone.y - this.zone.height / 2,
			this.zone.width,
			this.zone.height
		);
	}

	someChipsInZone() {
		this.graphics.lineStyle(10, 0x0000ff);
		this.drawZone();
	}

	noChipsInZone() {
		this.graphics.lineStyle(10, 0xff0000);
		this.drawZone();
	}

	updateBet(gameObject, betText, isAdding) {
		betText.setText(
			Number(betText.text) + (isAdding ? gameObject.value : -gameObject.value)
		);
	}

	// mechanics for objects moving in and out of zones
	placeMechanics(scene, zone, graphics, betText) {
		scene.input.on("dragenter", (pointer, gameObject, dropZone) => {
			if (gameObject.isChip && !gameObject.inBetZone) {
				gameObject.inBetZone = true;
				this.updateBet(gameObject, betText, gameObject.inBetZone); // Add the chip value to the bet
				this.chipsInZone += 1;
				this.someChipsInZone();
			}
		});

		scene.input.on("dragleave", (pointer, gameObject, dropZone) => {
			if (gameObject.isChip && gameObject.inBetZone) {
				gameObject.inBetZone = false;
				this.updateBet(gameObject, betText, gameObject.inBetZone); // Subtract the chip value from the bet
				this.chipsInZone -= 1;
				if (this.chipsInZone == 0) {
					this.noChipsInZone();
				}
			}
		});
	}
}
