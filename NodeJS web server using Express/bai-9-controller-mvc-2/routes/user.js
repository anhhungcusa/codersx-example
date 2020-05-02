const router = require("express").Router();
const controller = require("../controller/user.controller");

// list user
router.get("/", controller.index);

// create page
router.get("/create", controller.createPage);

// add new user
router.post("/", controller.addUser);

// delete a user
router.get("/:id/delete", controller.deleteUser);

// update page
router.get("/:id/update", controller.updatePage);
// update user
router.post("/:id", controller.updateUser);

module.exports = router;
