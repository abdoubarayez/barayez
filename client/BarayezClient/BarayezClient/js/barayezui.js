﻿/// <reference path="phaser.min.js" />
var ACE = 14;
var KING = 13;
var QUEEN = 12;
var JACK = 11;
var SPADE = 'S';
var HEART = 'H';
var DIAMOND = 'D';
var CLUB = 'C';
var SUITES = [CLUB, DIAMOND, HEART, SPADE];

var Width = 1024, Height = 768;

function strCard(cardString) {
    //alert("strcard")
    var card = new Card(5, ''); // any card
    var k = 1;
    if (cardString.length == 3) {
        if (cardString[1] == '1') card.number = JACK;
        else if (cardString[1] == '2') card.number = QUEEN;
        else if (cardString[1] == '3') card.number = KING;
        else if (cardString[1] == '4') card.number = ACE;
        else if (cardString[1] == '0') { card.number = 10; }
        k = 2;
    }
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
        if (this.number == JACK) numString += "J";
        else if (this.number == QUEEN) numString += "Q";
        else if (this.number == KING) numString += "K";
        else if (this.number == ACE) numString += "A";
        else numString += this.number;

        return numString + this.suite;
    }

    imageName() {
        var numString = "";
        if (this.number == JACK) numString += "jack";
        else if (this.number == QUEEN) numString += "queen";
        else if (this.number == KING) numString += "king";
        else if (this.number == ACE) numString += "ace";
        else numString += this.number;
        numString += "_of_";
        if (this.suite == CLUB) numString += "clubs";
        else if (this.suite == DIAMOND) numString += "diamonds";
        else if (this.suite == HEART) numString += "hearts";
        else if (this.suite == SPADE) numString += "spades";
        //numString += ".png";
        return numString;
    }
}


var game = new Phaser.Game(Width, Height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('2_of_clubs', 'images/2_of_clubs.png');
    game.load.image('2_of_diamonds', 'images/2_of_diamonds.png');
    game.load.image('2_of_hearts', 'images/2_of_hearts.png');
    game.load.image('2_of_spades', 'images/2_of_spades.png');
    game.load.image('3_of_clubs', 'images/3_of_clubs.png');
    game.load.image('3_of_diamonds', 'images/3_of_diamonds.png');
    game.load.image('3_of_hearts', 'images/3_of_hearts.png');
    game.load.image('3_of_spades', 'images/3_of_spades.png');
    game.load.image('4_of_clubs', 'images/4_of_clubs.png');
    game.load.image('4_of_diamonds', 'images/4_of_diamonds.png');
    game.load.image('4_of_hearts', 'images/4_of_hearts.png');
    game.load.image('4_of_spades', 'images/4_of_spades.png');
    game.load.image('5_of_clubs', 'images/5_of_clubs.png');
    game.load.image('5_of_diamonds', 'images/5_of_diamonds.png');
    game.load.image('5_of_hearts', 'images/5_of_hearts.png');
    game.load.image('5_of_spades', 'images/5_of_spades.png');
    game.load.image('6_of_clubs', 'images/6_of_clubs.png');
    game.load.image('6_of_diamonds', 'images/6_of_diamonds.png');
    game.load.image('6_of_hearts', 'images/6_of_hearts.png');
    game.load.image('6_of_spades', 'images/6_of_spades.png');
    game.load.image('7_of_clubs', 'images/7_of_clubs.png');
    game.load.image('7_of_diamonds', 'images/7_of_diamonds.png');
    game.load.image('7_of_hearts', 'images/7_of_hearts.png');
    game.load.image('7_of_spades', 'images/7_of_spades.png');
    game.load.image('8_of_clubs', 'images/8_of_clubs.png');
    game.load.image('8_of_diamonds', 'images/8_of_diamonds.png');
    game.load.image('8_of_hearts', 'images/8_of_hearts.png');
    game.load.image('8_of_spades', 'images/8_of_spades.png');
    game.load.image('9_of_clubs', 'images/9_of_clubs.png');
    game.load.image('9_of_diamonds', 'images/9_of_diamonds.png');
    game.load.image('9_of_hearts', 'images/9_of_hearts.png');
    game.load.image('9_of_spades', 'images/9_of_spades.png');
    game.load.image('10_of_clubs', 'images/10_of_clubs.png');
    game.load.image('10_of_diamonds', 'images/10_of_diamonds.png');
    game.load.image('10_of_hearts', 'images/10_of_hearts.png');
    game.load.image('10_of_spades', 'images/10_of_spades.png');
    game.load.image('ace_of_clubs', 'images/ace_of_clubs.png');
    game.load.image('ace_of_diamonds', 'images/ace_of_diamonds.png');
    game.load.image('ace_of_hearts', 'images/ace_of_hearts.png');
    game.load.image('ace_of_spades', 'images/ace_of_spades.png');
    game.load.image('jack_of_clubs', 'images/jack_of_clubs.png');
    game.load.image('jack_of_diamonds', 'images/jack_of_diamonds.png');
    game.load.image('jack_of_hearts', 'images/jack_of_hearts.png');
    game.load.image('jack_of_spades', 'images/jack_of_spades.png');
    game.load.image('king_of_clubs', 'images/king_of_clubs.png');
    game.load.image('king_of_diamonds', 'images/king_of_diamonds.png');
    game.load.image('king_of_hearts', 'images/king_of_hearts.png');
    game.load.image('king_of_spades', 'images/king_of_spades.png');
    game.load.image('queen_of_clubs', 'images/queen_of_clubs.png');
    game.load.image('queen_of_diamonds', 'images/queen_of_diamonds.png');
    game.load.image('queen_of_hearts', 'images/queen_of_hearts.png');
    game.load.image('queen_of_spades', 'images/queen_of_spades.png');

}

