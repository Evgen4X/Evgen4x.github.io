function toggleSettings() {
	settings.style.display = settings.style.display == "none" ? "flex" : "none";
}

function openLink(link) {
	open("https://" + link, "_blank"); //not working in HTML for some reason
}

function settingsSave() {
	//TODO: create settings
	settings.style.display = "none";
}

const settings = document.getElementById("settings");
settings.style.display = "none"; //must be set in js
