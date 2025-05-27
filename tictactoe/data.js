const COLORS = {
	border: () => (CURRENT_THEME() == "light" ? "#111111" : "#cccccc"),
	naught: () => "#0000ff",
	cross: () => "#ff0000",
	dark: () => (CURRENT_THEME() == "light" ? "#555555" : "#dddddd"),
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const main = document.querySelector("main");
canvas.style.width = window.innerWidth;
canvas.width = window.innerWidth;
canvas.style.hieght = window.innerHeight * 0.86;
canvas.height = window.innerHeight * 0.86;

const NUMBERS = {
	canvasWidth: canvas.width,
	canvasHeight: canvas.height,
	fieldSize: Math.min(canvas.width, canvas.height) * 0.7,
	fieldOffsetX: 0,
	fieldOffsetY: 0,
	objectSize: 0,
	objectOffset: 0,
};
//needs to be separate to refer to NUMBERS.tableWidth
NUMBERS.fieldOffsetX = (canvas.width - NUMBERS.fieldSize) / 2;
NUMBERS.fieldOffsetY = (canvas.height - NUMBERS.fieldSize) / 2;
NUMBERS.objectSize = NUMBERS.fieldSize * 0.25;
NUMBERS.objectOffset = (NUMBERS.fieldSize / 3 - NUMBERS.objectSize) / 2;

const DATA = {
	turn: true, //true - cross, false - naught
	playerTurn: true, //used only for PvE
	lastMove: -1, //used with override modifier
	mode: localStorage.getItem("mode"),
	modifiers: localStorage.getItem("modifiers") ? localStorage.getItem("modifiers").split(";") : [],
};

function checkField(field) {
	//horizontals
	for (let row = 0; row < 3; ++row) {
		if (field[row * 3] == field[row * 3 + 1] && field[row * 3] == field[row * 3 + 2] && field[row * 3] != 0) {
			return field[row * 3];
		}
	}

	//verticals
	for (let column = 0; column < 3; ++column) {
		if (field[column] == field[column + 3] && field[column] == field[column + 6] && field[column] != 0) {
			return field[column];
		}
	}

	//diagonals
	if (field[0] == field[4] && field[0] == field[8] && field[0] != 0) {
		return field[0];
	}
	if (field[2] == field[4] && field[2] == field[6] && field[2] != 0) {
		return field[2];
	}

	return 0;
}

function getAvailableMoves(field, countOverrides = true) {
	let ans = [];
	for (let i = 0; i < 9; ++i) {
		if (field[i] == 0) {
			ans.push(i);
		} else if (countOverrides && DATA.modifiers.includes("allow-override")) {
			if (field[i] != (DATA.turn ? 1 : 0)) {
				ans.push(i);
			}
		}
	}

	return ans;
}

function analyzeMove(field, move) {
	console.log(field);
	let prev = field[move];
	field[move] = DATA.turn ? 1 : -1;
	DATA.turn = !DATA.turn;
	let available = getAvailableMoves(field, false);
	DATA.turn = !DATA.turn;
	if (available.length == 0) {
		return checkField(field) == (DATA.turn ? 1 : 0) ? (1, 1) : (1, 0);
	}

	let answer = [0, 0];

	for (let opponentsMove of available) {
		let previous = field[opponentsMove];
		field[opponentsMove] = DATA.turn ? 0 : 1;
		let available2 = getAvailableMoves(field, false);
		for (let secondMove of available2) {
			let got = analyzeMove(field, secondMove);
			answer[0] += got[0];
			answer[1] += got[1];
		}
		field[opponentsMove] = previous;
	}

	field[move] = prev;

	return answer;
}

function getComputerMove(field) {
	let available = getAvailableMoves(field);
	if (DATA.mode == "pvc1") {
		let index = Math.floor(Math.random() * available.length);
		alert(available[index]);
		console.log(analyzeMove(field, available[index]));
		return available[index];
	}
}

function gameOver(winner) {
	const win_block1 = document.querySelector(".win-block[player='1']");
	const win_block2 = document.querySelector(".win-block[player='2']");
	if (winner != 0) {
		win_block1.style.color = winner == 1 ? COLORS.cross() : COLORS.naught();
		win_block1.style.borderColor = winner == 1 ? COLORS.cross() : COLORS.naught();
		win_block2.style.color = winner == 1 ? COLORS.cross() : COLORS.naught();
		win_block2.style.borderColor = winner == 1 ? COLORS.cross() : COLORS.naught();
	} else {
		win_block1.innerHTML = "DRAW!";
		win_block2.innerHTML = "DRAW!";
	}
	if (winner != -1) {
		win_block1.animate([{opacity: 0}, {opacity: 100}], {duration: 250, iterations: 6}); //, easing: "ease-in-out"});
	}
	if (winner != 1) {
		win_block2.animate([{opacity: 0}, {opacity: 100}], {duration: 250, iterations: 6}); //, easing: "ease-in-out"});
	}

	const restart = document.getElementById("again");
	restart.animate([{opacity: 0}, {opacity: 100}], {duration: 1500, fill: "forwards", easing: "ease-in"});
	restart.onclick = () => {
		window.location.reload();
	};
}
