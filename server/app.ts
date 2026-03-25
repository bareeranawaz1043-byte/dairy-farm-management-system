import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.ts";
import cowRoutes from "./routes/cowroutes.ts";
import { errorHandler } from "./middleware/errorhandler.ts";
import feedingRoutes from "./routes/feedingroutes";
dotenv.config();

connectDB();

const app: Application = express();


app.use(cors());
app.use(express.json());


app.use("/api/cows", cowRoutes);

app.use("/api/feeding", feedingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;