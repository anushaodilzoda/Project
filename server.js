var express = require("express");
const path=require("path");
var connection = require("./config/connection");



var app = express();

var PORT = process.env.PORT || 8080;

 app.use(express.static(__dirname +"/public/"));
app.use(express.static(path.join(__dirname, '/public')));

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


// app.post("/api/burgers", function(req, res) {
//     orm.insert("burgers", "name", req.body.name, function(data){
//         res.json({ id: data.insertId });
//     })
// });


// app.put("/api/burgers/:id", function(req, res) {
//     orm.update("burgers", "deleted","y", req.params.id, function(data){
//         res.status(200).end();
//     })
//   });

//   app.delete("/api/burgers/:id", function(req, res) {
//     orm.delete("burgers", "id", req.params.id, function(data){
//         res.status(200).end();
//     })
//   });

app.post("/submit", function(req, res) {
  connection.query(
      `INSERT INTO users(user_name, user_email, user_password, user_city, user_state, user_preferances) VALUES( ? , ? , ? , ? , ?, ?)`, [
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

app.post("/comment", function(req, res) {
  // When using the MySQL package, we'd use ?s in place of any values to be inserted, which are then swapped out with corresponding elements in the array
  // This helps us avoid an exploit known as SQL injection which we'd be open to if we used string concatenation
  // https://en.wikipedia.org/wiki/SQL_injection
  connection.query(
    `INSERT INTO website_reviews(review_author, review_content) VALUES( ? , ?)`, [req.body.name, req.body.comment],
      function(err, result) {
          if (err) throw err;

          res.redirect("/");
      }
  );
});

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});