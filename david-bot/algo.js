//const SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

class Other {
	constructor(delta) {
		this.delta = delta;
		this.inside = [-1,-1,-1,-1];
		this.inferred = [];
	}
	reset() {
		this.inside = [-1,-1,-1,-1];
		this.inferred = [];
	}
}

class DavidBot extends Player{
	constructor(playerIndex, name) {
		super(playerIndex, name);

		this.players = [this, new Other(1), new Other(2), new Other(3)];

		this.inside = [0,0,0,0];
		this.outside = [13,13,13,13];

		this.bad = [50, 9, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30]
	}
	reset() {
		this.inside = [0,0,0,0];
		this.outside = [13,13,13,13];
	}

	rotateLastTrick() {
		let ret = [];
		let i = this.playerIndex;
		for (let _ = 0; _ < 4; _++) {
			ret.push(game.lastTrick[i++]);
			if (i == 4) i = 0;
		}
		return ret;
	}

	playAny() {
		for (let c of this.hand)
			if (this.playCard(c))
				return;
	}

	stick() {
		for (let c of this.bad) {
			if (this.hand.indexOf(c) != -1) {
				this.playCard(c);
				return;
			}
		}
		this.playCard(this.hand[this.hand.length - 1]);
	}

	record(delta, card) {
		let suit = cardSuit(card);
		let i = SUITS.indexOf(suit);
		this.outside[i]--;

		// This person ran out
		if (delta && suit != this.lastSuit)
			this.players[delta].inside[i] = 0;
	}

	algorithm() {
		// On deal, parse hand
		if (this.hand.length == 13) {
			this.reset();
			for (let c of this.hand) {
				let i = SUITS.indexOf(cardSuit(c));
				this.inside[i]++;
				this.outside[i]--;
			}
		}

		// Parse last trick
		let lt = this.rotateLastTrick();
		this.inside[SUITS.indexOf(cardSuit(lt[0]))]--;
		for (let i = 0; i < 4; i++) this.record(i, lt[i]);

		// I am the first to play
		if (game.leadSuit == '') {
			this.playAny();
			return;
		}

		// I don't have the lead suit
		if (!this.checkForSuit(game.leadSuit)) {
			this.stick();
			return;
		}

		this.playAny();
		return;
	}
}

