import express from "express";
import cors from "cors";
import cowRoutes from "./routes/cowroutes.ts";
import feedingRoutes from "./routes/feedingroutes.ts";
import { errorHandler } from "./middleware/errorhandler.ts";
import salesRoutes from "./routes/salesroutes.ts";
import dashboardRoutes from "./routes/dashboardroutes.ts";
import userRoutes from "./routes/userroutes.ts";
import milkRoutes from "./routes/milkroutes.ts";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cows", cowRoutes);
app.use("/api/feeding", feedingRoutes);
app.use("/api/milk", milkRoutes);

// Root route
app.get("/", (req, res) => res.send("API is running..."));

// Error handler
app.use(errorHandler);

app.use("/api/sales", salesRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/users", userRoutes);
export default app;