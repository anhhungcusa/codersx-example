const router = require("express").Router();
const controller = require("../controller/index.controller");

router.get("/", controller.index);
router.get("/cart", controller.cartPage);
module.exports = router;