var cards = {};

var hands = [];

var ground = [{ x: 500, y: 400 }, { x: 380, y: 320 }, { x: 500, y: 250 }, { x: 600, y: 320 }];

function create() {

    var suites = ["C", "D", "H", "S"];
    for (var i = 0; i < suites.length; i++) {

        var currentHand = [];
        for (var j = 2; j < 15; j++) {

            //alert('calling strcard');

            var currentCard = strCard(j + suites[i]);
            var imagename = currentCard.imageName();
            //alert(imagename);

            var img = game.add.sprite(i * 75, j * 30, imagename);
            img.scale.set(0.15, 0.15);
            

            cards[imagename] = img;

            img.card = currentCard;
            img.hand = i;

            img.inputEnabled = true;
            img.events.onInputDown.add(onCardClick);

            currentHand.push(img);
            
        }

        hands.push(currentHand);

    }


    //hand0
    setCardLocation(240, 560, 40, 0, 0);

    //hand1
    setCardLocation(115, 180, 0, 25, 1);

    //hand2
    setCardLocation(240, 80, 40, 0, 2);

    
    //hand3
    setCardLocation(840, 180, 0, 25, 3);



    //game.add.sprite(1, 1, '2_of_clubs');
    //game.add.sprite(2, 2, '2_of_diamonds');
    //game.add.sprite(3, 3, '2_of_hearts');
    //game.add.sprite(4, 4, '2_of_spades');
    //game.add.sprite(5, 5, '3_of_clubs');
    //game.add.sprite(6, 6, '3_of_diamonds');
    //game.add.sprite(7, 7, '3_of_hearts');
    //game.add.sprite(8, 8, '3_of_spades');
    //game.add.sprite(9, 9, '4_of_clubs');
    //game.add.sprite(10, 10, '4_of_diamonds');
    //game.add.sprite(11, 11, '4_of_hearts');
    //game.add.sprite(12, 12, '4_of_spades');
    //game.add.sprite(13, 13, '5_of_clubs');
    //game.add.sprite(14, 14, '5_of_diamonds');
    //game.add.sprite(15, 15, '5_of_hearts');
    //game.add.sprite(16, 16, '5_of_spades');
    //game.add.sprite(17, 17, '6_of_clubs');
    //game.add.sprite(18, 18, '6_of_diamonds');
    //game.add.sprite(19, 19, '6_of_hearts');
    //game.add.sprite(20, 20, '6_of_spades');
    //game.add.sprite(21, 21, '7_of_clubs');
    //game.add.sprite(22, 22, '7_of_diamonds');
    //game.add.sprite(23, 23, '7_of_hearts');
    //game.add.sprite(24, 24, '7_of_spades');
    //game.add.sprite(25, 25, '8_of_clubs');
    //game.add.sprite(26, 26, '8_of_diamonds');
    //game.add.sprite(27, 27, '8_of_hearts');
    //game.add.sprite(28, 28, '8_of_spades');
    //game.add.sprite(29, 29, '9_of_clubs');
    //game.add.sprite(30, 30, '9_of_diamonds');
    //game.add.sprite(31, 31, '9_of_hearts');
    //game.add.sprite(32, 32, '9_of_spades');
    //game.add.sprite(33, 33, '10_of_clubs');
    //game.add.sprite(34, 34, '10_of_diamonds');
    //game.add.sprite(35, 35, '10_of_hearts');
    //game.add.sprite(36, 36, '10_of_spades');
    //game.add.sprite(37, 37, 'ace_of_clubs');
    //game.add.sprite(38, 38, 'ace_of_diamonds');
    //game.add.sprite(39, 39, 'ace_of_hearts');
    //game.add.sprite(40, 40, 'ace_of_spades');
    //game.add.sprite(41, 41, 'jack_of_clubs');
    //game.add.sprite(42, 42, 'jack_of_diamonds');
    //game.add.sprite(43, 43, 'jack_of_hearts');
    //game.add.sprite(44, 44, 'jack_of_spades');
    //game.add.sprite(45, 45, 'king_of_clubs');
    //game.add.sprite(46, 46, 'king_of_diamonds');
    //game.add.sprite(47, 47, 'king_of_hearts');
    //game.add.sprite(48, 48, 'king_of_spades');
    //game.add.sprite(49, 49, 'queen_of_clubs');
    //game.add.sprite(50, 50, 'queen_of_diamonds');
    //game.add.sprite(51, 51, 'queen_of_hearts');


}

function setCardLocation(x, y, dx, dy, handIndex) {
    for (var i = 0; i < hands[handIndex].length; i++) {
        hands[handIndex][i].y = y + i * dy;
        hands[handIndex][i].x = x + i * dx;
    }
}


function onCardClick(sprite) {
    game.add.tween(sprite).to({ x: ground[sprite.hand].x, y: ground[sprite.hand].y }, 2000, Phaser.Easing.Linear.None, true);
}

function update() {

}