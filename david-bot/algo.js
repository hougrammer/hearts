class Other {
	constructor(delta) {
		this.deta = delta;
		this.clubs = -1;
		this.diamonds = -1;
		this.hearts = -1;
		this.spades = -1;
	}
}

class DavidBot extends Player{
	constructor(playerIndex, name) {
		super(playerIndex, name);

		this.p1 = new Other(1);
		this.p2 = new Other(2);
		this.p3 = new Other(3);

		this.outside = [13,13,13,13];

		this.clubs = 0;
		this.diamonds = 0;
		this.hearts = 0;
		this.spades = 0;
		this.bad = [50, 9, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30]
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

	algorithm() {
		// On deal, parse hand
		if (this.hand.length == 13) {
			this.outside = [13,13,13,13];
			this.clubs = 0;
			this.diamonds = 0;
			this.hearts = 0;
			this.spades = 0;
			for (let c of this.hand) {
				switch (cardSuit(c)) {
					case 'Clubs': this.clubs++; this.outside[0]--; break;
					case 'Diamonds': this.diamonds++; this.outside[1]--; break;
					case 'Hearts': this.hearts++; this.outside[2]--; break;
					case 'Spades': this.spades++; this.outside[3]--; break;
				}
			}
		}

		// Parse last trick
		let lt = this.rotateLastTrick();


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

