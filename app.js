//requires
const express = require("express");
const mysql = require("mysql");
//app

const app = express();
// let email_ = req.body.email;
let email_;
var password_;

app.use(express.urlencoded({extended: true}));

//connect to mongoDB
// const dbURL = "mongodb+srv://admin:haslo123@cluster.zy4soi2.mongodb.net/LokalsiTarnowDB?retryWrites=true&w=majority&appName=Cluster";
// mongoose
// 	.connect(dbURL)
// 	.then((result) => {
// 		console.log("Connected to database");

// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

const connection = mysql.createConnection({
	host: "192.168.126.221",
	user: "root",
	password: "",
	database: "localsitarnowdb",
});
connection.connect((error) => {
	if (error) {
		console.log(error);
	} else {
		console.log("connected to database");

		app.listen(3000, (req, res) => {
			console.log("Server Running");
		});
	}
});

app.get("/add-user", (req, res, next) => {
	connection.query(
		"INSERT INTO users(email,password,estate,name,surname) VALUES('seba@gmail.com','1234','Moscice','Sebastian','Kusior');",
		(error, result) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Dodano użytkownika!");
				res.render("index", {title: "Nasze osiedle"});
			}
		}
	);
});

app.post("/add_post", (req, res) => {
	var content = req.body.content;
	var image = req.body.image;
	var user_id = 1; //req.body.user_id;
	var estate_id = 1; //req.body.estate_id;
	console.log(content, image);

	connection.query(`INSERT INTO post VALUES(NULL, '${content}', ${image}',0,0,${user_id},${estate_id})`, (error, result) => {
		if (error) {
			console.log(error);
			connection.query(
				"select content, image, name, image, surname from post INNER JOIN users ON post.users_id = users.id",
				(error, result) => {
					if (!error) {
						// console.log(result);
						res.render("index", {title: "Nasze osiedle", result: result});
					} else {
						// console.log(error);
						res.render("index", {title: "Nasze osiedle", result: undefined});
					}
				}
			);
		} else res.render("add_event", {title: "Dodaj event"});
	});
});

//set ejs
app.set("view engine", "ejs");

//middlewear
app.use(express.static("public"));

app.use((req, res, next) => {
	next();
});

app.get("/", (req, res) => {
	if (email_ == null && password_ == null) {
		res.render("login", {title: "Logowanie"});
	} else {
		connection.query("select content, image, name, likes, surname from post INNER JOIN users ON post.users_id = users.id", (error, result) => {
			if (!error) {
				// console.log(result);
				res.render("index", {title: "Nasze osiedle", result: result});
			} else {
				// console.log(error);
				res.render("index", {title: "Nasze osiedle", result: undefined});
			}
		});
	}
});

app.get("/add_event", (req, res) => {
	result = null;
	//res.render("index", {title: "Nasze osiedle", result: result});

	const query = "SELECT name, surname FROM users WHERE email = ? AND password = ?";

	connection.query(query, [email_, password_], (error, result) => {
		if (error) {
			console.log(error);
			return res.status(500).send("Błąd serwera");
		}

		if (result.length > 0) {
			console.log(result[0].name, result[0].surname, "!!!!!");
			res.render("add_event", {title: "Dodaj event", result: result[0]});
		} else {
			res.status(401).send("Nieautoryzowany dostęp");
		}
	});
});
app.get("/login", (req, res) => {
	if (email_ == null && password_ == null) {
		res.render("login", {title: "Logowanie"});
	} else {
		const query = "select content, image, name, likes, surname from post INNER JOIN users ON post.users_id = users.id";
		connection.query(query, (error, results) => {
			if (!error) {
				// console.log(result);
				res.render("index", {title: "Nasze osiedle", result: result});
			} else {
				// console.log(error);
				res.render("index", {title: "Nasze osiedle", result: undefined});
			}
		});
	}
});

app.get("/profile", (req, res) => {
	result = null;
	let user_id = 1; //req.body.user_id
	//res.render("index", {title: "Nasze osiedle", result: result});

	connection.query(
		`select name, surname, bio, post.content, image, likes, count(*) as numberofposts, count(comments.id) as comments from (users join post on users.id = post.users_id) join comments on post.id = comments.post_id where users_id = ${user_id} group by post.id;`,
		// `SELECT name, surname, bio, content, image, likes, count(*) as numberofposts from users INNER JOIN post ON users.id = post.users_id WHERE users_id = ${user_id}`,
		(error, result) => {
			if (!error) {
				res.render("profile", {title: "Mój profil", result: result});
			} else {
				console.log(error);
				res.render("profile", {title: "Mój profil", result: undefined});
			}
		}
	);
	// res.render("profile", {title: "Profil", result: {name: "Sebastian", surname: "Kusior", posts: 1}});
});

app.get("/register", (req, res) => {
	res.render("register", {title: "Rejestracja"});
});

//error 404

app.post("/login-submit", (req, res) => {
	email_ = req.body.email;
	password_ = req.body.password;
	const query = "SELECT email, password FROM users WHERE email = ? AND password = ?";

	connection.query(query, [email_, password_], (error, results) => {
		if (error) {
			console.error("Błąd zapytania:", error);
			return res.status(500).send("Błąd serwera");
		}

		if (results.length > 0) {
			console.log("ZALOGOWANO!");
			connection.query(
				"select content, image, name, likes, surname from post INNER JOIN users ON post.users_id = users.id",
				(error, result) => {
					if (!error) {
						// console.log(result);
						res.render("index", {title: "Nasze osiedle", result: result});
					} else {
						// console.log(error);
						res.render("index", {title: "Nasze osiedle", result: undefined});
					}
				}
			);
		} else {
			console.log("BŁĘDNE DANE!");
			res.status(401).send("Nieprawidłowy email lub hasło");
		}
	});
});

app.use((req, res) => {
	res.render("badrequest", {title: "Error 404"});
});
