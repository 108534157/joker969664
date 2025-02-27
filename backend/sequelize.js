import { Sequelize } from "sequelize";

// ⚡ 使用 SQLite 資料庫
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

export default sequelize;
