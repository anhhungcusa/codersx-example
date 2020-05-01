const router = require("express").Router();
const controller = require("../controllers/user");
// get users
router.get("/", controller.getUsers);
// get user by id
router.get("/:id", controller.getUserById);
// add user
router.post("/", controller.addUser);
// update user
router.patch("/:id", controller.updateUser);
// delete user
router.delete("/:id", controller.deleteUser);

module.exports = router;
