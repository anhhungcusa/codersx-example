const router = require("express").Router();
const db = require("../db");
const shortId = require("shortid");

// list book
router.get("/", (req, res) => {
  const books = db.get("books").value();
  return res.render("index", {
    books
  });
});

// create page
router.get("/create", (req, res) => res.render("create"));

// add new book
router.post("/", (req, res) => {
  const { title, description } = req.body;
  const newBook = { title, description, id: shortId() };
  db.get("books")
    .push(newBook)
    .write();
  return res.redirect("/books");
});

// delete a book
router.get("/:id/delete", (req, res) => {
  const { id } = req.params;
  if (id) {
    db.get("books")
      .remove({ id })
      .write();
    return res.redirect("/books");
  }
  return res.send("Invalid id");
});

// update page
router.get("/:id/update", (req, res) => {
  const { id } = req.params;
  if (!id) return res.send("Invalid id");
  const book = db
    .get("books")
    .find({ id })
    .value();
  return res.render("update", { book });
});
// update book
router.post("/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!id || !title) return res.status(400).send("Invalid request");
  db.get("books")
    .find({ id })
    .assign({ title })
    .write();
  return res.redirect("/books");
});
module.exports = router;
