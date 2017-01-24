// Config of random properties.

const bestFreeCardsToPlay = ['12-S', '14-H','13-H', '12-H', '11-H', '10-H', '9-H', '8-H', '7-H', '6-H', '5-H', '4-H', '3-H', '2-H'];

const round = {
startSuit : 'S',
p1: '5-S',
p2: '4-S',
p3: null
};

const hand = ['1-C', '2-C', '12-C', '6-S', '3-C', '14-H', '7-D', '8-D'];
const cardsPlayed = ['14-D', '5-D', '3-D', '13-C', '13-H', '12-H'];

const pointTotals = {
	'14-H' : 50,
	'13-H' : 40,
	'12-H' : 30,
	'11-H' : 20,
	'10-H' : 10,
	'9-H' : 10,
	'8-H' : 10,
	'7-H' : 10,
	'6-H' : 10,
	'5-H' : 10,
	'4-H' : 0,
	'3-H' : 0,
	'2-H' : 0,
	'12-S' : 100,
	'11-D' : -100
};


const otherPlayers = {

	p1: {
		name: 'p1',
	    S: true,
	    H: true,
	    C: true,
	    D: true,
	    pointsTotal: 0,
	    pointsRound: 0
	},
    p2: {
	   	name: 'p2',
	    S: true,
	    H: true,
	    C: true,
	    D: true,
	    pointsTotal: 0,
	    pointsRound: 0
	},
 	p3: {
  		name: 'p3',
	     S: false,
	     H: true,
	     C: true,
	     D: true,
	     pointsTotal: 0,
	     pointsRound: 0
	}
};

module.exports = {
	bestFreeCardsToPlay,
	hand,
	round,
	otherPlayers,
	pointTotals,
	cardsPlayed
}
