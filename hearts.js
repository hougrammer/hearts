// Suits order can be redefined if we don't like this.
const SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

// Point values of all the special cards
const SPECIALS = {
	9: 50, // 10 of Clubs "multiplier"

	23: 100, // Jack of Diamonds "goat"

	// Hearts:
	// The 2, 3 and 4 are not actually worth -1 points.
	// I'm just using it to easily check for shooting the moon.
	27: -1, // 2
	28: -1, // 3
	29: -1, // 4
	30: -10, // 5
	31: -10, // 6 
	32: -10, // 7
	33: -10, // 8
	34: -10, // 9
	35: -10, // 10
	36: -20, // Jack
	37: -30, // Queen
	38: -40, // King
	39: -50, // Ace

	50: -100 // Queen of Spades "pig"
};


/**
Utility array summer.
*/
function sum(arr) { 
	return arr.reduce(function(a,b) {
		return a+b;
	}, 0);
}

/**
Returns suit of card number.
*/
function cardSuit(number) { return SUITS[Math.floor((number-1)/13)]; }

/**
Returns name of card number.
Card 1 is 2 of Clubs.
Card 52 is Ace of Spades.
*/
function cardName(number) {
    var suit = cardSuit(number);
    switch (number%13) {
        case 0: return 'Ace of ' + suit;
        case 10: return 'Jack of ' + suit;
        case 11: return 'Queen of ' + suit;
        case 12: return 'King of ' + suit;
        default: return (number%13)+1 + ' of ' + suit;
    }
}

/**
Player class.
*/
function Player(playerIndex, name) {
	this.playerIndex = playerIndex;
	this.name = name;
	this.score =  0;
	this.hand = [];
	this.taken = [];
	this.algorithm = function() {
		for (var c of this.hand)
			if (game.playCard(playerIndex, c))
				break;
	}
}

