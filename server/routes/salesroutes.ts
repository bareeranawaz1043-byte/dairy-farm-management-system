import express from "express";
import { createSale, getSales } from "../controllers/salescontrollers";

const router = express.Router();

router.post("/", createSale);
router.get("/", getSales);

export default router;