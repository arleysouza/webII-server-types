import pool from "../database/db";
import { hashPassword } from "../utils/password";

type User = {
  id_user: number;
  email: string;
};

type UserWithPassword = User & {
  password: string;
};

async function insertUsuario(email: string, password: string): Promise<User | null> {
  const passwordEncoded = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO public.users (email, password)
         VALUES ($1, $2)
         RETURNING id_user, email`,
    [email, passwordEncoded],
  );

  return result.rows[0] || null;
}

async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  const result = await pool.query<UserWithPassword>(
    `SELECT id_user, email, password
       FROM public.users
      WHERE email = $1`,
    [email],
  );

  return result.rows[0] || null;
}

export {
  findUserByEmail,
  insertUsuario,
};
