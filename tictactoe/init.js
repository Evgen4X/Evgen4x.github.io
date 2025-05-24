function drawField(field) {
	ctx.strokeStyle = COLORS.border();
	ctx.lineWidth = 2;

	//vertical
	for (let i = 1; i < 3; ++i) {
		ctx.beginPath();
		ctx.moveTo(NUMBERS.fieldOffsetX + (NUMBERS.fieldSize * i) / 3, NUMBERS.fieldOffsetY);
		ctx.lineTo(NUMBERS.fieldOffsetX + (NUMBERS.fieldSize * i) / 3, NUMBERS.fieldOffsetY + NUMBERS.fieldSize);
		ctx.stroke();
	}

	//horizontal
	for (let i = 1; i < 3; ++i) {
		ctx.beginPath();
		ctx.moveTo(NUMBERS.fieldOffsetX, NUMBERS.fieldOffsetY + (NUMBERS.fieldSize * i) / 3);
		ctx.lineTo(NUMBERS.fieldOffsetX + NUMBERS.fieldSize, NUMBERS.fieldOffsetY + (NUMBERS.fieldSize * i) / 3);
		ctx.stroke();
	}

	//objects (naughts and crosses)
	for (let i = 0; i < 9; ++i) {
		if (field[i] == 1) {
			drawCross(i % 3, parseInt(i / 3));
		} else if (field[i] == -1) {
			drawNaught(i % 3, parseInt(i / 3));
		}
	}
}

function drawCross(x, y) {
	x = NUMBERS.fieldOffsetX + NUMBERS.objectOffset + (NUMBERS.fieldSize * x) / 3;
	y = NUMBERS.fieldOffsetY + NUMBERS.objectOffset + (NUMBERS.fieldSize * y) / 3;
	ctx.strokeStyle = COLORS.cross();
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + NUMBERS.objectSize, y + NUMBERS.objectSize);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x + NUMBERS.objectSize, y);
	ctx.lineTo(x, y + NUMBERS.objectSize);
	ctx.stroke();
}

function drawNaught(x, y) {
	x = NUMBERS.fieldOffsetX + (NUMBERS.fieldSize * x) / 3 + NUMBERS.fieldSize / 6;
	y = NUMBERS.fieldOffsetY + (NUMBERS.fieldSize * y) / 3 + NUMBERS.fieldSize / 6;
	ctx.strokeStyle = COLORS.naught();
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(x, y, NUMBERS.objectSize / 2, 0, 7);
	ctx.stroke();
}

function setToDefault() {
	const theme = localStorage.getItem("theme");
	localStorage.clear();
	localStorage.setItem("theme", theme);
	window.location.reload();
}

function saveSettings() {
	const modifier_settings = ["allow-override", "first-div"];
	let modifiers = [];
	for (let i of modifier_settings) {
		if (document.getElementById(i).checked) {
			modifiers.push(i);
		}
	}
	localStorage.setItem("modifiers", modifiers.join(";"));
	localStorage.setItem("showSettings", "false");
	window.location.reload();
}

function initSettings() {
	if (localStorage.getItem("modifiers")) {
		for (let i of localStorage.getItem("modifiers").split(";")) {
			document.getElementById(i).checked = true;
		}
	}
}

initSettings();

const settings = document.getElementById("settings");
if (localStorage.getItem("showSettings") == "true") {
	settings.style.display = "flex";
	localStorage.removeItem("showSettings");
}

document.getElementById("settings-button").onclick = () => {
	settings.style.display = "flex";
};

const modeTogglers = document.querySelectorAll(".mode-toggle");
modeTogglers.forEach((modeToggler) => {
	const mode = modeToggler.getAttribute("mode");
	if (mode == localStorage.getItem("mode") || (!localStorage.getItem("mode") && mode == "pvp")) {
		modeToggler.style.backgroundColor = "#999999";
		localStorage.setItem("mode", mode);
	}
	modeToggler.onclick = () => {
		localStorage.setItem("mode", mode);
		modeTogglers.forEach((modeToggler2) => {
			modeToggler2.style.backgroundColor = "#666666";
		});
		modeToggler.style.backgroundColor = "#999999";
	};
});
