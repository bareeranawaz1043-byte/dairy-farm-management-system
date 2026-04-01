import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const MONGO_URI: string = process.env.MONGO_URI || "mongodb://localhost:27017/dairyFarmDB";

const connectDB = async (retries = 5, delayMs = 5000): Promise<void> => {
  let attempts = 0;

  const connectWithRetry = async (): Promise<void> => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("MongoDB connected successfully");
    } catch (error) {
      attempts += 1;
      console.error(`MongoDB connection attempt ${attempts} failed:`, error);

      if (attempts < retries) {
        console.log(`Retrying MongoDB connection in ${delayMs / 1000}s...
`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        await connectWithRetry();
      } else {
        console.error("MongoDB connection failed after retries. Exiting.");
        process.exit(1);
      }
    }
  };

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
    connectWithRetry().catch((err) => console.error("Reconnect error:", err));
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  await connectWithRetry();
};

export default connectDB;