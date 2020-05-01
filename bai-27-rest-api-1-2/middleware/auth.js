const User = require("../models/user.model");

module.exports.isAuthorized = async (req, res, next) => {
  const { access_id } = req.signedCookies;
  const user = await User.findById(access_id);
  if (user) {
    req.user = user;
    return next();
  }
  return res.redirect("/auth/login");
};

module.exports.getAuth = async (req, res, next) => {
  const { access_id } = req.signedCookies;
  const user = await User.findById(access_id);
  if (user) {
    req.user = user;
  }
  return next();
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
  res.render("auth/error", {
    message: `You don't have permission to access`,
    auth: user
  });
};
