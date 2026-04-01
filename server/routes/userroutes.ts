import express from "express";
import { loginUser,getUsers, deleteUser } from "../controllers/usercontrollers.ts";

const router = express.Router();

router.get("/", getUsers); 
router.delete("/:id", deleteUser); 
router.post("/login", loginUser);

export default router;