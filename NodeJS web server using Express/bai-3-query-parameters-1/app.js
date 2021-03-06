var express = require("express");
var path = require("path");

var app = express();
const port = process.env.PORT || 4001;
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
const todos = ["Đi chợ", "Nấu cơm", "Rửa bát", "Học code tại CodersX"];

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.render("index"));
// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});
app.get("/todos", (req, res) => {
  // query
  const { q } = req.query;

  const matchedTodos = todos.filter(todo =>
    todo.toUpperCase().includes(q.toUpperCase())
  );
  res.render("todo", {
    todos: matchedTodos
  });
});

var listener = app.listen(port, function() {
  console.log("Listening on port " + listener.address().port);
});
