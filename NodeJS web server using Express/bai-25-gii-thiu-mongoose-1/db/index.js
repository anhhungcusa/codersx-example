const mongoose = require("mongoose");
const createConnection = () =>
  mongoose
    .connect(process.env.MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(res => {
      console.log("mongodb connected");
      return res;
    })
    .catch(err => {
      console.log("mongodb connect failed", err);
      return err;
    });

module.exports = { createConnection };
