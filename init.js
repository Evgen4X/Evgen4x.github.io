const header = document.querySelector("header");
const footer = document.querySelector("footer");

const url = new URL(document.baseURI).origin;
if (header) {
	header.innerHTML = `
<h1>Lokalsi Tarnów</h1>
<div id="header-buttons">
    <button id="search" class="button"><img class="icon" src="${url}/searchIcon.png"></button>
	<a href="/add_event/add_event.html"><button class="button">Dodaj Event</button></a>
	<button class="button"><img src="${url}/tarnow-icon.png" alt="herb tarnowa" /></button>
</div>
`;
}
if (footer) {
	footer.innerHTML = `
<div class="footer-option">eventy</div>
<div class="footer-option">d</div>
<div class="footer-option">profil</div>`;
}
