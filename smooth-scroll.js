const anchor = document.getElementById("scroll-anchor");
anchor.style.top = document.querySelector("main").getBoundingClientRect().height + "px";
console.warn(anchor.style.top);
document.onscrollend = () => {
	console.log(pageYOffset - anchor.getBoundingClientRect().y);
	if (pageYOffset - anchor.getBoundingClientRect().y + anchor.getBoundingClientRect().height > 0) {
		anchor.scrollIntoView({behavior: "smooth"});
	}
};
