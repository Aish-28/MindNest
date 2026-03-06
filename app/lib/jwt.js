import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyJwt(token) {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded;
}