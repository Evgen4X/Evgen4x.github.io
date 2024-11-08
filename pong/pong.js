class Player {
    static id = 0;
    constructor(x) {
        this.x = x;
        this.y = (3 * height) / 8;
        this.speed = parseInt(localStorage.getItem("playerSpeed"));
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

    draw(ctx) {
        let r = 255;
        let g = 255;
        let b = 255;
        if (this.events["faster_movement_speed"]) {
            let percentage =
                1 - this.events["faster_movement_speed"] / EVENT_LASTTIME;
            g *= 0.75;
            b *= percentage;
        }
        if (this.events["slower_movement_speed"]) {
            let percentage =
                1 - this.events["slower_movement_speed"] / EVENT_LASTTIME;
            r *= percentage;
            g *= percentage;
        }
        if (this.events["smaller_platform"]) {
            let percentage =
                1 - this.events["smaller_platform"] / EVENT_LASTTIME;
            percentage = Math.max(0.3, percentage);
            r *= percentage;
            g *= percentage;
            b *= percentage;
        }
        if (this.events["bigger_platform"]) {
            let percentage =
                1 - this.events["bigger_platform"] / EVENT_LASTTIME;
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
            this.y +=
                (this.y + this.height / 2 > this.destination ? -1 : 1) *
                this.speed;
            if (Math.abs(this.y + this.height / 2 - this.destination) < 2) {
                this.destination = null;
            }

            this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
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
}

class Ball {
    static speedMultiplier = 2;
    constructor(x, y, r, speed) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.speedMultiplier = Ball.speedMultiplier;
        this.events = { lastTimeHitPlayer: 0 };
        this.owner = null;
    }

    getTrajectory(ticks, players, updateSpeed = true) {
        const prevLTHP = this.events["lastTimeHitPlayer"];
        let speed = [this.speed[0], this.speed[1]];
        let answer = [];
        let x = this.x;
        let y = this.y;
        let CHANGESPEED = false;
        let framesTillPowerupChecks = 0; //check powerups only every 10th frame to prevent potential lags
        for (let i = 0; i < ticks; ++i, --framesTillPowerupChecks) {
            x += speed[0];
            y += speed[1];
            if (y <= 0 || y >= height - this.r) {
                speed[1] = -speed[1];
                y = Math.max(0, Math.min(y, height - this.r));
            }

            //player collision check
            if (this.events["lastTimeHitPlayer"] < 1) {
                players.forEach((player) => {
                    if (
                        player.x <= x + this.r &&
                        x - this.r <= player.x + player.width + 1 &&
                        player.y <= y - this.r &&
                        y <= player.y + player.height
                    ) {
                        console.log("!");
                        speed[0] = -speed[0];
                        speed[1] =
                            (8 / player.height) * (this.y - player.y) - 4;
                        this.events["lastTimeHitPlayer"] = 50;
                        if (
                            updateSpeed &&
                            Math.random() <
                                parseInt(localStorage.getItem("ballChance")) /
                                    100
                        ) {
                            if (
                                localStorage.getItem("ballAcceleration")[0] ==
                                "-"
                            ) {
                                let maxSpeed =
                                    parseInt(
                                        localStorage
                                            .getItem("ballAcceleration")
                                            .substring(1)
                                    ) / 2;
                                this.speedMultiplier =
                                    Math.floor(Math.random() * maxSpeed) + 1;
                            } else {
                                this.speedMultiplier += parseInt(
                                    localStorage.getItem("ballAcceleration")
                                );
                            }
                            this.owner = player.id;
                        }
                    }
                });
            }
            --this.events["lastTimeHitPlayer"];

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
                                powerup.collect(balls, [
                                    this.x,
                                    this.y,
                                    this.speed,
                                ]);
                            }
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

        return answer;
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

        let trajectory = this.getTrajectory(this.speedMultiplier, [p1, p2]);
        let position = trajectory[trajectory.length - 1];
        this.x = position[0];
        this.y = position[1];

        if (
            this.events["lastTimeHitY"] &&
            (this.y <= 0 || this.y >= height - this.r)
        ) {
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
            const player = p1.id == this.owner ? p1 : p2;
            player.score += this.speedMultiplier;
            balls = balls.filter((ball) => ball != this);
            if (balls.length == 0 && settings.style.display != "flex") {
                //TODO: smth better
                localStorage.setItem("showSettings", "false");
                location.reload();
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
        ctx.drawImage(
            this.img,
            this.x - 0.75 * this.r,
            this.y - 0.75 * this.r,
            this.r * 1.5,
            this.r * 1.5
        );
        this.lifetime -= 1;
        if (this.lifetime <= 0) {
            this.collect(null);
        }
    }

    pointCollides(x, y) {
        return (
            this.x - this.r <= x &&
            x <= this.x + this.r &&
            this.y - this.r <= y &&
            y <= this.y + this.r
        );
    }

    ballCollides(ball) {
        return (
            this.pointCollides(ball.x - ball.r, ball.y - ball.r) ||
            this.pointCollides(ball.x + ball.r, ball.y + ball.r) ||
            this.pointCollides(ball.x - ball.r, ball.y + ball.r) ||
            this.pointCollides(ball.x + ball.r, ball.y - ball.r)
        );
    }

    collect(target, additionalArgs = []) {
        if (additionalArgs) {
            this.onCollect(target, additionalArgs);
        } else if (target != null) {
            this.onCollect(target);
        }
        powerups = powerups.filter((powerup) => powerup.id != this.id);
    }
}

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
ctx.font = `${Math.floor(height / 10)}px Arial`;
console.log(`${Math.floor(height / 10)}px Arial`);
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
    ctx.font = `${Math.floor(height / 8)}px Arial`;

    ctx.fillText(p1.score, 50, 60, parseInt(canvas.width / 8));
    ctx.fillText(
        p2.score,
        parseInt((canvas.width * 9) / 50) - 10,
        60,
        parseInt(canvas.width / 8)
    );

    //update of p1
    if (keys["W"]) {
        p1.y -= p1.speed;
    }
    if (keys["S"]) {
        p1.y += p1.speed;
    }
    p1.y = Math.max(-5, Math.min(p1.y, height - p1.height));
    p1.update(ctx);

    //update of p2
    if (localStorage.getItem("mode") == "pvp") {
        if (keys["ARROWUP"]) {
            p2.y -= p2.speed;
        }
        if (keys["ARROWDOWN"]) {
            p2.y += p2.speed;
        }

        p2.y = Math.max(-5, Math.min(p2.y, height - p2.height));
    } else {
        const dumbness = parseInt(localStorage.getItem("mode")[3]);
        const offset = Math.random() * p2.height - p2.height / 2;
        //TODO: add diff 4 bot
        if (dumbness <= 4) {
            const k = dumbness == 1 ? 1.5 : dumbness == 2 ? 2 : 7;
            let targetBall =
                balls[getRightmostBallAfter(balls, canvas.width / k)];
            if (targetBall) {
                let traj = targetBall.getTrajectory(10 * k * k, [p2], false);
                p2.destination = traj[traj.length - 1][1] + offset;
                for (let i = 0; i < 10 * k * k; ++i) {
                    if (traj[i][0] >= p2.x) {
                        p2.destination = traj[i][1] + offset;
                        break;
                    }
                }
            } else if (Math.random() < 0.1) {
                p2.destination = Math.min(
                    Math.random() * canvas.height,
                    canvas.height - p2.height
                );
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

        if (
            (ball.y <= 0 || ball.y >= height - 2 * ball.r) &&
            ball.events["teleport"]
        ) {
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

    //spawnnig power-ups
    if (
        Math.random() <
            parseInt(localStorage.getItem("powerupsChance")) / 1000 &&
        powerups.length < parseInt(localStorage.getItem("maxPowerups"))
    ) {
        let name =
            availablePowerUps[
                Math.floor(Math.random() * availablePowerUps.length)
            ];
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
            (target == "self" &&
                ["smaller_platform", "slower_movement_speed"].includes(name)) ||
            (target == "enemy" &&
                ["bigger_platform", "faster_movement_speed"].includes(name))
        ) {
            color = "#DF4516";
        }
        let deviation = (Math.random() * width) / 4 - width / 8;
        let powerup = new PowerUp(
            width / 2 + deviation,
            Math.random() * height,
            "images/" + name + ".png",
            target,
            color,
            powerupsFunctions[name]
        );
        powerups.push(powerup);
    }
}

function restart() {
    p1.resize();
    p1.x = width / 10;
    p2.resize();
    p2.x = (9 * width) / 10;
    let speedX =
        parseInt(localStorage.getItem("ballInitSpeed")) *
        (Math.random() > 0.5 ? 1 : -1);
    let speedY =
        (canvas.height / canvas.width) *
        2.5 *
        parseInt(localStorage.getItem("ballInitSpeed")) *
        (Math.random() > 0.5 ? 1 : -1);
    this.speedMultiplier = parseInt(localStorage.getItem("ballInitSpeed"));
    balls = [
        new Ball(
            width / 2 - height / 60,
            height / 2 - height / 60,
            height / 60,
            [speedX, speedY]
        ),
    ];
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
        interval = setInterval(update, 10);
    }, 666);
}

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
        } else if (
            event.touches[0].clientX > canvas.width * 0.75 &&
            localStorage.getItem("mode") == "pvp"
        ) {
            p2.destination = event.touches[0].clientY; // - canvas.top;
        }
    }
});

document.addEventListener("mousemove", (event) => {
    if (keys.lmb == true) {
        if (event.clientX < canvas.width * 0.25) {
            p1.destination = event.clientY; // - canvas.top;
        } else if (
            event.clientX > canvas.width * 0.75 &&
            localStorage.getItem("mode") == "pvp"
        ) {
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
