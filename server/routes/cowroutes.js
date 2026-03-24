import express from "express";
import { createCow, getCows, updateCow, deleteCow } from "../controllers/cowcontrollers.js";

const router = express.Router();

router.route("/")
    .get(getCows)
    .post(createCow);

router.route("/:id")
    .put(updateCow)
    .delete(deleteCow);

export default router;