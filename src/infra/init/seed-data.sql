TRUNCATE TABLE public.contacts, public.users RESTART IDENTITY CASCADE;

WITH inserted_users AS (
  INSERT INTO public.users (email, password)
  VALUES
    ('usuario1@email.com', '123456'),
    ('usuario2@email.com', '123456'),
    ('usuario3@email.com', '123456')
  RETURNING id_user, email
),
numbered_users AS (
  SELECT
    id_user,
    ROW_NUMBER() OVER (ORDER BY email) AS user_number
  FROM inserted_users
),
contact_totals AS (
  SELECT * FROM (VALUES
    (1, 10),
    (2, 30),
    (3, 50)
  ) AS totals(user_number, total_contacts)
)
INSERT INTO public.contacts (id_user, name, fone)
SELECT
  numbered_users.id_user,
  'Contato ' || contact_number || ' - Usuario ' || numbered_users.user_number,
  '(12) 9' || LPAD(numbered_users.user_number::TEXT, 4, '0') || LPAD(contact_number::TEXT, 4, '0')
FROM numbered_users
JOIN contact_totals
  ON contact_totals.user_number = numbered_users.user_number
CROSS JOIN LATERAL generate_series(1, contact_totals.total_contacts) AS contact_number;
