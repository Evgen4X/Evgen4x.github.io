if (localStorage.getItem("powerups")) {
	availablePowerUps = localStorage.getItem("powerups").split(";");
} else {
	availablePowerUps = ["smaller_platform", "smaller_ball", "slower_movement_speed", "faster_movement_speed", "extra_ball", "bigger_platform", "ball_redirection", "speed_refresh"];
}

console.log(availablePowerUps);

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

const settings = document.getElementById('settings');
const powerupTogglers = document.querySelectorAll('.powerup-toggle');
powerupTogglers.forEach(powerupToggler => {
    const pup = powerupToggler.getAttribute('powerup');
    powerupToggler.style.backgroundImage = `url(${pup}.png)`;
    powerupToggler.style.backgroundSize = '10vh 10vh';
    powerupToggler.style.backgroundColor = '#999999';
    powerupToggler.style.width = '10vh';
    powerupToggler.style.height = '10vh';
    powerupToggler.style.borderRadius = '33%';
	if(!availablePowerUps.includes(pup)){
		powerupToggler.setAttribute('state', 'off');
		powerupToggler.style.opacity = '40%';
	}
    powerupToggler.onclick = () => {
		let powerups = ["smaller_platform", "smaller_ball", "slower_movement_speed", "faster_movement_speed", "extra_ball", "bigger_platform", "ball_redirection", "speed_refresh"];
		if(localStorage.getItem('powerups')){
			powerups = localStorage.getItem('powerups').split(';');
		}
        if(powerupToggler.getAttribute('state') == 'on'){
            powerupToggler.setAttribute('state', 'off');
			powerupToggler.style.opacity = '40%';
			powerups = powerups.filter(powerup => powerup != pup);
        } else {
			powerupToggler.setAttribute('state', 'on');
			powerupToggler.style.opacity = '100%';
			powerups.push(pup);
		}

		console.log(powerups);

		localStorage.setItem('powerups', powerups.join(';'));
    };
});

document.getElementById('settings-button').onclick = () => {
	settings.style.display = 'flex';
}


const playerSpeedInput = document.getElementById('playerSpeed');
playerSpeedInput.oninput = () => {
	let val = Math.max(-100, Math.min(100, parseInt(playerSpeedInput.value)));
	playerSpeedInput.value = val;
	localStorage.setItem('playerSpeed', val);
}
if(localStorage.getItem('playerSpeed')){
	playerSpeedInput.value = parseInt(localStorage.getItem('playerSpeed'))
} else {
	localStorage.setItem('playerSpeed', 4);
}

const ballAccelerationInput = document.getElementById('ballAcceleration');
ballAccelerationInput.oninput = () => {
	let val = Math.max(0, Math.min(100, parseInt(ballAccelerationInput.value)));
	ballAccelerationInput.value = val;
	localStorage.setItem('ballAcceleration', val);
}
if(localStorage.getItem('ballAcceleration')){
	ballAccelerationInput.value = parseInt(localStorage.getItem('ballAcceleration'))
} else {
	localStorage.setItem('ballAcceleration', 1);
}

const ballChanceInput = document.getElementById('ballChance');
ballAccelerationInput.oninput = () => {
	let val = Math.max(0, Math.min(100, parseInt(ballAccelerationInput.value)));
	ballChanceInput.value = val;
	localStorage.setItem('ballChance', val);
}
if(localStorage.getItem('ballChance')){
	ballChanceInput.value = parseInt(localStorage.getItem('ballChance'))
} else {
	localStorage.setItem('ballChance', 1);
}