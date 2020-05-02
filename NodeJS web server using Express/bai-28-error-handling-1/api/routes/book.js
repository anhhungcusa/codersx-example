const router = require("express").Router();
const multer = require("multer");
const upload = multer({
  dest: "public/uploads/"
});
const controller = require("../controllers/book");
// get books
router.get("/", controller.getBooks);
// get book by id
router.get("/:id", controller.getBookById);
// add book
router.post("/", upload.single("avatar"), controller.addBook);
// update book
router.patch("/:id", controller.updateBook);
// delete book
router.delete("/:id", controller.deleteBook);

module.exports = router;
