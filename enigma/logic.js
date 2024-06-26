class Rotor {
	constructor(inputs, outputs, rotations) {
		this.inputs = inputs;
		this.outputs = outputs;
		this.rotations = rotations;
		this.i = 0;
	}

	pass(char) {
		char = this.inputs.indexOf(char) + this.i;

		if (char >= ALPHABET.length) {
			char -= ALPHABET.length;
		}
		if (char < 0) {
			char += ALPHABET.length;
		}

		return this.outputs[char];
	}

	backwardPass(char) {
		char = this.outputs.indexOf(char) - this.i;

		if (char >= ALPHABET.length) {
			char -= ALPHABET.length;
		}
		if (char < 0) {
			char += ALPHABET.length;
		}

		return this.inputs[char];
	}

	rotate(n = 1) {
		this.i += n;

		if (this.i == ALPHABET.length) {
			this.i = 0;
		}

		return this.rotations.includes(ALPHABET[this.i]);
	}
}

function encode(rotor1, rotor2, rotor3, reflector) {
	function process(char) {
		rotor1.rotate() && rotor2.rotate() && rotor3.rotate();

		char = rotor3.pass(rotor2.pass(rotor1.pass(char)));

		char = reflector.pass(char);

		char = rotor1.backwardPass(rotor2.backwardPass(rotor3.backwardPass(char)));

		return char;
	}

	return process;
}

function type(key) {
	if (key != "BACKSPACE") {
		if (!ALPHABET.includes(key)) return;
		key = passer(key);
		textarea.innerHTML += key;
		document.querySelector(`.light[key="${key}"]`).animate([{backgroundColor: "var(--lrbg)"}, {backgroundColor: "rgb(230, 250, 0)"}, {backgroundColor: "var(--lrbg)"}], {duration: 1000});
	} else {
		textarea.innerHTML = textarea.innerHTML.slice(0, textarea.innerHTML.length - 1);
		r1.rotate(-1) && r2.rotate(-1) && r3.rotate(-1);
	}
}

function createRotor(outputs, rotations) {
	return new Rotor(ALPHABET, outputs, rotations);
}

function copy() {
	navigator.permissions.query({name: "clipboard-write"}).then((result) => {
		if (result.state === "granted" || result.state === "prompt") {
			navigator.clipboard.writeText(textarea.innerHTML);
		}
	});
}

function typeText(text, i) {
	while (!ALPHABET.includes(text[i++]) && i < text.length);
	type(text[i - 1]);
	document.querySelector(`.keyboard-key[key="${text[i - 1]}"]`).animate(
		[
			{backgroundColor: "var(--dbg)", borderColor: "var(--ltxt)"},
			{backgroundColor: "rgb(100, 100, 100)", borderColor: "var(--dtxt)"},
			{backgroundColor: "var(--brbg)", borderColor: "var(--ltxt)"},
		],
		{duration: 1000}
	);
	if (i == text.length) {
		document.getElementById("paste").disabled = false;
	} else {
		setTimeout(() => {
			typeText(text, i);
		}, 60000 / parseInt(document.getElementById("type-speed").value));
	}
}

function paste() {
	document.getElementById("paste").disabled = true;
	navigator.permissions.query({name: "clipboard-write"}).then((result) => {
		if (result.state === "granted" || result.state === "prompt") {
			navigator.clipboard.readText().then((text) => {
				text = text.toUpperCase();
				typeText(text, 0);
			});
		}
	});
}

function saveSettings() {
	let rotors = [];
	for (let i = 1; i < 4; ++i) {
		let rotor = document.getElementById(`rotor${i}`).value;
		let rotations = Array.from(document.getElementById(`rotor${i}-rotations`).value).filter((n) => ALPHABET.includes(n));
		if (rotor == "CUSTOM") {
			rotors.push(createRotor(document.getElementById("rotor1-outputs").value.slice(0, ALPHABET.length), rotations));
		} else {
			rotors.push(createRotor(ROTORS[rotor], rotations));
		}
	}

	console.log(rotors);

	let rotor = document.getElementById("reflector").value;
	if (rotor == "CUSTOM") {
		rf = createRotor(document.getElementById("reflector-outputs").value.slice(0, ALPHABET.length), []);
	} else {
		rf = createRotor(REFLECTORS[rotor], []);
	}

	passer = encode(rotors[0], rotors[1], rotors[2], rf);
}

document.querySelectorAll('input[list$="-list"]').forEach((input) => {
	document.getElementById(input.id + "-outputs").value = input.id == "reflector" ? REFLECTORS[input.value] : ROTORS[input.value];
	input.onchange = () => {
		if (input.value == "CUSTOM") {
			document.getElementById(input.id + "-outputs").value = "";
		} else {
			document.getElementById(input.id + "-outputs").value = input.id == "reflector" ? REFLECTORS[input.value] : ROTORS[input.value];
		}
	};
});

let r1 = createRotor(ROTORS["I"], []);
let r2 = createRotor(ROTORS["II"], []);
let r3 = createRotor(ROTORS["III"], []);
let rf = createRotor(REFLECTORS["A"], []);

var passer = encode(r1, r2, r3, rf);
