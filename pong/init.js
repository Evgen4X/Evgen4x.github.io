if (localStorage.getItem("powerups")) {
	availablePowerUps = localStorage.getItem("powerups").split(";");
} else {
	availablePowerUps = ["smaller_platform", "smaller_ball", "slower_movement_speed", "faster_movement_speed", "extra_ball", "bigger_platform", "ball_redirection", "speed_refresh"];
}

const EVENT_LASTTIME = 7500;

const powerupsFunctions = {
	smaller_platform: (target) => {
		if (!target.events["smaller_platform"]) {
			target.height /= 1.75;
			target.events["smaller_platform"] = EVENT_LASTTIME;
		} else {
			target.events["smaller_platform"] += EVENT_LASTTIME;
		}
	},
	bigger_platform: (target) => {
		if (!target.events["bigger_platform"]) {
			target.height *= 1.75;
			target.events["bigger_platform"] = EVENT_LASTTIME;
		} else {
			target.events["bigger_platform"] += EVENT_LASTTIME;
		}
	},
	smaller_ball: (targets) => {
		targets.forEach((ball) => {
			if (!ball.events["smaller_ball"]) {
				ball.r /= 1.75;
				ball.events["smaller_ball"] = EVENT_LASTTIME;
			} else {
				ball.events["smaller_ball"] += EVENT_LASTTIME;
			}
		});
	},
	slower_movement_speed: (target) => {
		if (!target.events["slower_movement_speed"]) {
			target.speed /= 1.5;
			target.events["slower_movement_speed"] = EVENT_LASTTIME;
		} else {
			target.events["slower_movement_Speed"] += EVENT_LASTTIME;
		}
	},
	faster_movement_speed: (target) => {
		if (!target.events["faster_movement_speed"]) {
			target.speed *= 1.5;
			target.events["faster_movement_speed"] = EVENT_LASTTIME;
		} else {
			target.events["faster_movement_speed"] += EVENT_LASTTIME;
		}
	},
	ball_redirection: (target) => {
		target.speed[1] = Math.random() * 10 - 5;
	},
	extra_ball: (targetList) => {
		let speed = targetList[targetList.length - 1].speed;
		targetList.push(new Ball(width / 2, height / 2, height / 60, [-speed[0], -speed[1]]));
	},
	speed_refresh: (targets) => {
		targets.forEach((ball) => {
			ball.speedMultiplier = Math.max(1, Math.sqrt(ball.speedMultiplier));
		});
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
			ball.r *= 1.75;
		});
	},
	slower_movement_speed: (target) => {
		target.speed *= 1.5;
	},
	faster_movement_speed: (target) => {
		target.speed /= 1.5;
	},
};

function setToDefault() {
	localStorage.clear();
	location.reload();
}

const settings = document.getElementById("settings");
if (!localStorage.getItem("showSettings")) {
	settings.style.display = "flex";
	localStorage.removeItem("showSettings");
}
const powerupTogglers = document.querySelectorAll(".powerup-toggle");
powerupTogglers.forEach((powerupToggler) => {
	const pup = powerupToggler.getAttribute("powerup");
	powerupToggler.style.backgroundImage = `url(images/${pup}.png)`;
	powerupToggler.style.backgroundSize = "10vh 10vh";
	powerupToggler.style.backgroundColor = "#999999";
	powerupToggler.style.width = "10vh";
	powerupToggler.style.height = "10vh";
	powerupToggler.style.borderRadius = "33%";
	if (!availablePowerUps.includes(pup)) {
		powerupToggler.setAttribute("state", "off");
		powerupToggler.style.opacity = "40%";
	}
	powerupToggler.onclick = () => {
		let powerups = ["smaller_platform", "smaller_ball", "slower_movement_speed", "faster_movement_speed", "extra_ball", "bigger_platform", "ball_redirection", "speed_refresh"];
		if (localStorage.getItem("powerups")) {
			powerups = localStorage.getItem("powerups").split(";");
		}
		if (powerupToggler.getAttribute("state") == "on") {
			powerupToggler.setAttribute("state", "off");
			powerupToggler.style.opacity = "40%";
			powerups = powerups.filter((powerup) => powerup != pup);
		} else {
			powerupToggler.setAttribute("state", "on");
			powerupToggler.style.opacity = "100%";
			powerups.push(pup);
		}

		localStorage.setItem("powerups", powerups.join(";"));
	};
});

