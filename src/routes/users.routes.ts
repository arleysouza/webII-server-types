import { Router } from "express";
import { createUser, updateEmail, updatePassword } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const usersRouter = Router();

usersRouter.post("/", createUser);
usersRouter.patch("/email", authMiddleware, updateEmail);
usersRouter.patch("/password", authMiddleware, updatePassword);

export {
  usersRouter,
};
