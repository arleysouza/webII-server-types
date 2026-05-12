import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { insertUsuario, updateUserEmail, updateUserPassword } from "../repositories/users.repository";

type CreateUserBody = {
  email?: string;
  password?: string;
};

type UpdateEmailBody = {
  email?: string;
};

type UpdatePasswordBody = {
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

async function updateEmail(
  request: AuthenticatedRequest & { body: UpdateEmailBody },
  response: Response,
): Promise<void> {
  const { email } = request.body;
  const idUser = request.user?.id_user;

  if (!idUser) {
    response.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  if (!email) {
    response.status(400).json({ message: "Email é obrigatório." });
    return;
  }

  const user = await updateUserEmail(idUser, email);

  if (!user) {
    response.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  response.json(user);
}

async function updatePassword(
  request: AuthenticatedRequest & { body: UpdatePasswordBody },
  response: Response,
): Promise<void> {
  const { password } = request.body;
  const idUser = request.user?.id_user;

  if (!idUser) {
    response.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  if (!password) {
    response.status(400).json({ message: "Senha é obrigatória." });
    return;
  }

  const user = await updateUserPassword(idUser, password);

  if (!user) {
    response.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  response.json({ message: "Senha atualizada com sucesso." });
}

export {
  createUser,
  updateEmail,
  updatePassword,
};
