import pool from "../database/db";

type Contact = {
  id_contact: number;
  id_user: number;
  name: string;
  fone: string;
};

async function insertContact(idUser: number, name: string, fone: string): Promise<Contact | null> {
  const result = await pool.query<Contact>(
    `INSERT INTO public.contacts (id_user, name, fone)
         VALUES ($1, $2, $3)
      RETURNING id_contact, id_user, name, fone`,
    [idUser, name, fone],
  );

  return result.rows[0] || null;
}

async function findContactsByUserId(idUser: number): Promise<Contact[]> {
  const result = await pool.query<Contact>(
    `SELECT id_contact, id_user, name, fone
       FROM public.contacts
      WHERE id_user = $1
      ORDER BY name`,
    [idUser],
  );

  return result.rows;
}

async function updateContactName(
  idContact: number,
  idUser: number,
  name: string,
): Promise<Contact | null> {
  const result = await pool.query<Contact>(
    `UPDATE public.contacts
        SET name = $3
      WHERE id_contact = $1
        AND id_user = $2
      RETURNING id_contact, id_user, name, fone`,
    [idContact, idUser, name],
  );

  return result.rows[0] || null;
}

async function updateContactFone(
  idContact: number,
  idUser: number,
  fone: string,
): Promise<Contact | null> {
  const result = await pool.query<Contact>(
    `UPDATE public.contacts
        SET fone = $3
      WHERE id_contact = $1
        AND id_user = $2
      RETURNING id_contact, id_user, name, fone`,
    [idContact, idUser, fone],
  );

  return result.rows[0] || null;
}

async function deleteContact(idContact: number, idUser: number): Promise<Contact | null> {
  const result = await pool.query<Contact>(
    `DELETE FROM public.contacts
      WHERE id_contact = $1
        AND id_user = $2
      RETURNING id_contact, id_user, name, fone`,
    [idContact, idUser],
  );

  return result.rows[0] || null;
}

export {
  type Contact,
  deleteContact,
  findContactsByUserId,
  insertContact,
  updateContactFone,
  updateContactName,
};
