function get_link() {
	let text = document.getElementById("link_input").value.toUpperCase();
	if (text.length < 1 || text.length > 20) {
		msg_alert("The number must be between 1 and 20 digits long!", 3000);
		return;
	}
	for (let i of text) {
		if (!"1234567890".includes(i)) {
			msg_alert("Invalid number! Use numbers only!", 3000);
			return;
		}
	}
	let url = new URL(window.location.href);
	url.searchParams.set("number", encode(text));
	url.searchParams.set("length", text.length);
	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.textContent = "Link is here";
	return;
}
