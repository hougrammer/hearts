// Utils that aren't focused on cards

const { bestFreeCardsToPlay, cardsPlayed,  hand, otherPlayers, pointTotals, round} = require('../config');
const { returnOnlySameSuit, getIntsFromCardArray, addTotalPointsOfCards, getCardToBeat, getWinningCard } = require('./card-utils');


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



module.exports = {
	getStatsOfRound
}

// let res = getStatsOfRound(round);
// console.log(res);