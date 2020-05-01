const router = require("express").Router();
const db = require("../db");
const shortId = require("shortid");

// list user
router.get("/", (req, res) => {
  const users = db.get("users").value();
  return res.render("user/index", {
    users
  });
});

// create page
router.get("/create", (req, res) => res.render("user/create"));

// add new user
router.post("/", (req, res) => {
  const { name } = req.body;
  const newUser = { name: name, id: shortId() };
  db.get("users")
    .push(newUser)
    .write();
  return res.redirect("/users");
});

// delete a user
router.get("/:id/delete", (req, res) => {
  const { id } = req.params;
  if (id) {
    db.get("users")
      .remove({ id })
      .write();
    return res.redirect("/users");
  }
  return res.send("Invalid id");
});

// update page
router.get("/:id/update", (req, res) => {
  const { id } = req.params;
  if (!id) return res.send("Invalid id");
  const user = db
    .get("users")
    .find({ id })
    .value();
  return res.render("user/update", { user });
});
// update user
router.post("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id || !name) return res.status(400).send("Invalid request");
  db.get("users")
    .find({ id })
    .assign({ name })
    .write();
  return res.redirect("/users");
});

module.exports = router;
