// Suites c = Clubs, d = Diamonds, h = hearts, s = space
 // Numbers are 2-20 , the J = 11, Q= 12, k = 13, Ace = 14
 var ACE = 14;
 var KING = 13;
 var QUEEN = 12;
 var JACK = 11;
 var SPADE = 'S';
 var HEART = 'H';
 var DIAMOND = 'D';
 var CLUB = 'C';
 var NT = 'Z';
 var DOUBLE = 'DOUBLE';
 var SUITES = [CLUB, DIAMOND, HEART, SPADE];
 
 function strCard(cardString) {
   var card = new Card(5,SPADE); // any card
   var k = 1;
   if(cardString[0] == 'J') card.number = JACK;
   else if(cardString[0] == 'Q') card.number = QUEEN;
   else if(cardString[0] == 'K') card.number = KING;
   else if(cardString[0] == 'A') card.number = ACE;
   else if(cardString[1] == '0') {k =2; card.number = 10;}
   else card.number = parseInt(cardString[0]);

   card.suite = cardString[k];
   
   return card;
 }
    
 class Card {
    constructor(number, suite) {
     this.number = number;
     this.suite = suite;
    }
    
    
    
    toString() {
            var numString = "";
        if(this.number == JACK) numString += "J";
      else if(this.number == QUEEN) numString += "Q";
      else if(this.number == KING) numString += "K";
      else if(this.number == ACE) numString += "A";
      else numString += this.number;
      
        return numString + this.suite;
    }

    imageName() {
      var numString = "";
        if(this.number == JACK) numString += "jack";
      else if(this.number == QUEEN) numString += "queen";
      else if(this.number == KING) numString += "king";
      else if(this.number == ACE) numString += "ace";
      else numString += this.number;
      numString += "_of_";
      if (this.suite == CLUB) numString += "clubs";
      else if (this.suite == DIAMOND) numString += "diamonds";
      else if (this.suite == HEART) numString += "hearts";
      else if (this.suite == SPADE) numString += "spades";
      numString += ".png";
      return numString;
    }
 }
 
 function compareCards(card1, card2) {
    if (card1.suite == card2.suite) return card1.number - card2.number;
  return card1.suite - card2.suite;
 }
 
  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
 class Game {
    constructor(ato) {
        this.ato = ato;
        // dictionary of played cards so far.
        this.playedCards = {};
        this.playedCards[CLUB] = [];
        this.playedCards[DIAMOND] = [];
        this.playedCards[HEART] = [];
        this.playedCards[SPADE] = [];
        this.players = [new Player(this, "P0"), new Player(this, "P1"), new Player(this, "P2"), new Player(this, "P3")];
        this.roundIndex = 0;
        this.currentPlayerIndex = 0;
        this.cardsToImgMap = {};
        this.rounds = [];
        this.auction = new Auction();
    }

    startNewHand() {
      this.cardsToImgMap = {};
      this.players[0].setNewHand(parseHand('10D,JD,9D,4D,3D,JC,10C,6C,2C,9H,7H,5H,4H'));
      this.players[1].setNewHand(parseHand('AC,KC,QC,9C,QH,8H,9S,4S,3S,QD,7D,6D,5D'));
      this.players[2].setNewHand(parseHand('7C,5C,3C,8C,AH,JH,6H,2H,KS,10S,AD,8D,2D'));
      this.players[3].setNewHand(parseHand('4C,KD,KH,10H,3H,AS,QS,JS,8S,7S,6S,5S,2S'));
      for (var  i = 0; i < this.players.length; i++) {
        this.renderHand(i);
      }
    }

    renderHand(playerIndex) {
      var index = 0;
      for (var i = 0; i <  SUITES.length; i++) {
        for (var j = 0; j < this.players[playerIndex].hand.cards[SUITES[i]].length; j++) {
          var card = new Card(this.players[playerIndex].hand.cards[SUITES[i]][j], SUITES[i]);
          var imgId = "p" + (playerIndex + 1) + "_img" + (index + 1);
          this.cardsToImgMap[card.toString()] = imgId;
          document.getElementById(imgId).src = "images/" + card.imageName();
          index++;
        }
      }
    }
 
    async playRound() {
      var startingPlayer = this.currentPlayerIndex;
      var round = new Round([], this);
      for (var i = 0; i < this.players.length; i++) {
        var card = this.players[this.currentPlayerIndex].play(round);
        round.cards.push(card);
        this.animatePlayCard(card);
        await sleep(500);
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
      }
      console.log(round.toString());
      var winnerIndex = (startingPlayer + round.getWiningPlayerIndex()) % 4;
      console.log("Round winner is player " + winnerIndex);
      this.players[winnerIndex].currentHandScore++;
      this.currentPlayerIndex = winnerIndex;
      this.recordRound(round);
      this.roundIndex++;
      await sleep(1000);
      document.getElementById("p1").src="";
      document.getElementById("p2").src="";
      document.getElementById("p3").src="";
      document.getElementById("p4").src="";
    }

    animatePlayCard(card) {
      var handImg = document.getElementById(this.cardsToImgMap[card.toString()]);
      var playImg = document.getElementById("p" + (this.currentPlayerIndex + 1));
      playImg.src = handImg.src;
      handImg.src = "";
    }

    recordRound(round) {
    	this.rounds.push(round);
        for (var i=0; i < round.cards.length; i++) {
            var card = round.cards[i];
            this.playedCards[card.suite].push(card);
            this.playedCards[card.suite].sort(compareCards);
        }
    }

    recordBid(bid) {
    	return this.auction.addBid(bid);
    }

    gettHighestPlayedCard(suite) {
        var len = this.playedCards[suite].length;
        if (len === 0) return null;
        return this.playedCards[suite][len - 1];
    }

    getHighestNonPlayedCard(suite) {
        var currentCard = ACE;

        var len = this.playedCards[suite].length;
        
        for (var i = len - 1; i >= 0; i--) {
            if (this.playedCards[suite][i].number != currentCard) break;
            currentCard--;
        }
        if(currentCard < 2) {
            return null;
        }

       // console.log(this.playedCards[suite].map(function(card) { return card.toString()}).join(",") + " " + currentCard);

        return new Card(currentCard, suite);;
    }

    getLastRoundForSuite(suite) {
    	for(var r = this.rounds.length-1; r >=0; r--) {
    		var round = this.rounds[r];
    		if(round.cards[0].suite == suite) {
    			return round;
    		}
    	}

    	return null;
    }

    getMateIndex(i) {
    	return (i + 2 ) %4;
    }
}



 class Hand {
    constructor(cards, game) {
     // dictionary suite to list of cards
     this.cards = cards;
     this.game = game;
     this.supporter = false;
     this.myLastBid = null;

     //this.lastMainCall = {CLUB: null, DIAMOND:null, HEART:null, SPADE:null, NT:null};
     this.supporterRaises = {CLUB: 0, DIAMOND:0, HEART:0, SPADE:0, NT:0};
     this.ourLastSuite = null;
    }
 
    hasCard(card) {
        if(card == null) {
            return false;
        }

        var cardsList = this.cards[card.suite];
        if (cardsList) {
            return cardsList.indexOf(card.number) >= 0;
        }
        return false;
    }

    removeCard(card) {
        var cardsList = this.cards[card.suite];
        if (cardsList) {
            var i = cardsList.indexOf(card.number);
            if(i >= 0) {
                cardsList.splice(i, 1);
            }
        }
    }

    getHighestCardInSuite(suite) {
        var card = this.game.getHighestNonPlayedCard(suite);
        if( card == null) {
            return null;
        }

        if (this.hasCard(card)) return card;
        return null;
    }

    getLowestCardInSuite(suite) {
        if (this.cards[suite].length > 0) {
            return new Card(this.cards[suite][0], suite);
        }
        return null;
    }

    getHighestNumericCardInSuite(suite) {

        var cardsList = this.cards[suite];
        var res = 1;
        if (cardsList && cardsList.length > 0) {
            for (var i = 0; i < cardsList.length; i++) {
                if (cardsList[i] < JACK) {
                    res = cardsList[i];
                }
            }

            if(res == 1) { 
                return null;
            }

            return new Card(res, suite);
        }

        return null;
    }

    getHighestNonAtoCard() {
        for (var i=0; i< SUITES.length; i++) {
            var suite = SUITES[i];
            if (suite != this.game.ato) {
                var card = this.game.getHighestNonPlayedCard(suite);
                if(card == null) {
                    continue;
                }
                if (this.hasCard(card)) return card;
            }
        }
        return null;
    }

    getLowestAto() {
        if (this.cards[this.game.ato].length > 0) {
            return new Card(this.cards[this.game.ato][0], this.game.ato);
        }
        return null;
    }

    getLargestCard(suite) {
        if (this.cards[suite].length > 0) {
            return new Card(this.cards[suite][this.cards[suite].length - 1], suite);
        }
        return null;
    }

    getFirstHigherCard(suite, card) {
        if (this.cards[suite].length > 0) {
            for (var i = 0; i < this.cards[suite].length; i++) {
                var myCard = this.cards[suite][i];
                if (myCard > card) {
                    return new Card(myCard, suite);
                }
            }
        }
        return null;
    }

    getLowestCardAnySuite() {
        for (var i = 0; i < SUITES.length; i++) {
            if (SUITES[i] != this.game.ato) {
                var card = this.getLowestCardInSuite(SUITES[i]);
                if (card !== null) {
                    return card;
                }
            }
        }
        return null;
    }

    hasSuite(suite) {
     return this.cards[suite].length > 0;
    }

    hasBaseSuite(round) {
        return this.hasSuite(round.getBaseSuite());
    }

    hasNonAto(round) {
        for (var i = 0; i < SUITES.length; i++) {
            if (SUITES[i] == this.game.ato) {
                continue;
            }

            if (this.cards[SUITES[i]].length > 0)
                return true;
        }
        return false;
    }

    isCardSupported(index, suite) {
    	// don't have card
    	if(index >= this.cards[suite].length) {
    		return false; 
    	}

    	var num = this.cards[suite][index];
    	var nCards = this.cards[suite].length -1; // all cards but me

    	if(num == ACE) { 
    		return true;
    	}

    	// King needs to be supported by 1 card. bit risky
    	if(num == KING) {
    		return nCards >= 1;
    	}

    	// Queen must be supported by at least 2
    	// Jack must be supported by at least 3
    	// 10 must be supported by at least 3
    	// 9 must be supported by at least 4
    	// 8 must be supported by at least 4
    	// 7 must be supported by at least 5
    	// ...
    	var neededCards = (12 - num) + 3;
    	neededCards -= neededCards/2;

    	return nCards >=  neededCards;
    }

    getWhoMightHaveSuite(suite, myIndex) {
    	var lastRound = this.game.getLastRoundForSuite(suite);
    	var result = [];
    	if(lastRound === null) {
    		var myCards = 0;
    		if(this.cards[suite] != null) {
    			myCards = this.cards[suite].length;
    		}
    		var maxOutside = 13 - this.game.playedCards[suite].length - myCards;
    		return [0,2,1].slice(0, maxOutside);
    	}
    	
		for(var i = 0 ; i< 4; i++) {
			if(i != myIndex) {
				if(lastRound.cards[i].suite == suite) {
					result.push(i);
				}
			}
		}

		return result;
    }



    getEstimatedRoundsLeftForSuite(suite, myIndex) {
    	var cardsLeft = 13 - this.cards[suite].length - this.game.playedCards[suite].length;

    	var nextRoundCards = 3;
    	if(game.getLastRoundForSuite(suite) != null) {
    		nextRoundCards = this.getWhoMightHaveSuite(suite, myIndex).length - 1;	
    	}

    	var n = 0;
    	while(cardsLeft > 0) {
    		cardsLeft -= nextRoundCards;
    		if(nextRoundCards > 1) {
    			nextRoundCards--;	
    		}
    		n++;
    	}

    	return n;
    }


    getMastersOutside(leftRounds) {
    	var mastersOutside = [];
    	var master = ACE;
    	var gameCards = this.game.playedCards[suite];
    	var handCards = this.cards[suite];
    	var gameIndex = gameCards.length;
    	var handIndex = handCards.length;
    	while(leftRounds > 0) {
    		var outside = true;

    		// if it was played
    		if(	gameIndex >= 0 
    			&& gameIndex < gameCards.length 
    			&& gameCards[gameIndex].number == master) {
    		  outside = false;
    		}

    		// if it was with me
    		if( handIndex >=0
    			&& handIndex < handCards.length
    			&& handCards[suite] == master) {
    		  outside = false;
    		}

    		if(outside) {
    			mastersOutside.push(master);
    		}
    		leftRounds--;
    		master--;
    	}

    	return mastersOutside;
    }

    mayCollectAto(myIndex, ato) {
    	// don't collect if only your mate has ato
    	var owners = this.getWhoMightHaveSuite(ato, myIndex);
    	if(owners.length == 1 && owners[0] == this.game.getMateIndex(myIndex)) {
    		return false;
    	}

    	// we should have at least 2 cards after collecting ato.
    	var leftRounds = this.getEstimatedRoundsLeftForSuite(ato, myIndex);
    	if(this.cards[ato].length - leftRounds < 2 ) {
    		return false;
    	}

    	var mastersOutside = this.getMastersOutside(leftRounds);
    	if(mastersOutside.length > 1) {
    		return false;
    	}

    	return true;
    }

    getEstimatedTricksForSuite(suite, myIndex, ato) {
    
    	var count = 0;
    	for(var i =0; i< this.cards[suite].length; i++) {
    		var number = this.cards[suite][i];
    		if(number == ACE) {
    			count++;
    			continue;
    		}

    		if(number == KING) {
    			if(this.isCardSupported(i, suite)) {
    				count++;
    			}
    			continue;
    		}

			if(this.isCardSupported(i, suite)) {
				if(suite === ato 
					|| ato === NT
					|| this.mayCollectAto(myIndex, ato)) {
 					count++;
				}
			}
    	}

    	return count;
    }

    getEstimatedTricks(ato, myIndex) {
    	var count = 0;
		for(var i = 0; i < 4; i++) {
    		var suite = SUITES[i];
    		count += this.getEstimatedTricksForSuite(suite, myIndex, ato);
    	}
    	return count;
    }

    getHighestSuite(myIndex) {
    	var maxCount = 0;
    	var maxSuite;
    	for(var i = 0; i < 4; i++) {
    		var suite = SUITES[i];
    		var count = this.getEstimatedTricks(suite, myIndex);
    		if(count >= maxCount) {
    			maxSuite = suite;
    		}
    	}

    	var count = this.getEstimatedTricks(NT, myIndex);
		if(count > maxCount) {
			maxSuite = suite;
		}

		return maxSuite;
    }

    getBidInternal(myIndex) {
    	var auction = this.game.auction;
    	if(auction.maxBidder === myIndex) {
    		return null;
    	}

    	var mySuite = this.getHighestSuite(myIndex);
    	console.log(mySuite);
		var myCount = this.getEstimatedTricks(mySuite, myIndex);
		console.log(myCount);

		// I am first
		if(auction.maxBid === null) {
			if(myCount >= 7) {
				return new Bid(7, mySuite);
			}

			return null;
		}

		var myHighestBid = new Bid(myCount, mySuite);

    	// my mate is the highest bidder
    	if(game.higestBidder === (myIndex + 2) % 4) {

    		// very strong hand in another color, change
    		if(mySuite != auction.higestBidder.suite
    			 && myCount >= 9
    			 && myHighestBid.greaterThan(auction.maxBid) ) {
    			this.ourLastSuite = mySuite;
    			return auction.maxBid.raise(mySuite);
    		}

    		// bad hand in mate color
    		// have another OK suite
    		// I never called 
    		// He made a weak call, change
    		if(this.getEstimatedTricks(auction.maxBid.suite, myIndex) < 2 
    			&& this.myLastBid === null 
    			&& this.myCount >= 5 
    			&& auction.maxBid.count == 7) {
    			this.ourLastSuite = mySuite;
    			return auction.maxBid.raise(mySuite);
	   		}

    		// He has the lead, support if you can
    		this.supporter = true;
    		this.ourLastSuite = auction.maxBid.suite;
    		return null;
    	}

    	// opponent is winning the bid

    	var minToWin = 13 - auction.maxBid.count + 1;
    	var myTricksInTheirSuite = this.getEstimatedTricks(auction.maxBid.suite, myIndex);

    	// Likely beat them in their suite , double
    	if(myTricksInTheirSuite > minToWin) {
    		return DOUBLE;
    	}

    	// I am just supporting, raise in mate suite if I need to
    	if(this.supporter) {
    		var mateLastSuite = auction.bids[auction.bids.length - 2].suite;
    		if(mateLastSuite != null) {
    			this.ourLastSuite = mateLastSuite;
    		}

    		// I raised him before, pass
    		if(this.supporterRaises[this.ourLastSuite]  != 0) {
    			return null;
    		}

    		var tricks = this.getEstimatedTricks(this.ourLastSuite, myIndex);
    		if(tricks > 2) {
    			this.supporterRaises[this.ourLastSuite]++;
    			return auction.maxBid.raise(this.ourLastSuite);
    		}

    		return null;
    	}

    	// mate didn't call or passed, raise
    	if(auction.bids.length < 2 
    		|| auction.bids[auction.bids.length - 2] === null) {

    		myHighestBid.count += this.supporterRaises[mySuite];

    		// if I can raise, do it.
    		if(myHighestBid.greaterThan(auction.maxBid)) {
    			this.ourLastSuite = mySuite;
    			return auction.maxBid.raise(mySuite);	
    		}
    		
    		return null;
    	}

    	var mateLastSuite = auction.bids[auction.bids.length - 2].suite;

    	// mate called in same suite
    	if(mateLastSuite === mySuite) {

    		this.ourLastSuite = mySuite;

    		// if I didn't call before, switch to supporting role
    		if(this.myLastBid === null) {
    			this.supporter = true;

    			var tricks = this.getEstimatedTricks(this.ourLastSuite, myIndex);
    			if(tricks > 2) {
	    			this.supporterRaises[this.ourLastSuite]++;
	    			return auction.maxBid.raise(this.ourLastSuite);
	    		}

	    		return null;
    		}

    		// I called before, he is supporting me, raise if you can

    		myHighestBid.count += this.supporterRaises[mySuite];

    		// if I can raise, do it.
    		if(myHighestBid.greaterThanO(auction.maxBid)) {
    			this.ourLastSuite = mySuite;
    			return auction.maxBid.raise(mySuite);	
    		}
    		
    		return null;
		}

		// Mate decided to change 

		

		// very strong hand in another color, change
		if(myCount >= 9
			 && myHighestBid.greaterThan(auction.maxBid) ) {
			this.ourLastSuite = mySuite;
			return auction.maxBid.raise(mySuite);
		}

		// He has the lead, support if you can
		this.supporter = true;
		this.ourLastSuite = auction.maxBid.suite;
		return null;
    }

    getBid(myIndex) {
    	var bid = this.getBidInternal(myIndex);
    	if(bid != null) { this.myLastBid = bid; }
    	return bid;
    }
 }

 class Round {
    constructor(cards, game) {
     this.cards = cards;
     this.game = game;
    }
 

    getWiningPlayerIndex() {
      // Must be called after the round is completed.
      if (this.cards.length != 4) return -1;
      var winnerIndex = 0;
      var winnerValue = -1;
      var suiteToCompare = this.cards[0].suite;
      var hasAto = false;
      for (var i = 0; i < this.cards.length; i++) {
        if (!hasAto && this.cards[i].suite === this.game.ato) {
          hasAto = true;
          suiteToCompare = this.game.ato;
          winnerValue = -1;
        }
        if (this.cards[i].suite === suiteToCompare && this.cards[i].number > winnerValue) {
          winnerValue = this.cards[i].number;
          winnerIndex = i;
        }
      }
      return winnerIndex;
    }

    isMateWining() {
        if (this.cards.length <= 2) return false;

        var mateIndex = this.cards.length - 2;
        var mateCard = this.cards[mateIndex];

        var oponenetPlayedAto = this.cards[0].suite == this.game.ato || this.cards[2].suite == this.game.ato;
        var matePlayedAto = mateCard.suite == this.game.ato;
        if (oponenetPlayedAto && !matePlayedAto) return false;
        if (!oponenetPlayedAto && matePlayedAto) return true;
        else {
            if (mateCard.suite == this.cards[0].suite && mateCard.suite == this.cards[2].suite) {
                return mateCard.number > this.cards[0].number && mateCard.number > this.cards[2].number;
            }
            if (mateCard.suite == this.getBaseSuite()) {
                return mateCard.number > this.cards[0].number;
            }
        }

        return false;
    }
 
    getBaseSuite () {
     return this.cards[0].suite;
    }

    toString() {
      var str = ""
      for (var i = 0; i < this.cards.length; i++) {
        str += "P[" + i + "]=" + this.cards[i].toString() + " ";
      }
      return str;
    }
}

