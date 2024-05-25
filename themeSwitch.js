const html = document.querySelector("html");
html.classList.add(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

const toggle = document.getElementById("theme-switch");

toggle.onclick = () => {
	html.classList.toggle("dark");
	html.classList.toggle("light");
	localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
};
