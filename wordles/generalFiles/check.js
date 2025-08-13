function is_word(word) {
	return answers.includes(word);
}

function ordinal(n) {
	let lastDigit = n % 10;
	if (n >= 4 && n <= 20) return n + "th";
	if (lastDigit == 1) return n + "st";
	if (lastDigit == 2) return n + "nd";
	if (lastDigit == 3) return n + "rd";
	return n + "th";
}

function oncetwice(n) {
	if (n == 1) return "once";
	if (n == 2) return "twice";
	if (n == 3) return "thrice";
	return `${n} times`;
}

function check_hard_mode(word, known) {
	//Third: check if greens were typed
	for (let i in known["green"]) {
		let green = known["green"][i];
		if (green && word[i] != green) {
			return `${ordinal(parseInt(i) + 1)} ${LETTER_NAME} must be ${green}`;
		}
	}

	//Second: check if yellows were used
	for (let i in known["yellow"]) {
		// let times = known["yellow"][i];
		let expected = known["yellow"][i];
		let occurrences = 0;
		for (let j in word) {
			if (!known["green"][j] && word[j] == i) {
				++occurrences;
			}
		}

		if (occurrences < expected) {
			return `${LETTER_NAME[0].toUpperCase() + LETTER_NAME.slice(1)} ${i} must be used at least ${oncetwice(expected)}`;
		}
	}

	return null;
}

function check_word(word, answer) {
	const result = [];
	const remainingLetters = answer.split("");

	// First pass: check for letters in the correct position
	for (let i = 0; i < word.length; i++) {
		if (word[i] === answer[i]) {
			result[i] = 2;
			remainingLetters[i] = null; // Mark the letter as used
		}
	}

	// Second pass: check for letters in the wrong position
	for (let i = 0; i < word.length; i++) {
		if (result[i] !== 2) {
			const letterIndex = remainingLetters.indexOf(word[i]);
			if (letterIndex !== -1) {
				result[i] = 1;
				remainingLetters[letterIndex] = null; // Mark the letter as used
			} else {
				result[i] = 0;
			}
		}
	}

	return result;
}

function set_first() {
	document.querySelectorAll('.brd_row[status="active"] .letter[index="1"]')[0].setAttribute("status", "active");
}

function new_game() {
	let url = new URL(window.location.href);
	url.searchParams.delete("word");
	window.location.href = url;
}

function get_link(minLength = 3, maxLength = 15) {
	console.log(alphabet);
	let text = document.getElementById("link_input").value.toUpperCase();
	if (text.length < minLength || text.length > maxLength) {
		msg_alert(`The word must be from ${minLength} to ${maxLength} ${LETTER_NAME}s long!<br>You'r word length: ${text.length}`, 3000);
		return;
	}
	for (let i of text) {
		if (!alphabet.includes(i)) {
			msg_alert("Invalid characters found!", 3000);
			return;
		}
	}
	let url = new URL(window.location.href);
	url.searchParams.set("word", encode(text));
	url.searchParams.set("length", text.length);
	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.innerHTML = "Link is here";
	return;
}
