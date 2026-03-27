import express from "express";
import cors from "cors";
import cowRoutes from "./routes/cowroutes.ts";
import feedingRoutes from "./routes/feedingroutes.ts";
import { errorHandler } from "./middleware/errorhandler.ts";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cows", cowRoutes);
app.use("/api/feeding", feedingRoutes);

// Root route
app.get("/", (req, res) => res.send("API is running..."));

// Error handler
app.use(errorHandler);

export default app;