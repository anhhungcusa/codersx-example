var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
var app = express();
const port = process.env.PORT || 4001;

app.set("view engine", "pug");
// use middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
let todos = ["Đi chợ", "Nấu cơm", "Rửa bát", "Học code tại CodersX"];

app.get("/", (req, res) => res.render("index", { todos }));
// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

app.get("/todos", (req, res) => {
  // query
  const { q } = req.query;
  let matchedTodos = todos;
  if (q) {
    matchedTodos = todos.filter(todo =>
      todo.toUpperCase().includes(q.toUpperCase())
    );
  }
  res.render("todo", {
    todos: matchedTodos
  });
});

app.post("/todos/create", (req, res) => {
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).send("Invalid todo");
  }
  todos.push(todo);
  return res.redirect("back");
});

var listener = app.listen(port, function() {
  console.log("Listening on port " + listener.address().port);
});
