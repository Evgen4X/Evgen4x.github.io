const settings = document.getElementById("settings");

document.getElementById("settings-button").onclick = () => {
	settings.style.display = "flex";
};

function generateField(n, size, toStart = false) {
	for (let _ = 0; _ < n; ++_) {
		if (toStart) {
			field.unshift(new Array(size).fill(false));
		} else {
			field.push(new Array(size).fill(false));
		}
	}
}

function putMines() {
	let available = [];
	for (let i = 0; i < data.width; i++) {
		for (let j = 0; j < data.height; ++j) {
			available.push([i, j]);
		}
	}

	available.sort((a, b) => Math.random() - 0.5);

	for (let i = 0; i < data.size() * data.minePercent; ++i) {
		field[available[i][0]][available[i][1]] = true;
	}
}

var field = [];

generateField(data.width, data.height);
putMines();

console.log(field);
