TRUNCATE TABLE public.contacts, public.users RESTART IDENTITY CASCADE;

WITH inserted_users AS (
  INSERT INTO public.users (email, password)
  VALUES
    ('usuario1@email.com', '96f5950213d32c5560c485ec5c8ef407:f0b5d3c931311a77645500061edad46d2807550e760ef7de485896fadb16d10449832e904cd54ead2b0760d543137b580bee79d157cacc76b32967793a4fd302'),
    ('usuario2@email.com', '2e497ecd0e1bf3589ec914b576ad9f5b:99d9075bc8b1f2feb2a2d9152427f2693dd0583d757de941a27ba6c20964135c9310bef9516f6794b3647b0f153919c0bc60805382b8ed07b19b1e2b456c6d0c'),
    ('usuario3@email.com', '02f51597d60ba4d8599ade8dfc7aec99:0a05f07cbfb8b4b55e24c88d3c52f887c9d4be19f9abe9b7c15e7deacc99a8a48dfa71c543f839c5d61afa16855b3a086bdda16c523ccf5168e8d8643843a0ff')
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
