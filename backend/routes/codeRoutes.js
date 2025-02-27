import express from "express";
import Code from "../models/Code.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// 🎟 產生序號並儲存到資料庫
router.post("/generate", async (req, res) => {
  const { points } = req.body;
  if (!points || points <= 0) return res.status(400).json({ message: "點數無效" });

  try {
    const newCode = await Code.create({
      code: uuidv4(),
      points: points,
    });
    res.status(201).json(newCode);
  } catch (error) {
    res.status(500).json({ message: "產生序號失敗", error });
  }
});

// 🔍 查詢所有序號
router.get("/all", async (req, res) => {
  try {
    const codes = await Code.findAll();
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: "查詢序號失敗" });
  }
});

export default router;
