module.exports.isValidName = (req, res, next) => {
  const { name } = req.body;
  if (!name || name.length > 30) {
    req.error = "Name length must be less than 30 characters";
  }
  next();
};
