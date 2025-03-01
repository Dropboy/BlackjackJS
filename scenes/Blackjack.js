class Blackjack extends Phaser.Scene {
    constructor() {
        super('Blackjack');
    }

    init(data) {
        // Access data passed from previous scene/restart
        this.gamesPlayed = data.gamesPlayed || 0;
        this.playerMoney = data.playerMoney || 1000; // Default starting money
        this.bet = data.bet
        // ... other initializations
    }

    create() {
        // Reset game state variables
        let bust = false;
        userHand = [];
        dealerHand = [];
        deck = [];
        
        // Add background
        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
        
        // Add bet text
        let betText = this.add.text(50, 950, "Bet Money: " + "0", {
            fontFamily: "Noto Serif",
            fontSize: 64,
            color: "#FFFFFF"
        })
        .setDepth(100)

        let playerMoneyText = this.add.text(50, 850, "Player Money: " + this.playerMoney, {
            fontFamily: "Noto Serif",
            fontSize: 64,
            color: "#FFFFFF",
        })
        .setDepth(100)

        // Creating Chip objects with values
        const chipTen = new Chip(this, 1450, 700, TEXTURES.CHIPS.TEN, 10);

        // Create a Hand object
        this.hand = new Hand(
            this,
            900,
            1000,
            TEXTURES.HANDS.OPEN,
            TEXTURES.HANDS.CLOSED
        );

        // Create drop zone for chips
        this.betZone = new DropZone(this, 1700, 800, 300, 300, betText);

        // Create hit button
        this.hitButton = new Button(
            this,
            700,
            500,
            10,
            10,
            TEXTURES.BUTTONS.HIT,
            hit,
            userHand,
            deck,
            dealerHand,
            this
        );

        // Build the deck
        this.deck = buildDeck(this, deck);

        deal(this)

    }

    update() {
        // Move hand smoothly
        this.hand.sprite.x += (this.hand.targetX - this.hand.sprite.x) * 0.2;
        this.hand.sprite.y += (this.hand.targetY - this.hand.sprite.y) * 0.2;

        // Move held chip with the hand
        if (this.hand.heldObject) {
            this.hand.heldObject.x = this.hand.sprite.x + 10;
            this.hand.heldObject.y = this.hand.sprite.y - 500;
        }
    }
}