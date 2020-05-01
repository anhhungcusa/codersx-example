const { Schema, model } = require("mongoose");

const sessionSchema = Schema({
  books: [String]
});

module.exports = model("Session", sessionSchema);
