const Book = require("../models/book.model");
const Session = require("../models/session.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { generatePagination, Exception, checkIsImage } = require("../utils");
// list book
module.exports.index = async (req, res) => {
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? Math.abs(+page) : 0;
  limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
  const length = await Book.estimatedDocumentCount();
  let pagination = null;
  let books = [];
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
    books = await Book.find({}, null, { limit, skip });
    const links = generatePagination(page, paginationSizes, numPages);
    pagination = {
      links,
      numPages,
      page,
      limit,
      start: skip
    };
  }

  return res.render("book/index", {
    books,
    auth: req.user,
    pagination
  });
};

// create page
module.exports.createPage = (req, res) =>
  res.render("book/create", { auth: req.user });

// add new book
module.exports.addBook = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title) throw new Exception("Title is not valid");
    if (!description) throw new Exception("Description is not valid");
    if (!req.file) {
      throw new Exception("Image is required");
    }
    if (!checkIsImage(req.file.mimetype)) {
      throw new Exception("Image is not valid");
    }

    const path = await cloudinary.uploader
      .upload(req.file.path, {
        public_id: `student/${req.file.filename}`,
        tags: "student"
      })
      .then(result => result.url)
      .catch(_ => false);
    if (!path) throw new Exception("There was an error saving your image");

    const newBook = new Book({ title, description, imgUrl: path });
    await newBook.save();

    // add dum data
    fs.unlinkSync(req.file.path);
    return res.redirect("/books");
  } catch (error) {
    return res.render("book/create", { error: error.message });
  }
};

// delete a book
module.exports.deleteBook = async (req, res, next) => {
  const { id } = req.params;
  if (id) {
    await Book.findByIdAndRemove(id);
    return res.redirect("/books");
  }
  return next(new Error("Invalid id"));
};

// update page
module.exports.updatePage = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.send("Invalid id");
  const book = await Book.findById(id);
  return res.render("book/update", { book, auth: req.user });
};
// update book
module.exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!id || !title) return res.status(400).send("Invalid request");
  await Book.findByIdAndUpdate(id, { title });
  return res.redirect("/books");
};

// add book to session cart
module.exports.addToCart = async (req, res) => {
  const { sessionId } = req.signedCookies;
  const { bookId } = req.params;
  if (!sessionId) {
    const newSession = new Session({ books: [bookId] });
    await newSession.save();
    res.cookie("sessionId", newSession._id, {
      maxAge: 24 * 3600 * 1000,
      signed: true
    });
    return res.redirect("/books");
  }
  await Session.findOneAndUpdate(
    { books: { $nin: bookId }, _id: sessionId },
    { $push: { books: bookId } }
  );
  res.redirect("/books");
};
