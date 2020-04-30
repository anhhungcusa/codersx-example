module.exports = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).render("error/500", {
    message: error ? error.message : "Internal server error"
  });
};
