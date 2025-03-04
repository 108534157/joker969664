import db from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { rows } = await db.execute("SELECT * FROM codes");
    res.status(200).json({ success: true, codes: rows });
  } catch (err) {
    res.status(500).json({ message: "資料庫錯誤", error: err.message });
  }
}
