const header = document.querySelector("header");
const footer = document.querySelector("footer");

function addOption(src, srcimg) {
	let text = `<div class="footer-option"><a href="${src}"><img src="${srcimg}"`;
	console.log(href, url + src);
	if (href == url + src || href == url + src + "/") {
		text += ` class="footer-img-focus"`;
	}
	text += `></a></div>`;

	return text;
}

const url = new URL(document.baseURI).origin;
const href = new URL(document.baseURI).href;

if (header) {
	header.innerHTML = `
<h1>Lokalsi Tarnów</h1>
<div id="header-buttons">
	<button class="button" style='background-color: transparent;' onclick="setEstate('NowaWartosc')"><img src="${url}/icons/tarnow-icon.png" alt="herb tarnowa" /></button>
</div>
`;
	//<button id="search" class="button"><img class="icon" src="${url}/icons/searchIcon.png"></button>
}
if (footer) {
	footer.style.height = "7vh";
	// 	footer.innerHTML = `
	// <div class="footer-option"><a href="/"><img src="/icons/eventsIcon.png"></a></div>
	// <div class="footer-option">d</div>
	// <div class="footer-option"><a href="/profile"><img src="/icons/profileIcon.png"></a></div>`;
	footer.innerHTML += addOption("/notexists", "/icons/eventsIcon.png");
	footer.innerHTML += addOption("/", "/icons/eventsIcon.png");
	footer.innerHTML += addOption("/profile", "/icons/profileIcon.png");
}
