const db = require("../db");
const shortId = require("shortid");
// index page
module.exports.index = (req, res) => {
  let transactions = db.get("transactions").value();
  if (transactions.length > 0) {
    const users = db.get("users").value();
    const books = db.get("books").value();
    transactions = transactions.map(trans => {
      const { bookId, userId, id } = trans;
      const user = users.find(val => val.id === userId);
      const book = books.find(val => val.id === bookId);
      return { id, user, book };
    });
  }
  res.render("transaction/index", { transactions });
};

// create page
module.exports.createPage = (req, res) => {
  const users = db.get("users").value();
  const books = db.get("books").value();
  return res.render("transaction/create", { books, users });
};

// add new transaction
module.exports.addTransaction = (req, res) => {
  const { userId, bookId } = req.body;
  if (!userId || !bookId) return res.status(400).send("Invalid request");
  db.get("transactions")
    .push({ userId, bookId, id: shortId() })
    .write();
  return res.redirect("/transactions");
};

// delete transaction
module.exports.deleteTransaction = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Invalid request");
  db.get("transactions")
    .remove({ id })
    .write();
  return res.redirect("/transactions");
};
