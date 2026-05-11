import { Router } from "express";
import { authRouter } from "./auth.routes";
import { contactsRouter } from "./contacts.routes";
import { usersRouter } from "./users.routes";

const router = Router();

router.use(authRouter);
router.use(usersRouter);
router.use(contactsRouter);

export {
  router,
};
