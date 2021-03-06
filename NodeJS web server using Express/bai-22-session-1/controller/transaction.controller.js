const db = require("../db");
const shortId = require("shortid");
const { generatePagination, Exception } = require("../utils");
// index page
module.exports.index = (req, res) => {
  let transactions = db.get("transactions").value();
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 3;
  let pagination = null;

  if (transactions.length > 0) {
    const users = db.get("users").value();
    const books = db.get("books").value();
    if (req.user.role !== 0) {
      transactions = transactions.filter(trans => {
        const { userId, isCompleted } = trans;
        const user = users.find(val => val.id === userId) || {};
        if (isCompleted === true || user.isLogging === false || user.role === 0)
          return false;
        return true;
      });
    }
    transactions = transactions.map(trans => {
      const { bookIds, userId, id, isCompleted } = trans;
      const user = users.find(val => val.id === userId);
      const rentedBooks = books.filter(val => bookIds.includes(val.id));
      return { id, user, books: rentedBooks, isCompleted };
    });

    // pagination
    const length = transactions.length;
    // num of pages
    const numPages = Math.ceil(length / limit);

    // size of a pagination bar: default 5
    const paginationSizes = numPages >= 5 ? 5 : numPages;
    if (page >= numPages) {
      page = numPages - 1;
    }
    // skip
    const skip = page * limit;
    transactions = transactions.slice(skip, skip + limit);
    const links = generatePagination(page, paginationSizes, numPages);
    pagination = {
      links,
      numPages,
      page,
      limit,
      start: skip
    };
  }
  res.render("transaction/index", { transactions, auth: req.user, pagination });
};

// create page
module.exports.createPage = (req, res) => {
  const users = db.get("users").value();
  const books = db.get("books").value();
  return res.render("transaction/create", { books, users, auth: req.user });
};

// add new transaction
module.exports.addTransaction = (req, res) => {
  const { userId, bookId } = req.body;
  if (!userId || !bookId) return res.status(400).send("Invalid request");
  db.get("transactions")
    .push({ userId, bookIds: [bookId], id: shortId(), isCompleted: false })
    .write();
  return res.redirect("/transactions");
};

module.exports.addTransactionWithBulk = (req, res) => {
  const { sessionId } = req.signedCookies;
  const { user } = req;
  try {
    if (!sessionId || !user) throw new Exception("Invalid Request");
    const cart = db
      .get("sessions")
      .find({ id: sessionId })
      .value();
    if (!cart) throw new Exception("Invalid Request");
    const newTransaction = {
      userId: user.id,
      bookIds: cart.books,
      id: shortId(),
      isCompleted: false
    };
    db.get("transactions")
      .push(newTransaction)
      .write();
    res.clearCookie("sessionId");
    db.get("sessions")
      .remove({ id: sessionId })
      .write();
    res.render("auth/alert", {
      message: `You have rented ${cart.books.length} books`,
      status: "success",
      auth: user
    });
  } catch (error) {
    res.render("auth/error", { message: error.message, auth: user });
  }
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

// complete transaction
module.exports.completeTransaction = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Invalid id");

  const transaction = db.get("transactions").find({ id });
  // check transaction is valid
  if (transaction.value()) {
    transaction.assign({ isCompleted: true }).write();
    return res.redirect("/transactions");
  }
  return res.send("Transaction not found");
};
