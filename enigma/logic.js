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
		// let shifts = this.shifts.slice(this.shifts.length - n);
		// this.shifts = shifts.concat(this.shifts.slice(0, this.shifts.length - n));
		//
		// let shifts = this.shifts.slice(0, n);
		// this.shifts = this.shifts.slice(n).concat(shifts);

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

		console.log(rotor1.i, rotor2.i, rotor3.i);

		console.log(rotor1.pass(char), rotor2.pass(rotor1.pass(char)), rotor3.pass(rotor2.pass(rotor1.pass(char))));

		char = rotor3.pass(rotor2.pass(rotor1.pass(char)));

		char = reflector.pass(char);

		console.log(char, rotor3.backwardPass(char), rotor2.backwardPass(rotor3.backwardPass(char)), rotor1.backwardPass(rotor2.backwardPass(rotor3.backwardPass(char))));

		char = rotor1.backwardPass(rotor2.backwardPass(rotor3.backwardPass(char)));

		return char;
	}

	return process;
}

function type(key) {
	if (key != "BACKSPACE") {
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

function paste() {
	navigator.permissions.query({name: "clipboard-write"}).then((result) => {
		if (result.state === "granted" || result.state === "prompt") {
			navigator.clipboard.readText().then((text) => {
				let i = 0;
				text = text.toUpperCase();
				let interval = window.setInterval(() => {
					while (!ALPHABET.includes(text[i++]) && i < text.length);
					type(text[i - 1]);
					if (i == text.length) window.clearInterval(interval);
				}, 60000 / parseInt(document.getElementById("type-speed").value));
			});
		}
	});
}
let r1 = createRotor(ROTORS["III"], []);
let r2 = createRotor(ROTORS["II"], []);
let r3 = createRotor(ROTORS["I"], []);
let rf = createRotor(REFLECTORS["B"], []);

const passer = encode(r1, r2, r3, rf);
