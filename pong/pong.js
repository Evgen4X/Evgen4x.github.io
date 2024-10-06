class Player {
	constructor(x) {
		this.x = x;
		this.y = (3 * height) / 8;
		this.speed = 8;
		this.events = {};
	}

	resize() {
		this.width = width / 65;
		this.height = height / 4;
		this.y = Math.min(this.y, height - this.height);
	}

	update(ctx) {
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class Ball {
	constructor(x, y, r, speed) {
		this.r = r;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedMultiplier = 4;
		this.events = {lastTimeHitY: true, lastTimeHitX: true, teleport: true};
	}

	update(ctx) {
		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 360);
		ctx.fill();

		this.x += this.speed[0] * this.speedMultiplier;
		this.y += this.speed[1] * this.speedMultiplier;

		if (this.events["lastTimeHitY"] && (this.y <= 0 || this.y >= height - this.r)) {
			this.speed[1] = -this.speed[1];
			this.events["lastTimeHitY"] = false;
			setTimeout(() => {
				this.events["lastTimeHitY"] = true;
			}, 500);
		}
	}
}

class PowerUp {
	constructor(x, y, img, color) {
		this.x = x;
		this.y = y;
		this.img = new Image(height / 50, height / 50);
		this.img.src = img;
		this.color = color;
	}

	update(ctx) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r);
		ctx.fill();
		ctx.drawImage(this.img, this.x - this.r, this.y - this.r, this.r * 1.5, this.r * 1.5);
	}
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight * 0.86;
canvas.width = width;
canvas.height = height;

function update() {
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, width);

	//update of p1
	if (keys["W"]) {
		p1.y -= p1.speed;
	}
	if (keys["S"]) {
		p1.y += p1.speed;
	}

	p1.y = Math.max(-1, Math.min(p1.y, height - p1.height));
	p1.update(ctx);

	//update of p2
	if (keys["ARROWUP"]) {
		p2.y -= p2.speed;
	}
	if (keys["ARROWDOWN"]) {
		p2.y += p2.speed;
	}

	p2.y = Math.max(-1, Math.min(p2.y, height - p2.height));
	p2.update(ctx);

	//update of balls
	balls.forEach((ball) => {
		ball.update(ctx);
		if (ball.events["lastTimeHitX"]) {
			[p1, p2].forEach((player) => {
				if (player.x <= ball.x + ball.r && ball.x - ball.r <= player.x + player.width + 1 && player.y <= ball.y - ball.r && ball.y <= player.y + player.height) {
					ball.speed[0] = -ball.speed[0];
					ball.speed[1] = Math.sin((Math.PI * (ball.y - player.y - player.height / 2)) / player.height);
					ball.events["lastTimeHitX"] = false;
					setTimeout(() => {
						ball.events["lastTimeHitX"] = true;
					}, 500);
					ball.speedMultiplier += 1;
				}
			});
		}

		if ((ball.y <= 0 || ball.y >= height - 2 * ball.r) && ball.events["teleport"]) {
			ball.y = Math.max(0, Math.min(ball.y, height - 2 * ball.r));
			ball.events["teleport"] = false;
			setTimeout(() => {
				ball.events["teleport"] = true;
			}, 200);
		}
	});

	//update of power-ups
	if (Math.random() < 0.2) {
		// let powerup = new PowerUp(width / 2 + (Math.random() * width) / 10, (Math.random() * height) / 1.25, powerups[index][0], powerups[index][1]);
	}
}

function restart() {
	p1.resize();
	p1.x = width / 10;
	p2.resize();
	p2.x = (9 * width) / 10;
	let speedX = Math.random() > 0.5 ? 1 : -1;
	let speedY = Math.random() > 0.5 ? 1 : -1;
	balls = [new Ball(width / 2 - height / 60, height / 2 - height / 60, height / 60, [speedX, speedY])];
	interval = setInterval(update, 20);
}

const p1 = new Player(width / 10);
const p2 = new Player((9 * width) / 10);
var balls = [];
var powerups = [];
const availablePowerUps = [];

var keys = {};

document.addEventListener("keydown", (event) => {
	const key = event.key.toUpperCase();
	keys[key] = true;

	if (!/F..?/.test(key)) {
		event.preventDefault();
	}
});

document.addEventListener("keyup", (event) => {
	const key = event.key.toUpperCase();
	keys[key] = false;

	if (!/F..?/.test(key)) {
		event.preventDefault();
	}
});

window.onresize = () => {
	width = window.innerWidth;
	height = window.innerHeight * 0.86;
	canvas.width = width;
	canvas.height = height;
	p1.resize();
	p2.resize();
	p1.x = width / 10;
	p2.x = (9 * width) / 10;
};

var interval;
restart();
