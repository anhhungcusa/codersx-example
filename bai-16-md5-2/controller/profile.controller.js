const db = require("../db");
const { Exception } = require("../utils");
const { hashPassword, verifyPassword } = require("../utils");
// change password page
module.exports.changePasswordPage = (req, res) => {
  return res.render("profile/change-password", { auth: req.user });
};

// update password
module.exports.changePassword = async (req, res) => {
  const user = req.user;
  const { old_password, new_password, confirm_password } = req.body;
  try {
    if (new_password !== confirm_password) {
      throw new Exception("Confirm password does not match");
    }
    const isValidPassword = await verifyPassword(user.password, old_password);
    console.log(isValidPassword, old_password);
    if (isValidPassword === false) {
      throw new Exception("Old password incorrect");
    }
    const password = await hashPassword(new_password);
    db.get("users")
      .find({ id: user.id })
      .assign({ password })
      .write();
    return res.redirect("/");
  } catch (error) {
    return res.render("profile/change-password", {
      old_password,
      new_password,
      confirm_password,
      error: error.message,
      auth: req.user
    });
  }
};
