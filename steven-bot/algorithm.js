const { bestFreeCardsToPlay, cardsPlayed,  hand, otherPlayers, pointTotals, round} = require('./config');
const { getCardsThatCanBeatMyCard, getAllUnavilableCardsPerSuit, getFreeCardToPlay } = require('./get-cards');
const { getStatsOfRound, addSuitToNumArray, OtherPlayer } = require('./utils/utils');
const { returnOnlySameSuit, getIntsFromCardArray, addTotalPointsOfCards, getCardToBeat, getWinningCard, getSuitOfCard, getHighestNonWinningCard, getLowestNonWinningCard, getIntFromCard } = require('./utils/card-utils');
const { getPercentChanceOfTakingTrick, getPointsInCurrentRound } = require('./risk');

const logObject = {};


const playRound = (round, hand, cardsPlayed, test) => {
	let cardToPlay = 'Error - No card selected for play';
	let cardToBeat = getCardToBeat(round);
	let roundStats = getStatsOfRound(round);

	logObject.cardToBeat = cardToBeat;
	logObject.hand = hand;
	logObject.round = round;
	logObject.roundStats = roundStats;

	if( roundStats.playersWhoPlayedSuit + roundStats.playersWhoDidNotPlaySuit === 0) {
		logObject.reasonForPlay= 'I played the card which results in me getting the lowest points';
		return getStartOfRoundCard(round, hand, cardsPlayed);
	}

	// I am not starting this round.
	
	let winningCard = getWinningCard(cardToBeat, hand);
	if (winningCard) {
		if( winningCard === '15-C') {
			// I can play anything I want
			cardToPlay = getFreeCardToPlay(hand);
			logObject.reasonForPlay = `I can play anything.  So I will play the highest point card I have: ${cardToPlay}.`;
			return cardToPlay;
		}
		// I can avoid this trick.  I should
		cardToPlay = winningCard
		logObject.reasonForPlay = `This is my worst card that avoids the trick: ${cardToPlay}`;
		return cardToPlay;
	}

	let myBestCard = getLowestNonWinningCard(cardToBeat, hand);
	let cardsThatBeatMyCard = getCardsThatCanBeatMyCard(myBestCard, round, hand, cardsPlayed);
	let percent = getPercentChanceOfTakingTrick(round, cardsThatBeatMyCard);
	let score = getPointsInCurrentRound(round);

	logObject.risk = `Likely points in round: ${score}.  Chance to take: ${percent}%.`;
	if(score === 0) {
		// There's no risk so I should take the trick.  Play my highest card of suit.
		cardToPlay = getHighestNonWinningCard(cardToBeat, hand);
		logObject.reasonForPlay = `No potential points in round.  I should take with my highest card ${cardToPlay}.`;
		return cardToPlay;
	}
	if (percent === 100) {
		// I can't avoid the trick no matter what
		cardToPlay = getHighestNonWinningCard(cardToBeat, hand);
		logObject.reasonForPlay = `I cant avoid this trick.  I should take with highest card: ${cardToPlay}.`;
		return cardToPlay;
	}

	// TODO:  Add some logic where if the odds are low, I take trick.  Should be points * chance to take
	// There's a chance I can avoid this trick
	cardToPlay = myBestCard
	logObject.reasonForPlay = `Likely points in round: ${score}.  Chance to take: ${percent}%.  I play my best card (${cardToPlay}) and hope i dont take`;
	return cardToPlay;
};

//Logic is #of potential points * chance of taking trick.  
const getStartOfRoundCard = (round, hand, cardsPlayed) => {
	let roundStats = getStatsOfRound(round);
	var chanceToTakeForEachCard = {};
    let suits = ['C', 'D', 'S', 'H'];
    for (let i = 0; i < suits.length; i++) {
    	let suitInMyHand = hand.filter((element) => returnOnlySameSuit(element, suits[i]));
        let usedCards = cardsPlayed.filter((element) => returnOnlySameSuit(element, suits[i]));

        let potentialRound = {
        	startSuit : suits[i],
			p1: null,
			p2: null,
			p3: null
        };
        let potentialPointsInRound = getPointsInCurrentRound(potentialRound);
        for(let j = 0; j < suitInMyHand.length; j++) {
        	let cardsThatBeatMyCard = getCardsThatCanBeatMyCard(suitInMyHand[j], round, hand, cardsPlayed);
        	let chanceToTakeTrick = getPercentChanceOfTakingTrick(round, cardsThatBeatMyCard);
        	let score = chanceToTakeTrick *  50 //potentialPointsInRound;

        	console.log(`${suitInMyHand[j]} -- ${chanceToTakeTrick}`);

        	chanceToTakeForEachCard[suitInMyHand[j]] = score;
    	}
    }

/*
    // Now that I have all of my cards and their score,
    // I will return the lowest score (highest numerical suit)

    // Import lodash and find a function to do this
    let orderedScore = chanceToTakeForEachCard
    let getAllLowestScores = orderedScore.filter
    // magically it becomes an array?
    for (let i = 0; i < getAllLowestScores.length; i++) {
    	let cardNum = getIntFromCard(getAllLowestScores[i]);
    	let highestCard = false;
    	for (let j = 0; j < getAllLowestScores.length; j++) {
    		if ()
    }
*/
    console.log(chanceToTakeForEachCard);
 
};

console.log(getStartOfRoundCard(round, hand, cardsPlayed));
//console.log(playRound(round, hand, cardsPlayed));
//console.log(logObject.reasonForPlay);
//console.log(JSON.stringify(logObject, null, 2));