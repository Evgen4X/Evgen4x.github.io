const textarea = document.getElementById("textarea");

const plugboard = document.getElementById("plugboard-keyboard");

const lights = document.getElementById("lights");

const keyboard = document.getElementById("keyboard");
const buttons = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M", "⌫"];
const breaks = ["P", "L", "⌫"];

var krow = document.createElement("div");
krow.classList.add("keyboard-row");
var lrow = document.createElement("div");
lrow.classList.add("lights-row");
var prow = document.createElement("div");
prow.classList.add("plugboard-row");

buttons.forEach((button) => {
	let div = document.createElement("div");
	div.classList.add("keyboard-key");
	div.innerHTML = button;
	div.onclick = () => {
		type(button);
	};

	div.setAttribute("key", button);

	krow.appendChild(div);

	if (breaks.includes(button)) {
		keyboard.appendChild(krow);
		krow = document.createElement("div");
		krow.classList.add("keyboard-row");
	}

	if (button != "⌫") {
		div = document.createElement("div");
		div.classList.add("light");
		div.innerHTML = button;
		div.setAttribute("key", button);

		lrow.appendChild(div);

		if (breaks.includes(button) || button == "M") {
			lights.appendChild(lrow);
			lrow = document.createElement("div");
			lrow.classList = "lights-row";
		}

		div = document.createElement("div");
		div.classList.add("plug-key");
		div.innerHTML = button;
		div.setAttribute("key", button);

		div.onclick = (event) => {
			let pconnection = plugboard.getAttribute("connection");
			let econnection = event.target.getAttribute("connection");
			if (pconnection) {
				if (pconnection != event.target.getAttribute("key")) {
					if (econnection) {
						document.querySelector(`.plug-key[key="${econnection}"]`).removeAttribute("connection");
					}
					let target = document.querySelector(`.plug-key[connection="${pconnection}"]`);
					if (target) {
						target.removeAttribute("connection");
					}
					event.target.setAttribute("connection", pconnection);
					document.querySelector(`.plug-key[key="${pconnection}"]`).setAttribute("connection", event.target.getAttribute("key"));
					plugboard.removeAttribute("connection");
				} else {
					plugboard.removeAttribute("connection");
				}
			} else {
				plugboard.setAttribute("connection", event.target.getAttribute("key"));
			}

			updatePlugboard();
		};

		prow.appendChild(div);

		if (breaks.includes(button) || button == "M") {
			plugboard.appendChild(prow);
			prow = document.createElement("div");
			prow.classList = "plugboard-row";
		}
	}
});

function updatePlugboard() {
	let colors = COLORS.filter((c) => document.querySelectorAll(`.plug-key[col="${c}"]`).length == 0);
	document.querySelectorAll(".plug-key").forEach((key) => {
		let connection = key.getAttribute("connection");
		if (connection) {
			if (key.style.backgroundColor == "var(--lrbg)") {
				let color = colors[0];
				colors.shift();
				key.style.backgroundColor = color;
				let target = document.querySelector(`.plug-key[connection="${key.getAttribute("key")}"]`);
				target.style.backgroundColor = color;
				target.setAttribute("col", color);
			}
		} else {
			key.style.backgroundColor = "var(--lrbg)";
			key.removeAttribute("col");
		}
	});
}

function clearPlugboard() {
	document.querySelectorAll(".plug-key").forEach((key) => {
		key.removeAttribute("connection");
		key.style.backgroundColor = "var(--lrbg)";
	});
}

var controlled = false;

document.addEventListener("keydown", (event) => {
	if (!document.querySelector("dialog").open) {
		let key = event.key.toUpperCase();

		if (key == "CONTROL") controlled = true;

		if (buttons.includes(key)) {
			if (key == "⌫" && controlled) {
				textarea.innerHTML = "";
			} else {
				type(key);
			}
		}
	}
});

document.addEventListener("keyup", (event) => {
	if (event.key == "Control") {
		controlled = false;
	}
});
