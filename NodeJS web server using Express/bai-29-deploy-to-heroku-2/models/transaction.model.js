const { Schema, model } = require("mongoose");
const transactionSchema = Schema({
  userId: String,
  bookIds: [String],
  shopIds: [String],
  isCompleted: {
    type: Boolean,
    default: false
  }
});

module.exports = model("Transaction", transactionSchema);
