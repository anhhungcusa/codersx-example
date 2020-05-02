const index = require("./index");
const user = require("./user");
const book = require("./book");
const transaction = require("./transaction");
const auth = require("./auth");
const profile = require("./profile");
// authen middlware
const authMiddlware = require("../middleware/auth");

const initRoutes = router => {
  router.use("/", authMiddlware.getAuth, index);
  router.use("/auth", auth);
  router.use("/books", authMiddlware.getAuth, book);
  router.use(
    "/users",
    authMiddlware.isAuthorized,
    authMiddlware.hasPermission("admin"),
    user
  );
  router.use("/transactions", authMiddlware.isAuthorized, transaction);
  router.use("/profile", authMiddlware.isAuthorized, profile);
};
module.exports = initRoutes;
