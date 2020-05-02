require("dotenv").config();
const express = require("express");
const bodyParse = require("body-parser");
const cookieParse = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8080;
const cookieMiddleware = require("./middleware/cookie");
const initRoutes = require("./routes/routes");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// template engine
app.set("view engine", "pug");
// middlware
app.use(express.static("public"));
app.use(cookieParse(process.env.SECRET_KEY || "hello-codersX"));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(cookieMiddleware.countCookie);
app.get("/", cookieMiddleware.sendCookie, (req, res) => {
  res.render("common/head");
});

app.get("/send/:to", async (req, res) => {
  try {
    const { to } = req.params;
    const msg = {
      to,
      from: "nguyenvy3681@gmail.com",
      subject: "Sending with Twilio SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: '<h1 style="color:red;font-size:50px">an shit khong</h1>'
    };
    await sgMail.send(msg);
    res.send("email sended to " + to);
  } catch (error) {
    res.json(error);
  }
});

// init routes
initRoutes(app);

const listener = app.listen(port, function() {
  console.log("Listening on port " + listener.address().port);
});
