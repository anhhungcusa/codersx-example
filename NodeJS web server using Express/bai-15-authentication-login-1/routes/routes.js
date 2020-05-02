const user = require("./user");
const book = require("./book");
const transaction = require("./transaction");
const auth = require("./auth");
// authen middlware
const authMiddlware = require("../middleware/auth");

const initRoutes = router => {
  router.use("/auth", auth);
  router.use("/books", authMiddlware.isAuthorized, book);
  router.use(
    "/users",
    authMiddlware.isAuthorized,
    authMiddlware.hasPermission("admin"),
    user
  );
  router.use("/transactions", authMiddlware.isAuthorized, transaction);
};
module.exports = initRoutes;
