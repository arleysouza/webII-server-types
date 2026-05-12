import { Router } from "express";
import { createUser, updateEmail, updatePassword } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const usersRouter = Router();

usersRouter.post("/users", createUser);
usersRouter.patch("/users/email", authMiddleware, updateEmail);
usersRouter.patch("/users/password", authMiddleware, updatePassword);

export {
  usersRouter,
};
