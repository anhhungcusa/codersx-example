const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const Book = require("../../models/book.model");
const { Exception } = require("../../utils");
const { statusCodes } = require("../../utils/constant");

module.exports.getTransactions = async (req, res) => {
  req.user = {
    role: 0,
    isLogging: false,
    wrongLoginCount: 1,
    _id: "5ea54ff9e3d8f9fe939a89b2",
    name: "nguyenvy",
    password: "$2b$10$X.wfHRypCk1Mb2si/jbEf.3/JipPtRH0utFr3YEqTRAtzcQ3ssqXq",
    email: "admin@gmail.com",
    avatar:
      "http://res.cloudinary.com/learn-nguyenvy/image/upload/v1587994173/student/1c287138f02a9fbe0abd01de94ab325b.png"
  };
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 3;
  try {
    const length = await Transaction.estimatedDocumentCount();
    if (length === 0)
      throw new Exception("Transactions not found", statusCodes.NOT_FOUND);
    const skip = page * limit;
    let transactions = await Transaction.find({}, null, { limit, skip });
    if (transactions.length === 0)
      throw new Exception("Transactions not found", statusCodes.NOT_FOUND);
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
        return val._id.toString() === userId;
      });
      const rentedBooks = books.filter(val => bookIds.includes(val._id));
      return { _id, user, books: rentedBooks, isCompleted };
    });

    return res.status(statusCodes.OK).json({ transactions });
  } catch ({
    message = "Invalid request",
    statusCode = statusCodes.BAD_REQUEST
  }) {
    return res.status(statusCode).json({ message });
  }
};

// add new transaction
module.exports.addTransaction = async (req, res) => {
  const { userId, bookIds } = req.body;
  try {
    if (!userId || !bookIds) throw new Exception("Transaction is not valid");
    const transaction = new Transaction({ bookIds, userId });
    await transaction.save();
    return res.status(statusCodes.OK).json({ transaction });
  } catch ({ message }) {
    return res.status(statusCodes.BAD_REQUEST).json({ message });
  }
};

// delete transaction
module.exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) throw new Exception("TransactionID is not valid");
    const transaction = await Transaction.findByIdAndRemove(id);
    if (!transaction)
      throw new Exception("Transaction not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).end();
  } catch ({
    message = "Invalid request",
    statusCode = statusCodes.BAD_REQUEST
  }) {
    return res.status(statusCode).json({ message });
  }
};

// complete transaction
module.exports.completeTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) throw new Exception("TransactionID is not valid");
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { isCompleted: true },
      { new: true }
    );
    if (!transaction)
      throw new Exception("Transaction not found", statusCodes.NOT_FOUND);
    return res.status(statusCodes.OK).json({ transaction });
  } catch ({
    message = "Invalid request",
    statusCode = statusCodes.BAD_REQUEST
  }) {
    return res.status(statusCode).send({ message });
  }
};
