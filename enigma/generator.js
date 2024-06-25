const textarea = document.getElementById("textarea");

const lights = document.getElementById("lights");

const keyboard = document.getElementById("keyboard");
const buttons = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"];
const breaks = ["P", "L", "BACKSPACE"];

var krow = document.createElement("div");
krow.classList.add("keyboard-row");
var lrow = document.createElement("div");
lrow.classList.add("lights-row");

buttons.forEach((button) => {
	let div = document.createElement("div");
	div.classList.add("keyboard-key");
	div.innerHTML = button;
	div.onclick = () => {
		type(button);
	};

	if (button == "Z") {
		krow.innerHTML = '<div style="width: 12em;"></div>';
	}

	if (button == "BACKSPACE") {
		div.style.width = "7em";
		div.style.marginLeft = "0.5em";
	}

	krow.appendChild(div);

	if (breaks.includes(button)) {
		keyboard.appendChild(krow);
		krow = document.createElement("div");
		krow.classList.add("keyboard-row");
	}

	if (button != "BACKSPACE") {
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
	}
});

var controlled = false;

document.addEventListener("keydown", (event) => {
	let key = event.key.toUpperCase();

	if (key == "CONTROL") controlled = true;

	if (buttons.includes(key)) {
		if (key == "BACKSPACE" && controlled) {
			textarea.innerHTML = "";
		} else {
			type(key);
		}
	}
});

document.addEventListener("keyup", (event) => {
	if (event.key == "Control") {
		controlled = false;
	}
});
