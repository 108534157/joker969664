import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Code = sequelize.define("Code", {
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  points: { type: DataTypes.INTEGER, allowNull: false },
  isUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

await sequelize.sync(); // 自動建立資料表
export default Code;
