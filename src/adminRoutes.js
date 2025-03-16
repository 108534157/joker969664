const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const router = express.Router();

// 設定 MySQL 連線
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "your_database",
});

// 管理員註冊 API
router.post("/admin-register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "請提供帳號和密碼！" });
  }

  // 檢查帳號是否已存在
  db.query("SELECT * FROM admins WHERE username = ?", [username], async (err, results) => {
    if (err) {
      console.error("資料庫錯誤：", err);
      return res.json({ success: false, message: "伺服器錯誤，請稍後再試！" });
    }

    if (results.length > 0) {
      return res.json({ success: false, message: "該帳號已被註冊！" });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新管理員
    db.query("INSERT INTO admins (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
      if (err) {
        console.error("插入失敗：", err);
        return res.json({ success: false, message: "註冊失敗，請稍後再試！" });
      }
      res.json({ success: true, message: "註冊成功！" });
    });
  });
});

module.exports = router;
