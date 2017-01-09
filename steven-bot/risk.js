const { bestFreeCardsToPlay, cardsPlayed, hand, otherPlayers, pointTotals, round} = require('./config');

const getPointsInCurrentRound = round => {
	console.log('lololololo');
	if (otherPlayers.p1[round.startSuit] && otherPlayers.p2[round.startSuit] && otherPlayers.p3[round.startSuit]) {
		// This can be enhanced by counting number of played suit 
		// Non hearts can 
		console.log('All players have start suit');
		let cards = [round.p1, round.p2, round.p3];
		let score = addTotalPointsOfCards(cards);
		console.log(score);
		return score;
	} else {
		//  This can be enhanced if a player without the start suit has played a card already
		console.log('Not all players have start suit.  Some risk involved');
		return 100;
	}
};

const addTotalPointsOfCards = cards => {
	let total = 0;
	for( let i = 0; i < cards.length; i++) {
		let score = pointTotals[cards[i]];
		if ( score )
			total += score;
	}
	return total;
};



getPointsInCurrentRound(round);

module.exports = {
	getPointsInCurrentRound
}