const modeTogglers = document.querySelectorAll(".mode-toggle");
modeTogglers.forEach((modeToggler) => {
	const pup = modeToggler.getAttribute("mode");
	if (pup == localStorage.getItem("mode") || (!localStorage.getItem("mode") && pup == "pvp")) {
		modeToggler.style.backgroundColor = "#999999";
		localStorage.setItem("mode", pup);
	}
	modeToggler.onclick = () => {
		localStorage.setItem("mode", pup);
		modeTogglers.forEach((modeToggler2) => {
			modeToggler2.style.backgroundColor = "#666666";
		});
		modeToggler.style.backgroundColor = "#999999";
	};
});

document.getElementById("settings-button").onclick = () => {
	settings.style.display = "flex";
};

const playerSpeedInput = document.getElementById("playerSpeed");
playerSpeedInput.oninput = () => {
	let val = Math.max(-100, Math.min(100, parseInt(playerSpeedInput.value)));
	playerSpeedInput.value = val;
	localStorage.setItem("playerSpeed", val);
};
if (!localStorage.getItem("playerSpeed")) {
	localStorage.setItem("playerSpeed", 4);
}
playerSpeedInput.value = parseInt(localStorage.getItem("playerSpeed"));

const ballAccelerationInput = document.getElementById("ballAcceleration");
ballAccelerationInput.oninput = () => {
	let val = Math.max(-10, Math.min(10, parseInt(ballAccelerationInput.value)));
	ballAccelerationInput.value = val;
	localStorage.setItem("ballAcceleration", val);
};
if (!localStorage.getItem("ballAcceleration")) {
	localStorage.setItem("ballAcceleration", 1);
}
ballAccelerationInput.value = parseInt(localStorage.getItem("ballAcceleration"));

const ballChanceInput = document.getElementById("ballChance");
ballChanceInput.oninput = () => {
	let val = Math.max(0, Math.min(100, parseInt(ballChanceInput.value)));
	ballChanceInput.value = val;
	localStorage.setItem("ballChance", val);
};
if (!localStorage.getItem("ballChance")) {
	localStorage.setItem("ballChance", 40);
}
ballChanceInput.value = parseInt(localStorage.getItem("ballChance"));

const maxPowerupsInput = document.getElementById("maxPowerups");
maxPowerupsInput.oninput = () => {
	let val = Math.max(1, Math.min(100, parseInt(maxPowerupsInput.value)));
	maxPowerupsInput.value = val;
	localStorage.setItem("maxPowerups", val);
};
if (!localStorage.getItem("maxPowerups")) {
	localStorage.setItem("maxPowerups", 2);
}
maxPowerupsInput.value = parseInt(localStorage.getItem("maxPowerups"));

const ballInitSpeedInput = document.getElementById("ballInitSpeed");
ballInitSpeedInput.oninput = () => {
	let val = Math.max(-10, Math.min(10, parseInt(ballInitSpeedInput.value)));
	ballInitSpeedInput.value = val;
	localStorage.setItem("ballInitSpeed", val);
};
if (!localStorage.getItem("ballInitSpeed")) {
	localStorage.setItem("ballInitSpeed", 2);
}
ballInitSpeedInput.value = parseInt(localStorage.getItem("ballInitSpeed"));

const powerupsChance = document.getElementById("powerupsChance");
powerupsChance.oninput = () => {
	let val = Math.max(0, Math.min(1000, parseInt(powerupsChance.value)));
	powerupsChance.value = val;
	localStorage.setItem("powerupsChance", val);
};
if (!localStorage.getItem("powerupsChance")) {
	localStorage.setItem("powerupsChance", 5);
}
powerupsChance.value = parseInt(localStorage.getItem("powerupsChance"));
