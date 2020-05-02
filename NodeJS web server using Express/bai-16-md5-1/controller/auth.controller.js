const db = require("../db");
const { Exception, hashPassword } = require("../utils");

module.exports.loginPage = (req, res) => res.render("auth/login");

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new Exception("email or password incorrect");
    const user = db
      .get("users")
      .find({ email, password: hashPassword(password) })
      .value();
    console.log({ email, password: hashPassword(password) });
    if (user === undefined) throw new Exception("email or password incorrect");
    // set user logging
    db.get("users")
      .find({ id: user.id })
      .assign({ isLogging: true })
      .write();
    const days = 2 * 1000 * 3600 * 24; // 2days
    res.cookie("access_id", user.id, { maxAge: days });
    return res.redirect("..");
  } catch (error) {
    return res.render("auth/login", { error: error.message, email, password });
  }
};

module.exports.logout = (req, res) => {
  const { id } = req.params;
  if (id) {
    db.get("users")
      .find({ id })
      .assign({ isLogging: false })
      .write();
  }
  res.clearCookie("access_id");
  res.redirect("/auth/login");
};
