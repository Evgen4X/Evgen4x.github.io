const html = document.querySelector("html");
html.classList.add(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

function toggleMode() {
	html.classList.toggle("dark");
	html.classList.toggle("light");
	localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
}

function CURRENT_THEME() {
	return html.classList.contains("dark") ? "dark" : "light";
}
