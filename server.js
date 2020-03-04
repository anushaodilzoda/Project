var express = require("express");
const path=require("path");



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


app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
