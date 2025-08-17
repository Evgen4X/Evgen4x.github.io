const HARD_MODE = "wordleHardMode";
const SHORT_MESSAGE_TIME = 2500;
var LETTER_NAME = "letter"; // used in alerts, "number" for numberle

var kb_buttons, brd_rows, brd_letters, letters_number, known_letters;

function hide_letter(event) {
	const target = event.target;
	if (target.style.opacity == "0") {
		target.style.opacity = "1";
	} else {
		target.style.opacity = "0";
	}
}

function generate(cols, rows, alphabet_, breakpoints) {
	known_letters = {green: new Array(cols), yellow: {}};
	let html = "";
	for (let i = 1; i <= rows; i++) {
		html += `<div class="brd_row" index="${i}">`;
		for (let j = 1; j <= cols; j++) {
			html += `<button class="letter" index="${j}"></button>`;
		}
		html += `</div>`;
	}
	document.querySelector(".mainboard").innerHTML = html;
	letters_number = cols;

	if (alphabet_ == null || alphabet_.length == 0) {
		alphabet_ = [
			"Q",
			"W",
			"E",
			"R",
			"T",
			"Y",
			"U",
			"I",
			"O",
			"P",
			"A",
			"S",
			"D",
			"F",
			"G",
			"H",
			"J",
			"K",
			"L",
			"ENTER",
			"Z",
			"X",
			"C",
			"V",
			"B",
			"N",
			"M",
			"⌫",
		];
		answers = answers.filter((answer) => answer.length == cols);
		if (params.get("word") == null) {
			answer = answers[Math.floor(Math.random() * answers.length)];
		} else {
			answer = decode(params.get("word"));
			msg_alert("That wordle <b><i>may</i></b> not use standart dictionary!", 7500);
		}
		check_dict = answers.includes(answer);
	} else {
		answers = null;
		check_dict = false;
	}

	if (breakpoints == null) {
		breakpoints = "PL⌫";
	}

	var kbd = document.getElementById("keyboard");
	var row = document.createElement("div");
	row.classList.add("kb_row");
	for (let i of alphabet_) {
		let letter = document.createElement("button");
		letter.classList.add("kb_key");
		letter.innerHTML = i;
		if (i == "ENTER") {
			letter.setAttribute("style", "aspect-ratio: 2 / 1");
		}
		row.appendChild(letter);
		if (breakpoints.includes(i)) {
			kbd.appendChild(row);
			row = document.createElement("div");
			row.classList.add("kb_row");
		}
	}

	kb_buttons = document.querySelectorAll(".kb_key");
	brd_rows = document.querySelectorAll(".brd_row");
	brd_rows[0].setAttribute("status", "active");
	brd_letters = document.querySelectorAll(".letter");
	brd_letters[0].setAttribute("status", "active");

	brd_letters.forEach((letter) => {
		letter.addEventListener("click", hide_letter);
	});

	return alphabet_;
}

function hide_all() {
	let target = brd_letters[0].style.opacity == "1" ? "0" : "1";
	brd_letters.forEach((letter) => {
		letter.addEventListener("click", hide_letter);
	});

	answers = answers.filter((answer) => answer.length == cols);
}

function encode(text) {
	let ans = "",
		n,
		chr;
	for (let i of text) {
		chr = i.charCodeAt(0);
		n = Math.floor(Math.random() * (chr - 33));
		ans += String.fromCharCode(chr - n) + String.fromCharCode(chr + n);
	}
	return ans;
}

function decode(text) {
	let ans = "",
		s1,
		s2;
	for (let i = 0; i < text.length; i += 2) {
		s1 = text[i].charCodeAt(0);
		s2 = text[i + 1].charCodeAt(0);
		ans += String.fromCharCode((s1 + s2) / 2);
	}
	return ans;
}

function msg_alert(msg, time) {
	let msgbox = document.querySelector("#alert"),
		spanbox = document.querySelector("#alert #alert-span");
	spanbox.innerHTML = msg;
	msgbox.animate([{top: "-12%"}, {top: "0"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.4, 1)"});
	setTimeout(() => {
		msgbox.animate([{top: "0"}, {top: "-12%"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.5, 1)"});
	}, time);
}

function show_settings() {
	document.querySelector(".settings").style.display = "flex";
}

function show_custom() {
	document.querySelector(".custom").style.display = "flex";
}

function show_add_report() {
	document.querySelector(".add-report").style.display = "flex";
}

function set_first() {
	document.querySelector('.brd_row[status="active"] .letter[index="1"]').setAttribute("status", "active");
}

function new_game() {
	let url = new URL(window.location.href);
	url.searchParams.delete("word");
	if (url.searchParams.get("scrumble")) {
		url.searchParams.delete("scrumble");
	}
	window.location.href = url;
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
	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.innerHTML = "Link is here";
	return;
}

const addReportInput = document.getElementById("add-report-input");

if (addReportInput) {
	addReportInput.onchange = () => {
		document.getElementById(
			"add-report-link"
		).href = `https://mail.google.com/mail/?view=cm&fs=1&to=y.maskaiev.5555@gmail.com&body=Hello!%0DI was playing your beautiful Worlde games and found out that a word was missing from the dictionary ;(%0DCould you please add this word:%20${addReportInput.value}%0D%0DThanks in advance!%20Best wishes!`;
	};
}

function close_all() {
	document.querySelectorAll(".absolute").forEach((el) => {
		el.style.display = "none";
	});
}

function show_how_to(name) {
	let sht = sessionStorage.getItem("shownHowTo");
	if (!sht || !sht.split(";").includes(name)) {
		document.querySelector(".how_to").style.display = "flex";
		if (name) {
			sessionStorage.setItem("shownHowTo", sht + ";" + name);
		}
	}
}

function hide_all() {
	let target = brd_letters[0].style.opacity == "1" ? "0" : "1";
	brd_letters.forEach((letter) => {
		letter.style.opacity = target;
	});
	document.getElementById("hide_all").innerHTML = ["Show all letters", "Hide all letters"][parseInt(target)];
	close_all();
}

function toggle_hard_mode() {
	if (localStorage.getItem(HARD_MODE) == "off") {
		localStorage.setItem(HARD_MODE, "on");
		hardModeButton.setAttribute("state", "on");
		hardModeButton.innerHTML = "Hard mode";
	} else {
		localStorage.setItem(HARD_MODE, "off");
		hardModeButton.setAttribute("state", "off");
		hardModeButton.innerHTML = "Normal mode";
	}
}

function init_toggle_buttons() {
	if (!localStorage.getItem(HARD_MODE)) {
		localStorage.setItem(HARD_MODE, "off");
	}
	if (localStorage.getItem(HARD_MODE) == "off") {
		hardModeButton.setAttribute("state", "off");
		hardModeButton.innerHTML = "Normal mode";
	} else {
		hardModeButton.setAttribute("state", "on");
		hardModeButton.innerHTML = "Hard mode";
	}
}

const hardModeButton = document.getElementById("hard-mode-button");

var alphabet = [
	"Q",
	"W",
	"E",
	"R",
	"T",
	"Y",
	"U",
	"I",
	"O",
	"P",
	"A",
	"S",
	"D",
	"F",
	"G",
	"H",
	"J",
	"K",
	"L",
	"ENTER",
	"Z",
	"X",
	"C",
	"V",
	"B",
	"N",
	"M",
	"⌫",
];
