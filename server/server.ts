import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.ts";
import app from "./app.ts";

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));