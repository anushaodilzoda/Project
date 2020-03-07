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

app.get("/view_favoites", function(req, res) {
  // var signedInUser = null;
  // if (typeof localStorage === "undefined" || localStorage === null) {
  //   var LocalStorage = require('node-localstorage').LocalStorage;
  //   localStorage = new LocalStorage('./scratch');
  //   signedInUser = localStorage.getItem('Signed in user: ');
  // }
//   console.log("local storage:: >>>>>>>>" + signedInUser);
// if(signedInUser=== null){
  res.sendFile(path.join(__dirname, "public/favorites.html"));
// } else if(signedInUser=== null || signedInUser === "undefined") {
//   // alert("Please sign in");
//   console.log("Please sign in");
// }
});

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



app.post("/addFav", function(req, res) {
      var str="";

      var user=JSON.stringify(req.body.data[1].user);

      user=user.substring(1,user.length-1);
    
      connection.query(
      "SELECT user_favorites FROM users WHERE user_email='"+user+"'",

        function(err, result) {
            if (err) throw err;
            if(result[0].user_favorites==null || result=="null"){
              str=req.body.data[0].location_id+":"+req.body.data[0].name+",";
            }else{
              str=result[0].user_favorites+req.body.data[0].location_id+":"+req.body.data[0].name+",";
            }
            console.log("obj to insert: "+str);
            connection.query(
              "UPDATE users SET user_favorites='"+str+"' WHERE user_email='"+user+"'",
              function(err, result) {
                  if (err) throw err;
              }
          );       
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
