// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const res = NextResponse.json({ status: "success", message: "Logged out" });

  // Clear the JWT cookie
  res.cookies.set({
    name: "jwt_token",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 0, // immediately expires
  });

  return res;
}
