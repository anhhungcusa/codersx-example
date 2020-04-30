const router = require("express").Router();
const controller = require("../controller/transaction.controller");
const authMiddlware = require("../middleware/auth");

// index page
router.get("/", controller.index);

// create page
router.get(
  "/create",
  authMiddlware.hasPermission("admin"),
  controller.createPage
);

// add new transaction
router.post(
  "/",
  authMiddlware.hasPermission("admin"),
  controller.addTransaction
);

//add new transaction with bulk
router.get("/bulk", controller.addTransactionWithBulk);

// delete transaction
router.get(
  "/:id/delete",
  authMiddlware.hasPermission("admin"),
  controller.deleteTransaction
);

// complete transaction
router.get(
  "/:id/complete",
  authMiddlware.hasPermission("admin"),
  controller.completeTransaction
);

module.exports = router;
