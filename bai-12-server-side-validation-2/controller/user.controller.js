const db = require("../db");
const shortId = require("shortid");

// list user
module.exports.index = (req, res) => {
  const users = db.get("users").value();
  return res.render("user/index", {
    users
  });
};

// create page
module.exports.createPage = (req, res) => res.render("user/create");

// add new user
module.exports.addUser = (req, res) => {
  const { name } = req.body;
  if (!name || name.length > 30) {
    return res.render("user/create", {
      name,
      error: "Name length must be less than 30 characters"
    });
  }
  const newUser = { name, id: shortId() };
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
  return res.render("user/update", { user });
};
// update user
module.exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id || !name) return res.status(400).send("Invalid request");
  db.get("users")
    .find({ id })
    .assign({ name })
    .write();
  return res.redirect("/users");
};
