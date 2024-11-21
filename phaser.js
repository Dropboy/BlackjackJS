class Example extends Phaser.Scene
{
	preload ()
	{
		this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
		this.load.image('hand', 'C:/Users/Eamon/Desktop/Github/Javascript Learning/Blackjack/assets/hand.png');
	}

	create ()
	{

		const hand = this.physics.add.image(400, 300, 'hand');

		hand.setDirectControl();
		hand.setImmovable();

		this.input.on('pointermove', pointer => {

			hand.setPosition(pointer.worldX, pointer.worldY);

		});

		this.physics.world.setBounds(0, -1500, 800, 2080);

		this.physics.add.collider(hand);
	}
}

const config = {
	parent: 'phaser-example',
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 50 },
		}
	},
	scale: {
		mode: Phaser.Scale.EXPAND,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: 1
	},
	scene: Example
};

const game = new Phaser.Game(config);