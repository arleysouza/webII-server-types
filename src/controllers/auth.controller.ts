import type { Request, Response } from "express";
import { authenticateUser } from "../services/auth.service";

type LoginBody = {
  email?: string;
  password?: string;
};

async function login(
  request: Request<unknown, unknown, LoginBody>,
  response: Response,
): Promise<void> {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400).json({ message: "Email e senha são obrigatórios." });
    return;
  }

  const loginResult = await authenticateUser(email, password);

  if (!loginResult) {
    response.status(401).json({ message: "Email ou senha inválidos." });
    return;
  }

  response.json(loginResult);
}

export {
  login,
};
