const user = require("./user");
const book = require("./book");
const transaction = require("./transaction");
const initRoutes = router => {
  router.use("/books", book);
  router.use("/users", user);
  router.use("/transactions", transaction);
};
module.exports = initRoutes;
