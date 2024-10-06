class Block {
	constructor(x, y, width, height, mass, color, borderColor, borderWidth) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.w = Math.floor(width);
		this.h = Math.floor(height);
		this.m = mass;
		this.color = color;
		this.color2 = borderColor;
		this.border = false;
		this.borderWidth = borderWidth;
		this.v = [0, 0];
		this.a = [0, 0];
		//                 x-wall,y-wall,block
		this.lastTimeHit = [true, true, true]; //false means that it was at least several ticks ago
	}

	drawRect(ctx) {
		let tmp = ctx.fillStyle;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = tmp;
		if (this.border) {
			tmp = ctx.strokeStyle;
			let tmp2 = ctx.lineWidth;
			ctx.lineWidth = this.borderWidth;
			ctx.strokeStyle = this.color2;
			ctx.strokeRect(this.x - this.borderWidth + 1, this.y - this.borderWidth + 1, this.w + this.borderWidth, this.h + this.borderWidth);
			ctx.strokeStyle = tmp;
			ctx.lineWidth = tmp2;
		}
	}

	pointCollides(x, y) {
		return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
	}

	blockCollides(block) {
		return this.pointCollides(block.x, block.y) || this.pointCollides(block.x + block.w, block.y) || this.blockCollides(block.x, block.y + block.h) || this.blockCollides(block.x + block.w, block.y + block.h);
	}
}

function update() {
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = html.classList.contains("dark") ? "#393939" : "#eeeeee";
	ctx.fillRect(0, 0, width, height);
	blocks.forEach((block) => {
		block.x += block.v[0];
		block.y += block.v[1];
		if (block.lastTimeHit[0] && (block.x < block.v[0] || block.x > width - block.v[0] - block.w)) {
			block.v[0] = -block.v[0];
			block.lastTimeHit[0] = false;
			setTimeout(() => {
				block.lastTimeHit[0] = true;
			}, 80);
		}
		if (block.lastTimeHit[1] && (block.y < block.v[1] || block.y > height - block.v[1] - block.h)) {
			block.v[1] = -block.v[1];
			block.lastTimeHit[1] = false;
			setTimeout(() => {
				block.lastTimeHit[1] = true;
			}, 80);
		}

		if (block.lastTimeHit[2]) block.drawRect(ctx);
	});
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight * 0.83;
canvas.width = width;
canvas.height = height;
var buttons = {};

var blocks = [];
if (localStorage.getItem("number-of-blocks")) {
	let max = parseInt(localStorage.getItem("number-of-blocks"));
	for (let i = 0; i < max; ++i) {
		let color = "#";
		for (let _ = 0; _ < 6; ++_) {
			color += "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
		}
		blocks.push(new Block((width * (i + 1)) / (max + 2), (height * (i + 1)) / (max + 2), height / Math.max(max, 5) - 10, height / Math.max(5, max) - 10, 100, color, "#ffffff", 3));
	}
}

document.addEventListener("keydown", (event) => {
	const key = event.key.toUpperCase();
	buttons[key] = true;

	if (!/F..?/.test(key)) {
		event.preventDefault();
	}
});

document.addEventListener("keyup", (event) => {
	const key = event.key.toUpperCase();
	buttons[key] = false;
});

document.onwheel = (event) => {
	blocks
		.filter((block) => block.border)
		.forEach((block) => {
			let val = event.deltaY / Math.abs(event.deltaY);
			console.log(val);
			if (buttons["CONTROL"]) {
				if (buttons["SHIFT"]) {
					block.y += val * 2;
				} else {
					block.x += val * 2;
				}
			} else {
				if (buttons["SHIFT"]) {
					block.v[1] += val;
				} else {
					block.v[0] += val;
				}
			}
		});

	event.preventDefault();
};

canvas.onclick = (event) => {
	const x = event.clientX;
	const y = event.clientY - canvas.getBoundingClientRect().y;

	blocks.forEach((block) => {
		if (block.border && !buttons["shift"]) {
			block.border = false;
		}
		if (block.pointCollides(x, y)) {
			block.border = true;
		}
	});
};

const updater = setInterval(update, 40);
