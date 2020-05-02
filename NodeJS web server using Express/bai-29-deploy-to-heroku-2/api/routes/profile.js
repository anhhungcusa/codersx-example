const router = require("express").Router();
const controller = require("../controllers/profile");
const multer = require("multer");
const upload = multer({
  dest: "public/uploads/"
});
// change avatar
router.path("/avatar", upload.single("avatar"), controller.changeAvatar);
// change password
router.path("/password", controller.changePassword);

module.exports = router;
