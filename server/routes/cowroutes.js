import express from "express";
import { createCow } from "../controllers/cowController.js";
import { getCows } from "../controllers/cowcontroller.js";

const router = express.Router();

router.get("/", getCows);

router.post("/", createCow);

export default router;