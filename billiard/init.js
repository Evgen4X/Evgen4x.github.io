function drawTable() {
	//table
	ctx.fillStyle = COLORS.tableOutline;
	ctx.beginPath();
	ctx.roundRect(
		NUMBERS.tableOffsetX,
		NUMBERS.tableOffsetY,
		NUMBERS.tableWidth + NUMBERS.tableBorderWidth,
		NUMBERS.tableHeight + NUMBERS.tableBorderWidth,
		NUMBERS.tableBorderWidth
	);
	ctx.fill();
	ctx.fillStyle = COLORS.tableBackground;
	ctx.beginPath();
	ctx.roundRect(
		NUMBERS.tableOffsetX + NUMBERS.tableBorderWidth / 2,
		NUMBERS.tableOffsetY + NUMBERS.tableBorderWidth / 2,
		NUMBERS.tableWidth,
		NUMBERS.tableHeight,
		NUMBERS.tableBorderWidth
	);
	ctx.fill();

	//magic happens in lines 26-70
	//holes
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	{
		ctx.arc(NUMBERS.tableOffsetX + NUMBERS.holeOffset, NUMBERS.tableOffsetY + NUMBERS.holeOffset, NUMBERS.holeRadius, 0, 7);
		ctx.arc(
			NUMBERS.tableOffsetX + (NUMBERS.tableWidth + NUMBERS.holeOffset) / 2,
			NUMBERS.tableOffsetY + NUMBERS.holeOffset,
			NUMBERS.holeRadius,
			0,
			7
		);
		ctx.arc(
			NUMBERS.tableOffsetX + NUMBERS.tableWidth + NUMBERS.holeOffsetNegative,
			NUMBERS.tableOffsetY + NUMBERS.holeOffset,
			NUMBERS.holeRadius,
			0,
			7
		);
	}
	ctx.fill();
	ctx.beginPath();
	{
		ctx.arc(
			NUMBERS.tableOffsetX + NUMBERS.holeOffset,
			NUMBERS.tableOffsetY + NUMBERS.tableHeight + NUMBERS.holeOffsetNegative,
			NUMBERS.holeRadius,
			0,
			7
		);
		ctx.arc(
			NUMBERS.tableOffsetX + (NUMBERS.tableWidth + NUMBERS.holeOffset) / 2,
			NUMBERS.tableOffsetY + NUMBERS.tableHeight + NUMBERS.holeOffsetNegative,
			NUMBERS.holeRadius,
			0,
			7
		);
		ctx.arc(
			NUMBERS.tableOffsetX + NUMBERS.tableWidth + NUMBERS.holeOffsetNegative,
			NUMBERS.tableOffsetY + NUMBERS.tableHeight + NUMBERS.holeOffsetNegative,
			NUMBERS.holeRadius,
			0,
			7
		);
	}
	ctx.fill();
}

drawTable();
