// Constants to avoid repeated strings
const TEXTURES = {
	CHIPS: {
		TEN: "chipTen",
		TWENTY: "chipTwenty",
		FIFTY: "chipFifty",
	},
	HANDS: {
		OPEN: "hand",
		CLOSED: "handClosed",
		POINTING: "handPointing",
		PALM: "hand",
	},
	BUTTONS: {
		HIT: "hit",
		STAND: "stand",
	},
};

// Build deck of cards
function buildDeck(scene) {

	let deck = []

	const suits = ["hearts", "diamonds", "spades", "clubs"];
	const ranks = [
		"ace",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"jack",
		"queen",
		"king",
	];
	const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

	for (let j = 0; j < suits.length; j++) {
		for (let i = 0; i < ranks.length; i++) {
			let frameIndex = 13 + j * 13 + i;
			deck.push(
				new Card(scene, 1700, 400, suits[j], ranks[i], values[i], frameIndex)
			);
		}
	}

	Phaser.Utils.Array.Shuffle(deck);

	let deckBack = new Card(scene, 1700, 400, undefined, undefined, undefined, 4);
	deckBack.setDepth(1);

	return deck;
}

function deal(scene) {
	console.log("Dealing...");
	scene.userHand.push(scene.deck.pop());
	scene.userHand.push(scene.deck.pop());
	scene.dealerHand.push(scene.deck.pop());
	scene.dealerHand.push(scene.deck.pop());
	console.log(scene.userHand)
	console.log(scene.dealerHand)
	console.log("Dealer's Hand Value: " + calculatePoints(scene.dealerHand));
	console.log("Player's Hand Value: " + calculatePoints(scene.userHand));
	animateCards(scene);
	// scene.userHand.forEach((card) => console.log(card.data.list));
	scene.userHand.forEach((card) => card.setInteractive({ draggable: true }));
	scene.userHand.forEach((card, index) => card.setDepth(index));
	scene.dealerHand.forEach((card, index) => card.setDepth(index));
}

// Calculate points of a hand
function calculatePoints(hand) {
	let points = 0;

	// loops through hand argument and adds all card values together
	for (let card of hand) {
		points += card.data.list.value;
	}
	return points;
}

function checkAce(hand) {
	console.log("checking ace");

	if (hand.some((card) => card.data.rank === "Ace")) {
		console.log("found an ace");
		return true;
	} else {
		convertAce(hand);
		return false;
	}
}

function convertAce(hand) {
	hand.map((card) => {
		// only convert ace if hand is over 21
		if (calculatePoints(hand) > 21) {
			// Only convert ace if value is not already 1
			if (card.data.rank == "Ace" && card.data.value != 1) {
				console.log("Ace conversion called...");
				card.value = 1;
			}
		}
		return;
	});
}

function gameplayLogic(scene) {
	switch (true) {
		case scene.userHand.hit == true && scene.dealerHand.hit == true:
			scene.userHand.push(scene.deck.pop());
			scene.dealerHand.push(scene.deck.pop());
			break;
		case scene.userHand.hit == true && scene.dealerHand.hit == false:
			scene.userHand.push(scene.deck.pop());
			break;
		case scene.userHand.hit == false && scene.dealerHand.hit == true:
			scene.dealerHand.push(scene.deck.pop());
			break;
	}
	
	animateCards(scene);
}

function checkHit(scene) {

	const points = calculatePoints(scene.dealerHand);

	if (points >= 21) {
		scene.dealerHand.hit = false; // Bust - cannot hit
	} else if (points >= 17) {
		scene.dealerHand.hit = false; // Dealer stands on 17+
	} else {
		console.log('dealer hit')
		scene.dealerHand.hit = true; // Can hit (player's choice or dealer must hit on <17)
	}

	gameplayLogic(scene)

}

function hit(scene) {
	console.log("User Hit");
	scene.userHand.hit = true;
	checkHit(scene)
	
	console.log("Dealer's Hand Value: " + calculatePoints(scene.dealerHand));
	console.log("Player's Hand Value: " + calculatePoints(scene.userHand));

	checkBust(scene);
}

function stand(scene) {

	scene.userHand.hit = false

	checkHit(scene.userHand.hit, scene.dealerHand.hit, scene)

	console.log("Dealer's Hand Value: " + calculatePoints(scene.dealerHand));
	console.log("Player's Hand Value: " + calculatePoints(scene.userHand));
	
	checkBust(scene);
}

function animateCards(scene) {
	const cardOffsetX = 80;

	for (let i = 0; i < scene.userHand.length; i++) {
		scene.tweens.add({
			targets: scene.userHand[i],
			x: 800 + i * cardOffsetX,
			y: 900,
			ease: "Power1",
			duration: 200,
			delay: 0,
		});
	}

	for (let i = 0; i < scene.dealerHand.length; i++) {
		scene.tweens.add({
			targets: scene.dealerHand[i],
			x: 800 + i * cardOffsetX,
			y: 180,
			ease: "Power1",
			duration: 200,
			delay: 0,
		});
	}

	scene.userHand.forEach((card) => card.setInteractive({ draggable: true }));
	scene.userHand.forEach((card, index) => card.setDepth(index));
	scene.dealerHand.forEach((card, index) => card.setDepth(index));

}

// Check for bust or blackjack
function checkBust(scene) {
	if (calculatePoints(scene.userHand) > 21) {
		bustText(scene.userHand, scene);
	} else if (calculatePoints(scene.dealerHand) > 21) {
		bustText(scene.dealerHand, scene);
	}
}

function bustText(hand, scene) {

	if (scene.bust == true) { return }
	scene.bust = true

	const textBackground = scene.add.graphics();

	textBackground.fillStyle(0x000000, 0.7);

	const centerX = 1920 / 2;
	const centerY = 1080 / 2;
	const width = 1300;
	const height = 175;

	textBackground.fillRoundedRect(
		centerX - width / 2,
		centerY - height / 2,
		width,
		height,
		20
	);

	// Set depth so it appears below the text
	textBackground.setDepth(99);

	if (hand == scene.userHand) {
		scene.add
			.text(1920 / 2, 1080 / 2, "YOU HAVE BUST :(", {
				fontFamily: "Noto Serif",
				fontSize: 128,
				color: "#FFFFFF",
			})
			.setDepth(100)
			.setOrigin(0.5, 0.5);
	} else {
		scene.add
			.text(1920 / 2, 1080 / 2, "DEALER HAS BUST", {
				fontFamily: "Noto Serif",
				fontSize: 128,
				color: "#FFFFFF",
			})
			.setDepth(100)
			.setOrigin(0.5, 0.5);
	}

	// restart after 2 seconds
	scene.time.delayedCall(2000, () => {
		scene.scene.restart()
	});
}