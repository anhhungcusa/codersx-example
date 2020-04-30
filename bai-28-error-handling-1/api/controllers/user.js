const User = require("../../models/user.model");
const { statusCodes } = require("../../utils/constant");
const { Exception, hashPassword } = require("../../utils");

// list user
module.exports.getUsers = async (req, res) => {
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? Math.abs(+page) : 0;
  limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
  try {
    const length = await User.estimatedDocumentCount();
    if (length === 0)
      throw new Exception("Users not found", statusCodes.NOT_FOUND);
    const skip = page * limit;
    const users = await User.find({}, null, { limit, skip });
    const pagination = {
      page,
      limit,
      length
    };
    return res.status(statusCodes.OK).json({ users, pagination });
  } catch ({
    statusCode = statusCodes.BAD_REQUEST,
    message = "Invalid request"
  }) {
    return res.status(statusCode).json({ message });
  }
};
// get user by id
module.exports.getUserById = async (req, res) => {
  // query params
  const { id } = req.params;
  try {
    if (!id) throw new Exception("User id is not valid");
    const user = await User.findById(id);
    if (!user) throw new Exception("User not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).json({ user });
  } catch ({
    statusCode = statusCodes.BAD_REQUEST,
    message = "Invalid request"
  }) {
    return res.status(statusCode).json({ message });
  }
};
// add new user
module.exports.addUser = async (req, res) => {
  let { name, email, imgUrl } = req.body;
  email = email && email.trim();
  name = name && name.trim();
  try {
    if (req.error) {
      throw new Exception(req.error);
    }
    // check email is existed
    const isExisted = await User.exists({ email });
    if (isExisted) {
      throw new Exception("Email is existed");
    }
    const password = await hashPassword("123123");
    const newUser = new User({
      name,
      password,
      email,
      imgUrl
    });
    await newUser.save();
    return res.status(statusCodes.OK).json({ newUser });
  } catch ({ message = "Invalid request" }) {
    return res.status(statusCodes.BAD_REQUEST).json({ message });
  }
};

// delete a user
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) throw new Exception("User id is not valid");
    const user = await User.findByIdAndRemove(id);
    if (!user) throw new Exception("User not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).end();
  } catch (error) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: "Invalid request" });
  }
};

// update user
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  let { name, email } = req.body;
  email = email && email.trim();
  name = name && name.trim();
  try {
    if (!id) throw new Exception("User id is not valid");
    if (req.error) {
      throw new Exception(req.error);
    }
    const user = await User.findById(id);
    if (!user) throw new Exception("User not found", statusCodes.NOT_FOUND);
    // check email is existed
    const isExisted = await User.exists({ email });
    if (user.email !== email) {
      if (isExisted) throw new Exception("Email is existed");
      user.email = email;
    }
    if (user.name !== name) user.name = name;
    await user.save();
    return res.status(statusCodes.OK).json({ user });
  } catch ({ message = "Invalid request" }) {
    return res.status(statusCodes.BAD_REQUEST).json({ message });
  }
};
