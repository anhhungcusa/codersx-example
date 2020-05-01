const User = require("../models/user.model");
const { Exception, verifyPassword } = require("../utils");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.loginPage = (req, res) => {
  const { email, password } = req.query;
  res.render("auth/login", { email, password });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new Exception("email or password incorrect");
    const user = await User.findOne({ email });
    if (!user) {
      throw new Exception("email or password incorrect");
    }
    if (user.wrongLoginCount > 3) {
      const msg = {
        to: email,
        from: "nguyenvy3681@gmail.com",
        subject: "Your account are locked",
        text: "xxxxxxx",
        html:
          '<h1 style="color:red;font-size:50px">Your account has been locked for more than three times failed password entry attempts</h1>'
      };
      await sgMail.send(msg);
      throw new Exception("You've entered the wrong password too many times");
    }

    const isValidPassword = await verifyPassword(user.password, password);
    if (isValidPassword === false) {
      await User.findByIdAndUpdate(user._id, { $inc: { wrongLoginCount: 1 } });
      throw new Exception("email or password incorrect");
    }

    // set user logging
    await User.findByIdAndUpdate(user._id, { isLogging: true });
    const days = 2 * 1000 * 3600 * 24; // 2days
    res.cookie("access_id", user._id, { maxAge: days, signed: true });
    return res.redirect("..");
  } catch (error) {
    return res.render("auth/login", { error: error.message, email, password });
  }
};

module.exports.logout = async (req, res) => {
  const { id } = req.params;
  if (id) {
    await User.findByIdAndUpdate(id, { isLogging: false });
  }
  res.clearCookie("access_id");
  res.redirect("/auth/login");
};
