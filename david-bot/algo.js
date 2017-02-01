//const SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

class Other {
	constructor(delta) {
		this.delta = delta;
		this.distro = [-1,-1,-1,-1];
		this.inferred = [];
	}
	reset() {
		this.distro = [-1,-1,-1,-1];
		this.inferred = [];
	}
}

class DavidBot extends Player{
	constructor(playerIndex, name) {
		super(playerIndex, name);

		this.players = [this, new Other(1), new Other(2), new Other(3)];

		this.distro = [0,0,0,0];
		this.outer = [13,13,13,13];
		this.outside = [];
		for (let i = 1; i <= 52; i++) this.outside.push(i);

		this.bad = [50, 9, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30];
	}

	reset() {
		this.distro = [0,0,0,0];
		this.outer = [13,13,13,13];
		this.outside = [];
		for (let i = 1; i <= 52; i++) this.outside.push(i);
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
		this.outside.splice(this.outside.indexOf(card), 1);

		// This person ran out
		if (suit != this.lastSuit)
			this.players[delta].distro[i] = 0;
	}

	findPoints() {
		for (let c in this.bad) {
			if (game.trick.indexOf(c) != -1)
				return true;
		}
		return false;
	}

	duck(cards) {
		let ls = game.leadSuit;
		let t = game.trick;
		let position = 5 - count(game.trick, 0);
		let max = 0;
		for (let c of game.trick)
			if (cardSuit(c) == ls && c > max)
				max = c;
		for (let i = cards.length; i; i--) {
			if (cards[i] < max) {
				this.playCard(cards[i]);
				return;
			}
		}
		if (position == 4) {
			this.playCard(cards[cards.length-1]);
			return;
		}
		this.playCard(cards[0]);
	}

	clubStrat() {
		let cards = [];
		for (let c of this.hand) 
			if (c <= 13) cards.push(c);

		if (!cards.length) this.stick();
		if (cards.length == 1) {
			this.playCard(cards[0]);
			return;
		}

		let t = game.trick;

		this.duck(cards);

	}

	diamondStrat() {
		let cards = [];
		let pens = [];
		for (let c of this.hand) {
			if (13 < c && c <= 26) cards.push(c);
			if (24 <= c && c <= 26) pens.push(c);
		}

		if (!cards.length) this.stick();
		if (cards.length == 1) {
			this.playCard(cards[0]);
			return;
		}

		let t = game.trick;
		let position = 5 - count(game.trick, 0);
		let ace = t.indexOf(26) != -1;
		let king = t.indexOf(25) != -1;
		let queen = t.indexOf(24) != -1;
		let jack = t.indexOf(23) != -1;

		if (jack) { 
			this.playCard(cards[cards.length-1]);
			return;
		}

		this.duck(cards);
	}

	heartStrat() {
		let cards = [];
		for (let c of this.hand) 
			if (26 < c && c <= 39) cards.push(c);

		if (!cards.length) this.stick();
		if (cards.length == 1) {
			this.playCard(cards[0]);
			return;
		}
		this.duck(cards);
	}

	spadeStrat() {
		let cards = [];
		for (let c of this.hand) 
			if (39 < c) cards.push(c);

		if (!cards.length) this.stick();
		if (cards.length == 1) {
			this.playCard(cards[0]);
			return;
		}

		let t = game.trick;
		let position = 5 - count(game.trick, 0);
		let ace = t.indexOf(52) != -1;
		let king = t.indexOf(51) != -1;
		let queen = t.indexOf(50) != -1;

		if (ace) {
			if (this.playCard(50)) return;
			if (this.playCard(51)) return;
			this.playCard(cards[cards.length-1]);
			return;
		}
		if (king) {
			if (this.playCard(50)) return;
			if (queen) {
				for (let i = cards.length; i; i--)
					if (cards[i] < 52) {
						this.playCard(cards[i]);
						return;
					}
			}
			this.playCard(cards[cards.length-1]);
			return;
		}
		if (queen) {
			for (let i = cards.length; i; i--) 
				if (cards[i] < 50)
					this.playCard(cards[i]);
			this.playCard(cards[cards.length-1]);
			return;
		}
		if (position == 4) {
			if (!this.findPoints()) {
				this.playCard(cards[cards.length-1]);
				return;
			}
			this.duck(cards);
			return;
		}
		this.duck(cards);
	}

	algorithm() {
		// On deal, parse hand
		if (this.hand.length == 13) {
			this.reset();
			for (let c of this.hand) {
				let i = SUITS.indexOf(cardSuit(c));
				this.distro[i]++;
				this.outside.splice(this.outside.indexOf(c), 1);
			}
		}

		// Parse last trick
		let lt = this.rotateLastTrick();
		this.distro[SUITS.indexOf(cardSuit(lt[0]))]--;
		for (let i = 0; i < 4; i++) this.record(i, lt[i]);

		let ls = game.leadSuit;
		// I am the first to play
		if (ls == '') {
			this.playAny();
			return;
		}

		switch (ls) {
			case 'Clubs': this.clubStrat(); return;
			case 'Diamonds': this.diamondStrat(); return;
			case 'Hearts': this.heartStrat(); return;
			case 'Spades': this.spadeStrat(); return;
		}

		this.playAny();
		return;
	}
}

