import express from "express";
import { loginUser } from "../controllers/usercontrollers.ts";

const router = express.Router();

router.post("/login", loginUser);

export default router;