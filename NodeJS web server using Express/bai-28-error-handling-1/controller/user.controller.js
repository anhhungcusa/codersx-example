const User = require("../models/user.model");
const { Exception, hashPassword, generatePagination } = require("../utils");
// list user
module.exports.index = async (req, res) => {
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? Math.abs(+page) : 0;
  limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
  const length = await User.estimatedDocumentCount();
  let pagination = null;
  let users = [];

  if (length > 0) {
    // num of pages
    const numPages = Math.ceil(length / limit);

    // size of a pagination bar: default 5
    const paginationSizes = numPages >= 5 ? 5 : numPages;
    if (page >= numPages && numPages > 0) {
      page = numPages - 1;
    }

    // skip
    const skip = page * limit;
    users = await User.find({}, null, { limit, skip });
    const links = generatePagination(page, paginationSizes, numPages);
    pagination = {
      links,
      numPages,
      page,
      limit,
      start: skip
    };
  }

  return res.render("user/index", {
    users,
    auth: req.user,
    pagination
  });
};

// create page
module.exports.createPage = (req, res) =>
  res.render("user/create", { auth: req.user });

// add new user
module.exports.addUser = async (req, res, next) => {
  let { name, email } = req.body;
  email = email.trim();
  name = name.trim();
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
      email
    });
    await newUser.save();
    return res.redirect("/users");
  } catch (error) {
    return res.render("user/create", {
      auth: req.user,
      name,
      email,
      error: error.message
    });
  }
};

// delete a user
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    await User.findByIdAndRemove(id);
    return res.redirect("/users");
  }
  return res.send("Invalid id");
};

// update page
module.exports.updatePage = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.send("Invalid id");
  const user = await User.findById(id);
  return res.render("user/update", { user, auth: req.user });
};
// update user
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  let { name, email } = req.body;
  email = email.trim();
  name = name.trim();
  try {
    if (req.error) {
      throw new Exception(req.error);
    }
    const user = await User.findById(id);
    if (!user) throw Exception("User not found");
    // check email is existed
    const isExisted = await User.exists({ email });
    if (user.email !== email) {
      if (isExisted) throw new Exception("Email is existed");
      user.email = email;
    }
    if (user.name !== name) user.name = name;
    await user.save();
    return res.redirect("/users");
  } catch (error) {
    return res.render("user/update", {
      user: { name, _id: id, email },
      error: error.message,
      auth: req.user
    });
  }
};
