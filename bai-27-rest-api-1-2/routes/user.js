const router = require("express").Router();
const controller = require("../controller/user.controller");

const validateMiddleware = require("../middleware/validate");
// list user
router.get("/", controller.index);

// create page
router.get("/create", controller.createPage);

// add new user
router.post("/", validateMiddleware.isValidName, controller.addUser);

// delete a user
router.get("/:id/delete", controller.deleteUser);

// update page
router.get("/:id/update", controller.updatePage);

// update user
router.post("/:id", validateMiddleware.isValidName, controller.updateUser);

module.exports = router;
