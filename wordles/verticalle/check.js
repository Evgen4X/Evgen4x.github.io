function is_word(word) {
	return answers.includes(word);
}

function check_word_vertical(word, position_) {
	const position = parseInt(position_) - 1;
	const result = [];
	const remainingLetters = answer.split("");

	// First pass: check for letters in the correct position
	for (let i = 0; i < word.length; i++) {
		if (word[i] == answer[position]) {
			result[i] = 2;
			remainingLetters[position] = null; // Mark the letter as used
			break; // Do not mark more than one letter as green, as it is obvious
		}
	}

	// Second pass: check for letters in the wrong position
	for (let i = 0; i < word.length; i++) {
		const letterIndex = remainingLetters.indexOf(word[i]);
		if (result[i] != 2) {
			if (letterIndex != -1) {
				result[i] = 1;
				remainingLetters[letterIndex] = null; // Mark the letter as used
			} else {
				result[i] = 0;
			}
		}
	}

	return result;
}

function check_word(word) {
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
