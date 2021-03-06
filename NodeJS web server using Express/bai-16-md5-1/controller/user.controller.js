const db = require("../db");
const shortId = require("shortid");
const { Exception } = require("../utils");
// list user
module.exports.index = (req, res) => {
  const users = db.get("users").value();
  return res.render("user/index", {
    users,
    auth: req.user
  });
};

// create page
module.exports.createPage = (req, res) =>
  res.render("user/create", { auth: req.user });

// add new user
module.exports.addUser = (req, res, next) => {
  let { name, email } = req.body;
  email = email.trim();
  name = name.trim();
  if (req.error) {
    return res.render("user/create", {
      name,
      error: req.error,
      auth: req.user
    });
  }
  // check email is existed
  if (
    db
      .get("users")
      .find({ email })
      .value() !== undefined
  ) {
    return res.render("user/create", {
      name,
      email,
      error: "Email is existed",
      auth: req.user
    });
  }

  const newUser = {
    name,
    id: shortId(),
    password: "123123",
    email,
    role: 1,
    isLogging: false
  };
  db.get("users")
    .push(newUser)
    .write();
  return res.redirect("/users");
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
