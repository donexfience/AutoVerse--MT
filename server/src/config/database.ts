import mongoose from "mongoose";
import dotnev from "dotenv";
dotnev.config();

class Database {
  private static uri: string =
    process.env.MONGO_URI || "mongodb://localhost:27017/AutoVerse";

  public static async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      process.exit(1);
    }
  }
}

export default Database;
