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
