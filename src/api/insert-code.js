import db from "../../utils/db";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { id, value } = req.body;
  if (!id || !value) return res.status(400).json({ message: "缺少必要參數" });

  try {
    db.prepare("INSERT INTO codes (id, value) VALUES (?, ?)").run(id, value);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "資料庫錯誤", error: err.message });
  }
}
