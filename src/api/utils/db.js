import { createClient } from "@libsql/client";

const db = createClient({
  url: "你的_Turso_資料庫_URL",
  authToken: "你的_Turso_auth_token"
});

export default db;
