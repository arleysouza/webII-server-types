import {
  insertUsuario,
  updateUserEmail,
  updateUserPassword,
} from "../repositories/users.repository";
import { hashPassword } from "../utils/password";

async function createUser(email: string, password: string) {
  const passwordEncoded = hashPassword(password);

  return insertUsuario(email, passwordEncoded);
}

async function changeUserEmail(idUser: number, email: string) {
  return updateUserEmail(idUser, email);
}

async function changeUserPassword(idUser: number, password: string) {
  const passwordEncoded = hashPassword(password);

  return updateUserPassword(idUser, passwordEncoded);
}

export {
  changeUserEmail,
  changeUserPassword,
  createUser,
};
