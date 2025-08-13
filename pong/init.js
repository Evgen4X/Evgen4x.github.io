if (localStorage.getItem("powerups")) {
	availablePowerUps = localStorage.getItem("powerups").split(";");
} else {
	availablePowerUps = [
		"smaller_platform",
		"smaller_ball",
		"slower_movement_speed",
		"faster_movement_speed",
		"extra_ball",
		"bigger_platform",
		"ball_redirection",
		"speed_refresh",
	];
}

const GAMESPEED_COEFFICIENT = 2;
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
			ball.r /= 1.75;
			ball.r = Math.max(ball.r, 1.1);
			if (!ball.events["smaller_ball"]) {
				ball.events["smaller_ball"] = EVENT_LASTTIME;
			} else {
				ball.events["smaller_ball"] += EVENT_LASTTIME * 0.5;
				ball.events["smaller_ball"] = Math.max(EVENT_LASTTIME, ball.events["smaller_ball"]);
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
	extra_ball: (targetList, args) => {
		const x = Math.round(args[0]),
			y = Math.round(args[1]),
			speed = args[2];

		const ball = new Ball(x, y + height / 10, [-speed[0], -speed[1]]);
		ball.owner = ball.speed[0] > 0 ? p1.id : p2.id;
		targetList.push(ball);
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
			ball.r = parseInt(localStorage.getItem("ballSize"));
		});
	},
	slower_movement_speed: (target) => {
		target.speed *= 1.5;
	},
	faster_movement_speed: (target) => {
		target.speed /= 1.5;
	},
};

function playSound(path) {
	let audio = new Audio(path);
	audio.play();
}

function setToDefault() {
	const theme = localStorage.getItem("theme");
	localStorage.clear();
	localStorage.setItem("theme", theme);
	window.location.reload();
}

function saveSettings() {
	const settings = [
		"playerSpeed",
		"ballAccelerationRate",
		"ballAccelerationChance",
		"ballInitialSpeed",
		"ballSize",
		"maximumPowerupsAtATime",
		"powerupSpawnRate",
	];
	for (let i of settings) {
		let val = localStorage.getItem(i + "Tmp");
		if (val) {
			localStorage.setItem(i, val);
		}
	}

	localStorage.setItem("showSettings", "True");
	window.location.reload();
}

function handleSettingsInput(id, min_, max_, default_) {
	const input = document.getElementById(id);
	input.oninput = () => {
		let val = Math.max(min_, Math.min(max_, parseInt(input.value)));
		localStorage.setItem(id + "Tmp", val);
		input.value = val;
	};
	if (!localStorage.getItem(id)) {
		localStorage.setItem(id, default_);
		localStorage.setItem(id + "Tmp", default_);
	}
	input.value = parseInt(localStorage.getItem(id + "Tmp"));
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
	if (!availablePowerUps.includes(pup)) {
		powerupToggler.setAttribute("state", "off");
		powerupToggler.style.opacity = "40%";
	}
	powerupToggler.onclick = () => {
		let powerups = [
			"smaller_platform",
			"smaller_ball",
			"slower_movement_speed",
			"faster_movement_speed",
			"extra_ball",
			"bigger_platform",
			"ball_redirection",
			"speed_refresh",
		];
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

handleSettingsInput("playerSpeed", -100, 100, "4");

handleSettingsInput("ballAccelerationRate", -10, 10, "1");

handleSettingsInput("ballAccelerationChance", 0, 100, "40");

handleSettingsInput("ballSize", 1, 100, "15");

handleSettingsInput("ballInitialSpeed", -10, 10, "2");

handleSettingsInput("maximumPowerupsAtATime", 1, 100, "2");

handleSettingsInput("powerupSpawnRate", 0, 1000, "5");
