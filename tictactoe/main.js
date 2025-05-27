function mainLoop() {
	ctx.clearRect(0, 0, NUMBERS.canvasWidth, NUMBERS.canvasHeight);
	drawField(field);
}

var field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const mainLoopInterval = setInterval(mainLoop, 40);

canvas.onclick = (event) => {
	let x = event.x - canvas.getBoundingClientRect().x;
	let y = event.y - canvas.getBoundingClientRect().y;

	if (x < NUMBERS.fieldOffsetX || x > NUMBERS.fieldOffsetX + NUMBERS.fieldSize) return;
	if (y < NUMBERS.fieldOffsetY || y > NUMBERS.fieldOffsetY + NUMBERS.fieldSize) return;

	let column = Math.floor((3 * (x - NUMBERS.fieldOffsetX)) / NUMBERS.fieldSize);
	let row = Math.floor((3 * (y - NUMBERS.fieldOffsetY)) / NUMBERS.fieldSize);
	let pos = row * 3 + column;

	if (DATA.mode == "pvp" || DATA.turn == DATA.playerTurn) {
		if (field[pos] == 0 || (DATA.modifiers.includes("allow-override") && pos != DATA.lastMove && field[pos] != (DATA.turn ? 1 : -1))) {
			field[pos] = DATA.turn ? 1 : -1;
			DATA.lastMove = pos;
			if (DATA.mode != "pvp") {
				field[getComputerMove(field)] = DATA.playerTurn ? -1 : 1;
				DATA.lastMove = pos;
			} else {
				DATA.turn = !DATA.turn;
			}
		}
		let chq = checkField(field);
		if (chq != 0) {
			if (!DATA.modifiers.includes("override")) {
				gameOver(chq);
			}
		}

		if (!DATA.modifiers.includes("override") && field.every((val) => val != 0)) {
			gameOver(0);
		}
	}
};
