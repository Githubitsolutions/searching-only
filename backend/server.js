const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = 4000;

let Post = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/posts", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

todoRoutes.route("/")
.get(function(req, res) {
  Post.find(function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.json(posts);
    }
  });
});

todoRoutes.route("/:id")
.get(function(req, res) {
  let id = req.params.id;
  Post.findById(id, function(err, post) {
    res.json(post);
  });
});

todoRoutes.route("/add")
.post(function(req, res) {
  let post = new Post(req.body);
  post.save()
    .then(post => {
      res.status(200).json({ post: "todo added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/update/:id")
.post(function(req, res) {
  Post.findById(req.params.id, function(err, todo) {
    if (!post) res.status(404).send("data is not found");
    else post.id = req.body.id;
    post.title = req.body.title;
    post.body = req.body.body;


    post.save()
      .then(post => {
        res.json("Todo updated");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

todoRoutes.route("/delete/:id")
.get(function(req, res) {
  let id = req.params.id;
  Post.findById(id, function(err, post) {
    post.remove({ _id: id })
      .then(post => {
        res.status(200).json({ post: "todo deleted successfully" });
      })
      .catch(err => {
        res.status(400).send("Deleting todo failed");
      });
  });
});

app.use("/posts", todoRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
