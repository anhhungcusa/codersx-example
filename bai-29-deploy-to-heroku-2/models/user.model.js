const { Schema, model } = require("mongoose");

const userSchema = Schema({
  name: String,
  password: String,
  email: String,
  role: {
    type: Number,
    default: 1
  },
  isLogging: { type: Boolean, default: false },
  wrongLoginCount: { type: Number, default: 0 },
  avatar: String,
  myShop: {
    name: String,
    isRegistered: {
      type: Boolean,
      default: false
    }
  }
});

module.exports = model("User", userSchema);
