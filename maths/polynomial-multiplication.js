class Element {
	constructor(names, number, powers) {
		this.names = names;
		this.number = parseInt(number);
		this.powers = [];
		powers.forEach((power) => {
			this.powers.push(parseInt(power));
		});
		for (let i = 0; i < this.names.length; ++i) {
			if (this.powers[i] == 0) {
				this.names.splice(i, 1);
				this.powers.splice(i, 1);
			}
		}
	}

	order() {
		let c = [];
		for (let i = 0; i < this.names.length; c.push(i++));
		c.sort((x, y) => this.powers[x] - this.powers[y]);
		this.powers.sort((x, y) => x - y);
		this.names.sort((x, y) => c[this.names.indexOf(x)] - c[this.names.indexOf(y)]);
		c.sort((x, y) => this.powers[x] - this.powers[y] || this.names[x].localeCompare(this.names[y]));
		this.names.sort((x, y) => c[this.names.indexOf(x)] - c[this.names.indexOf(y)]);
	}

	multiply(other) {
		let new_names = [];
		let new_powers = [];
		let remaining_names = other.names.filter(() => true);
		let remaining_powers = other.powers.filter(() => true);
		this.names.forEach((name, i) => {
			let index = remaining_names.indexOf(name);
			if (index != -1) {
				new_names.push(name);
				new_powers.push(this.powers[i] + other.powers[other.names.indexOf(name)]);
				remaining_names.splice(index, 1);
				remaining_powers.splice(index, 1);
			} else {
				new_names.push(name);
				new_powers.push(this.powers[i]);
			}
		});
		remaining_names.forEach((name, i) => {
			new_names.push(name);
			new_powers.push(remaining_powers[i]);
		});

		return new Element(new_names, this.number * other.number, new_powers);
	}
}

function get() {
	return document.getElementById("polynomial").value.replace(/ /g, "");
}

function isValid(expression) {
	let parenthesis = 0;
	for (let i = 0; i < expression.length; ++i) {
		if (expression[i] == "(") ++parenthesis;
		else if (expression[i] == ")") --parenthesis;
		else if (!expression[i].match(/[A-Za-z0-9\-\+\^]/)) {
			return i;
		}
	}

	return parenthesis == 0 ? -1 : -2;
}

function getParts(expression) {
	return expression.slice(1, -1).split(/\)\(/g);
}

function getElements(polynomial) {
	let elements = [];
	polynomial
		.replace(/(\(\))/g, "")
		.replace(/\^\-/g, "^&")
		.replace(/\-/g, "-~")
		.replace(/^-/, "~")
		.split(/[\+\-]/g)
		.forEach((el) => {
			let names = [];
			let powers = [];
			let atNames = false;
			let atPower = false;
			let index = -1;
			let number = "";
			el = el
				.replace(/\^&/g, "^-")
				.replace(/~/, "-")
				.replace(/[\(\)]/g, "");
			debugger;
			for (let i = 0; i < el.length; ++i) {
				let char = el[i];
				if (atPower || !"-+1234567890".includes(char)) {
					atNames = true;
					if (char.match(/[A-Za-z]/)) {
						atPower = false;
						++index;
						powers.push("");
						names.push(char);
					}
					if (atPower) {
						powers[index] += char;
					}
				}
				if (char == "^") {
					atPower = true;
				} else if (!atNames) {
					number += char;
				}
			}
			powers.forEach((p, i) => {
				if (p == "") {
					powers[i] = "1";
				}
			});
			if (number == "") {
				number = "1";
			} else if (number == "-") {
				number = "-1";
			}
			elements.push(new Element(names, number, powers));
		});

	return elements;
}

function multiplyPolynomials(a, b) {
	let res = [];
	for (let i = 0; i < a.length; ++i) {
		for (let j = 0; j < b.length; ++j) {
			res.push(a[i].multiply(b[j]));
		}
	}

	return res;
}

function addTerms(polynomial) {
	let res = [];
	polynomial.forEach((el) => {
		el.order();
		let found = false;
		res.forEach((rel) => {
			if (!found) {
				if (el.names.length == rel.names.length) {
					let flag = true;
					for (let i = 0; i < el.names.length; ++i) {
						if (rel.names[i] != el.names[i] || rel.powers[i] != el.powers[i]) {
							flag = false;
							break;
						}
					}
					if (flag) {
						res.push(new Element(el.names, el.number + rel.number, el.powers));
						found = true;
						res.splice(res.indexOf(rel), 1);
					}
				}
			}
		});
		if (!found) {
			res.push(el);
		}
	});

	return res;
}

function multiply() {
	if (isValid(get()) != -1) {
		alert(":(");
	}
	let input = getParts(get());
	let answer = getElements(input[0]);
	console.log(answer);

	for (let i = 1; i < input.length; ++i) {
		answer = multiplyPolynomials(answer, getElements(input[i]));
		console.log(answer, getElements(input[i]));
	}

	answer = addTerms(answer);
	//sort by powers, then by names
	answer.sort((a, b) => {
		let alen = a.powers.length;
		let blen = b.powers.length;
		let end = Math.min(alen, blen);
		for (let i = 0; i < end; ++i) {
			if (a.powers[i] != b.powers[i]) {
				return a.powers[i] - b.powers[i];
			}
		}
		if (alen > blen) {
			return 1;
		} else if (alen < blen) {
			return -1;
		}
		let charDiff = a.names
			.reduce((acc, v) => acc + v.charCodeAt(0).toString().padStart(3, "0"), "")
			.localeCompare(b.names.reduce((acc, v) => acc + v.charCodeAt(0).toString().padStart(3, "0"), ""));
		return charDiff;
	});

	let res = "";
	for (let i = 0; i < answer.length; ++i) {
		let el = answer[i];
		if (el.number == 0) continue;
		el.order();
		if (el.names.length == 0) {
			res += (el.number > 0 ? "+" : "") + el.number;
			continue;
		}
		res += (el.number > 0 ? "+" : "") + (el.number == 1 ? "" : el.number == "-1" ? "-" : el.number);
		for (let j = 0; j < el.names.length; ++j) {
			if (el.powers[j] == 1) {
				res += el.names[j];
			} else if (el.powers[j] != 0) {
				res += el.names[j] + "^" + (el.powers[j] < 0 || el.powers[j] > 9 ? "(" + el.powers[j] + ")" : +el.powers[j]);
			} else {
				res += Math.abs(el.number) == 1 ? "1" : "";
			}
		}
	}

	if (res[0] == "+") {
		res = res.slice(1);
	}

	output.innerHTML = res;
	output.style.width = res.length + "em";
	if (res.length != 0) {
		output.style.borderWidth = "1rem";
	} else {
		output.style.borderWidth = "0";
	}
}

const output = document.getElementById("output");
