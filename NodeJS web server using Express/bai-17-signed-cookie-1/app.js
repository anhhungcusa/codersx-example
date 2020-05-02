const express = require("express");
const bodyParse = require("body-parser");
const cookieParse = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8080;
const cookieMiddleware = require("./middleware/cookie");
const initRoutes = require("./routes/routes");
// template engine
app.set("view engine", "pug");
// middlware
app.use(express.static("public"));
app.use(cookieParse(process.env.SECRET_KEY || "hello-codersX"));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(cookieMiddleware.countCookie);
app.get("/", cookieMiddleware.sendCookie, (req, res) =>
  res.render("common/head")
);
// init routes
initRoutes(app);

const listener = app.listen(port, function() {
  console.log("Listening on port " + listener.address().port);
});
