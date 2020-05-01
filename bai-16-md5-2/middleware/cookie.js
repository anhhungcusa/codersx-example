module.exports.sendCookie = (req, res, next) => {
  res.cookie("user-id", "xx11xx", { maxAge: 12 * 3600000 });
  next();
};
let count = 0;
module.exports.countCookie = (req, res, next) => {
  console.log(`<${req.cookies["user-id"]}>: <${++count}>`);
  next();
};
