import { Router } from "express";
import { createUser } from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.post("/users", createUser);

export {
  usersRouter,
};
