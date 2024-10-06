const settingsButton = document.getElementById("settings-button");
const settings = document.getElementById("settings");
settingsButton.onclick = () => {
	settings.style.display = "flex";
};

const numberOfBlocksInput = document.getElementById("number-of-blocks");
numberOfBlocksInput.oninput = () => {
	let val = parseInt(numberOfBlocksInput.value);
	if (val < 2) {
		val = 2;
	}
	if (val > 10) {
		val = 10;
	}
	numberOfBlocksInput.value = val;
	localStorage.setItem("number-of-blocks", val);
};
