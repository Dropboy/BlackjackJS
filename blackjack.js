// TO DO
// Split functionality
// One hand displayed at a time
// Add functionality to choose if Ace should be 11 or 1

let userMoney = 100;

let wins = document.getElementById("Wins").textContent;
wins = +wins[6];
let streak = document.getElementById("Streak").textContent;
streak = +streak[7];
let losses = document.getElementById("Losses").textContent;
losses = +losses[7];

console.log(wins);
console.log(streak);
console.log(losses);

// eslint thinks this isn't called as it's not referenced in this code but in html
// eslint-disable-next-line no-unused-vars
function blackjack() {
	const suits = ["\u2666", "\u2660", "\u2663", "\u2665"];
	const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	const ranks = [
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"Jack",
		"Queen",
		"King",
		"Ace"
	];

	let winlossStatus = undefined;

	let deck = [];
	let userHand = [];
	let dealerHand = [];

	let bet = 0;

	// Deck building function
	function deckBuilder() {
		console.log("Building Deck...");
		// Suit loop
		for (let j = 0; j < suits.length; j++) {
			// Values & Rank loop
			for (let i = 0; i < values.length; i++) {
				deck.push({
					// if value is less than 10 return i else check if 14, if so return 11 (Ace) otherwise return 10 (face card)
					value: values[i] < 10 ? values[i] : values[i] == 14 ? 11 : 10,
					suit: suits[j],
					rank: ranks[i]
				});
			}
		}
	}

	// Shuffle function
	function shuffleDeck() {
		for (let i = 0; i < deck.length; i++) {
			// picks the random number between 0 and length of the deck
			let shuffle = Math.floor(Math.random() * deck.length);

			// swap the current with a random position
			[deck[i], deck[shuffle]] = [deck[shuffle], deck[i]];
		}
	}

	// Checks if user would like to bet, if
	function betCheck() {
		if (userMoney == 0) {
			alert(`You've got no money :( Refresh the page to refill.`);
			return;
		}

		bet = confirm(`You have ${userMoney}, would you like to place a bet?`);

		if (bet) {
			bet = +prompt("Please enter a bet");
		}

		while (bet > userMoney) {
			alert("You have bet more than you have, please choose another bet");
			confirm(`You have $${userMoney}, would you like to place a bet?`)
				? (bet = +prompt("Please enter a bet"))
				: null;
		}
		userMoney -= bet;
	}

	// Deal function
	function deal() {
		betCheck();

		console.log("Dealing cards...");

		// Takes last two cards from deck and adds to userHand & dealerHand
		userHand = userHand.concat(deck.splice(-2, 2));
		dealerHand = dealerHand.concat(deck.splice(-2, 2));

		checkBust(userHand, dealerHand);

		alert(`${printHand(userHand)} ${printHand(dealerHand)}`);

		alert(
			`Your total points is: ${calculatePoints(
				userHand
			)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
		);

		gameplayLogic();
	}

	// Use to debug certain hands
	function debugDeal() {
		betCheck();

		console.log("Debug Dealing cards...");

		userHand.push(
			{
				value: 11,
				suit: "\u2666",
				rank: "Ace"
			},
			{
				value: 11,
				suit: "\u2666",
				rank: "Ace"
			}
		);

		dealerHand.push(
			{
				value: 11,
				suit: "\u2666",
				rank: "Ace"
			},
			{
				value: 11,
				suit: "\u2666",
				rank: "Ace"
			}
		);

		checkBust(userHand, dealerHand);

		alert(`${printHand(userHand)} ${printHand(dealerHand)}`);

		alert(
			`Your total points is: ${calculatePoints(
				userHand
			)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
		);

		gameplayLogic();
	}

	// Prints hand values and suit in text form
	function printHand(hand) {
		let printedHand = "";

		hand == userHand
			? (printedHand = "You have: ")
			: (printedHand = "Dealer has: ");

		hand.forEach((card, index, hand) => {
			printedHand = printedHand.concat(`${card.rank} of ${card.suit}`);
			if (index == hand.length - 1) {
				printedHand = printedHand.concat(".");
			} else {
				printedHand = printedHand.concat(", ");
			}
		});
		return printedHand;
	}

	// Calculates total points of hand argument
	function calculatePoints(hand) {
		let points = 0;

		for (let card of hand) {
			points += card.value;
		}
		return points;
	}

	// Checks if user or dealer hand contains blackjack or bust
	function checkBust(user, dealer) {
		console.log("Checking if either hand contains blackjack or bust");

		// if user or dealer has an ace try and convert

		if (user.some((card) => card.rank == "Ace" && card.value != 1)) {
			convertAce(user);
		}

		if (dealer.some((card) => card.rank == "Ace" && card.value != 1)) {
			convertAce(dealer);
		}

		// if hand is under 21 return false
		if (calculatePoints(user) < 21 && calculatePoints(dealer) < 21) {
			return false;
			// if dealer or user has blackjack return true
		} else if (calculatePoints(user) == 21 || calculatePoints(dealer) == 21) {
			return true;
		}

		// check if hand is over 21 after checking for ace conversion
		return calculatePoints(user) > 21 || calculatePoints(dealer) > 21
			? true
			: false;
	}

	function convertAce(hand) {
		hand.map((card) => {
			// only convert ace if hand is over 21
			if (calculatePoints(hand) > 21) {
				// Only convert ace if value is not already 1
				if (card.rank == "Ace" && card.value != 1) {
					console.log("Ace conversion called...");
					card.value = 1;
				}
			}
			return;
		});
	}

	// Check if the dealer should hit
	function checkDealerHit() {
		// Dealer always hits under 17
		// Dealer should check if they have a soft or hard 17
		// if soft 17 (Ace + any value(s) that equals 17) they should hit
		// if equal to or greater than hard 17 (Any values added together to 17) they should stand

		switch (true) {
		// If hand value is less than 17 dealer should hit
		case calculatePoints(dealerHand) < 17:
			console.log("Dealer hits");
			return true;
			// If hand value is less than 21 but greater or equal to 17 and dealer has an ace in hand dealer should hit
		case 21 > calculatePoints(dealerHand) > 17 &&
				dealerHand.find((card) => card.rank == "Ace"):
			convertAce(dealerHand);
			return true;
		default:
			console.log("Dealer stands...");
			return false;
		}
	}

	function updateGameOutcome() {
		console.log("Updating game text and bet...");
		switch (true) {
		// User has won
		case winlossStatus == "Win":
			wins += 1;
			streak += 1;
			document.getElementById("Wins").textContent = `Wins: ${wins}`;
			document.getElementById("Streak").textContent = `Streak: ${streak}`;

			if (bet) {
				userMoney += bet * 2;
				alert(`You've won $${bet}! You have $${userMoney}`);
			}

			break;

			// User has lost
		case winlossStatus == "Lose":
			losses += 1;
			streak = 0;
			document.getElementById("Losses").textContent = `Losses: ${losses}`;
			document.getElementById("Streak").textContent = `Streak: ${streak}`;

			if (bet) {
				alert(`You've lost $${bet}, you have $${userMoney}`);
			}

			break;

			// Any other case (tie)
		default:
			if (bet) {
				userMoney += bet;
			}

			return;
		}
	}

	// Gameplay logic
	function gameplayLogic() {
		if (checkBust(userHand, dealerHand)) {
			return;
		}

		let hit = confirm("Would you like to hit?");

		// Both hands hit loop
		while (hit && checkDealerHit()) {
			console.log("Both User and Dealer hit... Dealing cards...");
			userHand.push(deck.pop());
			dealerHand.push(deck.pop());

			if (checkBust(userHand, dealerHand)) {
				alert(`${printHand(userHand)} ${printHand(dealerHand)}`);
				alert(
					`Your total points is: ${calculatePoints(
						userHand
					)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
				);
				return;
			}

			alert(`${printHand(userHand)} ${printHand(dealerHand)}`);
			alert(
				`Your total points is: ${calculatePoints(
					userHand
				)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
			);

			hit = confirm("Would you like to hit again?");
		}

		// User hand only hitting
		while (hit && !checkDealerHit()) {
			console.log("Dealer stands... Dealing card for user...");
			userHand.push(deck.pop());

			if (checkBust(userHand, dealerHand)) {
				alert(`${printHand(userHand)} ${printHand(dealerHand)}`);
				alert(
					`Your total points is: ${calculatePoints(
						userHand
					)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
				);
				return;
			}

			alert(`${printHand(userHand)} ${printHand(dealerHand)}`);
			alert(
				`Your total points is: ${calculatePoints(
					userHand
				)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
			);

			hit = confirm("Would you like to hit again?");
		}

		// Dealer hand only hitting
		while (checkDealerHit() && !hit) {
			console.log("User stands... Dealing card for dealer...");
			dealerHand.push(deck.pop());

			if (checkBust(userHand, dealerHand)) {
				alert(`${printHand(userHand)} ${printHand(dealerHand)}`);
				alert(
					`Your total points is: ${calculatePoints(
						userHand
					)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
				);
				return;
			}

			alert(`${printHand(userHand)} ${printHand(dealerHand)}`);
			alert(
				`Your total points is: ${calculatePoints(
					userHand
				)}. The Dealer's total points is: ${calculatePoints(dealerHand)}.`
			);
		}
	}

	// Scoring
	function ScoringLogic() {
		console.log("Choosing winner...");
		switch (true) {
		// If user hand has blackjack
		case calculatePoints(dealerHand) == 21:
			alert("Dealer has Blackjack :( You Lose.");
			winlossStatus = "Lose";
			break;
			// If dealer has blackjack
		case calculatePoints(userHand) == 21:
			alert("You have Blackjack! You Win!");
			winlossStatus = "Win";
			break;
			// If user hand is greater than 21
		case calculatePoints(userHand) > 21:
			alert("You have bust.");
			winlossStatus = "Lose";
			break;
			// If user hand is less than or equal to 21 and dealer hand value is less than userHand
		case calculatePoints(userHand) <= 21 &&
				calculatePoints(dealerHand) < calculatePoints(userHand):
			alert("You have won!");
			winlossStatus = "Win";
			break;
			// If dealer hand is greater than 21 but user hand is less than or equal to 21
		case calculatePoints(dealerHand) > 21 && calculatePoints(userHand) <= 21:
			alert("Dealer has bust, you win!");
			winlossStatus = "Win";
			break;
			// If user hand is less than or equal to 21 but dealer hand is greater than user hand but less than or equal to 21
		case calculatePoints(userHand) <= 21 &&
				calculatePoints(dealerHand) <= 21 &&
				calculatePoints(dealerHand) > calculatePoints(userHand):
			alert("Dealer wins.");
			winlossStatus = "Lose";
			break;
			// If user hand and dealer hand are the same value
		case calculatePoints(userHand) == calculatePoints(dealerHand):
			alert("Tie");
			winlossStatus = "Tie";
			break;
		}

		console.log(winlossStatus);
		updateGameOutcome();
		playAgain();
	}

	// Check if user would like to retry
	function playAgain() {
		let retry = confirm("Try Again?");

		if (retry) {
			blackjack();
		}
		return;
	}

	deckBuilder();
	shuffleDeck();
	deal();
	// debugDeal();
	ScoringLogic();
}
