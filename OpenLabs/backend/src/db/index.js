import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    
    console.log(`Connecting to MongoDB Atlas...`);
    const connectionInstance = await mongoose.connect(rawUri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB connected successfully! Host: ${connectionInstance.connection.host}, Database: ${connectionInstance.connection.name}`
    );
    return connectionInstance;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.warn("Running in offline demo mode. Mock fallback services active.");
    return null;
  }
};

export default connectDB;
