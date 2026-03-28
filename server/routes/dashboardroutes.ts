import express from "express";
import { getTotalCows,getTotalMilk } from "../controllers/dashboardcontroller";

const router = express.Router();

router.get("/total-cows", getTotalCows);
router.get("/total-milk", getTotalMilk);
export default router;