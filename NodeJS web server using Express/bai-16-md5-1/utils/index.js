const md5 = require("md5");

module.exports = {
  Exception: function Exception(message) {
    this.message = message;
  },
  hashPassword(plainPassword) {
    return md5(plainPassword);
  },
  verifyPassword(hashPassword, plainPassword) {
    return hashPassword === md5(plainPassword);
  }
};
