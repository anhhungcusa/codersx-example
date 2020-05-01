const router = require("express").Router();
const controller = require("../controller/auth.controller");

router.get("/login", controller.loginPage);
router.post("/login", controller.login);
router.get("/:id/logout", controller.logout);

module.exports = router;
