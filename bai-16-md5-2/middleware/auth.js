const db = require("../db");
module.exports.isAuthorized = (req, res, next) => {
  const { access_id } = req.cookies;
  const user = db
    .get("users")
    .find({ id: access_id })
    .value();
  if (user) {
    req.user = user;
    return next();
  }
  return res.redirect("/auth/login");
};

module.exports.hasPermission = permission => (req, res, next) => {
  const user = req.user;
  req.permission = permission;
  switch (permission) {
    case "admin":
      if (user.role === 0) {
        return next();
      }
      break;
    default:
      break;
  }
  res.redirect("/");
};
