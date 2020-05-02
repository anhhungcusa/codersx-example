const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const Session = require("../models/session.model");
const { generatePagination, Exception } = require("../utils");
// index page
module.exports.index = async (req, res) => {
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? Math.abs(+page) : 0;
  limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
  let pagination = null;
  const length = await Transaction.estimatedDocumentCount();
  let transactions = [];
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
    transactions = await Transaction.find({}, null, { limit, skip });
    let { userIds, bookIds } = transactions.reduce(
      (acc, curr) => {
        acc.userIds.add(curr.userId);
        curr.bookIds.forEach(bookId => {
          acc.bookIds.add(bookId);
        });
        return acc;
      },
      { userIds: new Set(), bookIds: new Set() }
    );
    userIds = Array.from(userIds.values());
    bookIds = Array.from(bookIds.values());
    const [users, books] = await Promise.all([
      User.find({ _id: { $in: userIds } }),
      Book.find({ _id: { $in: bookIds } })
    ]);
    if (req.user.role !== 0) {
      transactions = transactions.filter(trans => {
        const { userId, isCompleted } = trans;
        const user = users.find(val => val._id.toString() === userId);
        if (
          isCompleted === true ||
          !user ||
          user.isLogging === false ||
          user.role === 0
        )
          return false;
        return true;
      });
    }
    transactions = transactions.map(trans => {
      const { bookIds, userId, _id, isCompleted } = trans;
      const user = users.find(val => {
        console.log(typeof val._id.str);
        return val._id.toString() === userId;
      });
      const rentedBooks = books.filter(val => bookIds.includes(val._id));
      return { _id, user, books: rentedBooks, isCompleted };
    });
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
module.exports.createPage = async (req, res) => {
  const [users, books] = await Promise.all([User.find({}), Book.find({})]);
  return res.render("transaction/create", { books, users, auth: req.user });
};

// add new transaction
module.exports.addTransaction = async (req, res, next) => {
  const { userId, bookId } = req.body;
  try {
    if (!userId || !bookId) return res.status(400).send("Invalid request");
    const book = await Book.findById(bookId);
    if (!book) throw new Error("book not found");
    const newTransaction = new Transaction({ bookIds: [bookId], userId });
    await newTransaction.save();
    return res.redirect("/transactions");
  } catch (error) {
    next(error);
  }
};

module.exports.addTransactionWithBulk = async (req, res) => {
  const { sessionId } = req.signedCookies;
  const { user } = req;
  try {
    if (!sessionId || !user) throw new Exception("Invalid Request");
    const session = await Session.findById(sessionId);
    if (!session) throw new Exception("Invalid Request");
    const books = await Book.find({ _id: { $in: session.books } });
    let shopIds = session.books.reduce((acc, curr) => {
      const book = books.find(val => val._id.toString() === curr);
      const { shopId } = book;
      if (shopId) acc.add(shopId);
      return acc;
    }, new Set());
    shopIds = Array.from(shopIds.values());
    const newTransaction = new Transaction({
      userId: user._id,
      bookIds: session.books,
      shopIds
    });
    await newTransaction.save();
    res.clearCookie("sessionId");
    await Session.findByIdAndRemove(sessionId);
    res.render("auth/alert", {
      message: `You have rented ${session.books.length} books`,
      status: "success",
      auth: user
    });
  } catch (error) {
    res.render("auth/error", { message: error.message, auth: user });
  }
};

// delete transaction
module.exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Invalid request");
  await Transaction.findByIdAndRemove(id);
  return res.redirect("/transactions");
};

// complete transaction
module.exports.completeTransaction = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Invalid id");
  await Transaction.findByIdAndUpdate(id, { isCompleted: true });
  return res.redirect("/transactions");
};
