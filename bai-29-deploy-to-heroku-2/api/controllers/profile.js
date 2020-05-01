const cloudinary = require("cloudinary").v2;
const { statusCodes } = require("../../utils/constant");
const User = require("../../models/user.model");
const fs = require("fs");
const {
  hashPassword,
  Exception,
  verifyPassword,
  checkIsImage
} = require("../utils");

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
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        avatar: path
      },
      { new: true }
    );
    if (!updatedUser)
      throw new Exception("User not found", statusCodes.NOT_FOUND);

    fs.unlinkSync(req.file.path);
    res.status(statusCodes.OK).send({ user: updatedUser });
  } catch ({
    message = "Invalid request",
    statusCode = statusCodes.BAD_REQUEST
  }) {
    res.status(statusCode).send({ message });
  }
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
    if (isValidPassword === false) {
      throw new Exception("Old password incorrect");
    }
    const password = await hashPassword(new_password);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password },
      { new: true }
    );
    if (!updatedUser)
      throw new Exception("User not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).send({ user: updatedUser });
  } catch ({
    message = "Invalid request",
    statusCode = statusCodes.BAD_REQUEST
  }) {
    return res.status(statusCode).send({ message });
  }
};
