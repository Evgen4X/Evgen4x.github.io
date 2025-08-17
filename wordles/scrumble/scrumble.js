function format(n) {
	return n.toString().padStart(2, "0");
}

function updateTimer() {
	if (game_over.style.display == "flex") {
		clearInterval(timerInterval);
		return;
	}
	--time;

	let minutes = Math.floor(time / 60);
	let seconds = time % 60;

	timeLeft.innerHTML = `${format(minutes)}:${format(seconds)}`;

	if (time == 0) {
		if (enter_pressed) {
			clearInterval(timerInterval);
			typeLetter = () => {};
			setTimeout(() => {
				if (game_over.style.display != "flex") {
					show_game_over(false);
				}
			}, 2000);
		} else {
			show_game_over(false);
			clearInterval(timerInterval);
			typeLetter = () => {};
		}
	}
}

function get_link(minLength = 3, maxLength = 15) {
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

	let scrumble = document.getElementById("link_scrumble").value;
	if (scrumble) {
		scrumble = scrumble.toUpperCase();
		if (scrumble.length == text.length) {
			let scrumble_ = scrumble;
			for (let i of text) {
				let n = scrumble_.indexOf(i);
				console.log(i, n);
				if (n != -1) {
					scrumble_ = scrumble_.split(0, n) + scrumble.split(n + 1);
				} else {
					msg_alert("Scrumbled version must include only the letters of the answer", 3000);
					return;
				}
			}
			url.searchParams.set("scrumble", encode(scrumble));
		}
	}

	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.innerHTML = "Link is here";
	return;
}

const timeLeft = document.getElementById("time-left");
var time = Math.floor((letters_number * letters_number) / 4 + letters_number * 0.69);

document.getElementById("timer").style.width = `calc(45vw - ${answer.length / 2} * ${
	document.querySelector(".letter").getBoundingClientRect().width * 1.25
}px)`;

if (letters_number > 10) {
	document.getElementById("timer").style.fontSize = "2rem";
	document.getElementById("time-left").style.fontSize = "3rem";
}

document.onkeyup = (e) => {
	if (e.key.toUpperCase() == "ENTER") {
		enter_pressed = true;
		setTimeout(() => {
			enter_pressed = false;
		}, 1000);
	}
};

var timerInterval;
let enter_pressed = false;
let init_word;

if (params.get("scrumble")) {
	init_word = decode(params.get("scrumble"));
} else {
	init_word = answer.split("").sort((a, b) => Math.random() - 0.5);

	while (init_word.join("") == answer) {
		init_word = answer.split("").sort((a, b) => Math.random() - 0.5);
	}
}

function start() {
	kb_buttons.forEach((button) => {
		if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(button.innerHTML)) {
			if (answer.includes(button.innerHTML)) {
				button.addEventListener("click", buttonType);
				button.setAttribute("letter", button.innerHTML.toString());
			} else {
				button.style.opacity = 0.15;
			}
		} else {
			button.addEventListener("click", buttonType);
			button.setAttribute("letter", button.innerHTML.toString());
		}
	});

	for (let i of init_word) {
		typeLetter(i);
	}

	typeLetter("ENTER");

	updateTimer();

	timerInterval = setInterval(updateTimer, 1000);
}

setTimeout(() => {
	if (document.querySelector(".how_to").style.display != "flex") {
		start();
	} else {
		document.getElementById("how_to-close-button").addEventListener("click", start);
	}
}, 10);
