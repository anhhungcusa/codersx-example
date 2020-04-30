var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid").v1;
const port = process.env.PORT || 4001;

const app = express();
const db = require("./db/db");

app.set("view engine", "pug");
// use middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const todos = db.get("todos").value();
  res.render("index", { todos });
});

app.get("/todos", (req, res) => {
  let todos = db.get("todos");
  // query
  const { q } = req.query;
  if (q) {
    todos = todos.filter(todo => {
      return todo.text.toLocaleLowerCase().includes(q.toLocaleLowerCase());
    });
  }
  todos = todos.value();
  res.render("todo", {
    todos
  });
});

app.post("/todos/create", (req, res) => {
  const { todo: text } = req.body;
  if (!text) {
    return res.status(400).send("Invalid todo");
  }
  db.get("todos")
    .push({ text, id: uuid() })
    .write();
  return res.redirect("back");
});

var listener = app.listen(port, function() {
  console.log("Listening on port " + listener.address().port);
});
