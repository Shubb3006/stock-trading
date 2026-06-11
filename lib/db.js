// import mongoose from "mongoose";

// let isConnected = false;

// export const connectDB = async () => {
//   if (isConnected) return;

//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "stock_trading_db",
//     });

//     isConnected = true;
//     console.log("MongoDB connected:", conn.connection.host);
//   } catch (error) {
//     console.error("MongoDB error:", error);
//     throw error;
//   }
// };


import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "stock_trading_db",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}