import express from "express";
import { loginUser, getUsers, deleteUser } from "../controllers/usercontrollers.ts";
import { protect, adminOnly } from "../middleware/authmiddleware.ts";

const router = express.Router();
router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.post("/login", loginUser);

export default router;