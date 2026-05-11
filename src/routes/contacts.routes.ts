import { Router } from "express";
import { createContact, listContacts } from "../controllers/contacts.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const contactsRouter = Router();

contactsRouter.post("/contacts", authMiddleware, createContact);
contactsRouter.get("/contacts", authMiddleware, listContacts);

export {
  contactsRouter,
};
