const { Schema, model } = require("mongoose");

const bookSchema = Schema({
  title: String,
  description: String,
  imgUrl: String
});

module.exports = model("Book", bookSchema);
