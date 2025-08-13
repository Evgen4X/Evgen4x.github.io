class Player {
	static id = 0;
	constructor(x) {
		this.x = x;
		this.y = (3 * height) / 8;
		this.speed = PLAYER_SPEED;
		this.events = {};
		this.id = ++Player.id;
		this.destination = null;
		this.score = 0;
	}

	resize() {
		this.width = width / 65;
		this.height = height / 4;
		this.y = Math.min(this.y, height - this.height);
	}

	moveUp() {
		this.y -= this.speed * GAMESPEED_COEFFICIENT;
	}

	moveDown() {
		this.y += this.speed * GAMESPEED_COEFFICIENT;
	}

	draw(ctx) {
		let r = 255;
		let g = 255;
		let b = 255;
		if (this.events["faster_movement_speed"]) {
			let percentage = 1 - this.events["faster_movement_speed"] / EVENT_LASTTIME;
			g *= 0.75;
			b *= percentage;
		}
		if (this.events["slower_movement_speed"]) {
			let percentage = 1 - this.events["slower_movement_speed"] / EVENT_LASTTIME;
			r *= percentage;
			g *= percentage;
		}
		if (this.events["smaller_platform"]) {
			let percentage = 1 - this.events["smaller_platform"] / EVENT_LASTTIME;
			percentage = Math.max(0.3, percentage);
			r *= percentage;
			g *= percentage;
			b *= percentage;
		}
		if (this.events["bigger_platform"]) {
			let percentage = 1 - this.events["bigger_platform"] / EVENT_LASTTIME;
			percentage = Math.max(0.3, percentage);
			r *= percentage;
			b *= percentage;
		}

		if (document.querySelector("html").classList.contains("light")) {
			r = 255 - r;
			g = 255 - g;
			b = 255 - b;
		}

		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	update(ctx) {
		if (this.destination) {
			this.y += (this.y + this.height / 2 > this.destination ? -1 : 1) * this.speed * GAMESPEED_COEFFICIENT;
			if (Math.abs(this.y + this.height / 2 - this.destination) < 2) {
				this.destination = null;
			}

			this.y = Math.max(-15, Math.min(canvas.height - this.height + 15, this.y));
		}

		this.draw(ctx);

		for (let i in this.events) {
			this.events[i] -= 10;
			if (this.events[i] <= 0) {
				delete this.events[i];
				if (powerupsOnExpire[i]) {
					powerupsOnExpire[i](this);
				}
			}
		}
	}

	ballCollides(ball) {
		const ballTop = ball.y - ball.r;
		const ballBottom = ball.y + ball.r;
		const ballLeft = ball.x - ball.r;
		const ballRight = ball.x + ball.r;

		const top = this.y;
		const bottom = this.y + this.height;
		const left = this.x;
		const right = this.x + this.width;

		return (
			(((ballRight > left && ballLeft < left) || (ballLeft < right && ballRight > right)) && ballTop < bottom && ballBottom > top) ||
			(((ballBottom > top && ballTop < top) || (ballTop < bottom && ballBottom > bottom)) && ballLeft < right && ballRight > left)
		);
	}
}

class Ball {
	static speedMultiplier = 2;

	constructor(x, y, speed) {
		this.r = BALL_SIZE;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedMultiplier = Ball.speedMultiplier;
		this.events = {lastTimeHitPlayer: 0, lastTimeHitBall: 200};
		this.owner = null;
		console.log(this.speed);
	}

	ballCollides(ball) {
		return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) <= ball.r + this.r;
	}

	getTrajectory(ticks, players, updateSpeed = true) {
		let playerCollisionOccured = false;
		const prevLTHP = this.events["lastTimeHitPlayer"];
		let speed = [this.speed[0], this.speed[1]];
		let answer = [];
		let x = this.x;
		let y = this.y;
		let CHANGESPEED = false;
		let framesTillPowerupChecks = 0; //check powerups only every 10th frame to prevent potential lags
		for (let i = 0; i < ticks; ++i, --framesTillPowerupChecks) {
			x += speed[0] * GAMESPEED_COEFFICIENT;
			y += speed[1] * GAMESPEED_COEFFICIENT;
			if (y <= 0 || y >= height - this.r) {
				speed[1] = -speed[1];
				y = Math.max(0, Math.min(y, height - this.r));
			}

			//player collision check
			if (this.events["lastTimeHitPlayer"] < 1) {
				players.forEach((player) => {
					if (player.ballCollides(this)) {
						playerCollisionOccured = true;
						speed[0] = -speed[0];
						speed[1] = (8 / player.height) * (this.y - player.y) - 4;
						this.events["lastTimeHitPlayer"] = 50;
						if (updateSpeed && Math.random() < BALL_ACCELERATION_CHANCE / 100) {
							if (BALL_ACCELERATION_RATE < 0) {
								let maxSpeed = -BALL_ACCELERATION_RATE + 1;
								this.speedMultiplier = Math.floor(Math.random() * maxSpeed) + 1;
							} else {
								this.speedMultiplier += BALL_ACCELERATION_RATE;
							}
							this.owner = player.id;
						}
					}
				});
			}
			--this.events["lastTimeHitPlayer"];

			if (updateSpeed && this.events["lastTimeHitBall"] < 0) {
				balls.forEach((ball) => {
					if (ball != this && ball.events["lastTimeHitBall"] < 0) {
						if (this.ballCollides(ball)) {
							this.speed = [((this.x - ball.x) / this.r) * this.speedMultiplier, ((this.y - ball.y) / this.r) * this.speedMultiplier];
							ball.speed = [
								-this.speed[0] / this.speedMultiplier / ball.speedMultiplier,
								(-this.speed[1] / this.speedMultiplier) * ball.speedMultiplier,
							];
							this.events["lastTimeHitBall"] = 50;
							ball.events["lastTimeHitBall"] = 50;
						}
					}
				});
			}
			--this.events["lastTimeHitBall"];

			if (updateSpeed) {
				//powerups check
				if (framesTillPowerupChecks == 0) {
					powerups.forEach((powerup) => {
						if (powerup.ballCollides(this)) {
							let target = balls;
							if (powerup.target == "self") {
								target = p1.id == this.owner ? p1 : p2;
							} else if (powerup.target == "enemy") {
								target = p1.id == this.owner ? p2 : p1;
							} else if (powerup.target == "ballClass") {
								target = Ball;
							} else if (powerup.target == "ball") {
								CHANGESPEED = true;
								target = null;
							} else if (powerup.target == "ballAndPos") {
								target = null;
								powerup.collect(balls, [this.x, this.y, this.speed]);
							}
							playSound("sounds/powerupTake.mp3");
							powerup.collect(target);
						}
					});

					framesTillPowerupChecks = 10;
				}
			}

			answer.push([x, y]);
		}

		if (updateSpeed) {
			this.speed = speed;
			if (CHANGESPEED) {
				this.speed[1] = Math.random() * 8 - 4;
			}
		} else {
			this.events["lastTimeHitPlayer"] = prevLTHP;
		}

		return [answer, playerCollisionOccured];
	}

	draw(ctx) {
		let r = 255;
		let g = 255;
		let b = 255;
		if (this.events["smaller_ball"]) {
			let percentage = 1 - this.events["smaller_ball"] / EVENT_LASTTIME;
			g *= percentage;
			b *= percentage;
		}

		if (document.querySelector("html").classList.contains("light")) {
			r = 255 - r;
			g = 255 - g;
			b = 255 - b;
		}

		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 360);
		ctx.fill();
	}

	update(ctx) {
		this.draw(ctx);

		if (Math.abs(this.speed[0]) <= 1) {
			this.speed[0] = Math.abs(this.speedMultiplier) * (this.speed < 0 ? -1 : 1);
		}

		let trajectory_collision = this.getTrajectory(this.speedMultiplier, [p1, p2]);
		let trajectory = trajectory_collision[0];
		if (trajectory_collision[1]) {
			playSound("sounds/ballHit.mp3");
		}
		let position = trajectory[trajectory.length - 1];
		this.x = Math.round(position[0]);
		this.y = Math.round(position[1]);

		if (this.events["lastTimeHitY"] && (this.y <= 0 || this.y >= height - this.r)) {
			this.speed[1] = -this.speed[1];
			this.events["lastTimeHitY"] = false;
			setTimeout(() => {
				this.events["lastTimeHitY"] = true;
			}, 500);
		}

		for (let i in this.events) {
			if (availablePowerUps.includes(i)) {
				this.events[i] -= 10;
				if (this.events[i] <= 0) {
					delete this.events[i];
					powerupsOnExpire[i]([this]);
				}
			}
		}

		if (this.x < -this.r || this.x > width) {
			const player = this.x < 1 ? p2 : p1;
			player.score += parseInt(this.speedMultiplier);
			balls = balls.filter((ball) => ball != this);
			if (balls.length == 0 && settings.style.display != "flex") {
				//TODO: smth better
				localStorage.setItem("showSettings", "false");
				const win_block = document.getElementById("win-block");
				win_block.style.left = p1.score > p2.score ? "25vw" : "60vw";
				playSound("sounds/gameEnd.mp3");
				win_block.animate([{opacity: 0}, {opacity: 100}], {duration: 250, iterations: 6}); //, easing: "ease-in-out"});
				setTimeout(() => {
					location.reload();
				}, 1500);
			}
		}
	}
}

class PowerUp {
	static id = 0;
	constructor(x, y, img, target, color, onCollect) {
		this.x = x;
		this.y = y;
		this.r = height / 25;
		this.img = new Image(height / 25, height / 25);
		this.img.src = img;
		this.target = target;
		this.color = color;
		this.onCollect = onCollect;
		this.lifetime = Math.random() * 1400 + 600; //6-20 sec
		this.id = ++PowerUp.id;
	}

	update(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 360);
		ctx.fill();
		ctx.drawImage(this.img, this.x - 0.75 * this.r, this.y - 0.75 * this.r, this.r * 1.5, this.r * 1.5);
		this.lifetime -= 1;
		if (this.lifetime <= 0) {
			this.collect(null);
		}
	}

	ballCollides(ball) {
		return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) <= ball.r + this.r;
	}

	collect(target, additionalArgs = []) {
		if (additionalArgs.length > 0) {
			this.onCollect(target, additionalArgs);
		} else if (target != null) {
			this.onCollect(target);
		}
		powerups = powerups.filter((powerup) => powerup.id != this.id);
	}
}
