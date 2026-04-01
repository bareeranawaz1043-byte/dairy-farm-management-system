import express from "express";
import {
  createCow,
  getCows,
  updateCow,
  deleteCow,
  getSickCows,
  getAlerts,
} from "../controllers/cowcontrollers.ts";
import { protect } from "../middleware/authmiddleware.ts";
const router = express.Router();

router.post("/", protect, createCow);
router.get("/", getCows);
router.put("/:id", protect, updateCow);
router.delete("/:id", protect, deleteCow);
router.get("/sick", getSickCows);
router.get("/alerts", getAlerts);

export default router;