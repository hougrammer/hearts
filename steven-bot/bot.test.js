const expect = require('expect');
const { getCardToBeat, getWinningCard } = require('./hearts');
const { getPercentChanceOfTakingTrick, getPointsInCurrentRound } = require('./risk');

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

	it('should calculate my % chance of taking a trick with 2 players who must play suit', () => {
		let round = {
			startSuit : 'D',
			playerOrder: 3,
			p1: '6-D',
			p2: null,
			p3: null
		};
		let hand = ['1-C', '2-C', '15-C', '3-C', '14-H', '7-D', '8-D'];
		let cardsPlayed = ['14-D', '5-D', '3-D', '13-C', '13-H', '12-H'];

		let risk = getPercentChanceOfTakingTrick('7-D', round, hand, cardsPlayed);
		expect(risk).toBe('0.50');
	});

		it('should calculate my % chance of taking a trick with 3 players who must play suit', () => {
		let round = {
			startSuit : 'D',
			playerOrder: 3,
			p1: null,
			p2: null,
			p3: null
		};
		let hand = ['1-C', '2-C', '15-C', '3-C', '14-H', '7-D', '8-D'];
		let cardsPlayed = ['14-D', '5-D', '13-C', '13-H', '12-H'];

		let risk = getPercentChanceOfTakingTrick('7-D', round, hand, cardsPlayed);
		expect(risk).toBe('0.59');
	});
});