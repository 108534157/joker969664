import db from "../../utils/db";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  const codes = db.prepare("SELECT * FROM codes").all(); // ✅ 取得所有序號
  res.status(200).json({ success: true, codes });
}
