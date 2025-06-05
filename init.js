const header = document.querySelector("header");
const footer = document.querySelector("footer");

const url = new URL(document.baseURI).origin;

header.innerHTML = `
<h1>Lokalsi Tarnów</h1>
<button id="search"><img class="icon" src="${url}/searchIcon.png"></button>
`;
footer.innerHTML = `
<div class="footer-option">a</div>
<div class="footer-option">d</div>
<div class="footer-option">c</div>`;
