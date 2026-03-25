import express from "express";
import { createMilk, getMilk } from "../controllers/milkcontrollers";

const router = express.Router();

// POST milk
router.post("/", createMilk);

// GET milk
router.get("/", getMilk);

export default router;