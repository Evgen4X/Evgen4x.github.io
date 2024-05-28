const InumberOfPlayers = document.getElementById("number-of-players");
InumberOfPlayers.onchange = () => {
	InumberOfPlayers.value = Math.min(Math.max(parseInt(InumberOfPlayers.value), 2), 8);
	localStorage.setItem("number-of-players", InumberOfPlayers.value);
};
var numberOfPlayers = 5;
if (localStorage.getItem("number-of-players")) {
	numberOfPlayers = parseInt(localStorage.getItem("number-of-players"));
	localStorage.removeItem("number-of-players");
}
InumberOfPlayers.value = numberOfPlayers;
var deck = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "TC", "TD", "TH", "TS", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS"];
deck.sort((a, b) => Math.random() - 0.5);
function addCard(dest, number) {
	for (let i = 0; i < number; ++i) {
		dest.push(deck.pop());
	}
}

var players = [];
var playerDivs = [];
for (let i = 0; i < parseInt(InumberOfPlayers.value); ++i) {
	players.push([]);
	addCard(players[i], 2);
	let div = document.createElement("div");
	div.classList.add("player-cards");
	if (i != 0) {
		div.classList = "hidden-cards";
	}
	div.id = "player-cards-" + i;
	div.setAttribute("player", i);
	document.getElementById("players-container").appendChild(div);
	playerDivs.push(div);

	updateCards(div, players[i], true);
}

var community = ["?", "?", "?", "?", "?"];
var communityDivs = [];
updateCards(document.getElementById("community-cards"), community);

function updateCards(html, js) {
	html.innerHTML = "";
	js.forEach((card) => {
		html.innerHTML += `<div class='card' card='${card}'></div>`;
	});

	updateAll();
}

function updateAll(hideAll) {
	document.querySelectorAll(".card").forEach((el) => {
		let card = el.getAttribute("card");
		if (card == "?") {
			el.style.backgroundImage = `url(images/back.png)`;
		} else {
			el.style.backgroundImage = `url(images/${Vnames[values.indexOf(card[0])]}_of_${Snames[suites.indexOf(card[1])]}.png)`;
		}
	});
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function drawCard(cards) {
	cards.forEach((card) => {
		ctx.drawImage(card[2], card[0], card[1]);
	});
}
