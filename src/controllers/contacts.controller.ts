import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  changeContactFone,
  changeContactName,
  createContact as createContactService,
  listContacts as listContactsService,
  parseContactId,
  removeContact as removeContactService,
} from "../services/contacts.service";

type CreateContactBody = {
  name?: string;
  fone?: string;
};

type ContactParams = {
  id_contact?: string;
};

type UpdateContactNameBody = {
  name?: string;
};

type UpdateContactFoneBody = {
  fone?: string;
};

async function createContact(
  request: AuthenticatedRequest & { body: CreateContactBody },
  response: Response,
): Promise<void> {
  const { name, fone } = request.body;
  const idUser = request.user.id_user;

  if (!name || !fone) {
    response.status(400).json({ message: "Nome e telefone são obrigatórios." });
    return;
  }

  const contact = await createContactService(idUser, name, fone);

  response.status(201).json(contact);
}

async function listContacts(
  request: AuthenticatedRequest,
  response: Response,
): Promise<void> {
  const idUser = request.user.id_user;

  const contacts = await listContactsService(idUser);

  response.json(contacts);
}

async function updateName(
  request: AuthenticatedRequest & { params: ContactParams; body: UpdateContactNameBody },
  response: Response,
): Promise<void> {
  const { name } = request.body;
  const idUser = request.user.id_user;
  const idContact = parseContactId(request.params.id_contact);

  if (!idContact) {
    response.status(400).json({ message: "Contato inválido." });
    return;
  }

  if (!name) {
    response.status(400).json({ message: "Nome é obrigatório." });
    return;
  }

  const contact = await changeContactName(idContact, idUser, name);

  if (!contact) {
    response.status(404).json({ message: "Contato não encontrado." });
    return;
  }

  response.json(contact);
}

async function updateFone(
  request: AuthenticatedRequest & { params: ContactParams; body: UpdateContactFoneBody },
  response: Response,
): Promise<void> {
  const { fone } = request.body;
  const idUser = request.user.id_user;
  const idContact = parseContactId(request.params.id_contact);

  if (!idContact) {
    response.status(400).json({ message: "Contato inválido." });
    return;
  }

  if (!fone) {
    response.status(400).json({ message: "Telefone é obrigatório." });
    return;
  }

  const contact = await changeContactFone(idContact, idUser, fone);

  if (!contact) {
    response.status(404).json({ message: "Contato não encontrado." });
    return;
  }

  response.json(contact);
}

async function removeContact(
  request: AuthenticatedRequest & { params: ContactParams },
  response: Response,
): Promise<void> {
  const idUser = request.user.id_user;
  const idContact = parseContactId(request.params.id_contact);

  if (!idContact) {
    response.status(400).json({ message: "Contato inválido." });
    return;
  }

  const contact = await removeContactService(idContact, idUser);

  if (!contact) {
    response.status(404).json({ message: "Contato não encontrado." });
    return;
  }

  response.json({ message: "Contato excluído com sucesso." });
}

export {
  createContact,
  listContacts,
  removeContact,
  updateFone,
  updateName,
};
