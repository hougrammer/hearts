// Lowest level utils for cards.

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

const getIntFromCard = card => {
    return parseInt(card.substring(0,card.indexOf('-')));
}

const addTotalPointsOfCards = cards => {
	let total = 0;
	for( let i = 0; i < cards.length; i++) {
		let score = pointTotals[cards[i]];
		if ( score )
			total += score;
	}
	return total;
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
        console.log('You have no cards of the start suit.  You are free to play anything');
        return getFreeCardToPlay(hand);
    }
    let formattedCards = getIntsFromCardArray(viableCards);
    let winningCard = getClosestLowerCard(formattedCards, numToBeat, suit);
    if(winningCard) {
        return winningCard;
    } else {
    //Code to handle what happens if you can choose any card you want
    // THis should move somewhere else.  I should return null here.
        console.log('You have no cards that can guarantee that you avoid this trick.');
        return null;
    }
};

module.exports = {
	returnOnlySameSuit,
	getIntsFromCardArray,
	addTotalPointsOfCards,
	getCardToBeat,
    getIntFromCard,
	getWinningCard
};