class Bid {
	constructor(count, suite) {
		this.count = count;
		this.suite = suite;
	}

	greaterThan(b) {
		if(this.suite == b.suite) {
			return this.count > b.count;
		}

		if(this.suite == null) { return false; }
		if(b.suite == null) { return true; }

		return this.suite > b.suite;
	}

	// returns the lowest bid in suite that is greater than this bid
	raise(suite) {
		if(this.suite < suite) {
			return new Bid(this.count, suite);
		}

		return new Bid(this.count + 1, suite);
	}

	toString() {
		return this.count + " " + this.suite;
	}
}

class Auction {
	constructor() {
		this.bids = [];
		this.currentBidder = 0;
		this.maxBidder = -1;
		this.maxBid = null;
		this.passes = 0;
		this.open = true;
	}

	addBid(bid) {
		if(!this.open) {
			return true;
		}

		if(bid == null) { // PASS
			this.bids.push(bid);
			this.currentBidder++;
			this.currentBidder%=4;
			this.passes++;

			if(this.passes == 4) {
				this.open = false;
				return true;
			}

			if(this.passes == 3 && this.maxBid != null) {
				this.open = false;
				return true;
			}

			return false;
		}

		if( this.maxBid == null 
			|| bid.greaterThan(this.maxBid)) {
            this.passes = 0;
			this.maxBidder = this.currentBidder;
			this.maxBid = bid;

			this.bids.push(bid);
			this.currentBidder++;
			this.currentBidder%=4;

			return false;
		}

		return false;
	}
}

