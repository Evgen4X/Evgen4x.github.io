const data = {
	minePercent: 0.3,
	width: 10,
	height: 10,
	size: function () {
		return this.width * this.height;
	},
};

function saveSettings() {
	const settings = ["mine-percent"];
	for (let i of settings) {
		let val = document.querySelector(`input#${i}`);
		localStorage.setItem(i, val);
	}

	localStorage.setItem("showSettings", "true");
	window.location.reload();
}
