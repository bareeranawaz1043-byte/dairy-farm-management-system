import dotenv from "dotenv";
dotenv.config(); // must be at the very top

import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.ts";
import cowRoutes from "./routes/cowroutes.ts";
import { errorHandler } from "./middleware/errorhandler.ts";

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cows", cowRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Error handler (last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));