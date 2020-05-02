const bcrypt = require("bcrypt");
module.exports = {
  Exception: function Exception(message) {
    this.message = message;
  },
  hashPassword: plainPassword => {
    return bcrypt.hash(plainPassword, 10);
  },
  verifyPassword(hashPassword, plainPassword) {
    return bcrypt.compare(plainPassword, hashPassword);
  }
};
