class DavidBot extends Player{
	constructor(playerIndex, name) {
		super(playerIndex, name);
		this.clubs = 13;
		this.diamonds = 13;
		this.hearts = 13;
		this.spades = 13;
		this.BAD = [50, 9, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30]
	}

	playAny() {
		for (var c of this.hand)
			if (this.playCard(c))
				return;
	}

	stick() {
		for (var c of this.BAD) {
			if (this.hand.indexOf(c) != -1) {
				this.playCard(c);
				return;
			}
		}
		this.playCard(this.hand[this.hand.length - 1]);
	}

	algorithm() {
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

