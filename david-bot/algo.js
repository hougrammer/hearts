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

		this.playAny();

	}

	diamondStrat() {
		let cards = [];
		for (let c of this.hand) 
			if (13 < c && c <= 26) cards.push(c);

		if (!cards.length) this.stick();
		if (cards.length == 1) {
			this.playCard(cards[0]);
			return;
		}
		this.playAny();
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
		this.playAny();
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


		this.playAny();
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

