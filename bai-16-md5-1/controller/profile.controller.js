const db = require("../db");
const { Exception } = require("../utils");
const { hashPassword, verifyPassword } = require("../utils");
// change password page
module.exports.changePasswordPage = (req, res) => {
  return res.render("profile/change-password");
};

// update password
module.exports.changePassword = (req, res) => {
  const user = req.user;
  const { old_password, new_password, confirm_password } = req.body;
  try {
    if (new_password !== confirm_password) {
      throw new Exception("Confirm password does not match");
    }
    if (verifyPassword(user.password, old_password) === false) {
      throw new Exception("Old password incorrect");
    }
    db.get("users")
      .find({ id: user.id })
      .assign({ password: hashPassword(new_password) })
      .write();
    return res.redirect("/");
  } catch (error) {
    return res.render("profile/change-password", {
      old_password,
      new_password,
      confirm_password,
      error: error.message
    });
  }
};
