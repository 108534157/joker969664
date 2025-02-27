import db from "../utils/db.js";

export default async function handler(req, res) {
  const result = await db.execute("SELECT * FROM codes");
  res.status(200).json({ success: true, codes: result.rows });
}
