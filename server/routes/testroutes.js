// routes/testRoutes.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "API working" });
});

export default router;