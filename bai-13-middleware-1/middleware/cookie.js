module.exports.sendCookie = (req, res, next) => {
  res.cookie("user-id", "xx11xx");
  next();
};
