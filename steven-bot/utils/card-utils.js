// Lowest level utils for cards.
const { bestFreeCardsToPlay, cardsPlayed,  hand, otherPlayers, pointTotals, round} = require('../config');

const returnOnlySameSuit = (card, suit) => {
if (card && card.length > 0)
    return card[card.length - 1] == suit;
return false;
};


const getIntsFromCardArray = arrayOfCards => {
    let formattedCards = [];
    for (let i = 0; i < arrayOfCards.length; i++) {
        let split = arrayOfCards[i].indexOf('-');
        formattedCards.push(parseInt(arrayOfCards[i].substring(0,split)));
    }
    return formattedCards;
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

const getSuitOfCard = card => {
    return card[card.length - 1];
};

const getCardToBeat = round => {
    let cardsPlayed = [round.p1, round.p2, round.p3];
    let suit = round.startSuit;
    let cardsToBeat = cardsPlayed.filter((element) => returnOnlySameSuit(element, suit));
    let formattedCards = getIntsFromCardArray(cardsToBeat);
    let number = Math.max.apply(null, formattedCards);
    return number + '-' + suit;
};

const getWinningCard = (cardToBeat, hand) => {
    let suit = cardToBeat[cardToBeat.length - 1];
    let split = cardToBeat.indexOf('-');
    let numToBeat = parseInt(cardToBeat.substring(0,split));
    let viableCards = hand.filter((element) => returnOnlySameSuit(element, suit));
    if( viableCards.length === 0) {
    	// This is me returning that I can play anything I want
        return '15-C';
    }
    let formattedCards = getIntsFromCardArray(viableCards);
    let winningCard = getClosestLowerCard(formattedCards, numToBeat, suit);
    if(winningCard) {
        return winningCard;
    } else {
    	//I don't have a guarantee that I can avoid the trick
        return null;
    }
};

const getViableCardsToPlay = (cardToBeat, hand) => {
	let suit = cardToBeat[cardToBeat.length - 1];
    let split = cardToBeat.indexOf('-');
    let numToBeat = parseInt(cardToBeat.substring(0,split));
    return hand.filter((element) => returnOnlySameSuit(element, suit));
};

const getLowestNonWinningCard = (cardToBeat, hand) => {
	let suit = cardToBeat[cardToBeat.length - 1];
    let viableCards = getViableCardsToPlay(cardToBeat, hand);
    if( viableCards.length === 0) 
    	console.log('Error - I think I have no cards of the suit when I do');
    let viableCardsInt = getIntsFromCardArray(viableCards);
    let cardAsInt =  Math.min.apply(null, viableCardsInt);
    return `${cardAsInt}-${suit}`;

};

const getHighestNonWinningCard = (cardToBeat, hand) => {
	let suit = cardToBeat[cardToBeat.length - 1];
    let viableCards = getViableCardsToPlay(cardToBeat, hand);
    if( viableCards.length === 0) 
    	console.log('Error - I think I have no cards of the suit when I do');
    let viableCardsInt = getIntsFromCardArray(viableCards);
    let cardAsInt =  Math.max.apply(null, viableCardsInt);
    return `${cardAsInt}-${suit}`;

};

const getClosestLowerCard = (cards, cardToBeat, suit) => {
    let allDifferences = [];
    for (let i = 0; i < cards.length; i++) {
        let diff = cardToBeat - cards[i];
        allDifferences.push({
            card: cards[i],
            diff: diff
        });
    }
    let possibleChoices = allDifferences.filter((element) => element.diff > 0);
    if (possibleChoices.length === 0) {
        // I have no cards lower than the suit.
        return null;
    }
    let sortedPossibleChoices = possibleChoices.sort(function (a, b) {
       return a.diff - b.diff;
    });
    let bestCard = sortedPossibleChoices[0].card + '-' + suit;
    return bestCard;
};

module.exports = {
	returnOnlySameSuit,
	getIntsFromCardArray,
	addTotalPointsOfCards,
	getCardToBeat,
	getWinningCard,
	getSuitOfCard,
	getClosestLowerCard,
	getLowestNonWinningCard,
	getHighestNonWinningCard
};
