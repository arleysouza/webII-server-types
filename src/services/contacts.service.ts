import {
  deleteContact,
  findContactsByUserId,
  insertContact,
  updateContactFone,
  updateContactName,
} from "../repositories/contacts.repository";

function parseContactId(idContact?: string): number | null {
  const parsedId = Number(idContact);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

async function createContact(idUser: number, name: string, fone: string) {
  return insertContact(idUser, name, fone);
}

async function listContacts(idUser: number) {
  return findContactsByUserId(idUser);
}

async function changeContactName(idContact: number, idUser: number, name: string) {
  return updateContactName(idContact, idUser, name);
}

async function changeContactFone(idContact: number, idUser: number, fone: string) {
  return updateContactFone(idContact, idUser, fone);
}

async function removeContact(idContact: number, idUser: number) {
  return deleteContact(idContact, idUser);
}

export {
  changeContactFone,
  changeContactName,
  createContact,
  listContacts,
  parseContactId,
  removeContact,
};
