const expect = require('expect');
const { getCardToBeat, getWinningCard } = require('./hearts');


const round = {
	startSuit : 'D',
	playerOrder: 3,
	p1: null,
	p2: '7-D',
	p3: '8-C'
};
const hand = ['8-D','5-D','2-D','6-C','12-S'];

describe('avoiding tricks', () => {
	it('should avoid the trick', () => {
		let cardToBeat = getCardToBeat(round);
		let cardToPlay = getWinningCard(cardToBeat, hand);
		expect(cardToPlay).toBe('5-D');
	});
});