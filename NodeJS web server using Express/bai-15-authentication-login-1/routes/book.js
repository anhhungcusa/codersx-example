const router = require("express").Router();
const authMiddlware = require("../middleware/auth");
const controller = require("../controller/book.controller");
// list book
router.get("/", controller.index);

// create page
router.get(
  "/create",
  authMiddlware.hasPermission("admin"),
  controller.createPage
);

// add new book
router.post("/", authMiddlware.hasPermission("admin"), controller.addBook);

// delete a book
router.get(
  "/:id/delete",
  authMiddlware.hasPermission("admin"),
  controller.deleteBook
);

// update page
router.get(
  "/:id/update",
  authMiddlware.hasPermission("admin"),
  controller.updatePage
);
// update book
router.post(
  "/:id",
  authMiddlware.hasPermission("admin"),
  controller.updateBook
);
module.exports = router;