class Player{
  constructor(game, playerName) {
    this.game = game;
    this.playerName = playerName;
  }

  setNewHand(cardsDict) {

    this.hand = new Hand(cardsDict, this.game);
    this.currentHandScore = 0;
  }

  play(round) {
  	var rules = masterRules[round.cards.length];
  	var card = null;
  	for(var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if(rule.condition(this.hand, round)) {
            console.log(this.playerName + ": Executing rule " + i);
            card = rule.action(this.hand, round);
            break;
        }
    }
    if (card) {
      this.hand.removeCard(card);
    }
    return card;
  }

  getBid(myIndex) { 
  	return this.hand.getBid(myIndex);
  }


}

 
 var firstRules = [];

 firstRules.push({
     condition: function(hand, round) {
         return hand.getHighestNonAtoCard() !== null;
     },
     action: function(hand, round) {
         return hand.getHighestNonAtoCard();
     }
 });

 firstRules.push({
     condition: function(hand, round) {
         return hand.getLowestCardAnySuite() !== null;
     },
     action: function(hand, round) {
         return hand.getLowestCardAnySuite();
     }
 });

 firstRules.push({
     condition: function(hand, round) {
         return true;
     },
     action: function(hand, round) {
         return hand.getLowestCardInSuite(hand.game.ato);
     }
 });

 var secondRules = [];

 secondRules.push({
     condition: function(hand, round) {
         return hand.hasBaseSuite(round) &&
             hand.getHighestCardInSuite(round.getBaseSuite()) !== null;
     },
     action: function(hand, round) {
         return hand.getHighestCardInSuite(round.getBaseSuite());
     }
 });
 secondRules.push({
     condition: function(hand, round) {
         return hand.hasBaseSuite(round) &&
             hand.getHighestCardInSuite(round.getBaseSuite()) === null;
     },
     action: function(hand, round) {
         return hand.getLowestCardInSuite(round.getBaseSuite());
     }
 });
 secondRules.push({
     condition: function(hand, round) {
         return !hand.hasBaseSuite(round) &&
             hand.getHighestNumericCardInSuite(hand.game.ato) !== null;
     },
     action: function(hand, round) {
         return hand.getHighestNumericCardInSuite(hand.game.ato);
     }
 });
 secondRules.push({
     condition: function(hand, round) {
         return !hand.hasBaseSuite(round) &&
             hand.hasSuite(hand.game.ato);
     },
     action: function(hand, round) {
         return hand.getLowestAto(hand.game.ato);
     }
 });
 secondRules.push({
     condition: function(hand, round) {
         return true;
     },
     action: function(hand, round) {
         return hand.getLowestCardAnySuite();
     }
 });

 var thirdRules = [];

 thirdRules.push({
     condition: function(hand, round) {
         var highestNonPlayedCard = hand.game.getHighestNonPlayedCard(round.getBaseSuite());
         return hand.hasBaseSuite(round) &&
             highestNonPlayedCard != null &&
             round.cards[0].number === highestNonPlayedCard.number;
     },
     action: function(hand, round) {
         return hand.getLowestCardInSuite(round.getBaseSuite());
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
        var highestNonPlayedCard =hand.game.getHighestNonPlayedCard(round.getBaseSuite());
        return hand.hasBaseSuite(round) &&
             ( round.cards[1].suite == hand.game.ato
            || ( highestNonPlayedCard != null && round.cards[1].number === highestNonPlayedCard.number ));
     },
     action: function(hand, round) {
         return hand.getLowestCardInSuite(round.getBaseSuite());
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
         return hand.hasBaseSuite(round) && hand.getHighestCardInSuite(round.getBaseSuite()) !== null;
     },
     action: function(hand, round) {
         return hand.getHighestCardInSuite(round.getBaseSuite());
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
         return hand.hasSuite(hand.game.ato) &&
             round.cards[1].suite == hand.game.ato &&
             hand.getFirstHigherCard(hand.game.ato, round.cards[1].number) !== null;
     },
     action: function(hand, round) {
         return hand.getFirstHigherCard(hand.game.ato, round.cards[1].number);
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
         return hand.hasSuite(hand.game.ato) &&
             round.cards[1].suite == hand.game.ato;
     },
     action: function(hand, round) {
         return hand.getLowestCardAnySuite();
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
         var highestNonPlayedCard = hand.game.getHighestNonPlayedCard(round.getBaseSuite());
         return hand.hasSuite(hand.game.ato) &&
            highestNonPlayedCard != null &&
             round.cards[0].suite == highestNonPlayedCard.suite &&
             hand.hasNonAto();
     },
     action: function(hand, round) {
         return hand.getLowestCardAnySuite();
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
         return hand.hasSuite(hand.game.ato) &&
             hand.getHighestNumericCardInSuite(hand.game.ato) !== null;
     },
     action: function(hand, round) {
         return hand.getHighestNumericCardInSuite(hand.game.ato);
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
         return hand.hasSuite(hand.game.ato);
     },
     action: function(hand, round) {
         return hand.getLowestAto();
     }
 });

 thirdRules.push({
     condition: function(hand, round) {
         return true;
     },
     action: function(hand, round) {
         return hand.getLowestCardAnySuite();
     }
 });


 var fourthRules = [];

 // Has base and mate is wining, then play lowest card in base
 fourthRules.push({
     condition: function(hand, round) {
         return hand.hasSuite(round.getBaseSuite()) && round.isMateWining();
     },
     action: function(hand, round) {
         return hand.getLowestCardInSuite(round.getBaseSuite());
     }
 });

 // Has base, oponent is wining, and has higher card to play
 fourthRules.push({
     condition: function(hand, round) {
         return hand.hasSuite(round.getBaseSuite()) &&
             round.cards[2].suite != hand.game.ato &&
             hand.getFirstHigherCard(round.getBaseSuite(), round.cards[0].number) !== null &&
             hand.getFirstHigherCard(round.getBaseSuite(), round.cards[2].number) !== null;
     },
     action: function(hand, round) {
        return hand.getFirstHigherCard(round.getBaseSuite(), Math.max(round.cards[0].number, round.cards[2].number));
     }
 });

 // Has base, oponent is wining and I can't win
 fourthRules.push({
     condition: function(hand, round) {
         return hand.hasBaseSuite(round);
     },
     action: function(hand, round) {
         return hand.getLowestCardInSuite(round.getBaseSuite());
     }
 });

 // Doesn't have base but mate is wining yaaay, 3ash ya zomol
 fourthRules.push({
     condition: function(hand, round) {
         return round.isMateWining();
     },
     action: function(hand, round) {
        var globalLowest = []
         for (var i = 0; i < SUITES.length; i++) {
             if (SUITES[i] != hand.game.ato) {
                 var card =  hand.getLowestCardInSuite(SUITES[i]);
                 if( card != null) {
                    globalLowest.push(card);
                 }
             }
         }
         if (globalLowest.length > 0) {
            globalLowest.sort(function(c1, c2) { return c1.number - c2.number});
            return globalLowest[0];
         }
         return hand.getLowestCardInSuite(hand.game.ato);
     }
 });

 // Doesn't have base, and has higher ato than oponent
 fourthRules.push({
     condition: function(hand, round) {
         return round.cards[2].suite == hand.game.ato && hand.getFirstHigherCard(hand.game.ato, round.cards[2].number) !== null;
     },
     action: function(hand, round) {
         return hand.getFirstHigherCard(hand.game.ato, round.cards[2].number);
     }
 });

 // Doesn't have base, and can't get higher ato
 fourthRules.push({
     condition: function(hand, round) {
         return round.cards[2].suite == hand.game.ato;
     },
     action: function(hand, round) {
         for (var i = 0; i < SUITES.length; i++) {
             if (SUITES[i] != hand.game.ato) {
                 var card = hand.getLowestCardInSuite(SUITES[i]);
                 if (card !== null) return card;
               }

         }
         return hand.getLowestCardInSuite(hand.game.ato);
     }
 });

 // Doesn't have base, oponenet didn't ato
 fourthRules.push({
     condition: function(hand, round) {
         return round.cards[2].suite != hand.game.ato && hand.getLowestCardInSuite(hand.game.ato) !== null;
     },
     action: function(hand, round) {
         return hand.getLowestCardInSuite(hand.game.ato);
     }
 });

 // Doesn't have base , nor ato :'(
 fourthRules.push({
     condition: function(hand, round) {
         return true;
     },
     action: function(hand, round) {
         return hand.getLowestCardAnySuite();
     }
 });
 
