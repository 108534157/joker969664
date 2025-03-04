const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // 新增 JWT 支援
require("dotenv").config(); // 使用環境變數

const app = express();
const PORT = 4000;
const SECRET_KEY = process.env.SECRET_KEY || "super_secret_key"; // 使用環境變數

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 連接 MySQL 資料庫
const db = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12765835", // 修改成你的 MySQL 使用者
  password: "ZYj7Hic3yq", // 修改成你的 MySQL 密碼
  database: "sql12765835",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 確保 `codes` 和 `admins` 資料表存在
db.query(
  `CREATE TABLE IF NOT EXISTS codes (
    id VARCHAR(255) PRIMARY KEY,
    value INT NOT NULL CHECK (value >= 0)
  )`,
  (err) => {
    if (err) console.error("建立 `codes` 資料表失敗:", err.message);
    else console.log("`codes` 資料表準備完成");
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  )`,
  (err) => {
    if (err) console.error("建立 `admins` 資料表失敗:", err.message);
    else console.log("`admins` 資料表準備完成");
  }
);

// 驗證序號 & 取得點數
app.post("/validate-code", (req, res) => {
  const { code } = req.body;
  db.query("SELECT value FROM codes WHERE id = ?", [code.trim()], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "伺服器錯誤" });
    if (results.length === 0) return res.status(400).json({ success: false, message: "序號無效" });

    res.json({ success: true, points: results[0].value });
  });
});

// 扣除點數 API
app.post("/update-points", (req, res) => {
  const { code } = req.body;
  db.query("SELECT value FROM codes WHERE id = ?", [code.trim()], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "伺服器錯誤" });
    if (results.length === 0) return res.status(400).json({ success: false, message: "序號無效" });
    if (results[0].value <= 0) return res.status(400).json({ success: false, message: "點數不足" });

    const newPoints = results[0].value - 1;
    db.query("UPDATE codes SET value = ? WHERE id = ?", [newPoints, code.trim()], (updateErr) => {
      if (updateErr) return res.status(500).json({ success: false, message: "更新點數失敗" });
      res.json({ success: true, points: newPoints });
    });
  });
});

// 新增序號 API（需管理員權限）
app.post("/insert-code", verifyAdmin, (req, res) => {
  const { id, value } = req.body;
  if (!id || value == null || value < 0) {
    return res.status(400).json({ success: false, message: "無效的輸入數據" });
  }

  db.query("INSERT INTO codes (id, value) VALUES (?, ?)", [id, value], (err) => {
    if (err) return res.status(500).json({ success: false, message: "無法儲存序號" });
    res.json({ success: true, message: "序號新增成功！" });
  });
});

// 管理員登入 API
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM admins WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "伺服器錯誤" });
    if (results.length === 0) return res.status(401).json({ success: false, message: "帳號不存在" });

    try {
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (!validPassword) return res.status(401).json({ success: false, message: "密碼錯誤" });

      const token = jwt.sign({ id: results[0].id, username }, SECRET_KEY, { expiresIn: "2h" });

      res.json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  });
});

// 驗證管理員 Token Middleware
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ success: false, message: "權限不足！" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "無效的 Token" });
    }
    req.admin = decoded;
    next();
  });
}

// 管理員註冊 API（只執行一次）
app.post("/admin-register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("INSERT INTO admins (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
    if (err) return res.status(500).json({ success: false, message: "註冊失敗" });
    res.json({ success: true, message: "管理員註冊成功！" });
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器運行於 http://localhost:${PORT}`);
});
module.exports = app;
