const router = require("express").Router();
const controller = require("../controller/shop.controller");
const bookController = require("../controller/book.controller");
const authMiddlware = require("../middleware/auth");
router.get("/", authMiddlware.getAuth, controller.index);
// myshop page
router.get("/:id/books", authMiddlware.getAuth, controller.shopPage);
router.get("/register", authMiddlware.isAuthorized, controller.registerPage);
router.post("/register", authMiddlware.isAuthorized, controller.addShop);

router.get(
  "/books/create",
  authMiddlware.isAuthorized,
  bookController.createPage
);
router.get("/:id/my-books", authMiddlware.isAuthorized, controller.bookPage);
router.get(
  "/:id/my-transactions",
  authMiddlware.isAuthorized,
  controller.transactionPage
);
module.exports = router;
