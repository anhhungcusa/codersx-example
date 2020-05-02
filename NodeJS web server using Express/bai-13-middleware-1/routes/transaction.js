const router = require("express").Router();
const controller = require("../controller/transaction.controller");
// index page
router.get("/", controller.index);

// create page
router.get("/create", controller.createPage);

// add new transaction
router.post("/", controller.addTransaction);
// delete transaction
router.get("/:id/delete", controller.deleteTransaction);

// complete transaction
router.get("/:id/complete", controller.completeTransaction);

module.exports = router;
