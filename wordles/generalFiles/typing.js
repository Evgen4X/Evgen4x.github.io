const game_over = document.querySelector(".go");

function buttonType(event) {
	const sender = event.target;
	const text = sender.innerHTML;
	typeLetter(text);
}

function keyType(event) {
	const key = event.key.toUpperCase();
	if (key == "BACKSPACE") {
		typeLetter("⌫");
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
			word += document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`).innerHTML;
		}
		if (word.length != letters_number) {
			msg_alert("Enter full word!", SHORT_MESSAGE_TIME);
			return;
		}
		if (check_dict && !is_word(word)) {
			msg_alert("Enter a valid word!", SHORT_MESSAGE_TIME);
			return;
		}
		if (localStorage.getItem(HARD_MODE) == "on") {
			let response = check_hard_mode(word, known_letters);
			if (response) {
				msg_alert(response, SHORT_MESSAGE_TIME);
				return;
			}
		}
		let check = check_word(word, answer),
			i = 1;
		known_letters["yellow"] = {};
		for (let status of check) {
			let letterDiv = document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`);
			let button = document.querySelector(`#keyboard button[letter="${letterDiv.innerHTML}"`);
			let prev_color = button.style.getPropertyValue("--color");
			let letter = letterDiv.innerHTML;
			if (status == 0) {
				letterDiv.style.setProperty("--color", "#545454");
				if (prev_color != "#79b851" && prev_color != "#f3c237") {
					button.style.setProperty("--color", "#545454");
				}
			} else if (status == 1) {
				letterDiv.style.setProperty("--color", "#f3c237");
				if (prev_color != "#79b851") {
					button.style.setProperty("--color", "#f3c237");
				}
				if (known_letters["yellow"][letter]) {
					known_letters["yellow"][letter]++;
				} else {
					known_letters["yellow"][letter] = 1;
				}
			} else {
				letterDiv.style.setProperty("--color", "#79b851");
				button.style.setProperty("--color", "#79b851");
				known_letters["green"][i - 1] = letter;
			}
			letterDiv.style.animation = `to_color 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
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
		if (index == 6) {
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
			target[0].innerHTML = "";
			target[0].setAttribute("status", "active");
			return;
		}
		let index = parseInt(letter.getAttribute("index"));
		let target = document.querySelector(`.brd_row[status="active"] .letter[index="${index - 1}"]`);
		target.innerHTML = "";
		target.setAttribute("status", "active");
		letter.setAttribute("status", "none");
	} else {
		letter.innerHTML = text;
		letter.setAttribute("status", "filled");
		if (letter.getAttribute("index") != letters_number) {
			let index = parseInt(letter.getAttribute("index"));
			let next = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${index + 1}"]`);
			next[0].setAttribute("status", "active");
		}
	}
}

function show_game_over(win) {
	let title = document.querySelector(".absolute .title"),
		ans = document.querySelector(".absolute .go_answer");
	if (win) {
		title.innerHTML = "You won!";
	} else {
		title.innerHTML = "You lost!";
	}
	ans.innerHTML = `The correct answer was: ${answer.toLowerCase()}`;
	game_over.style.display = "flex";
}

kb_buttons.forEach((button) => {
	button.addEventListener("click", buttonType);
	button.setAttribute("letter", button.innerHTML.toString());
});
document.addEventListener("keyup", keyType);

// setting amount of letters
const letters_slider = document.querySelectorAll(".amount_of_letters");
letters_slider.forEach((button) => {
	button.addEventListener("click", () => {
		let url = new URL(window.location.href);
		url.search = "";
		url.searchParams.set("length", button.innerHTML);
		window.location.href = url;
	});
});
