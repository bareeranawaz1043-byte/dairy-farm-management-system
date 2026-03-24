import express from "express";
import { createCow } from "../controllers/cowcontroller.js";
import { getCows } from "../controllers/cowcontroller.js";
import { updateCow } from "../controllers/cowcontroller.js";
import { deleteCow } from "../controllers/cowcontroller.js";
import { createCow, getCows, updateCow, deleteCow } from "../controllers/cowcontroller.js";

router.route("/")
    .get(getCows)
    .post(createCow);

router.route("/:id")
    .put(updateCow)
    .delete(deleteCow);

router.delete("/:id", deleteCow);

router.put("/:id", updateCow);

const router = express.Router();

router.get("/", getCows);

router.post("/", createCow);

export default router;