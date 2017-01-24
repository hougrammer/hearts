const { bestFreeCardsToPlay, cardsPlayed,  hand, otherPlayers, pointTotals, round} = require('../config');
const { returnOnlySameSuit, getIntsFromCardArray, addTotalPointsOfCards, getCardToBeat, getWinningCard, getSuitOfCard } = require('./card-utils');

const getStatsOfRound = round => {
	let results = {
		canAvoidTrick: false,
		playersLeftWhoCanPlayAnything: 0,
		playersLeftWhoMustPlaySuit: 0,
		playersWhoPlayedSuit: 0,
		playersWhoDidNotPlaySuit: 0
	};

	let cardToBeat = getCardToBeat(round);
	if(getWinningCard(cardToBeat, hand)) 
		results.canAvoidTrick = true;

	// P1
	if (round.p1 !== null && getSuitOfCard(round.p1) === round.startSuit) {
		results.playersWhoPlayedSuit++
	} else if (round.p1 !== null && getSuitOfCard(round.p1) !== round.startSuit) {
		results.playersWhoDidNotPlaySuit++
	} else if(round.p1 === null && !otherPlayers.p1[round.startSuit]) {
		results.playersLeftWhoCanPlayAnything++
	} else if (round.p1 === null && otherPlayers.p1[round.startSuit]){
		results.playersLeftWhoMustPlaySuit++
	}  

	// P2
	if (round.p2 !== null && getSuitOfCard(round.p2) === round.startSuit) {
		results.playersWhoPlayedSuit++
	} else if (round.p2 !== null && getSuitOfCard(round.p2) !== round.startSuit) {
		results.playersWhoDidNotPlaySuit++
	} else if(round.p2 === null && !otherPlayers.p2[round.startSuit]) {
		results.playersLeftWhoCanPlayAnything++
	} else if (round.p2 === null && otherPlayers.p2[round.startSuit]){
		results.playersLeftWhoMustPlaySuit++
	}  

	// P3
	if (round.p3 !== null && getSuitOfCard(round.p3) === round.startSuit) {
		results.playersWhoPlayedSuit++
	} else if (round.p3 !== null && getSuitOfCard(round.p3) !== round.startSuit) {
		results.playersWhoDidNotPlaySuit++
	} else if(round.p3 === null && !otherPlayers.p3[round.startSuit]) {
		results.playersLeftWhoCanPlayAnything++
	} else if (round.p3 === null && otherPlayers.p3[round.startSuit]){
		results.playersLeftWhoMustPlaySuit++
	}  

	return results;
};

const addSuitToNumArray = (array, suit) => {
    let res = [];
    for (let i = 0; i< array.length; i++) {
        res.push(`${array[i]}-${suit}`);
    }
    return res;
}

const OtherPlayer = function(name) {
    self = {
        name: name,
        hasSpades : true,
        hasHearts : true,
        hasClubs : true,
        hasDiamonds : true,

        pointsTotal : 0,
        pointsRound: 0
    };
    otherPlayers[name] = self;
    return self;
};

module.exports = {
	getStatsOfRound,
	addSuitToNumArray,
	OtherPlayer
};
