import type { Request, RequestHandler, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  changeUserEmail,
  changeUserPassword,
  createUser as createUserService,
} from "../services/users.service";

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

  const user = await createUserService(email, password);

  response.status(201).json(user);
}

const updateEmail: RequestHandler<ParamsDictionary, unknown, UpdateEmailBody> = async (
  request,
  response,
): Promise<void> => {
  const { email } = request.body;
  const idUser = (request as AuthenticatedRequest).user.id_user;

  if (!email) {
    response.status(400).json({ message: "Email é obrigatório." });
    return;
  }

  const user = await changeUserEmail(idUser, email);

  if (!user) {
    response.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  response.json(user);
};

const updatePassword: RequestHandler<ParamsDictionary, unknown, UpdatePasswordBody> = async (
  request,
  response,
): Promise<void> => {
  const { password } = request.body;
  const idUser = (request as AuthenticatedRequest).user.id_user;

  if (!password) {
    response.status(400).json({ message: "Senha é obrigatória." });
    return;
  }

  const user = await changeUserPassword(idUser, password);

  if (!user) {
    response.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  response.json({ message: "Senha atualizada com sucesso." });
};

export {
  createUser,
  updateEmail,
  updatePassword,
};
