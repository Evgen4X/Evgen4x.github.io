const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const HEIGHT = canvas.getBoundingClientRect().height;
const WIDTH = canvas.getBoundingClientRect().width;
// const RESOLUTION = 1000;
const RESOLUTION = HEIGHT;
const DATA = {
	poleWidth: Math.round(WIDTH / 100),
	poleHeight: Math.round(HEIGHT * 0.5),
	poleBase: HEIGHT * 0.9,
	poleColor: "#cccccc",
	poleStroke: "#000000",
};

canvas.height = RESOLUTION;
canvas.width = (RESOLUTION * WIDTH) / HEIGHT;

function drawPole(x) {
	ctx.fillStyle = DATA.poleColor;
	ctx.strokeStyle = DATA.poleStroke;
	ctx.beginPath();
	ctx.arc(x, DATA.poleBase, DATA.poleWidth / 2, 0, Math.PI);
	ctx.lineTo(x - DATA.poleWidth / 2, DATA.poleBase - DATA.poleHeight);
	ctx.arc(x, DATA.poleBase - DATA.poleHeight, DATA.poleWidth / 2, Math.PI, 2 * Math.PI);
	ctx.lineTo(x + DATA.poleWidth / 2, DATA.poleBase);

	ctx.fill();
	ctx.stroke();
}
