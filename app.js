const express = require("express");
const mongoose = require;

const app = express();

//connect to mongoDB
const dbURL = "mongodb+srv://admin:haslo123@cluster.zy4soi2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
app.set("view engine", "ejs");

app.listen(3000, (req, res) => {
	console.log("Server Running");
});
app.use(express.static("public"));

app.use((req, res, next) => {
	next();
});

app.get("/", (req, res) => {
	res.render("index", {title: "Nasze osiedle"});
});

app.get("/add_event", (req, res) => {
	res.render("add_event", {title: "Dodaj event"});
});

app.get("/login", (req, res) => {
	res.render("login", {title: "Logowanie"});
});

app.get("/profile", (req, res) => {
	res.render("profile", {title: "Profil"});
});

app.get("/register", (req, res) => {
	res.render("register", {title: "Rejestracja"});
});

//error 404
app.use((req, res) => {
	res.render("badrequest", {title: "Error 404"});
});
