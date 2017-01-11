function f() {
	for (var c of this.hand)
			if (game.playCard(playerIndex, c))
				break;
}