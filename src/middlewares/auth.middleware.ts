import type { NextFunction, Request, Response } from "express";
import { type TokenPayload, verifyToken } from "../utils/jwt";

type AuthenticatedRequest = Request & {
  user: TokenPayload;
};

type RequestWithOptionalUser = Request & {
  user?: TokenPayload;
};

function authMiddleware(
  request: RequestWithOptionalUser,
  response: Response,
  next: NextFunction,
): void {
  const authorization = request.headers.authorization;
  const [, token] = authorization?.split(" ") || [];

  if (!token) {
    response.status(401).json({ message: "Token não informado." });
    return;
  }

  try {
    const user = verifyToken(token);

    if (!user) {
      response.status(401).json({ message: "Token inválido." });
      return;
    }

    request.user = user;
    next();
  } catch {
    response.status(401).json({ message: "Token inválido." });
  }
}

export {
  authMiddleware,
  type AuthenticatedRequest,
};
