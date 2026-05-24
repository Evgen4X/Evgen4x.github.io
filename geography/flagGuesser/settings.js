const settings = document.getElementById("settings");

function toggleSettingsDisplay() {
	settings.style.display = settings.style.display == "none" ? "flex" : "none";
}

document.getElementById("settings-button").onclick = toggleSettings;
