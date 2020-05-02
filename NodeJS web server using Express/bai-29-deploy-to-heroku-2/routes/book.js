const router = require("express").Router();
const controller = require("../controller/book.controller");
const multer = require("multer");
const upload = multer({
  dest: "public/uploads/"
});
// list book
router.get("/", controller.index);

// create page
router.get("/create", controller.createPage);

// add new book
router.post("/", upload.single("avatar"), controller.addBook);

// delete a book
router.get("/:id/delete", controller.deleteBook);

// update page
router.get("/:id/update", controller.updatePage);
// update book
router.post("/:id", controller.updateBook);

// add to cart
router.get("/:bookId/add", controller.addToCart);

module.exports = router;
