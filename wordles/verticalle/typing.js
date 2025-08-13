const kb_buttons = document.querySelectorAll(".kb_key");
const brd_rows = document.querySelectorAll(".brd_row");
brd_rows[0].setAttribute("status", "active");
const brd_letters = document.querySelectorAll(".letter");
brd_letters[0].setAttribute("status", "active");
brd_letters.forEach((letter) => {
	letter.addEventListener("click", hide_letter);
});
const game_over = document.querySelector(".go");

function buttonType(event) {
	const sender = event.target;
	const text = sender.textContent;
	typeLetter(text);
}

function keyType(event) {
	const key = event.key;
	if (key == "Backspace") {
		typeLetter("⌫");
		return;
	} else if (alphabet.includes(key.toUpperCase())) {
		typeLetter(key.toUpperCase());
	}
}

function typeLetter(text) {
	const row = document.querySelector('.brd_row[status="active"]');
	const letter = document.querySelector('.letter[status="active"]');

	if (text == "ENTER") {
		let word = "";
		for (let i = 1; i < letters_number + 1; i++) {
			word += document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`).textContent;
		}

		if (word.length != letters_number) {
			msg_alert("Enter full word!", 3000);
			return;
		}
		if (!is_word(word) && check_dict) {
			msg_alert("Enter a valid word!", 3000);
			return;
		}
		let check = check_word_vertical(word, answer, row.getAttribute("index"));
		let i = 1;
		if (row.getAttribute("index") == letters_number + 1) {
			check = check_word(word, answer);
		}
		for (let status of check) {
			let letter = document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`);
			let button = document.querySelector(`#keyboard button[letter="${letter.textContent}"`);
			let prev_color = button.style.getPropertyValue("--color");
			console.log(letter, status);
			if (status == 0) {
				letter.style.setProperty("--color", "#545454");
				if (prev_color != "#79b851" && prev_color != "#f3c237") {
					button.style.setProperty("--color", "#545454");
				}
			} else if (status == 1) {
				letter.style.setProperty("--color", "#f3c237");
				if (prev_color != "#79b851") {
					button.style.setProperty("--color", "#f3c237");
				}
			} else if (status == 2) {
				letter.style.setProperty("--color", "#79b851");
				button.style.setProperty("--color", "#79b851");
			}
			letter.style.animation = `to_color 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
			button.style.animation = `to_color 0s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
			i++;
		}
		let index = parseInt(row.getAttribute("index"));
		row.setAttribute("status", "filled");
		let next_row = document.querySelectorAll(`.brd_row[index="${index + 1}"]`)[0];
		if (check.every((status) => status == 2)) {
			setTimeout(() => {
				show_game_over(true);
			}, 2000);
			return;
		}
		if (index == letters_number + 1) {
			setTimeout(() => {
				show_game_over(false);
			}, 2000);
			return;
		}
		next_row.setAttribute("status", "active");
		set_first();
	} else if (text == "⌫") {
		if (letter == null) {
			let target = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${letters_number}"]`);
			target[0].textContent = "";
			target[0].setAttribute("status", "active");
			return;
		}
		let index = parseInt(letter.getAttribute("index"));
		let target = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${index - 1}"]`)[0];
		target.textContent = "";
		target.setAttribute("status", "active");
		letter.setAttribute("status", "none");
	} else {
		letter.textContent = text;
		letter.setAttribute("status", "filled");
		if (letter.getAttribute("index") != letters_number) {
			let index = parseInt(letter.getAttribute("index"));
			let next = document.querySelector(`.brd_row[status="active"] .letter[index="${index + 1}"]`);
			next.setAttribute("status", "active");
		}
	}
}

function show_game_over(win) {
	let title = document.querySelector(".absolute .title"),
		ans = document.querySelector(".absolute .go_answer");
	if (win) {
		title.textContent = "You won!";
	} else {
		title.textContent = "You lost!";
	}
	ans.textContent = `The correct answer was: ${answer.toLowerCase()}`;
	game_over.style.display = "flex";
}

kb_buttons.forEach((button) => {
	button.addEventListener("click", buttonType);
	button.setAttribute("letter", button.textContent.toString());
});
document.addEventListener("keyup", keyType);

var answer;
if (params.get("word") == null) {
	answers = answers.filter((word) => word.length == letters_number);
	answer = answers[Math.floor(Math.random() * answers.length)];
} else {
	answer = decode(params.get("word"));
	msg_alert("That wordle may not use standart dictionary!", 7500);
}
