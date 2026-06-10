// lib/auth.js
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import { connectDB } from "@/lib/db";

export const getUserFromCookie = async (req) => {
  await connectDB();

  // 1. Read cookie from request headers
  const cookieHeader = req.headers.get("cookie") || "";

  // 2. Parse cookies
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...v] = c.trim().split("=")
      return [key, decodeURIComponent(v.join("="))]
    })
  );

  const token = cookies["jwt_token"];
  if (!token) return null;

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB
    const user = await User.findById(decoded.userId).select("-password");
    return user || null;
  } catch {
    return null;
  }
};
