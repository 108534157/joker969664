const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root", // ⚠️ 請改成你的 MySQL 帳號
  password: "yourpassword", // ⚠️ 請改成你的 MySQL 密碼
  database: "baccarat_db",
});

module.exports = db;
