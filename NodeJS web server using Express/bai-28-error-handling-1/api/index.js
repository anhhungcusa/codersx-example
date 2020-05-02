//routes
const auth = require("./routes/auth");
const user = require("./routes/user");
const book = require("./routes/book");
const transaction = require("./routes/transaction");
const doc = require("./routes/doc");

const authMiddleware = require("./middlewares/auth");
// init rest routes
module.exports = router => {
  const prefix = "/api/v1";
  router.use(`${prefix}/auth`, auth);
  router.use(`${prefix}/users`, authMiddleware.isAuthorized, user);
  router.use(`${prefix}/books`, authMiddleware.isAuthorized, book);
  router.use(
    `${prefix}/transactions`,
    authMiddleware.isAuthorized,
    transaction
  );
  router.use(`${prefix}/docs`, doc);
  // router.use(`${prefix}`)
};
