function cancel() {
	let elements = document.getElementsByTagName("input");
	for (let i = 0; i < elements.length; i++) {
		console.log(elements[i]);
		if (elements[i].value != "") {
			if (!confirm("Jesteś pewien, że chcesz anulować? Wprowadzone dane zostaną utracone.")) {
				return;
			}
			break;
		}
	}
	elements = document.getElementsByTagName("textarea");
	if (elements[0].value != "") {
		if (!confirm("Jesteś pewien, że chcesz anulować? Wprowadzone dane zostaną utracone.")) {
			return;
		}
	}
	window.open("../", "_self");
}
