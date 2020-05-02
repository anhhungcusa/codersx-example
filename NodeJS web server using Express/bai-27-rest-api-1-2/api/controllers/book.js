const Book = require("../../models/book.model");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { statusCodes } = require("../../utils/constant");
const { Exception, checkIsImage } = require("../../utils");
// list book
module.exports.getBooks = async (req, res) => {
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 3;
  try {
    const length = await Book.estimatedDocumentCount();
    if (length === 0)
      throw new Exception("Books not found", statusCodes.NOT_FOUND);
    // skip
    const skip = page * limit;
    const books = await Book.find({}, null, { limit, skip });
    if (books.length === 0)
      throw new Exception("Books not found", statusCodes.NOT_FOUND);
    const pagination = {
      page,
      limit,
      length
    };
    return res.status(statusCodes.OK).json({ books, pagination });
  } catch ({
    statusCode = statusCodes.BAD_REQUEST,
    message = "Invalid Request"
  }) {
    return res.status(statusCode).json({ message });
  }
};
// get book by id
module.exports.getBookById = async (req, res) => {
  // query params
  const { id } = req.params;
  try {
    if (!id) throw new Exception("BookID is not valid");
    const book = await Book.findById(id);
    if (!book) throw new Exception("Book not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).json({ book });
  } catch ({
    statusCode = statusCodes.BAD_REQUEST,
    message = "Invalid Request"
  }) {
    return res.status(statusCode).json({ message });
  }
};

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
    // delete file uploaded to cloundinary in server
    fs.unlinkSync(req.file.path);
    return res.status(statusCodes.OK).json({ newBook });
  } catch ({ message = "Invalid Request" }) {
    return res.status(statusCodes.BAD_REQUEST).json({ message });
  }
};

// delete a book
module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) throw new Exception("BookID is not valid");
    const book = await Book.findByIdAndRemove(id);
    if (book) throw new Exception("Book not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).send({ book });
  } catch ({
    message = "Invalid Request",
    statusCode = statusCodes.BAD_REQUEST
  }) {
    return res.status(statusCodes).send({ message });
  }
};

// update book
module.exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    if (!id) throw new Exception("BookID is not valid");
    if (!title) throw new Exception("Title is not valid");
    const book = await Book.findByIdAndUpdate(id, { title }, { new: true });
    if (!book) throw new Exception("Book not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).send({ book });
  } catch ({
    statusCode = statusCodes.BAD_REQUEST,
    message = "Invalid Requset"
  }) {
    return res.status(statusCode).send({ message });
  }
};
