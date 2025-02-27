const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ✅ 連接 SQLite3 資料庫
const db = new sqlite3.Database(path.resolve(__dirname, "codes.db"), (err) => {
  if (err) {
    console.error("❌ 資料庫連接失敗:", err.message);
  } else {
    console.log("✅ 連接 SQLite 資料庫成功！");
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS codes (
          id TEXT PRIMARY KEY,
          value INTEGER NOT NULL CHECK(value >= 0)
        )`
      );
    });
  }
});

// ✅ **驗證序號 & 取得點數**
app.post("/validate-code", (req, res) => {
  const { code } = req.body;
  console.log(`🔍 查詢序號: "${code}"`);

  db.get("SELECT value FROM codes WHERE id = ?", [code.trim()], (err, row) => {
    if (err) {
      console.error("❌ 查詢錯誤:", err.message);
      return res.status(500).json({ error: "伺服器錯誤" });
    }
    if (!row) {
      console.warn(`⚠️ 序號無效: "${code}"`);
      return res.status(400).json({ valid: false, message: "❌ 序號無效" });
    }

    console.log(`✅ 序號有效，點數: ${row.value}`);
    return res.json({ valid: true, points: row.value });
  });
});

// ✅ **扣除點數 API**
app.post("/update-points", (req, res) => {
  const { code } = req.body;

  db.get("SELECT value FROM codes WHERE id = ?", [code.trim()], (err, row) => {
    if (err) return res.status(500).json({ error: "伺服器錯誤" });
    if (!row) return res.status(400).json({ valid: false, message: "❌ 序號無效" });
    if (row.value <= 0) return res.status(400).json({ valid: false, message: "❌ 點數不足" });

    const newPoints = row.value - 1;
    db.run("UPDATE codes SET value = ? WHERE id = ?", [newPoints, code.trim()], (err) => {
      if (err) return res.status(500).json({ error: "更新點數失敗" });
      console.log(`✅ 扣除 1 點，剩餘點數: ${newPoints}`);
      return res.json({ success: true, points: newPoints });
    });
  });
});

// ✅ **新增序號 API**
app.post("/insert-code", (req, res) => {
  const { id, value } = req.body;

  if (!id || value == null || value < 0) {
    return res.status(400).json({ error: "❌ 無效的輸入數據" });
  }

  db.get("SELECT id FROM codes WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("❌ 查詢錯誤:", err.message);
      return res.status(500).json({ error: "伺服器錯誤" });
    }
    if (row) {
      return res.status(400).json({ error: "❌ 此序號已存在" });
    }

    db.run("INSERT INTO codes (id, value) VALUES (?, ?)", [id, value], function (err) {
      if (err) {
        console.error("❌ 插入序號失敗:", err.message);
        return res.status(500).json({ error: "無法儲存序號" });
      }
      console.log(`✅ 新增序號: ${id} - ${value}點`);
      return res.json({ success: true });
    });
  });
});

// ✅ **取得所有序號**
app.get("/get-codes", (req, res) => {
  db.all("SELECT * FROM codes", [], (err, rows) => {
    if (err) {
      console.error("❌ 查詢序號失敗：", err.message);
      return res.status(500).json({ success: false, message: "❌ 讀取序號失敗" });
    }
    return res.json({ success: true, codes: rows });
  });
});

// ✅ **刪除序號**
app.post("/delete-code", (req, res) => {
  const { code } = req.body;

  db.run("DELETE FROM codes WHERE id = ?", [code.trim()], (err) => {
    if (err) {
      console.error("❌ 刪除序號失敗：", err.message);
      return res.status(500).json({ success: false, message: "❌ 刪除失敗" });
    }
    console.log(`✅ 已刪除序號: ${code}`);
    return res.json({ success: true });
  });
});


// ✅ **啟動伺服器**
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行中：http://localhost:${PORT}`);
});
