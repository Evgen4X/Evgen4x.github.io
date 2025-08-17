function hide_letter(event) {
	const target = event.target;
	if (target.style.opacity == "0") {
		target.style.opacity = "1";
	} else {
		target.style.opacity = "0";
	}
}

function generate(cols, rows) {
	let html = "";
	for (let i = 1; i <= rows; i++) {
		html += `<div class="brd_row" index="${i}">`;
		if (i == 6) {
			html += `<span>Nothing: just play a normal wordle!</span><div class="event"><img src="normal.png"></div>`;
		} else {
			html += `<span></span><div class="event"></div>`;
		}
		for (let j = 1; j <= cols; j++) {
			html += `<button class="letter" index="${j}"></button>`;
		}
		html += `</div>`;
	}
	document.querySelector(".mainboard").innerHTML = html;
	letters_number = cols;

	var kbd = document.getElementById("keyboard");
	var row = document.createElement("div");
	row.classList.add("kb_row");
	for (let i of alphabet) {
		let letter = document.createElement("button");
		letter.classList.add("kb_key");
		letter.innerHTML = i;
		if (i == "ENTER") {
			letter.setAttribute("style", "aspect-ratio: 2 / 1");
		}
		row.appendChild(letter);
		if ("PL⌫".includes(i)) {
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

	answers = answers.filter((answer) => answer.length == cols);

	if (params.get("word") == null) {
		answer = answers[Math.floor(Math.random() * answers.length)];
	} else {
		answer = decode(params.get("word"));
		msg_alert("That wordle may not use standart dictionary!", 7500);
	}
	check_dict = answers.includes(answer);
}

function encode(text) {
	let ans = "",
		n,
		chr;
	for (let i of text) {
		n = Math.floor(Math.random() * 30);
		chr = i.charCodeAt(0);
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

function encode(text) {
	let ans = "",
		n,
		chr;
	for (let i of text) {
		n = Math.floor(Math.random() * 30);
		chr = i.charCodeAt(0);
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

function hide_all() {
	let target = brd_letters[0].style.opacity == "1" ? "0" : "1";
	brd_letters.forEach((letter) => {
		letter.style.opacity = target;
	});
	document.getElementById("hide_all").innerHTML = ["Show all letters", "Hide all letters"][parseInt(target)];
	close_all();
}

function get_link() {
	let text = document.getElementById("link_input").value.toUpperCase();
	if (text.length != 5) {
		msg_alert("The word must be 5 symbols long!", 3000);
		return;
	}
	for (let i of text) {
		if (!"QAZWSXEDCRFVTGBYHNUJMIKOLP".includes(i)) {
			msg_alert("Invalid word!", 3000);
			return;
		}
	}
	let url = new URL(window.location.href);
	url.searchParams.set("word", encode(text));
	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.innerHTML = "Link is here";
	return;
}

function show_settings() {
	document.querySelector(".settings").style.display = "flex";
}

function show_custom() {
	document.querySelector(".custom").style.display = "flex";
}

function close_all() {
	document.querySelectorAll(".absolute").forEach((el) => {
		el.style.display = "none";
	});
}

function show_add_report() {
	document.querySelector(".add-report").style.display = "flex";
}

const addReportInput = document.getElementById("add-report-input");

addReportInput.onchange = () => {
	document.getElementById(
		"add-report-link"
	).href = `https://mail.google.com/mail/?view=cm&fs=1&to=y.maskaiev.5555@gmail.com&body=Hello!%0DI was playing your beautiful Worlde games and found out that a word was missing from the dictionary ;(%0DCould you please add this word:%20${addReportInput.value}%0D%0DThanks in advance!%20Best wishes!`;
};

function show_how_to(name) {
	let sht = sessionStorage.getItem("shownHowTo");
	if (!sht || !sht.split(";").includes(name)) {
		document.querySelector(".how_to").style.display = "flex";
		if (name) {
			sessionStorage.setItem("shownHowTo", sht + ";" + name);
		}
	}
}

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

const params = new URL(window.location.href).searchParams;
var answer, check_dict;

if (params.get("length") == null) {
	generate(5, 6);
} else if (params.get("word") != null) {
	generate(params.get("word").length / 2, 6);
} else {
	generate(parseInt(params.get("length")), 6);
}
