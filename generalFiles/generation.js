// const mainDiv = document.getElementById("main");
/*
//mainDiv.appendChild(generateContainer("Texas Holdem", "texasHoldem/index.html", "Play"));
mainDiv.appendChild(generateContainer("Wordles", "wordles/main/index.html", "Play"));
mainDiv.appendChild(generateContainer("Maths", "maths/index.html"));

//Hidden temporarely (04.10.2024 - ?)
//mainDiv.appendChild(generateContainer('Probability', 'probability/index.html'));
mainDiv.appendChild(generateContainer("Enigma Machine", "enigma/index.html"));

//Added: 23.05.2025
//mainDiv.appendChild(generateContainer("Billiard", "billiard/index.html", "Play"));

mainDiv.appendChild(generateContainer("TicTacToe", "tictactoe/index.html", "Play"));
mainDiv.appendChild(generateContainer("Pong", "pong/index.html", "Play"));

//Hidden temporarely (05.10.2024 - ?)
//mainDiv.appendChild(generateContainer('To do list', 'toDoList/index.html'));
//mainDiv.appendChild(generateContainer("Simulations", "simulations/index.html"));

mainDiv.appendChild(generateContainer("FNaS", "FNaS/index.html", "Play"));

//mainDiv.appendChild(generateContainer("Minesweeper", "minesweeper/index.html", "Play"));

/* RIP all the links which were hidden 'temporarely' */

function windowResized() {
	const width = main.getBoundingClientRect().width;
	COLUMNS = width > 1000 ? 8 : 4;
	ROW_HEIGHT = main.getBoundingClientRect().height / ROWS;
	COLUMN_WIDTH = width / COLUMNS;
}

function goto(href) {
	let splits = window.location.href.split("/");
	if (href) {
		if (splits.includes("index.html")) {
			splits[splits.indexOf("index.html")] = href;
		} else {
			splits.push(href);
		}
	} else {
		splits = splits.slice(0, splits.indexOf("Evgen4x.github.io") + 1);
		splits.push("index.html");
	}
	window.location.href = splits.join("/");
}

function generateContainer(name, href, text = "Go") {
	let el = document.createElement("div");
	el.id = name;
	el.classList.add("container");
	el.innerHTML = `
        <a class="element" id="${name.toLowerCase().replace(/ /g, "-")}" href="${href}">
            <h3>${name}</h3>
            <div class="screenshot"></div>
            <div class="button">${text}</div>
        </a>
    `;

	return el;
}

function generateShortcut(name, href, src) {
	if (!src) {
		src = `${urlPrefix}src/images/unknown-thumbnail.png`;
	}
	let el = document.createElement("div");
	el.style.gridColumn = column;
	el.style.gridRow = row++;
	if (row > ROWS) {
		row = 0;
		++column;
	}
	el.id = name;
	el.classList.add("shortcut");
	el.setAttribute("href", href);
	el.draggable = true;
	el.innerHTML = `
        <div class="thumbnail">
            <img src="${src}">
        </div>
        <div class="shortcut-name">${name}</div>
    `;

	el.onclick = () => {
		if (el.getAttribute("lastClicked")) {
			let n = new Date().getTime() - parseInt(el.getAttribute("lastClicked"));
			if (n < 500) {
				let href = el.getAttribute("href");
				goto(href);
			} else {
				el.setAttribute("lastClicked", new Date().getTime().toString());
			}
		}
		el.setAttribute("lastClicked", new Date().getTime().toString());

		document.querySelectorAll(".shortcut").forEach((shortcut) => {
			shortcut.classList.remove("focused");
		});

		setTimeout(() => {
			el.classList.add("focused");
		}, 5);
	};

	el.ondragend = (e) => {
		const x = e.pageX;
		const y = e.pageY;
		const row = Math.ceil(y / ROW_HEIGHT);
		const col = Math.ceil(x / COLUMN_WIDTH);
		document.querySelectorAll(".shortcut").forEach((shortcut) => {
			if (shortcut.style.gridColumn == col && shortcut.style.gridRow == row) {
				shortcut.style.gridRow = el.style.gridRow;
				shortcut.style.gridColumn = el.style.gridColumn;
				console.log(shortcut);
			} else {
				console.log(shortcut.style.gridColumn, col);
			}
		});
		el.style.gridRow = row;
		el.style.gridColumn = col;
	};

	return el;
}

function generateRightbarIcon(src, func, name) {
	let icon = document.createElement("div");
	icon.classList.add("right-bar-icon");
	icon.onclick = func;
	if (name) {
		icon.id = `${name}-icon`;
	}
	icon.style.backgroundImage = src;
	rightBar.appendChild(icon);
}

function datetimeupdate() {
	let date = new Date();
	datetime.innerHTML = `${date.toTimeString().split(" ")[0]}<br>
    ${date.toLocaleDateString()}`;
	if (navigator.onLine) {
		wifi.style.backgroundImage = `url(${urlPrefix}src/images/wifi.png)`;
	} else {
		wifi.style.backgroundImage = `url(${urlPrefix}src/images/no-wifi.png)`;
	}
	if (navigator.cookieEnabled) {
		cookie.style.backgroundImage = `url(${urlPrefix}src/images/cookie.png)`;
	} else {
		cookie.style.backgroundImage = `url(${urlPrefix}src/images/no-cookie.png)`;
	}
}

function restart() {
	sessionStorage.clear();
	goto(null);
}

function hideAll() {
	document.querySelectorAll(".shortcut").forEach((shortcut) => {
		shortcut.classList.remove("focused");
	});
	document.querySelectorAll(".folder").forEach((folder) => {
		folder.classList.remove("focused");
	});
	if (windows.style.display != "none") {
		windows.style.display = "none";
	}
}

const main = document.querySelector("main");
const footer = document.querySelector("footer");
const rightBar = document.getElementById("right-bar");
const datetime = document.getElementById("datetime");
const wifi = document.getElementById("icon-wifi");
const cookie = document.getElementById("icon-cookie");
var column = 1;
var row = 1;
var COLUMNS;
const ROWS = 6;
var ROW_HEIGHTS;
var COLUMN_WIDTH;
main.style.display = "grid";
windowResized();
main.style.display = "none";

main.onclick = hideAll;
footer.onclick = hideAll;

document.onkeydown = (e) => {
	if (e.key.toLowerCase() == "enter") {
		document.querySelectorAll(".shortcut").forEach((shortcut) => {
			if (shortcut.classList.contains("focused")) {
				let href = shortcut.getAttribute("href");
				goto(href);
			}
		});
	}
};

generateRightbarIcon(
	`url(${urlPrefix}src/icons/windows-icon.png)`,
	() => {
		if (windows.style.display == "flex") {
			windows.style.display = "none";
		} else {
			setTimeout(() => {
				windows.style.display = "flex";
			}, 5);
		}
	},
	"windows"
);

window.addEventListener("resize", windowResized);

setInterval(datetimeupdate, 1000);
