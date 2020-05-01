const User = require("../models/user.model");
const Book = require("../models/book.model");
const Transaction = require("../models/transaction.model");
const { generatePagination } = require("../utils");
module.exports = {
  async index(req, res, next) {
    let { page, limit } = req.query;
    page = +page && +page >= 0 ? Math.abs(+page) : 0;
    limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
    try {
      const length = await User.countDocuments({ "myShop.isRegistered": true });
      let pagination = null;
      let shops = [];
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
        shops = await User.find({ "myShop.isRegistered": true }, "myShop", {
          limit,
          skip
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

      return res.render("shop/index", {
        shops,
        auth: req.user,
        pagination
      });
    } catch (error) {
      next(error);
    }
  },
  registerPage(req, res) {
    return res.render("shop/register", {
      auth: req.user,
      cartSize: req.cartSize
    });
  },
  async bookPage(req, res, next) {
    const { user: auth, cartSize } = req;
    const { id } = req.params;
    // query params
    let { page, limit } = req.query;
    page = +page && +page >= 0 ? Math.abs(+page) : 0;
    limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
    try {
      if (!id) throw new Error("Shop not found");
      if (auth._id.toString() !== id)
        throw new Error("You can't access this page");
      const length = await Book.countDocuments({ shopId: id });
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
        books = await Book.find({ shopId: id }, null, { limit, skip });
        const links = generatePagination(page, paginationSizes, numPages);
        pagination = {
          links,
          numPages,
          page,
          limit,
          start: skip
        };
      }
      res.render("shop/my-books", { auth, cartSize, pagination, books });
    } catch (error) {
      next(error);
    }
  },
  async shopPage(req, res, next) {
    const { user: auth, cartSize } = req;
    const { id } = req.params;
    // query params
    let { page, limit } = req.query;
    page = +page && +page >= 0 ? Math.abs(+page) : 0;
    limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
    try {
      if (!id) throw new Error("Shop not found");
      const length = await Book.countDocuments({ shopId: id });
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
        books = await Book.find({ shopId: id }, null, { limit, skip });
        const links = generatePagination(page, paginationSizes, numPages);
        pagination = {
          links,
          numPages,
          page,
          limit,
          start: skip
        };
      }
      const shop = await User.findById(id, "myShop");
      if (!shop) throw new Error("shop not found");
      res.render("shop/my-shop", { auth, cartSize, pagination, books, shop });
    } catch (error) {
      next(error);
    }
  },
  async transactionPage(req, res, next) {
    let { page, limit } = req.query;
    const { user: auth, cartSize } = req;
    const { id } = req.params;
    page = +page && +page >= 0 ? Math.abs(+page) : 0;
    limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
    let pagination = null;
    try {
      if (auth._id.toString() !== id)
        throw new Error("You can't access this page");
      const length = await Transaction.countDocuments({ shopIds: id });
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
        transactions = await Transaction.find({ shopIds: id }, null, {
          limit,
          skip
        });
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
          const rentedBooks = books.filter(val => {
            if (val.shopId !== id) return false;
            return bookIds.includes(val._id);
          });
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
      res.render("shop/my-transactions", {
        transactions,
        auth: req.user,
        pagination,
        cartSize
      });
    } catch (error) {
      next(error);
    }
  },
  async addShop(req, res, next) {
    const { name } = req.body;
    const { _id } = req.user;
    try {
      const user = await User.findByIdAndUpdate(_id, {
        myShop: { name, isRegistered: true }
      });
      if (!user) throw new Error("User not found");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
};
