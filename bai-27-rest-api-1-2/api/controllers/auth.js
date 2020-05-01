const User = require("../../models/user.model");
const { Exception, verifyPassword } = require("../../utils");
const { statusCodes } = require("../../utils/constant");
const { generateAccessToken } = require("../../utils/jwt");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      await User.findByIdAndUpdate(
        user._id,
        { $inc: { wrongLoginCount: 1 } },
        { new: true }
      );
      throw new Exception("email or password incorrect");
    }
    const token = await generateAccessToken(
      user,
      process.env.JWT_SECRET_KEY,
      "7d"
    );

    // set user logging
    await User.findByIdAndUpdate(user._id, { isLogging: true }, { new: true });
    return res.status(statusCodes.OK).json({
      message: "You have successfully logged in",
      user,
      token
    });
  } catch ({ message = "Invalid request" }) {
    return res.status(statusCodes.BAD_REQUEST).json({ message });
  }
};

module.exports.logout = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Exception({ message: "User id is not valid" });
    }
    await User.findByIdAndUpdate(id, { isLogging: false }, { new: true });
    res.status(statusCodes.OK).json({ message: "Logout successfully" });
  } catch ({ message = "Invalid request" }) {
    res.status(statusCodes.BAD_REQUEST).json({ message });
  }
};
