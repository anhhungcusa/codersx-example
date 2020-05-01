const express = require("express");
const bodyParse = require("body-parser");
const app = express();

const initRoutes = require("./routes/routes");
// template engine
app.set("view engine", "pug");
// middlware
app.use(express.static("public"));
app.use(bodyParse.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("common/head"));
// init routes
initRoutes(app);

const listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
