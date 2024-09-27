function generate(cols, rows) {
	let html = "";
	for (let i = 1; i <= cols; i++) {
		html += `<div class="brd_row vertical" index="${i}">`;
		for (let j = 1; j <= cols; j++) {
			html += `<button class="letter" index="${j}"></button>`;
		}
		html += `</div>`;
	}

	document.querySelector(".mainboard").innerHTML = html;
	letters_number = cols;

	html = `<div class="brd_row" index="${cols + 1}">`;

	for(let i = 1; i <= cols; ++i){
		html += `<button class="letter" index="${i}"></button>`;
	}
	html += '</div>';

	document.querySelector('.subboard').innerHTML = html;

	let alphabet = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"];
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
			console.log(kbd);
		}
	}
}



function msg_alert(msg, time) {
	let msgbox = document.querySelector("#alert"),
		spanbox = document.querySelector("#alert #alert-span");
	spanbox.textContent = msg;
	msgbox.animate([{top: "-12%"}, {top: "0"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.4, 1)"});
	setTimeout(() => {
		msgbox.animate([{top: "0"}, {top: "-12%"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.5, 1)"});
	}, time);
}

function new_game() {
	let url = new URL(window.location.href);
	url.searchParams.delete("word");
	window.location.href = url;
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

function get_link() {
	let text = document.getElementById("link_input").value.toUpperCase();
	if (text.length < 3 || text.length > 15) {
		msg_alert("The word must be between 3 and 15 symbols long!", 3000);
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
	link.textContent = "Link is here";
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

function show_how_to() {
	document.querySelector(".how_to").style.display = "flex";
}

function hide_letter(event) {
	const target = event.target;
	if (target.style.opacity == "0") {
		target.style.opacity = "1";
	} else {
		target.style.opacity = "0";
	}
}

function hide_all() {
	let target = brd_letters[0].style.opacity == "1" ? "0" : "1";
	brd_letters.forEach((letter) => {
		letter.style.opacity = target;
	});
	document.getElementById("hide_all").textContent = ["Show all letters", "Hide all letters"][parseInt(target)];
	close_all();
}

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


show_how_to();

const params = new URL(window.location.href).searchParams;
var answer, check_dict, letters_number;

if (params.get("length") == null) {
	generate(5, 6);
} else if (params.get("word") != null) {
	generate(params.get("word").length / 2, 6);
	msg_alert("That wordle may not use standart dictionary!", 7500);
} else {
	generate(parseInt(params.get("length")), 6);
}