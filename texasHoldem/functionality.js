function toggleSettings() {
	settings.style.display = settings.style.display == "none" ? "flex" : "none";
	if (settings.style.display == "flex") {
		localStorage.setItem("number-of-players", document.getElementById("number-of-players").value);
	}
}

function openLink(link) {
	open("https://" + link, "_blank"); //not working in HTML for some reason
}

const settings = document.getElementById("settings");
settings.style.display = "none"; //must be set in js
