const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const path = require('path');
const methodOverride = require("method-override");

const app = express();

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, "public")));;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "windows123",
    database: "delta_app"
});

// Faker function
// function createRandomUser() {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(),
//         faker.internet.email(),
//         faker.internet.password()
//     ];
// }

// HOME ROUTE
app.get("/", (req, res) => {

    let q = 'SELECT count(*) FROM users';

    connection.query(q, (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        let count = result[0]["count(*)"];

        res.render("home.ejs", { count });

    });
});
// for adding new user:
app.get("/newuser", (req, res) => {
    res.render("newuser.ejs");
});


app.post("/user/newuser", (req, res) => {

    let { id, name, email, password } = req.body;

    let q = "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)";

    connection.query(q, [id, name, email, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Insert failed");
        }

        res.redirect("/user");
    });
});

// SHOW USERS ROUTE
app.get("/user", (req, res) => {

    let q = `SELECT * FROM users`;

    connection.query(q, (err, user) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("user.ejs", { user });

    });
});

// EDIT ROUTE
app.get("/user/:id/edit", (req, res) => {

    let { id } = req.params;

    let q = `SELECT * FROM users WHERE id = ?`;

    connection.query(q, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        let user = result[0];

        res.render("edit.ejs", { user });

    });
});

// UPDATE ROUTE
app.patch("/user/:id", (req, res) => {

    let { id } = req.params;

    let { password: formpassword, username: newname } = req.body;

    let q = `SELECT * FROM users WHERE id = '${id}'`;

    connection.query(q, (err, result) => {

        if (err) {
            console.log(err);
            if(formpassword!=users.password)
            {
                res.send("wrong password");
            }
        }
        else {
        let q2 =`Update users set name=${newname} where id='${id}' `;
            connection.query(q2, (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect("/user");
                }
            });
        }
    });
});
// Delete:
app.get("/user/:id/delete", (req, res) => {

    let { id } = req.params;
    let q = "SELECT * FROM users WHERE id = ?";

    connection.query(q, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        let user = result[0];

        res.render("delete.ejs", { user });
    });
});
app.post("/user/:id/delete", (req, res) => {

    let { id } = req.params;
    let { email, password } = req.body;

    let q1 = "SELECT * FROM users WHERE id = ? AND email = ? AND password = ?";

    connection.query(q1, [id, email, password], (err, result) => {

        if (err) return res.send("DB error");


        let q2 = "DELETE FROM users WHERE id = ?";

        connection.query(q2, [id], (err2) => {

            if (err2) return res.send("Delete failed");

            res.redirect("/user");
        });
    });
});


// SERVER
app.listen(3000, () => {
    console.log("server is listening on port 3000");
});