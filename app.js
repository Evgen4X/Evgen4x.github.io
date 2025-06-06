//requires
const express = require("express");
const mysql = require("mysql");

//app

const app = express();
app.use(express.urlencoded({extended: true}));
var email_;
var password_;
var estate_;
var query_main =
	"select content, image, CONCAT(YEAR(post.date),'-',MONTH(post.date),'-',DAY(post.date),' ',HOUR(post.date),':',MINUTE(post.date)) AS date_format, name, likes, liked, surname from post INNER JOIN users ON post.users_id = users.id WHERE users.estate_id = post.estate_id and users.id = ? ORDER BY post.date DESC";

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
	host: "192.168.0.175",
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

	const query = "SELECT id, estates_id FROM users WHERE email = ? AND password = ?";

	connection.query(query, [email_, password_], (error, result) => {
		if (result) {
			user_id = result[0].id;
			estate_id = result[0].estates_id;
		}
	});

	//var date_ = req.body.date_;
	// console.log("content:", content, "image: ", image);

	connection.query(
		`INSERT INTO post(content, image,likes, comments_id, users_id, estate_id,date) VALUES('${content}', '${image}',0,0,${user_id},${estate_id},CURRENT_DATE())`,
		(error, result) => {
			// console.log(error);
			connection.query(query_main, [user_id], (error, result) => {
				if (!error) {
					// console.log(result);
					// for (let i = 0; i < result.length; ++i) {
					// 	result[i][image] = result[i][image].toString("hex");
					// 	console.log(new Buffer(result[i][image]));
					// }
					res.render("index", {title: "Nasze osiedle", result: result});
				} else {
					// console.log(error);
					res.render("index", {title: "Nasze osiedle", result: undefined});
				}
			});
		}
	);
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
		// user_id = 1; //req.body.user_id;
		const query = "SELECT id, estates_id FROM users WHERE email = ? AND password = ?";

		connection.query(query, [email_, password_], (error, result) => {
			if (result) {
				user_id = result[0].id;
			}
		});
		console.log("user_id: ", user_id);
		connection.query(query_main, [user_id], (error, result) => {
			if (!error) {
				// console.log(result);
				res.render("index", {title: "Nasze osiedle", result: result});
			} else {
				console.log(error);
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
			// console.log(result[0].name, result[0].surname, "!!!!!");
			res.render("add_event", {title: "Dodaj event", result: result[0]});
		} else {
			res.status(401).send("Nieautoryzowany dostęp");
		}
	});
});
app.get("/login", (req, res) => {
	console.log(email_);
	if (email_ == null && password_ == null) {
		res.render("login", {title: "Logowanie"});
	} else {
		user_id = 1; //req.body.user_id;
		const query = "SELECT id, estates_id FROM users WHERE email = ? AND password = ?";

		connection.query(query, [email_, password_], (error, result) => {
			if (result) {
				user_id = result[0].id;
			}
		});

		connection.query(query_main, [user_id], (error, result) => {
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
	let user_id = 1; //req.body.user_id;
	//res.render("index", {title: "Nasze osiedle", result: result});

	connection.query(
		`select name, surname, bio, post.content, image, likes, liked from (users join post on users.id = post.users_id) where users_id = ${user_id} group by post.id;`,
		(error, result) => {
			if (!error) {
				result.forEach((row) => {
					if (row.image) {
						row.base64Image = row.image.toString("base64");
					}
				});
				// console.log(result);

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

app.get("/logout", (req, res) => {
	res.render("logout", {title: "Log out"});
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
			// estate_ = results[0].name;
			// console.log(estate_);
			user_id = 1; //req.body.user_id;
			const query = "SELECT id, estates_id FROM users WHERE email = ? AND password = ?";

			connection.query(query, [email_, password_], (error, result) => {
				if (result) {
					user_id = result[0].id;
				}
			});
			connection.query(query_main, [user_id], (error, result) => {
				if (!error) {
					// console.log(result);
					res.render("index", {title: "Nasze osiedle", result: result});
				} else {
					// console.log(error);
					res.render("index", {title: "Nasze osiedle", result: undefined});
				}
			});
		} else {
			console.log("BŁĘDNE DANE!");
			// res.status(401).send("Nieprawidłowy email lub hasło");

			res.render("login");
		}
	});
});

app.use((req, res) => {
	res.render("badrequest", {title: "Error 404"});
});
