import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "stock_trading_db",
    });

    isConnected = true;
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB error:", error);
    throw error;
  }
};
