const COLORS = {
	tableOutline: "#111111",
	tableBackground: "#01816a",
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const main = document.querySelector("main");
canvas.style.width = window.innerWidth;
canvas.width = window.innerWidth;
canvas.style.hieght = window.innerHeight * 0.86;
canvas.height = window.innerHeight * 0.86;

const NUMBERS = {
	canvasWidth: canvas.width,
	canvasHeight: canvas.height,
	tableWidth: Math.min(canvas.width, canvas.height * 2) * 0.8,
	tableHeight: Math.min(canvas.width / 2, canvas.height) * 0.8,
};
//needs to be separate to refer to NUMBERS.tableWidth
NUMBERS.tableBorderWidth = NUMBERS.tableHeight * 0.1;
NUMBERS.tableOffsetX = (canvas.width - (NUMBERS.tableWidth + NUMBERS.tableBorderWidth)) / 2;
NUMBERS.tableOffsetY = (canvas.height - (NUMBERS.tableHeight + NUMBERS.tableBorderWidth)) / 2;
NUMBERS.holeRadius = NUMBERS.tableBorderWidth * 0.5;
NUMBERS.ballRadius = NUMBERS.tableBorderWidth * 0.4;
NUMBERS.holeOffset = NUMBERS.tableBorderWidth * 0.9;
NUMBERS.holeOffsetNegative = NUMBERS.tableBorderWidth * 0.1;
NUMBERS.sideWidth = NUMBERS.holeRadius * 2 - NUMBERS.holeOffset;
