const settings = document.getElementById("settings");
settings.style.display = "none";

function toggleSettingsDisplay() {
	settings.style.display = settings.style.display == "none" ? "flex" : "none";
}

document.getElementById("settings-button").onclick = toggleSettingsDisplay;