var masterRules = [firstRules, secondRules, thirdRules, fourthRules];

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

//////
// TESTING
//////
 function test() {
     var cards = {};
     cards [SPADE] = [5, 10, JACK, KING, ACE];
     cards [HEART] = [7, 8, QUEEN, KING];
     cards [DIAMOND] = [3, 7, 9, 10];
     cards [CLUB] = [];
     
     var game = new Game(SPADE);
     var myHand = new Hand(cards, game);
     var round = new Round([
            new Card(ACE, HEART),
        new Card(10, HEART),
        new Card(5, HEART),
        new Card(2, HEART)
     ]);
     game.recordRound(round);
     
     // HasCard
     assert(myHand.hasCard(new Card(ACE, SPADE)) == true);
     assert(myHand.hasCard(new Card(ACE, DIAMOND)) == false);
     
     // getHighestCardInSuite
     var highestSpade = myHand.getHighestCardInSuite(SPADE);
     assert(highestSpade !== null);
     assert(highestSpade.suite == SPADE);
     assert(highestSpade.number == ACE);
     var  highestClubs = myHand.getHighestCardInSuite(CLUB);
     assert(highestClubs == null);
     
     // getLowestCardInSuite
     var lowestSpade = myHand.getLowestCardInSuite(SPADE);
     assert(lowestSpade !== null);
     assert(lowestSpade.suite == SPADE);
     assert(lowestSpade.number == 5);
     
}

