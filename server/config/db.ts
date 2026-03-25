import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const MONGO_URI: string = process.env.MONGO_URI || "mongodb://localhost:27017/dairyFarmDB";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Stop the server if DB connection fails
  }
};

export default connectDB;