// Config of random properties.

const bestFreeCardsToPlay = ['12-S', '14-H','13-H', '12-H', '11-H', '10-H', '9-H', '8-H', '7-H', '6-H', '5-H', '4-H', '3-H', '2-H'];

const round = {
startSuit : 'D',
playerOrder: 3,
p1: null,
p2: '14-D',
p3: '7-D'
};
 
const hand = ['1-C', '2-C', '15-C', '3-C', '14-H'];

module.exports = {
	bestFreeCardsToPlay,
	hand,
	round
}