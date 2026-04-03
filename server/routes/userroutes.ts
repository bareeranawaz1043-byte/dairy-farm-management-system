import express from "express";
import { 
  loginUser, 
  registerUser, 
  getUsers, 
  deleteUser 
} from "../controllers/usercontrollers.ts";

import { protect, adminOnly } from "../middleware/authmiddleware.ts";

const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser); 
router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;