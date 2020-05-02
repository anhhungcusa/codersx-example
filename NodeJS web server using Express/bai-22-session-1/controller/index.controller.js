const db = require("../db");
module.exports.index = (req, res) => {
  res.render("common/head", { auth: req.user });
};

module.exports.cartPage = (req, res) => {
  const { sessionId } = req.signedCookies;

  const cart = db
    .get("sessions")
    .find({ id: sessionId })
    .value();
  const bookIds = cart ? cart.books : [];
  const books = db
    .get("books")
    .filter(book => {
      return bookIds.includes(book.id);
    })
    .value();

  res.render("user/cart", { auth: req.user, books });
};
