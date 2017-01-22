class DavidBot extends Player{
	constructor(playerIndex, name) {
		super(playerIndex, name);
		this.clubs = 13;
		this.diamonds = 13;
		this.hearts = 13;
		this.spades = 13;
		this.BADCARDS = [50, 9, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30]
	}

	playAny() {
		for (var c of this.hand)
			if (game.playCard(this.playerIndex, c))
				break;
	}

	algorithm() {
		// I am the first to play
		if (game.leadSuit == '') {
			this.playAny();
			return;
		}

		// I have the lead suit
		if (this.checkForSuit(game.leadSuit)) {
			
		}
		this.playAny();
		return;
	}
}

