function getRightmostBallAfter(balls, x) {
	let ans;
	let ansX = canvas.width;
	balls.forEach((ball, i) => {
		if (ball.x >= x && ball.x < ansX) {
			ansX = ball.x;
			ans = i;
		}
	});

	return ans;
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
	if (document.querySelector("html").classList.contains("light")) {
		ctx.fillStyle = "#cccccc";
	}
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = "#ffffff";
	if (document.querySelector("html").classList.contains("light")) {
		ctx.fillStyle = "#000000";
	}

	p1score.innerHTML = p1.score;
	p2score.innerHTML = p2.score;

	//update of p1
	if (keys["W"]) {
		p1.moveUp();
	}
	if (keys["S"]) {
		p1.moveDown();
	}
	p1.y = Math.max(-15, Math.min(p1.y, height - p1.height + 15));
	p1.update(ctx);

	//update of p2
	if (PLAYING_MODE == "pvp") {
		if (keys["ARROWUP"]) {
			p2.moveUp();
		}
		if (keys["ARROWDOWN"]) {
			p2.moveDown();
		}

		p2.y = Math.max(-15, Math.min(p2.y, height - p2.height + 15));
	} else {
		const dumbness = parseInt(PLAYING_MODE[3]);
		const offset = Math.random() * p2.height - p2.height / 2;
		//TODO: add diff 4 bot
		if (dumbness <= 4) {
			const k = dumbness == 1 ? 1.5 : dumbness == 2 ? 2 : 7;
			let targetBall = balls[getRightmostBallAfter(balls, canvas.width / k)];
			if (targetBall) {
				let traj = targetBall.getTrajectory(10 * k * k, [p2], false)[0];
				p2.destination = traj[traj.length - 1][1] + offset;
				for (let i = 0; i < 10 * k * k; ++i) {
					if (traj[i][0] >= p2.x) {
						p2.destination = traj[i][1] + offset;
						break;
					}
				}
			} else if (Math.random() < 0.1) {
				p2.destination = Math.min(Math.random() * canvas.height, canvas.height - p2.height);
				if (dumbness == 3) {
					p2.destination = canvas.height / 2 - p2.height / 2;
				}
			}
			if (dumbness == 1 && Math.random() < 0.2) {
				let inc = canvas.height;
				if (Math.random() < 0.5) {
					inc *= -1;
				}
				p2.destination += inc;
			}
		} else {
		}
	}
	p2.update(ctx);

	//update of balls
	balls.forEach((ball) => {
		ball.update(ctx);

		if ((ball.y <= 0 || ball.y >= height - 2 * ball.r) && ball.events["teleport"]) {
			ball.y = Math.max(0, Math.min(ball.y, height - 2 * ball.r));
			ball.events["teleport"] = false;
			setTimeout(() => {
				ball.events["teleport"] = true;
			}, 500);
		}
	});

	//updating of powerups
	powerups.forEach((powerup) => {
		powerup.update(ctx);
	});

	//spawnnig powerups
	if (powerups.length < MAX_POWERUPS_AT_A_TIME && Math.random() < POWERUP_SPAWN_RATE / 1000) {
		let name = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
		let target = Math.random() < 0.5 ? "self" : "enemy";
		let color = "#16DF2A";
		if (name == "ball_redirection") {
			target = "ball";
			color = "#ebf10d";
		} else if (name == "extra_ball") {
			target = "ballAndPos";
			color = "#ebf10d";
		} else if (name.includes("ball") || name.includes("refresh")) {
			target = "balls";
			color = "#ebf10d";
		} else if (
			(target == "self" && ["smaller_platform", "slower_movement_speed"].includes(name)) ||
			(target == "enemy" && ["bigger_platform", "faster_movement_speed"].includes(name))
		) {
			color = "#DF4516";
		}
		let deviation = (Math.random() * width) / 3 - width / 6;
		let powerup = new PowerUp(width / 2 + deviation, Math.random() * height, "images/" + name + ".png", target, color, powerupsFunctions[name]);
		powerups.push(powerup);
	}
}

function restart() {
	p1.resize();
	p1.x = width / 10;
	p2.resize();
	p2.x = (9 * width) / 10 - p2.width;

	let speedX = BALL_ITITIAL_SPEED * (Math.random() >= 0.5 ? 1 : -1);
	let speedY = (canvas.height / canvas.width) * 2.5 * BALL_ITITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1);
	this.speedMultiplier = BALL_ITITIAL_SPEED;

	balls = [new Ball(width / 2 - height / 60, height / 2 - height / 60, [speedX, speedY])];

	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = "#000000";
	if (document.querySelector("html").classList.contains("light")) {
		ctx.fillStyle = "#cccccc";
	}

	ctx.fillRect(0, 0, width, height);
	p1.draw(ctx);
	p2.draw(ctx);

	balls[0].draw(ctx);
	balls[0].owner = p1.id;

	setTimeout(() => {
		interval = setInterval(update, 20);
	}, 666);
}

//settings constantns
const PLAYING_MODE = localStorage.getItem("mode");
const PLAYER_SPEED = parseInt(localStorage.getItem("playerSpeed"));
const BALL_ACCELERATION_RATE = parseInt(localStorage.getItem("ballAccelerationRate"));
const BALL_ACCELERATION_CHANCE = parseInt(localStorage.getItem("ballAccelerationChance"));
const BALL_ITITIAL_SPEED = parseInt(localStorage.getItem("ballInitialSpeed"));
const BALL_SIZE = parseInt(localStorage.getItem("ballSize"));
const MAX_POWERUPS_AT_A_TIME = parseInt(localStorage.getItem("maximumPowerupsAtATime"));
const POWERUP_SPAWN_RATE = parseInt(localStorage.getItem("powerupSpawnRate"));

const p1score = document.getElementById("p1-score");
const p2score = document.getElementById("p2-score");

const p1 = new Player(width / 10);
const p2 = new Player((9 * width) / 10);
var balls = [];
var powerups = [];
var availablePowerUps = [];

var keys = {};

document.addEventListener("keydown", (event) => {
	const key = event.key.toUpperCase();
	keys[key] = true;

	if (!/F?[0-9]+/.test(key) && key != "-" && key != "BACKSPACE") {
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

document.addEventListener("mousedown", () => {
	keys.lmb = true;
});

document.addEventListener("touchstart", () => {
	keys.lmb = true;
});

document.addEventListener("mouseup", () => {
	keys.lmb = false;
});

document.addEventListener("touchend", () => {
	keys.lmb = false;
});

document.addEventListener("touchmove", (event) => {
	if (keys.lmb == true) {
		if (event.touches[0].clientX < canvas.width * 0.25) {
			p1.destination = event.touches[0].clientY; // - canvas.top;
		} else if (event.touches[0].clientX > canvas.width * 0.75 && PLAYING_MODE == "pvp") {
			p2.destination = event.touches[0].clientY; // - canvas.top;
		}
	}
});

document.addEventListener("mousemove", (event) => {
	if (keys.lmb == true) {
		if (event.clientX < canvas.width * 0.25) {
			p1.destination = event.clientY; // - canvas.top;
		} else if (event.clientX > canvas.width * 0.75 && PLAYING_MODE == "pvp") {
			p2.destination = event.clientY; // - canvas.top;
		}
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
var inertia = false;

restart();
