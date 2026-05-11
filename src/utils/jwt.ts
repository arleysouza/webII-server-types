import dotenv from "dotenv";
import jwt, { type JwtPayload } from "jsonwebtoken";
import path from "path";

type TokenPayload = {
  id_user: number;
  email: string;
};

dotenv.config({ quiet: true, path: path.resolve(__dirname, "..", "..", ".env") });

function createToken(payload: TokenPayload): string {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "jwt-dev-secret",
    {
      expiresIn: Number(process.env.DEFAULT_EXPIRES_IN_SECONDS || 60 * 60 * 24),
    },
  );
}

function verifyToken(token: string): TokenPayload | null {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "jwt-dev-secret",
  ) as JwtPayload;

  if (
    typeof decoded.id_user !== "number"
    || typeof decoded.email !== "string"
  ) {
    return null;
  }

  return {
    id_user: decoded.id_user,
    email: decoded.email,
  };
}

export {
  createToken,
  type TokenPayload,
  verifyToken,
};
