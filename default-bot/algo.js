/**
DefaultBot just plays the first legal card in its hand.
*/
class DefaultBot extends Player {
	constructor(playerIndex, name) {
		super(playerIndex, name);
	}
	
	algorithm() {
		for (var c of this.hand)
			if (game.playCard(this.playerIndex, c))
				break;
	}
}