const db = require("../db");
const shortId = require("shortid");
const { generatePagination } = require("../utils");
// list book
module.exports.index = (req, res) => {
  const query = db.get("books");
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
  const books = query
    .drop(skip)
    .take(limit)
    .value();
  const links = generatePagination(page, paginationSizes, numPages);

  return res.render("book/index", {
    books,
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
  res.render("book/create", { auth: req.user });

// add new book
module.exports.addBook = (req, res) => {
  const { title, description } = req.body;
  const newBook = { title, description, id: shortId() };
  db.get("books")
    .push(newBook)
    .write();
  // add dum data
  if (false) {
    const dum = [
      "Bibliography of Oregon history",
      "Bibliography of Saskatchewan history",
      "Bibliography of South Dakota history",
      "Bibliography of the American Civil War",
      "Bibliography of the American Revolutionary War",
      "Bibliography of the Arab–Israeli conflict",
      "Bibliography of the Front de libération du Québec",
      "Bibliography of The Holocaust",
      "Bibliography of the Kent State shootings",
      "Bibliography of the Lewis and Clark Expedition",
      "Bibliography of the Ottoman Empire",
      "Bibliography of the Reconstruction Era",
      "Bibliography of the Republican Party",
      "Bibliography of the Rwandan genocide",
      "Bibliography of the War in Darfur",
      "Bibliography of the War of 1812",
      "Bibliography of the history of Lyon",
      "Bibliography of United States military history",
      "Bibliography of early U.S. naval history",
      "Bibliography of World War I",
      "Bibliography of World War II",
      "Bibliography of Wyoming history"
    ];
    dum.forEach(val => {
      const newB = { title: val, description: "text", id: shortId() };
      db.get("books")
        .push(newB)
        .write();
    });
  }
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
  return res.render("book/update", { book, auth: req.user });
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
