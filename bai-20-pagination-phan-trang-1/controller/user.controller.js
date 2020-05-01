const db = require("../db");
const shortId = require("shortid");
const { Exception, hashPassword, generatePagination } = require("../utils");
// list user
module.exports.index = (req, res) => {
  const query = db.get("users");
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 3;

  const length = query.size().value();

  // num of pages
  const numPages = Math.ceil(length / limit);

  // size of a pagination bar: default 5
  const paginationSizes = numPages >= 5 ? 5 : numPages;
  if (page >= numPages) {
    page = numPages - 1;
  }
  // skip
  const skip = page * limit;
  const users = query
    .drop(skip)
    .take(limit)
    .value();
  const links = generatePagination(page, paginationSizes, numPages);
  return res.render("user/index", {
    users,
    auth: req.user,
    pagination: {
      links,
      numPages,
      page,
      limit,
      start: skip
    }
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
    if (
      db
        .get("users")
        .find({ email })
        .value() !== undefined
    ) {
      throw new Exception("Email is existed");
    }
    const password = await hashPassword("123123");
    const newUser = {
      name,
      id: shortId(),
      password,
      email,
      role: 1,
      isLogging: false
    };
    db.get("users")
      .push(newUser)
      .write();
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
module.exports.deleteUser = (req, res) => {
  const { id } = req.params;
  if (id) {
    db.get("users")
      .remove({ id })
      .write();
    return res.redirect("/users");
  }
  return res.send("Invalid id");
};

// update page
module.exports.updatePage = (req, res) => {
  const { id } = req.params;
  if (!id) return res.send("Invalid id");
  const user = db
    .get("users")
    .find({ id })
    .value();
  return res.render("user/update", { user, auth: req.user });
};
// update user
module.exports.updateUser = (req, res) => {
  const { id } = req.params;
  let { name, email } = req.body;
  email = email.trim();
  name = name.trim();
  try {
    if (req.error) {
      throw new Exception(req.error);
    }
    const userQuery = db.get("users").find({ id });
    if (userQuery.value() === undefined) throw Exception("User not found");
    // check email is existed
    if (
      userQuery.value().email !== email &&
      db
        .get("users")
        .find({ email })
        .value()
    ) {
      throw new Exception("Email is existed");
    }
    userQuery.assign({ name, email }).write();
    return res.redirect("/users");
  } catch (error) {
    console.log(error);
    return res.render("user/update", {
      user: { name, id, email },
      error: error.message,
      auth: req.user
    });
  }
};
