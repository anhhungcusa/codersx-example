const express = require("express");
const bodyParse = require("body-parser");
const app = express();

// template engine
app.set("view engine", "pug");
// middlware
app.use(bodyParse.urlencoded({ extended: false }));

// routes
const bookRoute = require("./routes/book");

app.use("/books", bookRoute);

const listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
