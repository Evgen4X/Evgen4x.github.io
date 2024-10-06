function generateContainer(name, href, text = "Go") {
	let el = document.createElement("div");
	el.id = name;
	el.classList.add("container");
	el.innerHTML = `
        <a class="element" id="${name.toLowerCase().replace(/ /g, "-")}" href="${href}">
            <h3>${name}</h3>
            <div class="screenshot"></div>
            <div class="button">${text}</div>
        </a>
    `;

	return el;
}
