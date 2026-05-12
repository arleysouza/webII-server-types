import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
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

const createContact: RequestHandler<ParamsDictionary, unknown, CreateContactBody> = async (
  request,
  response,
): Promise<void> => {
  const { name, fone } = request.body;
  const idUser = (request as AuthenticatedRequest).user.id_user;

  if (!name || !fone) {
    response.status(400).json({ message: "Nome e telefone são obrigatórios." });
    return;
  }

  const contact = await createContactService(idUser, name, fone);

  response.status(201).json(contact);
};

const listContacts: RequestHandler = async (
  request,
  response,
): Promise<void> => {
  const idUser = (request as AuthenticatedRequest).user.id_user;

  const contacts = await listContactsService(idUser);

  response.json(contacts);
};

const updateName: RequestHandler<ContactParams, unknown, UpdateContactNameBody> = async (
  request,
  response,
): Promise<void> => {
  const { name } = request.body;
  const idUser = (request as AuthenticatedRequest).user.id_user;
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
};

const updateFone: RequestHandler<ContactParams, unknown, UpdateContactFoneBody> = async (
  request,
  response,
): Promise<void> => {
  const { fone } = request.body;
  const idUser = (request as AuthenticatedRequest).user.id_user;
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
};

const removeContact: RequestHandler<ContactParams> = async (
  request,
  response,
): Promise<void> => {
  const idUser = (request as AuthenticatedRequest).user.id_user;
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
};

export {
  createContact,
  listContacts,
  removeContact,
  updateFone,
  updateName,
};
