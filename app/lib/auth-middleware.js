import { verifyJwt } from "./jwt";
import { NextResponse } from "next/server";

export function requireAuth(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  console.log("Auth token:", token);

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Access denied. No token provided." },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = verifyJwt(token);
    console.log("Decoded:", decoded);
    return { user: decoded };
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid token." }, { status: 401 }),
    };
  }
}