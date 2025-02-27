import db from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  const { value } = req.body;
  const id = uuidv4();

  await db.execute("INSERT INTO codes (id, value) VALUES (?, ?)", [id, value]);

  res.status(200).json({ success: true, id, value });
}
