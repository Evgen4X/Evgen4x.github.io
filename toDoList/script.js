function setCookie(name, value, time) {
	const d = new Date();
	d.setTime(d.getTime() + time * 24 * 3600 * 1000);
	document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
	let val = undefined;
	document.cookie.split(/; /g).forEach((part) => {
		let [n, value] = part.split("=");
		console.log({n, value, part});
		if (n == name) {
			val = value;
		}
	});

	return val;
}

/**
 *
 * @param {string} val - timestamp (number)\\\\description (// - line break, **...** - bold, ~~...~~ - italic)\\\\tags (// - separator)
 * @returns {object} - {date: Date(), desc: description, tags: tags (array)}
 */
function getData(val) {
	let [date, desc, tags] = val.split("\\\\");
	const d = new Date(parseInt(date));

	let opened = [];

	let description = "";

	for (let i = 0; i < desc.length; ++i) {
		if (desc[i] == "*" && desc[i + 1] == "*") {
			if (desc[i - 1] != "\\") {
				if (opened[0] == "**") {
					description += "</b>";
					opened.shift();
					++i;
				} else {
					description += "<b>";
					++i;
					opened.unshift("**");
				}
			} else {
				description = description.slice(0, description.length - 1) + "*";
			}
		} else if (desc[i] == "~" && desc[i + 1] == "~") {
			if (desc[i - 1] != "\\") {
				if (opened[0] == "~~") {
					description += "</i>";
					opened.shift();
					++i;
				} else {
					description += "<i>";
					++i;
					opened.unshift("~~");
				}
			} else {
				description = description.slice(0, description.length - 1) + "~";
			}
		} else {
			description += desc[i];
		}
	}

	return {date: d, desc: description.replace(/\/\/\/\//g, "<br>"), tags: tags.split("//")};
}

if (navigator.cookieEnabled) {
} else {
}

console.log(new Date().getTime());

const aside = document.querySelector("aside");
