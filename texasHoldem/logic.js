/**
 *
 * @param {Array} cards - cards of hand
 * @returns {Object} - {name: name of the hand, cards: 5 cards of the hand, rest: the 'kicker cards'}
 */
function getHand(cards) {
	cards.sort((a, b) => values.indexOf(a[0]) - values.indexOf(b[0]));

	let royalFlush = [];
	let straightFlush = [];
	let fourOfAKind = [];
	let fullHouse = [];
	let flush = [];
	let straight = [];
	let threeOfAKind = [];
	let pairs = [];
	let suitNumber = {C: 0, D: 0, H: 0, S: 0};

	cards.forEach((card, i) => {
		let value = card[0];
		let suit = card[1];
		++suitNumber[suit];

		if (values.indexOf(value) > 7) {
			royalFlush.push(card);
		}

		if (straightFlush.length != 0 && values.indexOf(value) != values.indexOf(straightFlush[straightFlush.length - 1][0]) + 1 && straightFlush.length < 5) {
			straightFlush = [];
		}
		straightFlush.push(card);

		if (fourOfAKind.length != 0 && fourOfAKind.length < 4 && values.indexOf(value) != values.indexOf(fourOfAKind[0][0])) {
			fourOfAKind = [];
		}
		fourOfAKind.push(card);

		//TODO: fullHouse

		flush.push(card);

		if (straight.filter((card) => card[0] == value).length == 0) {
			straight.push(card);
		}

		//                                                  <3
		if (threeOfAKind.length != 0 && threeOfAKind.length < 3 && values.indexOf(value) != values.indexOf(threeOfAKind[0][0])) {
			threeOfAKind = [];
		}
		threeOfAKind.push(card);

		if (i != 6 && value == cards[i + 1][0]) {
			pairs.push(card, cards[i + 1]);
		}
	});

	let fiveSuites = "";
	["C", "D", "H", "S"].forEach((suite) => {
		if (suitNumber[suite] >= 5) {
			fiveSuites = suite;
		}
	});

	//checking RF
	if (royalFlush.filter((card) => card[1] == fiveSuites).length == 5) {
		return {name: "royal flush", cards: royalFlush.filter((card) => card[1] == fiveSuites), rest: []}; //chance: 0.000154%
	}

	//checking SF
	if (straightFlush.filter((card) => card[1] == fiveSuites).length >= 5) {
		return {name: "straight flush", cards: straightFlush.filter((card) => card[1] == fiveSuites).slice(-5), rest: []}; //chance: 0.00139%
	}

	let remaining = cards.filter((card) => !fourOfAKind.includes(card)).slice(-1);
	//checking FOAK
	if (fourOfAKind.length == 4) {
		return {name: "four of a kind", cards: fourOfAKind.concat(remaining), rest: remaining}; // chance: 0.0255%
	}

	//checking FH
	//TODO: do.
	//chance: 0.1441%

	//checking Flush
	if (fiveSuites) {
		return {name: "flush", cards: cards.filter((card) => card[1] == fiveSuites).slice(-5)}; // chance: 0.1965%
	}

	//checking Straight
	for (let i = straight.length - 5; i >= 0; --i) {
		let value = values.indexOf(straight[i][0]);
		if (
			value == values.indexOf(straight[i + 1][0]) - 1 && //.
			value == values.indexOf(straight[i + 2][0]) - 2 &&
			value == values.indexOf(straight[i + 3][0]) - 3 &&
			value == values.indexOf(straight[i + 4][0]) - 4
		) {
			return {name: "straight", cards: straight.slice(i)}; //chance: 0.3925%
		}
	}

	remaining = cards.filter((card) => !threeOfAKind.includes(card)).slice(-2);
	//checking TOAK
	if (threeOfAKind.length >= 3) {
		return {name: "three of a kind", cards: threeOfAKind.slice(-3).concat(remaining), rest: remaining}; //chance: 2.1128%
	}

	remaining = cards.filter((card) => !pairs.includes(card)).slice(pairs.length - 5);
	//checking TP
	if (pairs.length > 3) {
		return {name: "two pair", cards: pairs.slice(-4).concat(remaining.slice(-1)), rest: remaining.slice(-1)}; //chance: 4.7539%
	}

	//checking P
	if (pairs.length == 2) {
		return {name: "pair", cards: pairs.concat(remaining), rest: remaining}; //chance: 42.2569%
	}

	return {name: "high card", cards: cards.slice(-1).concat(cards.slice(-5, -1)), rest: cards.slice(-5, -1)}; //chance: 50.1177%
}
/**
 *
 * @param {Object} hand1 - first hand
 * @param {Object} hand2 - second hand
 * @returns {number} - 1 if hand1 wins, -1 if hand2 does, 0 if it's draw
 */
function compareHands(hand1, hand2) {
	if (hands.indexOf(hand1.name) != hands.indexOf(hand2.name)) {
		return hands.indexOf(hand1.name) > hands.indexOf(hand2.name) ? 1 : -1;
	}

	let name = hand1.name;

	//checking the cards in the hand
	for (let i = 0; i < handSizes[hands.indexOf(name)]; ++i) {
		if (values.indexOf(hand1.cards[i][0]) > values.indexOf(hand2.cards[i][0])) {
			return 1;
		}
		if (values.indexOf(hand1.cards[i][0]) < values.indexOf(hand2.cards[i][0])) {
			return -1;
		}
	}

	for (let i = 4; i >= handSizes[hands.indexOf(name)]; --i) {
		if (values.indexOf(hand1.cards[i][0]) > values.indexOf(hand2.cards[i][0])) {
			return 1;
		}
		if (values.indexOf(hand1.cards[i][0]) < values.indexOf(hand2.cards[i][0])) {
			return -1;
		}
	}

	return 0;
}

//               0    1    2    3    4    5    6    7    8    9   10   11   12
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const suites = ["C", "D", "H", "S"]; //clubs, diamonds, hearts, spades
const Vnames = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
const Snames = ["clubs", "diamonds", "hearts", "spades"];
const hands = ["high card", "pair", "two pair", "three of a kind", "straight", "flush", "full house", "four of a kind", "straight flush", "royal flush"];
const handSizes = [1, 2, 4, 3, 5, 5, 5, 4, 5, 5]; //# of cards that are not in the 'rest'
