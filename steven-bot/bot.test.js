const expect = require('expect');
const { getCardToBeat, getWinningCard } = require('./hearts');
const { getPointsInCurrentRound } = require('./risk');

const hand = ['8-D','5-D','2-D','6-C','12-S'];

describe('avoiding tricks', () => {
	it('should avoid the trick', () => {
		let round = {
			startSuit : 'D',
			playerOrder: 3,
			p1: null,
			p2: '7-D',
			p3: '8-C'
		};
		let cardToBeat = getCardToBeat(round);
		let cardToPlay = getWinningCard(cardToBeat, hand);
		expect(cardToPlay).toBe('5-D');
	});
});

describe('Accessing risk', () => {
	// if fails, maybe put otherPlayers config in here.
	it('should calculate how many points are in a round', () => {
		let round = {
			startSuit : 'H',
			playerOrder: 3,
			p1: '12-S',
			p2: '11-D',
			p3: '12-H'
		};
		let pointTotal = getPointsInCurrentRound(round);
		expect(pointTotal).toBe(30);

	});
});