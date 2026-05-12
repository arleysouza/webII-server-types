import { Router } from "express";
import {
  createContact,
  listContacts,
  removeContact,
  updateFone,
  updateName,
} from "../controllers/contacts.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const contactsRouter = Router();

contactsRouter.post("/", authMiddleware, createContact);
contactsRouter.get("/", authMiddleware, listContacts);
contactsRouter.patch("/:id_contact/name", authMiddleware, updateName);
contactsRouter.patch("/:id_contact/fone", authMiddleware, updateFone);
contactsRouter.delete("/:id_contact", authMiddleware, removeContact);

export {
  contactsRouter,
};
