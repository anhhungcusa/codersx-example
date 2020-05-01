module.exports.isValidName = (req, res, next) => {
  let { name } = req.body;
  name = name.trim();
  if (!name || name.length > 30) {
    req.error = "Name length must be less than 30 characters";
  }
  next();
};
