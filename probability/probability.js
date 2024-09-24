const table = document.querySelector("table#main-table");
var questionTypes = 0;
var questions = 0;
var points = 0;

function updateSummary() {
	questionTypes = 0;
	questions = 0;
	points = 0;
	document.querySelectorAll("tr.question").forEach((question) => {
		++questionTypes;
		let info = question.getAttribute("info");
		let [_, pts, times] = info.split("-");
		pts = parseInt(pts);
		times = parseInt(times);
		points += parseInt(pts) * parseInt(times);
		questions += parseInt(times);
	});

	document.getElementById("all-rows").innerHTML = questionTypes;
	document.getElementById("all-questions").innerHTML = questions;
	document.getElementById("all-points").innerHTML = points;

	const minScore = document.getElementById("min-score");
	const slider = document.querySelector('input[type="range"]');

	minScore.value = parseInt(slider.value);
}

function updateTable() {
	updateSummary();

	document.querySelectorAll("input.question-input").forEach((input) => {
		input.onchange = (event) => {
			let input = event.target;
			let val = input.value;
			input.setAttribute("value", val);
			let info = input.parentElement.parentElement.getAttribute("info");
			let [a, b, c] = info.split("-");
			if (input.parentElement.classList.contains("td1")) {
				a = val;
			} else if (input.parentElement.classList.contains("td2")) {
				b = val;
			} else {
				c = val;
			}
			input.parentElement.parentElement.setAttribute("info", `${a}-${b}-${c}`);

			updateSummary();
		};
	});

	const minScore = document.getElementById("min-score");
	const slider = document.querySelector('input[type="range"]');

	slider.onchange = () => {
		minScore.value = parseInt(slider.value);
		slider.setAttribute("value", slider.value);
	};

	slider.onmousemove = () => {
		minScore.value = parseInt(slider.value);
		slider.setAttribute("value", slider.value);
	};
}

function addRow() {
	++questionTypes;
	questions += 10;
	points += 10;
	table.innerHTML = table.innerHTML.replace(
		'<tr class="ending-tr">',
		`
		<tr class="question" info="4-1-10" id="tr${questionTypes}">
			<td><button class="remove-row-button" onclick="removeRow(${questionTypes});"></button></td>
			<td class="td1"><input type="number" class="question-input" min="2" value="4" /></td>
			<td class="td2"><input type="number" class="question-input" min="0" value="1" /></td>
			<td class="td3"><input type="number" class="question-input" min="1" value="10" /></td>
		</tr>
		
		<tr class="ending-tr">`
	);
	//
	updateTable();
}

function removeRow(id) {
	table.innerHTML = table.innerHTML.replace(new RegExp(`<tr class="question" info="[0-9]*-[0-9]*-[0-9]*" id="tr${id}">\n((\t)+<td( class="td[0-9]+")?>.*<\/td>\n){4}(\t)*<\/tr>`), "");

	updateTable();
}

function getLocalProbabilityOfExactly(n, options, times) {
	let p = 1;
	for (let i = n; i < times; p *= ++i);

	for (let i = 1; i < times - n; p /= ++i);

	p *= Math.pow(1 / options, n);
	p *= Math.pow(1 - 1 / options, times - n);

	return p;
}

function getProbabilityOfExactly(n) {}

function calculate() {
	getLocalProbabilityOfExactly(5, 2, 19);
	updateTable();

	const tbl = document.getElementById("answer-table");

	let html = "<tr><td>Requied points</td><td>";

	let goal = Math.ceil((parseInt(document.querySelector('input[type="range"]').value) / 100) * points);

	let prob100 = 1,
		prob0 = 1,
		prob = 1;

	let data = [];

	document.querySelectorAll("tr.question").forEach((tr) => {
		let info = tr.getAttribute("info");
		let [options, points, times] = info.split("-");
		options = parseInt(options);
		points = parseInt(points);
		times = parseInt(times);

		data.push([options, points, times]);

		prob100 *= Math.pow(1 / options, times);
		prob0 *= Math.pow(1 - 1 / options, times);
	});

	html += goal + `</td></tr><tr><td>Probability of getting 100%</td><td>${Math.round(prob100 * 100_00000000) / 1_00000000}%</td></tr>`;
	html += `<tr><td>Probability of getting 0%</td><td>${Math.round(prob0 * 100_00000000) / 1_00000000}%</td></tr>`;

	for (let i = goal; i < points; ++i) {
		prob += getProbabilityOfExactly(i);
	}

	html += `<tr><td>Probability of getting ${goal} pts</td><td>${Math.round(prob * 100_00000000) / 1_00000000}%</td></tr>`;

	html += "</table>";

	tbl.innerHTML = html;
}

addRow();
