setTimeout(() => {
	shortcuts = document.querySelectorAll(".shortcut");
	shortcuts.forEach((s) => {
		s.setAttribute("selected", "0");
		s.setAttribute("timeLastClicked", "0");
		s.onclick = () => clicked(s);
		s.ondragstart = (e) => {
			dragStart(e, s);
		};
		s.ondragend = (e) => {
			drag(e, s);
		};
	});
}, 100);
var shortcuts = [];
var selected = [];
var dragX = -1;
var dragY = -1;
var mousePressed = false;
var shiftPressed = false;

document.onkeydown = (e) => {
	if (e.key == "Shift") {
		shiftPressed = true;
	}
};

document.onkeyup = (e) => {
	if (e.key == "Shift") {
		shiftPressed = false;
	}
};

document.onmousedown = (e) => {
	let flag = true;
	shortcuts.forEach((s) => {
		if (isPointInside(e.pageX, e.pageY, s.getBoundingClientRect())) {
			flag = false;
		}
	});
	if (flag) {
		dragX = e.pageX;
		dragY = e.pageY;
		mousePressed = true;
	}
};

document.onmouseup = () => {
	mousePressed = false;
	selectionRect.style.display = "none";
};

document.onmousemove = (e) => {
	if (mousePressed) {
		const top = Math.min(dragY, e.pageY);
		const bottom = Math.max(dragY, e.pageY);
		const left = Math.min(dragX, e.pageX);
		const right = Math.max(dragX, e.pageX);
		selectionRect.style.display = "block";
		selectionRect.style.top = top + "px";
		selectionRect.style.left = left + "px";
		selectionRect.style.height = bottom - top + "px";
		selectionRect.style.width = right - left + "px";
		shortcuts.forEach((s) => {
			if (isShortcutInside(s, top, right, bottom, left)) {
				if (s.getAttribute("selected") == "0") {
					s.setAttribute("selected", "1");
					s.setAttribute("timeLastClicked", Date.now().toString());
					selected.push(s);
					setTimeout(() => {
						s.classList.add("focused");
					}, 5);
				}
			} else {
				s.classList.remove("focused");
				s.setAttribute("selected", 0);
				selected = selected.filter((s_) => s_ != s);
			}
		});
	}
};

footer.onclick = deselectAll;
main.onclick = (e) => {
	let flag = true;
	shortcuts.forEach((s) => {
		if (isPointInside(e.pageX, e.pageY, s.getBoundingClientRect())) {
			flag = false;
		}
	});
	if (flag) deselectAll();
};

function isPointInside(x, y, rect) {
	return y <= rect.bottom && x <= rect.right && y >= rect.top && x >= rect.left;
}

function isShortcutInside(s, top, right, bottom, left) {
	const rect = s.getBoundingClientRect();
	return rect.top <= bottom && rect.left <= right && rect.bottom >= top && rect.right >= left;
}

function deselectAll() {
	selected.forEach((s) => {
		s.classList.remove("focused");
		s.setAttribute("selected", 0);
	});
	selected = [];
}

function moveShortcut(shortcut, newCol, newRow) {
	if (newCol > COLUMNS || newRow > ROWS || newCol < 0 || newRow < 0) return;
	const col = shortcut.style.gridColumn;
	const row = shortcut.style.gridRow;
	if (newCol == col && newRow == row) return;
	shortcuts.forEach((s) => {
		if (shortcut != s && parseInt(s.style.gridColumn) == newCol && parseInt(s.style.gridRow) == newRow) {
			if (s.style.gridRow == row && s.style.gridColumn == col) return;
			s.style.gridRow = row;
			s.style.gridColumn = col;
		}
		shortcut.style.gridRow = newRow;
		shortcut.style.gridColumn = newCol;
	});
}

function dragStart(e, s) {
	if (s.getAttribute("selected") == "0") {
		deselectAll();
		s.setAttribute("selected", "1");
		s.setAttribute("timeLastClicked", Date.now().toString());
		setTimeout(() => {
			s.classList.add("focused");
		}, 5);
		selected = [s];
	}
	dragX = e.pageX;
	dragY = e.pageY;
	if (s.getAttribute("selected") == "0") {
		s.setAttribute("selected", "1");
		s.setAttribute("timeLastClicked", Date.now().toString());
		selected.push(s);
		setTimeout(() => {
			s.classList.add("focused");
		}, 5);
	}
}

function drag(e, shortcut) {
	const refCol = parseInt(shortcut.style.gridColumn);
	const refRow = parseInt(shortcut.style.gridRow);
	const [newCol, newRow] = posToGrid(e.pageX, e.pageY);
	console.log(selected);
	selected.forEach((s) => {
		moveShortcut(s, s.style.gridColumn - refCol + newCol, s.style.gridRow - refRow + newRow);
	});
}

function clicked(shortcut) {
	let wasSelected = shortcut.getAttribute("selected") == "1";
	if (!shiftPressed) {
		deselectAll();
	}
	if (wasSelected) {
		let ms = Date.now() - parseInt(shortcut.getAttribute("timeLastClicked"));
		if (ms < 500) {
			goto(shortcut.getAttribute("href"));
		} else {
			shortcut.setAttribute("selected", "0");
			selected = selected.filter((s) => s != shortcut);
			shortcut.classList.remove("focused");
		}
	} else {
		shortcut.setAttribute("selected", "1");
		shortcut.setAttribute("timeLastClicked", Date.now().toString());
		selected.push(shortcut);
		setTimeout(() => {
			shortcut.classList.add("focused");
		}, 5);
	}
	timeLastClickedAny = Date.now();
}
