// app/api/protected/route.js
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req) {
  const user = await getUserFromCookie(req);

  if (!user) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Now you have the user, just like req.user in Express
  return NextResponse.json({
    status: "success",
    user,
  });
}
