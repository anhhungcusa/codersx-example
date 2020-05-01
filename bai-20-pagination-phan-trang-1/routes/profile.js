const router = require("express").Router();
const controller = require("../controller/profile.controller");
// change password page
router.get("/change-password", controller.changePasswordPage);
router.post("/change-password", controller.changePassword);

module.exports = router;
