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
        for (var i=0; i < round.cards.length; i++) {
            var card = round.cards[i];
            this.playedCards[card.suite].push(card);
            this.playedCards[card.suite].sort(compareCards);
        }
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
}



 class Hand {
    constructor(cards, game) {
     // dictionary suite to list of cards
     this.cards = cards;
     this.game = game;
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
            if (suite != game.ato) {
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

        var oponenetPlayedAto = this.cards[0].suite == game.ato || this.cards[2].suite == game.ato;
        var matePlayedAto = mateCard.suite == game.ato;
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
 