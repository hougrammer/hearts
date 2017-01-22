const { bestFreeCardsToPlay, cardsPlayed,  hand, otherPlayers, pointTotals, round} = require('./config');
const { getNumOfCardsThatCanBeatMyBest, getCardsThatCanBeatMyCard, getAllUnavilableCardsPerSuit } = require('./hearts');
const {getStatsOfRound } = require('./utils');


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
		let numOfPlayersWhoCanPlayAnything = getNumOfPlayersWhoCanPlayAnything(round);

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

const getNumOfPlayersWhoCanPlayAnything = round => {
	let numOfPlayersWhoCanPlayAnything = 0;
		if (round.p1 === null && !otherPlayers.p1[round.startSuit])
			numOfPlayersWhoCanPlayAnything++;
		if (round.p2 === null && !otherPlayers.p2[round.startSuit])
			numOfPlayersWhoCanPlayAnything++;
		if (round.p3 === null && !otherPlayers.p3[round.startSuit])
			numOfPlayersWhoCanPlayAnything++;
	return numOfPlayersWhoCanPlayAnything;
}

const getPercentChanceOfTakingTrick = (myBestCard, round, hand, cardsPlayed) => {
	console.log('cardsPlayed test1: ', cardsPlayed);
	console.log('sdhgksjdfhgdkjfgdkjfgjkdfgjkdfngkldfgkldf');
	let roundStats = getStatsOfRound(round);
	let cardsThatBeatMyCard = getCardsThatCanBeatMyCard(myBestCard, round, hand, cardsPlayed);

	console.log('playersLeftWhoMustPlaySuit: ', roundStats.playersLeftWhoMustPlaySuit);
	console.log('cardsThatBeatMyCard', cardsThatBeatMyCard);

	// My best can't beat the trick.  No other players must play suit or 1 other player must
	// suit and he can definitely beat me.
	if (roundStats.playersLeftWhoMustPlaySuit === 0 || (roundStats.playersLeftWhoMustPlaySuit === 1 &&  cardsThatBeatMyCard.length > 0)){
		console.log('I am definitely taking this trick');
		return 100;
	}

	// My best can't beat trick.  2 other players must play suit
	if (roundStats.playersLeftWhoMustPlaySuit === 2 &&  cardsThatBeatMyCard.length > 0){
		console.log('Theres a chance i can dodge the trick if i play my best');
		return (Math.pow((1/2),cardsThatBeatMyCard.length) * 2).toFixed(2);
	}

	// I start the trick.  Everyone must play suit.  <3 cards can beat me.
	if (roundStats.playersLeftWhoMustPlaySuit === 3 &&  cardsThatBeatMyCard.length < 3){
		console.log('Im not taking this trick');
		return 0;
	}

	if (roundStats.playersLeftWhoMustPlaySuit === 3 &&  cardsThatBeatMyCard.length > 2){
		console.log('Theres a chance i can dodge the trick if i play my best');
		return (Math.pow((2/3),cardsThatBeatMyCard.length) * 3).toFixed(2);
		
	}

	console.log('Error - getPercentChanceOfTakingTrick encountered an unexpected scenario.');
	return .50;
};




console.log('');
console.log('');
console.log('');
console.log('');
console.log(getPercentChanceOfTakingTrick('7-D', round, hand, cardsPlayed));
//getAvailablePointCards(cardsPlayed, hand);

module.exports = {
	getPointsInCurrentRound,
	getPercentChanceOfTakingTrick
}