/**
Game class.
*/
function Game(north, west, south, east) {
    this.players = [north, west, south, east]
    this.currPlayer = 0; // Arbitrary.  Will be changed with find2().
    this.leadSuit = '';
    this.trick = [];

    // Variables for game simulation
    this.sim = false;
    this.interval;

    /**
    Updates #status <div> if msg is defined.
    Returns status of game.
    */
    this.status = function(msg) {
    	if (msg) $("#status").html(msg);
    	return $("#status").text();
    }

    /**
	Deals cards to all the players.
    */
    this.deal = function() {
		var deck = [];
		for (var i = 1; i <= 52; i++) {
			deck.push(i);
		}
		for (var i = 0; i < 52; i++) {
			var j = Math.floor(Math.random()*52);
			var temp = deck[i];
			deck[i] = deck[j];
			deck[j] = temp;
		}
		for (var i = 0; i < 52; i++) {
			this.players[i%4].hand.push(deck[i]);
		}

		var cmp = function(a,b) {return a-b;};
		for (var p of this.players) p.hand.sort(cmp);
	}

	/**
	Finds the 2 of clubs to determine first player.
	*/
	this.find2 = function() {
		for (var i = 0; i < 4; i++)
			if (this.players[i].hand.indexOf(1) != -1)
				return i;
	}

	/**
	Returns next player in rotation.
	Traditionally counterclockwise.
	*/
    this.nextPlayer = function() {
    	var ret = (this.currPlayer == 3) ? 0 : this.currPlayer+1;
    	game.status('Next player is ' + this.players[ret].name);
        return ret;
    }

    /**
	Returns card names of hand with <a> tags.
	*/
	this.listHand = function(playerIndex) {
		player = this.players[playerIndex];
		ret = '';
		for (var c of player.hand)
			ret += '<a class="list-group-item" onclick="game.playCard(' + playerIndex + ',' + c + ')">' 
				+ cardName(c) 
				+ '</a>';
		return ret;
	}

	/**
	Updates hand display of player.
	Updates all hands if playerIndex is omitted.
	*/
	this.updateHand = function(playerIndex) {
		var ids = ['#north-hand', '#west-hand', '#south-hand', '#east-hand'];
		if (playerIndex == undefined) 
			for (var i = 0; i < 4; i++)
				$(ids[i]).html(this.listHand(i));
		else
			$(ids[playerIndex]).html(this.listHand(playerIndex));
	}

	/**
	Updates scoreboard.
	*/
	this.updateScoreboard = function() {
		var ids = ['#north-score', '#west-score', '#south-score', '#east-score'];
		for (var i = 0; i < 4; i++) $(ids[i]).html(this.players[i].score);
	}

    /**
	Plays card. Returns true if successful.
	*/
	this.playCard = function(playerIndex, card) {
		var player = this.players[playerIndex];
		var name = player.name;

		// Check if it's this player's turn.
		if (playerIndex != this.currPlayer) {
			this.status('It is ' + this.players[this.currPlayer].name + '\'s turn');
			return false;
		}

		// Check if this player has the card.
		var i = player.hand.indexOf(card);
		if (i == -1) {
		    this.status(name + ' does not have the ' + cardName(card));
		    return false;
		}
		
		// Check for following suit.
		if (this.leadSuit && cardSuit(card) != this.leadSuit) {
		    for (var c of player.hand) {
		        if (cardSuit(c) == this.leadSuit) {
		            this.status(name + ' must play ' + this.leadSuit);
		            return false;
		        }
		    }
		}
		
		// Set lead suit if not already.
		if (!this.leadSuit) this.leadSuit = cardSuit(card);

		// Remove card from player's hand and add it to trick.
		this.trick.push([playerIndex, player.hand.splice(i, 1)[0]]);

		// Update current player.
		if (this.trick.length == 4) this.currPlayer = this.evalTrick();
		else this.currPlayer = this.nextPlayer();

		// Update display.
		this.updateHand(playerIndex);

		// Check for end of round.
		if (!this.players[this.currPlayer].hand.length) game.evalRound();

		return true;
	}

	/**
	Evaluates trick. Returns next player to play.
	*/
	this.evalTrick = function() {
		var takerIndex = 0;
		var max = -1;
		var cards = [];

		// Check who played the largest card of lead suit.
		for (var pc of this.trick) {
			cards.push(pc[1]);
			if (pc[1] > max && cardSuit(pc[1]) == this.leadSuit) {
				takerIndex = pc[0];
				max = pc[1];
			}
		}

		// Give the cards to taker.  Ignore cards not in SPECIALS.
		var taker = this.players[takerIndex];
		for (var c of cards) {
			if (c in SPECIALS)
				taker.taken.push(c);
		}

		// Reset trick and lead suit.
		this.trick = [];
		this.leadSuit = '';
		game.status(taker.name + ' took the last trick.');

		return takerIndex;
	}

	/**
	Evaluates outcome of the round.
	*/
	this.evalRound = function() {
		for (var i = 0; i < 4; i++) {
			var p = this.players[i];
			var mult = false;
			var goat = false;
			var pig = false;
			var hearts = 0;

			for (var c of p.taken) {
				switch (c) {
					case 9: mult = true; break;
					case 23: goat = true; break;
					case 50: 
						pig = true; 
						this.currPlayer = i; // Player with pig starts next round.
						break;
					default: hearts += SPECIALS[c];
				}
			}

			// Check for dry multiplier
			if (mult && !goat && !pig && !hearts) p.score += 50;

			else {
				// Check for shooting the moon
				if (hearts == -203) hearts = 200;

				p.score += (1 + mult) * (goat*100 + pig*-100 + (hearts - hearts%10));
			}

			// Update scoreboard
			game.updateScoreboard();

			// Reset taken cards
			p.taken = [];
		}

		// Check for a loser.
		var loser;
		for (var p of this.players) 
			if (p.score <= -1000) 
				loser = p;

		// Deal another hand if there is no loser.  Else end game.
		if (loser == undefined) game.deal();
		else {
			game.status(loser.name + ' loses.');

			// Stop simulation if ongoing.
			if (this.sim) {
				this.sim = false;
				clearInterval(this.interval);
			}
		}
	}


	/**
	Driver function to call player choice algorithm.
	*/
	this.callAlgo = function() {
		var p = game.players[game.currPlayer];
		p.algorithm();
	}

	/**
	Quickly play through games.
	*/
	this.simulate = function() {
		if (!this.sim) {
			this.sim = true;
			this.interval = setInterval(this.callAlgo, 10);
		}

		else {
			this.sim = false;
			clearInterval(this.interval);
		}
	}
}

var north, west, south, east, game;

/**
Initializes game.
*/
function initGame() {
	north = new Player(0, 'North');
	west = new Player(1, 'West');
	south = new Player(2, 'South');
	east = new Player(3, 'East');
	game = new Game(north, west, south, east);

	// Stop simulation if ongoing.
	if (game.sim) {
		game.sim = false;
		clearInterval(game.interval);
	}
	game.deal();
	game.currPlayer = game.find2();
	game.updateHand();
	game.updateScoreboard();

	game.status("It is " + game.players[game.currPlayer].name + "'s turn.");
}