var game = new Game(SPADE);


function parseCardsString(cardsString) {
    return cardsString.split(',').map(function(str) { return strCard(str);});
}

function parseHand(CardString) {
    var cardsList = parseCardsString(CardString);
    var cardsDict = {};
  cardsDict[SPADE] = [];
  cardsDict[HEART] = [];
  cardsDict[DIAMOND] = [];
  cardsDict[CLUB] = [];
  for (var i = 0; i < cardsList.length; i++) {
    var card = cardsList[i];
    cardsDict[card.suite].push(card.number);
    cardsDict[card.suite].sort(function(a,b) { return a - b});
    //console.log(cardsDict[card.suite].join(","));
  }
  return cardsDict;
}

function recordRound(cardString) {
    game.recordRound(new Round(parseCardsString(cardString)));
}

function playRound(cardString) {
    var cards = cardString.split(',').map(function(str) { return strCard(str);});
  alert(game.playRound(cards));
}

async function play() {
  for(var r = 0; r < 13; r++) {
    console.log("play round " + r);
    await game.playRound();
    console.log("*********************************");
  } 
}
function newHand() {
  game.startNewHand();
}

function bid() {
	newHand();
	var i = 0;
	var bid = game.players[i].getBid(i);
	alert(bid);
	while(!game.recordBid(bid)) {
		i++;
		i%=4;
		bid = game.players[i].getBid(i);
		alert(bid);
	}
 }
