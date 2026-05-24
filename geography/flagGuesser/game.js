function setFlag(flag) {
	flagDiv.style.backgroundImage = `url(../files/images/flags/${flag}.png)`;
}

function shuffle(n) {
	let data = [];
	for (let i = 0; i < n; ++i) data.push(i);

	return data.sort((a, b) => Math.random() - 0.5);
}

function getCountry(n) {
	return Object.keys(COUNTRIES)[order[n]];
}

function next() {
	return getCountry(index++);
}

function filter(text) {
	text = text.trim().toLowerCase();
	text = text.replace(`^[A-Za-z_-\(\) ]`, "").replace(/ /g, "");
	return text;
}

function entered() {
	const regexps = COUNTRIES[getCountry(index - 1)]["regex"];
	const value = filter(flagInput.value);
	for (let regex of regexps) {
		if (new RegExp(regex).test(value)) {
			++score;
			break;
		}
	}
	++played;

	scoreboard.innerHTML = `Score: ${score}/${played}&nbsp;&nbsp;&nbsp;(${Math.round((score / played) * 10000) / 100}%)`;

	setFlag(next());
	flagInput.value = "";
}

const flagDiv = document.getElementById("flag");
const flagInput = document.getElementById("flag-input");
const scoreboard = document.getElementById("scoreboard");
const order = shuffle(Object.keys(COUNTRIES).length);
var index = 0;
var score = 0;
var played = 0;

setFlag(next());

document.onkeydown = (e) => {
	const key = e.key.toUpperCase();
	if (key == "ENTER") {
		entered();
	}
};
