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

		//                      <3
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
		return {name: "royal flush", cards: royalFlush.filter((card) => card[1] == fiveSuites)}; //chance: 0.000154%
	}

	//checking SF
	if (straightFlush.filter((card) => card[1] == fiveSuites).length >= 5) {
		return {name: "straight flush", cards: straightFlush.filter((card) => card[1] == fiveSuites).slice(-5)}; //chance: 0.00139%
	}

	//checking FOAK
	if (fourOfAKind.length == 4) {
		return {name: "four of a kind", cards: fourOfAKind}; // chance: 0.0255%
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

	//checking TOAK
	if (threeOfAKind.length >= 3) {
		return {name: "three of a kind", cards: threeOfAKind.slice(-3)}; //chance: 2.1128%
	}

	//checking TP
	if (pairs.length > 3) {
		return {name: "two pair", cards: pairs.slice(-4)}; //chance: 4.7539%
	}

	//checking P
	if (pairs.length == 2) {
		return {name: "pair", cards: pairs}; //chance: 42.2569%
	}

	return {name: "high card", cards: cards.slice(-5)}; //chance: 50.1177%
}

//               0    1    2    3    4    5    6    7    8    9   10   11   12
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]; //T is for 10
const suites = ["C", "D", "H", "S"]; //clubs, diamonds, hearts, spades
