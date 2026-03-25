import express from "express";
import { createFeeding, getFeeding } from "../controllers/feedingcontrollers";

const router = express.Router();

router.post("/", createFeeding);

router.get("/", getFeeding);

export default router;