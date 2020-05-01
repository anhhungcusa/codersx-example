const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const db = require("../db");
const {
  hashPassword,
  Exception,
  verifyPassword,
  checkIsImage
} = require("../utils");

module.exports.index = (req, res) => {
  res.render("profile/index", { auth: req.user });
};

module.exports.avatarPage = (req, res) => {
  res.render("profile/avatar", { auth: req.user });
};

module.exports.changeAvatar = async (req, res) => {
  const user = req.user;
  try {
    if (!req.file) {
      throw new Exception("Avatar is required");
    }
    if (!checkIsImage(req.file.mimetype)) {
      throw new Exception("Avatar is not valid");
    }

    const path = await cloudinary.uploader
      .upload(req.file.path, {
        public_id: `student/${req.file.filename}`,
        tags: "student"
      })
      .then(result => result.url)
      .catch(_ => false);
    if (!path) throw new Exception("There was an error saving your avatar");
    db.get("users")
      .find({ id: user.id })
      .assign({ avatar: path })
      .write();
    fs.unlinkSync(req.file.path);
    res.redirect("/profile");
  } catch (error) {
    res.render("profile/avatar", { auth: user, error: error.message });
  }
};

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
