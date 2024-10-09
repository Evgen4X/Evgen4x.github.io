if (localStorage.getItem("powerups")) {
	availablePowerUps = localStorage.getItem("powerups").split(";");
} else {
	availablePowerUps = ["smaller_platform", "smaller_ball", "slower_movement_sped", "faster_movement_speed", "extra_ball", "bigger_platform", "ball_redirection", "speed_refresh"];
}

localStorage.setItem("powerups", "extra_ball;smaller_ball;speed_refresh");

const EVENT_LASTTIME = 5000;

const powerupsFunctions = {
	smaller_platform: (target) => {
		if (!target.events["smaller_platform"]) {
			target.height /= 1.75;
		}
		target.events["smaller_platform"] = EVENT_LASTTIME;
	},
	bigger_platform: (target) => {
		if (!target.events["bigger_platform"]) {
			target.height *= 1.75;
		}
		target.events["bigger_platform"] = EVENT_LASTTIME;
	},
	smaller_ball: (targets) => {
		targets.forEach((ball) => {
			if (!ball.events["smaller_ball"]) {
				ball.r /= 1.5;
			}
			ball.events["smaller_ball"] = EVENT_LASTTIME;
		});
	},
	slower_movement_speed: (target) => {
		if (!target.events["slower_movement_speed"]) {
			target.speed /= 1.5;
		}
		target.events["slower_movement_speed"] = EVENT_LASTTIME;
	},
	faster_movement_speed: (target) => {
		if (!target.events["faster_movement_speed"]) {
			target.speed *= 1.5;
		}
		target.events["faster_movement_speed"] = EVENT_LASTTIME;
	},
	ball_redirection: (targets) => {
		targets.forEach((ball) => {
			ball.speed[1] = Math.random() * 3 - 1.5;
		});
	},
	extra_ball: (targetList) => {
		let speed = targetList[targetList.length - 1].speed;
		targetList.push(new Ball(width / 2, height / 2, height / 60, [speed[0] < 0 ? 1 : -1, speed[1] < 0 ? 1 : -1]));
	},
	speed_refresh: (ballClass) => {
		ballClass.speedMultiplier = Math.max(1, Math.sqrt(ballClass.speedMultiplier));
	},
};

const powerupsOnExpire = {
	smaller_platform: (target) => {
		target.height *= 1.75;
	},
	bigger_platform: (target) => {
		target.height /= 1.75;
	},
	smaller_ball: (target) => {
		target.forEach((ball) => {
			ball.r *= 1.5;
		});
	},
	slower_movement_speed: (target) => {
		target.speed *= 1.5;
	},
	faster_movement_speed: (target) => {
		target.speed /= 1.5;
	},
};
