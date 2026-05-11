import type { Request, Response } from "express";
import { insertUsuario } from "../repositories/users.repository";

type CreateUserBody = {
  email?: string;
  password?: string;
};

async function createUser(
  request: Request<unknown, unknown, CreateUserBody>,
  response: Response,
): Promise<void> {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400).json({ message: "Email e senha são obrigatórios." });
    return;
  }

  const user = await insertUsuario(email, password);

  response.status(201).json(user);
}

export { createUser };
