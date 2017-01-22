// Round = 1 set of 13 cards
// Order is p1, p2, p3, player.  p1 is left of player.  p2 is across.  p3 is right.

const { cardsPlayed, hand, bestFreeCardsToPlay, otherPlayers, round} = require('./config');

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


const returnOnlySameSuit = (card, suit) => {
if (card && card.length > 0)
    return card[card.length - 1] == suit;
return false;
}

const addSuitToNumArray = (array, suit) => {
    let res = [];
    for (let i = 0; i< array.length; i++) {
        res.push(`${array[i]}-${suit}`);
    }
    return res;
}

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

}

const getIntsFromCardArray = arrayOfCards => {
    let formattedCards = [];
    for (let i = 0; i < arrayOfCards.length; i++) {
        let split = arrayOfCards[i].indexOf('-');
        formattedCards.push(parseInt(arrayOfCards[i].substring(0,split)));
    }
    return formattedCards;
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
        console.log('You have no cards lower than the suit.');
        return null;
    }
    let sortedPossibleChoices = possibleChoices.sort(function (a, b) {
       return a.diff - b.diff;
    });
    let bestCard = sortedPossibleChoices[0].card + '-' + suit;
    return bestCard;
};

const getFreeCardToPlay = (hand) => {
    for (let i = 0; i < bestFreeCardsToPlay.length ; i++) {
        let indexOfCard = hand.indexOf(bestFreeCardsToPlay[i]);
        if(indexOfCard !== -1) {
            return hand[indexOfCard];
        }
    }
    // I don't have a preference in what i should play.  I should do the largest card in the hand
    // Unless I want to add suit tactics
    return hand[0];
};

const tryToAvoidTrick = (cardToBeat, hand) => {
    let otherPlayersToPlay = 0;
    if (round.p1 && round.p2 === null)
        otherPlayersToPlay = 1;
    else if (round.p1 === null && round.p2 === null)
        otherPlayersToPlay = 2;
    let numOfCardsThatCanBeatMyBest = 0;
}


const getAllUnavilableCardsPerSuit = (suit, hand, cardsPlayed) => {
    let suitInMyHand = hand.filter((element) => returnOnlySameSuit(element, suit));
    let usedCards = cardsPlayed.filter((element) => returnOnlySameSuit(element, suit));
    // I can merge the cards in my hand with the used cards
    // since other players can't use my cards  --They actually can cause players can impact other players :)
    Array.prototype.push.apply(usedCards, suitInMyHand);
    if (round.p1 && round.p1[round.p1.length - 1] === suit)
        usedCards.push(round.p1);
    if (round.p2 && round.p2[round.p2.length - 1] === suit)
        usedCards.push(round.p2);
    if (round.p3 && round.p3[round.p3.length - 1] === suit)
        usedCards.push(round.p3);
    return usedCards;
};

const getNumOfCardsThatCanBeatMyBest = (myBestCard, hand) => {
    let suit  = myBestCard[myBestCard.length -1];
    let myBest = parseInt(myBestCard.substring(0,myBestCard.indexOf('-')));
    let suitInMyHand = hand.filter((element) => returnOnlySameSuit(element, myBestCard[myBestCard.length -1]));
    let usedCards = getAllUnavilableCardsPerSuit(suit, hand);

    let formattedUsedCards = getIntsFromCardArray(usedCards);
    let usedCardsThatBeatMyBest = formattedUsedCards.filter((element) => element < myBest);
    let availableCardsThatBeatMyBest = myBest - usedCardsThatBeatMyBest.length - 2;
    return availableCardsThatBeatMyBest;
};

const getCardsThatCanBeatMyCard = (myCard, round, hand, cardsPlayed) => {
    console.log('cardsPlayed test: ', cardsPlayed);
    let suit  = myCard[myCard.length -1];
    let cardNumber = parseInt(myCard.substring(0,myCard.indexOf('-')));
    
    let suitInMyHand = hand.filter((element) => returnOnlySameSuit(element, myCard[myCard.length -1]));
    let usedCards = getAllUnavilableCardsPerSuit(suit, hand, cardsPlayed);
    if (round.p1 !== null && round.p1[round.p1.length -1] === round.startSuit)
            usedCards.push(round.p1);
    if (round.p2 !== null && round.p2[round.p2.length -1] === round.startSuit)
            usedCards.push(round.p2);
    if (round.p3 !== null && round.p3[round.p3.length -1] === round.startSuit)
            usedCards.push(round.p3);

    let formattedUsedCards = getIntsFromCardArray(usedCards);
    let possibleCards = [2,3,4,5,6,7,8,9,10,11,12,13,14];
    let cardsOfSuitNotPlayed = [];
    for (let i = 0; i < possibleCards.length; i++) {
        if(formattedUsedCards.indexOf(possibleCards[i]) === -1) 
            cardsOfSuitNotPlayed.push(possibleCards[i]);
    }
    console.log('cardsOfSuitNotPlayed',cardsOfSuitNotPlayed);
    let cardsThatBeatMyCard = cardsOfSuitNotPlayed.filter((element) => element < cardNumber);


    return addSuitToNumArray(cardsThatBeatMyCard, suit);
};




//console.log(getCardsThatCanBeatMyCard('8-D', round, hand, cardsPlayed));

 module.exports = {
    getWinningCard,
    getCardToBeat,
    hand,
    getNumOfCardsThatCanBeatMyBest,
    getAllUnavilableCardsPerSuit,
    getCardsThatCanBeatMyCard
 };


// For risk, see how many points are on the table.
// See how many points are left.
// Calculate risk.  Risk = Points on table - points remaining in game
// Choose card:  If risk is high, choose lowest card.  If risk low, play highest card. Middle risk: middle card
    // Need to decide thresholds

// For starting a trick
// Risk:  How many points are remaining.  Known safe cards (against cards played and other players have suit)
// Reward:  Cards in hand
