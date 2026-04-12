import express from "express";
import {
  getTotalCows,
  getTotalMilk,
  getTotalSales,   
  getAlerts,      
  getMonthlyReport,
} from "../controllers/dashboardcontroller.ts"; 

import { protect, adminOnly } from "../middleware/authmiddleware.ts";

const router = express.Router();


router.get("/total-cows", getTotalCows);
router.get("/total-milk", getTotalMilk);
router.get("/total-sales", getTotalSales); 
router.get("/alerts", getAlerts);          
router.get("/monthly", protect, adminOnly, getMonthlyReport);

export default router;