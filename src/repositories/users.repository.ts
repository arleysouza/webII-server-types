import pool from "../database/db";

type User = {
  id_user: number;
  email: string;
};

type UserWithPassword = User & {
  password: string;
};

async function insertUsuario(email: string, password: string): Promise<User | null> {
  const result = await pool.query(
    `INSERT INTO public.users (email, password)
         VALUES ($1, $2)
         RETURNING id_user, email`,
    [email, password],
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

async function updateUserEmail(idUser: number, email: string): Promise<User | null> {
  const result = await pool.query<User>(
    `UPDATE public.users
        SET email = $2
      WHERE id_user = $1
      RETURNING id_user, email`,
    [idUser, email],
  );

  return result.rows[0] || null;
}

async function updateUserPassword(idUser: number, password: string): Promise<User | null> {
  const result = await pool.query<User>(
    `UPDATE public.users
        SET password = $2
      WHERE id_user = $1
      RETURNING id_user, email`,
    [idUser, password],
  );

  return result.rows[0] || null;
}

export {
  findUserByEmail,
  insertUsuario,
  updateUserEmail,
  updateUserPassword,
};
