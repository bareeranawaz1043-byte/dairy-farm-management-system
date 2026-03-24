import express from "express";
import { createCow } from "../controllers/cowController.js";

const router = express.Router();

router.post("/", createCow);

export default router;