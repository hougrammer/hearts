function defaultBot() {
	for (var c of this.hand)
		if (game.playCard(this.playerIndex, c))
			break;
}