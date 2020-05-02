const user = require("./user");
const book = require("./book");

const initRoutes = router => {
  router.use("/books", book);
  router.use("/users", user);
};
module.exports = initRoutes;
