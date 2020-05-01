const low = require("lowdb");

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db/db.json");
const db = low(adapter);

db.defaults({
  books: [],
  users: [
    {
      name: "NGUYEN VY",
      id: "lgFohRdC-",
      password: "123123",
      email: "admin@gmail.com",
      role: 0
    }
  ],
  transactions: []
}).write();

module.exports = db;
