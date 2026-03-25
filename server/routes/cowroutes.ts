import express from "express";
import { createCow, getCows, updateCow, deleteCow } from "../controllers/cowcontrollers.ts";

const router = express.Router();

// /api/cows
router.route("/")
    .get(getCows)
    .post(createCow);

// /api/cows/:id
router.route("/:id")
    .put(updateCow)
    .delete(deleteCow);

export default router;