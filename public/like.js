function likeClicked(announceId) {
	const likeButton = document.querySelector(`.announce[announceId="${announceId}"] .announceContent .bar .likeButton`);
	var on;
	likeButton.childNodes.forEach((node) => {
		if (node.nodeName == "IMG") {
			if (node.src.includes("Off")) {
				node.src = node.src.replace("Off", "On");
				on = true;
			} else {
				node.src = node.src.replace("On", "Off");
				on = false;
			}
		} else if (node.nodeName == "P") {
			node.innerHTML = parseInt(node.innerHTML) + (on ? 1 : -1);
		}
	});
}
