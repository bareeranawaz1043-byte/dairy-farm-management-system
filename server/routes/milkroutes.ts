import express from "express";
import {
  createMilk,
  getMilk,
  getTotalMilk,
  getDailyMilk,
  getMilkPerCow,
} from "../controllers/milkcontrollers";

const router = express.Router();

router.post("/", createMilk);
router.get("/", getMilk);

router.get("/total", getTotalMilk);
router.get("/daily", getDailyMilk);
router.get("/per-cow", getMilkPerCow);

export default router;