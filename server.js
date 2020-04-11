var express = require("express");
const path = require("path");
var connection = require("./config/connection");

require("dotenv").config();

var app = express();

var PORT = process.env.PORT || 8082;

app.use(express.static(__dirname + "/public/"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/search", function(req, res) {
  res.sendFile(path.join(__dirname, "public/search.html"));
});

app.get("/places", function(req, res) {
  res.sendFile(path.join(__dirname, "public/places.html"));
});

app.get("/view_favorites", function(req, res) {
  res.sendFile(path.join(__dirname, "public/favorites.html"));
});

app.post("/submit", function(req, res) {
  connection.query(
    `INSERT INTO users(user_name, user_email, user_password, user_city, user_state, user_preferances) VALUES( ? , ? , ? , ? , ?, ?)`,
    [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.city,
      req.body.state,
      req.body.fav_food
    ],

    function(err, result) {
      if (err) throw err;

      res.redirect("/");
    }
  );
});

app.post("/addFav", function(req, res) {
  var str = "";

  var user = JSON.stringify(req.body.data[1].user);

  user = user.substring(1, user.length - 1);

  connection.query(
    "SELECT user_favorites FROM users WHERE user_email='" + user + "'",

    function(err, result) {
      var extract =
        req.body.data[0].name +
        ":" +
        req.body.data[0].address +
        ":" +
        req.body.data[0].latitude +
        ":" +
        req.body.data[0].longitude +
        ";;";
      if (err) throw err;
      if (result[0].user_favorites == null || result == "null") {
        str = extract;
      } else {
        str = result[0].user_favorites + extract;
      }
      connection.query(
        "UPDATE users SET user_favorites='" +
          str +
          "' WHERE user_email='" +
          user +
          "'",
        function(err, result) {
          if (err) throw err;
        }
      );
    }
  );
});

app.post("/comment", function(req, res) {
  connection.query(
    `INSERT INTO website_reviews(review_author, review_content) VALUES( ? , ?)`,
    [req.body.name, req.body.comment],
    function(err, result) {
      if (err) throw err;

      res.redirect("/");
    }
  );
});

app.post("/pullDb", function(req, res) {
  var user = JSON.stringify(req.body.user);
  user = user.substring(1, user.length - 1);
  connection.query(
    "SELECT user_favorites FROM users WHERE user_email='" + user + "'",
    function(err, result) {
      res.send(result);
    }
  );
});

app.delete("/deleteFav", function(req, res) {
  var user = JSON.stringify(req.body.data[0]);
  var deleteData = JSON.stringify(req.body.data[1]);
  user = user.substring(1, user.length - 1);
  deleteData = deleteData.substring(1, deleteData.length - 1);
  connection.query(
    "SELECT user_favorites FROM users WHERE user_email='" + user + "'",
    function(err, result) {
      var resultStr = result[0].user_favorites;
      resultStr = resultStr.substring(0, resultStr.length - 2);
      var arr = resultStr.split(";;");
      var newStr = "";
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].includes(deleteData)) continue;
        newStr += arr[i] + ";;";
      }
      connection.query(
        "UPDATE users SET user_favorites='" +
          newStr +
          "' WHERE user_email='" +
          user +
          "'",
        function(err, result) {
          if (err) throw err;
        }
      );
    }
  );
});

app.get("/signIn", function(req, res) {
  var username = req.query.username;
  var password = req.query.password;
  connection.query(
    "SELECT user_name FROM users WHERE user_email='" +
      username +
      "' and user_password='" +
      password +
      "'",
    function(err, result) {
      if (err) throw err;
      if (result[0] != undefined) {
        res.send(result[0].user_name);
      } else {
        res.send("user not found");
      }
    }
  );
});

app.get("/get_key", function(req, res) {
  res.send(process.env.TRIPADVISOR_KEY);
});

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
