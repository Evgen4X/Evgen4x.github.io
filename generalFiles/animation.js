function bootUpAnimation() {
	const bootup = document.getElementById("bootup");
	const text = document.getElementById("bootup-text");
	if (sessionStorage.getItem("booted")) {
		for (let i = 0; ++i < 50; gen());
		setInterval(anim, 40);
		setInterval(gen, 200);
		generation();
		bootup.style.display = "none";
		canvas.style.display = "block";
	} else {
		sessionStorage.setItem("booted", "booted");
		setTimeout(() => {
			text.style.fontSize = emulatorType == "android" ? "20vw" : "30vh";
			bootup.animate([{backgroundColor: "#000000"}, {backgroundColor: "#222222"}], {duration: 100, fill: "forwards"});
			setTimeout(() => {
				text.animate([{opacity: 0}, {opacity: 1}, {opacity: 1}, {opacity: 1}, {opacity: 1}, {opacity: 1}, {opacity: 0}], {
					duration: 2500,
					fill: "forwards",
				});
				setTimeout(() => {
					canvas.style.display = "block";
					for (let i = 0; ++i < 50; gen());
					setInterval(anim, 40);
					setInterval(gen, 200);
					generation();
					bootup.animate([{opacity: 1}, {opacity: 0}], {duration: 250});
					setTimeout(() => {
						bootup.style.display = "none";
					}, 250);
				}, 2750);
			}, 1500);
		}, 1000);
	}
}

function anim() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, CWidth, CHeight);
	ctx.strokeStyle = "#aaaaaa";
	ctx.fillStyle = "#aaaaaa";
	bubbles.forEach((bubble, i) => {
		ctx.beginPath();
		ctx.arc(bubble[0], bubble[1], bubble[2], 0, Math.PI * 2);
		ctx.fill();
		bubble[0] += bubble[3];
		bubble[1] += bubble[4];

		if (bubble[2] < 10 && Math.random() < 0.01) {
			++bubble[2];
		}

		if (bubble[5] != -1) {
			let bub = bubbles[bubble[5]];

			if (Math.sqrt(Math.pow(bub[0] - bubble[0], 2) + Math.pow(bub[1] - bubble[1], 2)) < 11) {
				bubbles.forEach((b) => {
					if (b[5] > bubbles.indexOf(bub)) {
						--b[5];
					}
				});
				bubble[2] = (bubble[2] + bub[2]) / 1.05;
				bubbles.splice(bubbles.indexOf(bub), 1);
				bubble[5] = -1;

				if (bubble[2] > 15) {
					bubbles.forEach((b) => {
						if (b[5] > i) {
							--b[5];
						}
					});

					//bounds at size of 15: 2-5; at size of 26: 7-13
					let n = Math.floor(Math.random() * (0.196 * bubble[2] - 0.3) + (0.454 * bubble[2] - 4.8));
					let basis = Math.random() * 2 * Math.PI;
					let speed = Math.random() * 5 + 2;

					for (let j = 0; j < n; ++j) {
						bubbles.push([
							bubble[0],
							bubble[1],
							Math.floor(bubble[2] / n),
							Math.cos(basis + (2 * j * Math.PI) / n) * speed,
							Math.sin(basis + (2 * j * Math.PI) / n) * speed,
							-1,
						]);
					}

					bubbles.splice(bubbles.indexOf(bubble), 1);
				}

				return;
			}

			ctx.beginPath();
			ctx.moveTo(bubble[0], bubble[1]);
			ctx.lineTo(bub[0], bub[1]);
			ctx.stroke();

			let distX = bubble[0] - bub[0];
			let distY = bubble[1] - bub[1];

			bub[3] = distX / 20;
			bub[4] = distY / 20;
			bubble[3] = -distX / 20;
			bubble[4] = -distY / 20;
		}

		if (Math.random() < 0.07) {
			bubble[3] += Math.random() * 2 - 1;
			bubble[4] += Math.random() * 2 - 1;
		}

		bubble[3] = Math.min(10, bubble[3]);
		bubble[3] = Math.max(-10, bubble[3]);

		bubble[4] = Math.min(10, bubble[4]);
		bubble[4] = Math.max(-10, bubble[4]);

		if (bubble[0] < 0) {
			bubble[0] = CWidth - bubble[2];
		} else if (bubble[0] > CWidth) {
			bubble[0] = 5;
		}

		if (bubble[1] < 0) {
			bubble[1] = CHeight - bubble[2];
		} else if (bubble[1] > CHeight) {
			bubble[1] = 5;
		}

		if (bubble[5] == -1 && Math.random() < 0.01) {
			let closest = bubbles[0];
			let index = -1;
			bubbles.forEach((bub, i) => {
				if (
					bub[5] == -1 &&
					bub != bubble &&
					Math.pow(bub[0] - bubble[0], 2) + Math.pow(bub[1] - bubble[1], 2) <
						Math.pow(closest[0] - bubble[0], 2) + Math.pow(closest[1] - bubble[1], 2)
				) {
					closest = bub;
					index = i;
				}
			});

			if (index != -1) {
				bubble[5] = index;
				bubbles[index][5] = i;
			}
		}
	});
}

function gen() {
	if (bubbles.length > 100) {
		//prevents overflowing
		bubbles.forEach((bubble) => {
			if (bubble[5] > 35) {
				bubble[5] = -1;
			}
		});
		bubbles.splice(35);
	}
	let bubble = [
		Math.random() * CWidth, //x
		Math.random() * CHeight, //y
		Math.random() * 4 + 1, //size
		Math.random() * 2 - 1, //speed x
		Math.random() * 2 - 1, //speed y
		-1, //connection
	];

	bubbles.push(bubble);
}

function mouseMoved(event) {
	let x = event.clientX;
	let y = event.clientY;

	bubbles.forEach((bubble) => {
		if (Math.sqrt(Math.pow(bubble[0] - x, 2) + Math.pow(bubble[1] - y, 2)) <= 150) {
			bubble[3] = (x - bubble[0]) / 20;
			bubble[4] = (y - bubble[1]) / 20;
		}
	});
}

var bubbles = [];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var CWidth = window.innerWidth;
var CHeight = window.innerHeight;

window.onresize = () => {
	CWidth = window.innerWidth;
	CHeight = window.innerHeight;
	canvas.setAttribute("width", CWidth);
	canvas.setAttribute("height", CHeight);
};

// document.querySelectorAll("*").forEach((el) => {
// 	el.onmousemove = mouseMoved;
// });

canvas.setAttribute("width", CWidth);
canvas.setAttribute("height", CHeight);

var emulatorType;
if (screen.width < screen.height) {
	emulatorType = "android";
} else {
	emulatorType = "windows";
}

bootUpAnimation();
