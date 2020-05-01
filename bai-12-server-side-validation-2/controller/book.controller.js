const db = require("../db");
const shortId = require("shortid");

// list book
module.exports.index = (req, res) => {
  const books = db.get("books").value();
  return res.render("book/index", {
    books
  });
};

// create page
module.exports.createPage = (req, res) => res.render("book/create");

// add new book
module.exports.addBook = (req, res) => {
  const { title, description } = req.body;
  const newBook = { title, description, id: shortId() };
  db.get("books")
    .push(newBook)
    .write();
  return res.redirect("/books");
};

// delete a book
module.exports.deleteBook = (req, res) => {
  const { id } = req.params;
  if (id) {
    db.get("books")
      .remove({ id })
      .write();
    return res.redirect("/books");
  }
  return res.send("Invalid id");
};

// update page
module.exports.updatePage = (req, res) => {
  const { id } = req.params;
  if (!id) return res.send("Invalid id");
  const book = db
    .get("books")
    .find({ id })
    .value();
  return res.render("book/update", { book });
};
// update book
module.exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!id || !title) return res.status(400).send("Invalid request");
  db.get("books")
    .find({ id })
    .assign({ title })
    .write();
  return res.redirect("/books");
};
