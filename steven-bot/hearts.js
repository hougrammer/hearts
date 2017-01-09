// Round = 1 set of 13 cards
// Order is p1, p2, p3, player.  p1 is left of player.  p2 is across.  p3 is right.
 
const {hand, bestFreeCardsToPlay, otherPlayers, round} = require('./config');

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
 

 
const getScore = () => {
};
 
const avoidTrick = (round, hand, otherPlayers) => {
if (round.p1 && round.p2 && round.p3) { // All players have thrown a card
     
}
// Check to see if p1 hasn't, does he have any of the suit? (if no, avoid trick)
// Check to see if p2 hasn't; does he have the suit?
// Check to se eif p3 hasn't; does he have the suit?
 
};
 
const returnOnlySameSuit = (card, suit) => {
if (card && card.length > 0)
return card[card.length - 1] == suit;
return false;
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
        return '15-C';
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
 
let cardToBeat = getCardToBeat(round);
console.log('card to beat: ',cardToBeat);
let winningCard = getWinningCard(cardToBeat, hand);
console.log('winningCard: ', winningCard);
 

 module.exports = {
    getWinningCard,
    getCardToBeat,
    hand
 };
 
 
// For risk, see how many points are on the table.
// See how many points are left.
// Calculate risk.  Risk = Points on table - points remaining in game
// Choose card:  If risk is high, choose lowest card.  If risk low, play highest card. Middle risk: middle card
    // Need to decide thresholds
 
// For starting a trick
// Risk:  How many points are remaining.  Known safe cards (against cards played and other players have suit)
// Reward:  Cards in hand