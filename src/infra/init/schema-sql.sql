CREATE TABLE IF NOT EXISTS public.users (
  id_user SERIAL NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(200) NOT NULL,
  PRIMARY KEY(id_user)
);

CREATE TABLE IF NOT EXISTS public.contacts (
  id_contact SERIAL NOT NULL,
  id_user INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  fone VARCHAR(15) NOT NULL,
  PRIMARY KEY(id_contact),
  FOREIGN KEY(id_user) REFERENCES public.users(id_user)
);
