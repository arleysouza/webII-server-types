import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { findContactsByUserId, insertContact } from "../repositories/contacts.repository";

type CreateContactBody = {
  name?: string;
  fone?: string;
};

async function createContact(
  request: AuthenticatedRequest & { body: CreateContactBody },
  response: Response,
): Promise<void> {
  const { name, fone } = request.body;
  const idUser = request.user?.id_user;

  if (!idUser) {
    response.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  if (!name || !fone) {
    response.status(400).json({ message: "Nome e telefone são obrigatórios." });
    return;
  }

  const contact = await insertContact(idUser, name, fone);

  response.status(201).json(contact);
}

async function listContacts(
  request: AuthenticatedRequest,
  response: Response,
): Promise<void> {
  const idUser = request.user?.id_user;

  if (!idUser) {
    response.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  const contacts = await findContactsByUserId(idUser);

  response.json(contacts);
}

export {
  createContact,
  listContacts,
};
