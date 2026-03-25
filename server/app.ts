import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.ts";
import cowRoutes from "./routes/cowroutes.ts";
import { errorHandler } from "./middleware/errorhandler.ts";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cows", cowRoutes);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Error handling middleware (last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;