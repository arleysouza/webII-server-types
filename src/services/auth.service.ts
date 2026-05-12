import { findUserByEmail } from "../repositories/users.repository";
import { createToken } from "../utils/jwt";
import { verifyPassword } from "../utils/password";

async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.password)) {
    return null;
  }

  const token = createToken({
    id_user: user.id_user,
    email: user.email,
  });

  return {
    token,
    user: {
      id_user: user.id_user,
      email: user.email,
    },
  };
}

export {
  authenticateUser,
};
