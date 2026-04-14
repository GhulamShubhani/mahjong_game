import jwt from "jsonwebtoken";

export const TOKEN_COOKIE = "mahjong_token";

function secret() {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET required in production");
  }
  return process.env.JWT_SECRET || "dev_mahjong_token_secret";
}

export function signToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    secret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
  );
}

export function verifyToken(token: string) {
  const decoded = jwt.verify(token, secret()) as jwt.JwtPayload;
  if (typeof decoded.sub !== "string") {
    throw new Error("invalid token");
  }
  return decoded.sub;
}
