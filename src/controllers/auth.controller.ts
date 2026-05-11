import type { Request, Response } from "express";
import { findUserByEmail } from "../repositories/users.repository";
import { createToken } from "../utils/jwt";
import { verifyPassword } from "../utils/password";

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

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.password)) {
    response.status(401).json({ message: "Email ou senha inválidos." });
    return;
  }

  const token = createToken({
    id_user: user.id_user,
    email: user.email,
  });

  response.json({
    token,
    user: {
      id_user: user.id_user,
      email: user.email,
    },
  });
}

export {
  login,
};
