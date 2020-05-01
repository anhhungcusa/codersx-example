const multer = require("multer");
const upload = multer({
  dest: "public/uploads/"
});

const router = require("express").Router();
const controller = require("../controller/profile.controller");

router.get("/", controller.index);
router.get("/avatar", controller.avatarPage);
router.post("/avatar", upload.single("avatar"), controller.changeAvatar);
// change password page
router.get("/change-password", controller.changePasswordPage);
router.post("/change-password", controller.changePassword);

module.exports = router;
