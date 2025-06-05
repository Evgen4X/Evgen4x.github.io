const button = document.getElementById("password-show");
const input = document.querySelector("input[type='password']");
button.setAttribute("show", "0");
button.onclick = () => {
	if (button.getAttribute("show") == "0") {
		button.setAttribute("show", "1");
		input.setAttribute("type", "text");
	} else {
		button.setAttribute("show", "0");
		input.setAttribute("type", "password");
	}
};
