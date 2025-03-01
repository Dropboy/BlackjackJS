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
	},
	BUTTONS: {
		HIT: "hit",
		STAND: "stand",
	},
};

// Game state variables (moved from global scope)
let userHand = [];
let dealerHand = [];
let deck = [];

// Calculate points of a hand
function calculatePoints(hand) {
	let points = 0;

	// loops through hand argument and adds all card values together
	for (let card of hand) {
		points += card.data.list.value;
	}
	return points;
}

function bustText(hand, scene) {

	const textBackground = scene.add.graphics();

	textBackground.fillStyle(0x000000, 0.7); // Black with 70% opacity

	const centerX = 1920 / 2;
	const centerY = 1080 / 2;
	const width = 1300;
	const height = 175;

	textBackground.fillRoundedRect(
		centerX - width / 2,
		centerY - height / 2,
		width,
		height,
		20 // Corner radius - makes rounded corners
	);

	// Set depth so it appears below the text
	textBackground.setDepth(99);

	if (hand == userHand) {
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

	// After 2 seconds, restart with data
	scene.time.delayedCall(2000, () => {
		scene.scene.start(scene.scene.key, {
			gamesPlayed: (scene.gamesPlayed || 0) + 1,
			playerMoney: scene.playerMoney + scene.bet,
			bust: false
			// other data you want to preserve
		});
	});
}

// Check for bust or blackjack
function checkBust(userHand, dealerHand, scene) {
	console.log(calculatePoints(userHand))
	if (calculatePoints(userHand) > 21) {
		bustText(userHand, scene);
	} else if (calculatePoints(dealerHand) > 21) {
		bustText(dealerHand, scene);
	}
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

function checkHit(userHand, dealerHand) {
	let userHandHit = null;
	let dealerHandHit = null;

	// Function to determine hit flag based on hand type and value
	const determineHitFlag = (hand, isDealer) => {
		const points = calculatePoints(hand);

		if (points > 21) {
			return false; // Bust - cannot hit
		} else if (isDealer && points >= 17) {
			return false; // Dealer stands on 17+
		} else {
			return true; // Can hit (player's choice or dealer must hit on <17)
		}
	};

	// Apply the same logic to both hands
	userHandHit = determineHitFlag(userHand, false);
	dealerHandHit = determineHitFlag(dealerHand, true);

	switch (true) {
		case userHandHit == true && dealerHandHit == true:
			userHand.push(deck.pop());
			dealerHand.push(deck.pop());
			break;
		case userHandHit == true && dealerHandHit == false:
			userHand.push(deck.pop());
			break;
		case userHandHit == false && dealerHandHit == true:
			dealerHand.push(deck.pop());
			break;
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

function stand() {
	// if user hits stand button, their hit flag should be set to false
	// run checkhit function to check if dealer should hit
	// if it should play out round
	// otherwise begin end game logic
}

function deal(scene) {
	console.log("Dealing...");
	userHand.push(deck.pop());
	userHand.push(deck.pop());
	dealerHand.push(deck.pop());
	dealerHand.push(deck.pop());
	animateCards(scene);
	// userHand.forEach((card) => console.log(card.data.list));
	userHand.forEach((card) => card.setInteractive({ draggable: true }));
	userHand.forEach((card, index) => card.setDepth(index));
	dealerHand.forEach((card, index) => card.setDepth(index));
}

// Hit action
function hit(userHand, deck, dealerHand, scene) {
	console.log("user hit");

	userHandHit = true;

	// check if either user or dealer should hit

	checkHit(userHand, dealerHand);

	animateCards(scene);

	// userHand.forEach((card) => console.log(card.data.list));
	userHand.forEach((card) => card.setInteractive({ draggable: true }));
	userHand.forEach((card, index) => card.setDepth(index));
	dealerHand.forEach((card, index) => card.setDepth(index));

	console.log("Dealer's Hand Value: " + calculatePoints(dealerHand));
	console.log("Player's Hand Value: " + calculatePoints(userHand));

	checkBust(userHand, dealerHand, scene);
}

function animateCards(scene) {
	const cardOffsetX = 80;

	for (let i = 0; i < userHand.length; i++) {
		scene.tweens.add({
			targets: userHand[i],
			x: 800 + i * cardOffsetX,
			y: 850,
			ease: "Power1",
			duration: 200,
			delay: 0,
		});
	}

	for (let i = 0; i < dealerHand.length; i++) {
		scene.tweens.add({
			targets: dealerHand[i],
			x: 800 + i * cardOffsetX,
			y: 200,
			ease: "Power1",
			duration: 200,
			delay: 0,
		});
	}
}

// Build deck of cards
function buildDeck(scene, deck) {
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
