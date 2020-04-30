const router = require("express").Router();
const controller = require("../controllers/transaction");

router.get("/", controller.getTransactions);
router.post("/", controller.addTransaction);
router.delete("/:id", controller.deleteTransaction);
router.patch("/:id", controller.completeTransaction);
module.exports = router;
