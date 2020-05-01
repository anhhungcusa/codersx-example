require("dotenv").config();
const express = require("express");
const bodyParse = require("body-parser");
const cookieParse = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8080;
const initRoutes = require("./routes/routes");
const initRestRoutes = require("./api/index");
const { createConnection } = require("./db");
// init connect  to mongodb atlas
createConnection();
// template engine
app.set("view engine", "pug");
// middlware
app.use(express.static("public"));
app.use(cookieParse(process.env.SECRET_KEY || "hello-codersX"));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

// init routes
initRoutes(app);
initRestRoutes(app);
app.get("*", (req, res) => res.send("route not found"));

const listener = app.listen(port, function() {
  console.log("Listening on port:" + listener.address().port);
});
