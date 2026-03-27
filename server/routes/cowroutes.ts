import express from "express";
import {
  createCow,
  getCows,
  updateCow,
  deleteCow,
  getSickCows,
  getAlerts,
} from "../controllers/cowcontrollers.ts";

const router = express.Router();

router.post("/", createCow);
router.get("/", getCows);
router.put("/:id", updateCow);
router.delete("/:id", deleteCow);
router.get("/sick", getSickCows);
router.get("/alerts", getAlerts);

export default router;