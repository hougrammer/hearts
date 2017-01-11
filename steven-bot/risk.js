const { bestFreeCardsToPlay, cardsPlayed,  hand, otherPlayers, pointTotals, round} = require('./config');
const { getNumOfCardsThatCanBeatMyBest, getAllUnavilableCardsPerSuit } = require('./hearts');

const getPointsInCurrentRound = round => {
	let cards = [round.p1, round.p2, round.p3];
	let score = addTotalPointsOfCards(cards);

	if (otherPlayers.p1[round.startSuit] && otherPlayers.p2[round.startSuit] && otherPlayers.p3[round.startSuit]) {
		// This can be enhanced by counting number of played suit
		// Non hearts can
		console.log('All players probably have start suit');

		console.log(score);
		return score;


	} else {
		// Handles situations where I'm not the last person to play.
		//Assume the worst for this else block
		// TODO:  This block wont work if the start suit is hearts.  I need to assume that people will play hearts

		let unavailableCards = getAllUnavilableCardsPerSuit(round.startSuit, hand);
		let numOfPlayersWhoCanPlayAnything = 0;
		if (round.p1 === null && !otherPlayers.p1[round.startSuit])
			numOfPlayersWhoCanPlayAnything++;
		if (round.p2 === null && !otherPlayers.p2[round.startSuit])
			numOfPlayersWhoCanPlayAnything++;
		if (round.p3 === null && !otherPlayers.p3[round.startSuit])
			numOfPlayersWhoCanPlayAnything++;

		let availablePointCards = getAvailablePointCards(cardsPlayed, hand);
		let potentialAdditionalPoints = 0;
		if (numOfPlayersWhoCanPlayAnything === 1)
			potentialAdditionalPoints += pointTotals[availablePointCards[0]];
		if (numOfPlayersWhoCanPlayAnything === 2) {
			potentialAdditionalPoints += pointTotals[availablePointCards[0]];
			potentialAdditionalPoints += pointTotals[availablePointCards[1]];
		}
		//  This can be enhanced if a player without the start suit has played a card already
		console.log(`${numOfPlayersWhoCanPlayAnything} players can play anything.`);
		console.log(`There can be an additional ${potentialAdditionalPoints} points played (${score} points currently played).`);
		return score + potentialAdditionalPoints;
	}
};

const getAvailablePointCards = (cardsPlayed, hand) => {
	let availablePointCards =[];
	for (let key in pointTotals) {
		if (pointTotals[key] > 0 && cardsPlayed.indexOf(key) === -1)
			availablePointCards.push(key);
	}
	availablePointCards.sort((a, b) => {
  		return pointTotals[b] - pointTotals[a];
	});
	return availablePointCards;
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



console.log(getPointsInCurrentRound(round));
//getAvailablePointCards(cardsPlayed, hand);

module.exports = {
	getPointsInCurrentRound
}
