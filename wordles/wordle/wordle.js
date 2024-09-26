const params = new URL(window.location.href).searchParams;
var answer, check_dict, alphabet;

if (params.get("length") == null) {
	alphabet = generate(5, 6);
} else if (params.get("word") != null) {
	alphabet = generate(params.get("word").length / 2, 6);
} else {
	alphabet = generate(parseInt(params.get("length")), 6);
}

console.log(alphabet);
