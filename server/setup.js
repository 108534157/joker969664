import db from "../utils/db.js";

async function setupDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS codes (
      id TEXT PRIMARY KEY,
      value INTEGER
    )
  `);
  console.log("✅ 資料庫初始化完成！");
}

setupDatabase();
