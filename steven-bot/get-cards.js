const { cardsPlayed, hand, bestFreeCardsToPlay, otherPlayers, round} = require('./config');
const { getStatsOfRound, addSuitToNumArray, OtherPlayer } = require('./utils/utils');
const { returnOnlySameSuit, getIntsFromCardArray, addTotalPointsOfCards, getCardToBeat, getWinningCard, getSuitOfCard } = require('./utils/card-utils');


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


console.log(getCardsThatCanBeatMyCard('8-D', round, hand, cardsPlayed));

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
