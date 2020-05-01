const Book = require("../models/book.model");
const Session = require("../models/session.model");
module.exports.index = (req, res) => {
  res.render("common/head", { auth: req.user });
};

module.exports.cartPage = async (req, res) => {
  const { sessionId } = req.signedCookies;

  const session = await Session.findById(sessionId);
  let books = [];
  if (session) {
    books = await Book.find({ _id: { $in: session.books } });
  }
  res.render("user/cart", { auth: req.user, books });
};
