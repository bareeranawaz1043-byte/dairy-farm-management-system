import express from "express";
import { getTotalCows } from "../controllers/dashboardcontroller";

const router = express.Router();

router.get("/total-cows", getTotalCows);

export default router;