import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set cookie in Next.js App Router style
  res.cookies.set({
    name: "jwt_token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  return token;
};
