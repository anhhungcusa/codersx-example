const express = require("express");
const bodyParse = require("body-parser");
const app = express();

// template engine
app.set("view engine", "pug");
// middlware
app.use(bodyParse.urlencoded({ extended: false }));

// routes
const bookRoute = require("./routes/book");
const userRoute = require("./routes/user");
app.use("/books", bookRoute);
app.use("/users", userRoute);
const listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
