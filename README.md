# Server - API de usuários e contatos

API em Node.js, Express, TypeScript e PostgreSQL para cadastro de usuários, login com JWT e gerenciamento de contatos do usuário autenticado.

## Requisitos

- Node.js
- npm
- PostgreSQL

## Configuração do ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
PORT=3001

POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123
POSTGRES_DB=bdaula
POSTGRES_PORT=5432

JWT_SECRET=@codigo_secreto@
DEFAULT_EXPIRES_IN_SECONDS=600
```

Instale as dependências:

```bash
npm install
```

## Criar o banco de dados e tabelas

Crie o banco no PostgreSQL:

```bash
createdb -h localhost -p 5432 -U postgres bdaula
```

Depois execute os scripts SQL do projeto:

```bash
npm run db:init
```

Esse comando compila o TypeScript e executa:

- `src/infra/init/schema-sql.sql`: cria as tabelas `users` e `contacts`
- `src/infra/init/seed-data.sql`: limpa as tabelas e insere dados iniciais

## Subir o projeto

Execute:

```bash
npm run dev
```

Com o `.env` acima, a API ficará disponível em:

```text
http://localhost:3001
```

## Rotas de teste

### Criar usuário

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"novo@email.com","password":"123456"}'
```

Resposta esperada:

```json
{
  "id_user": 4,
  "email": "novo@email.com"
}
```

### Login

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario1@email.com","password":"123456"}'
```

Resposta esperada:

```json
{
  "token": "JWT_GERADO",
  "user": {
    "id_user": 1,
    "email": "usuario1@email.com"
  }
}
```

### Atualizar email do usuário logado

Substitua `JWT_GERADO` pelo token retornado no login:

```bash
curl -X PATCH http://localhost:3001/api/users/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_GERADO" \
  -d '{"email":"usuario1-novo@email.com"}'
```

Resposta esperada:

```json
{
  "id_user": 1,
  "email": "usuario1-novo@email.com"
}
```

### Atualizar senha do usuário logado

```bash
curl -X PATCH http://localhost:3001/api/users/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_GERADO" \
  -d '{"password":"nova-senha"}'
```

Resposta esperada:

```json
{
  "message": "Senha atualizada com sucesso."
}
```

### Criar contato do usuário logado

Substitua `JWT_GERADO` pelo token retornado no login:

```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_GERADO" \
  -d '{"name":"Maria Silva","fone":"(12)99999-0000"}'
```

Resposta esperada:

```json
{
  "id_contact": 91,
  "id_user": 1,
  "name": "Maria Silva",
  "fone": "(12)99999-0000"
}
```

### Listar contatos do usuário logado

```bash
curl http://localhost:3001/api/contacts \
  -H "Authorization: Bearer JWT_GERADO"
```

Resposta esperada:

```json
[
  {
    "id_contact": 1,
    "id_user": 1,
    "name": "Contato 1 - Usuario 1",
    "fone": "(12) 900010001"
  }
]
```

## Diagrama do BD

```mermaid
erDiagram
  USERS ||--o{ CONTACTS : possui

  USERS {
    int id_user PK
    varchar email
    varchar password
  }

  CONTACTS {
    int id_contact PK
    int id_user FK
    varchar name
    varchar fone
  }
```

## Diagrama de componentes

```mermaid
flowchart TD
  Client[Cliente HTTP]
  Server[Express Server]
  Routes[Routes]
  AuthMiddleware[Auth Middleware]
  Controllers[Controllers]
  Repositories[Repositories]
  Utils[Utils JWT e Password]
  Database[(PostgreSQL)]

  Client --> Server
  Server --> Routes
  Routes --> AuthMiddleware
  Routes --> Controllers
  AuthMiddleware --> Utils
  AuthMiddleware --> Controllers
  Controllers --> Repositories
  Controllers --> Utils
  Repositories --> Database
```

## Diagramas de sequência

### POST /api/users

```mermaid
sequenceDiagram
  actor Client as Cliente
  participant Router as Users Router
  participant Controller as Users Controller
  participant Repository as Users Repository
  participant Password as Password Utils
  participant DB as PostgreSQL

  Client->>Router: POST /api/users
  Router->>Controller: createUser(request, response)
  Controller->>Controller: valida email e password
  Controller->>Repository: insertUsuario(email, password)
  Repository->>Password: hashPassword(password)
  Password-->>Repository: password hash
  Repository->>DB: INSERT INTO users
  DB-->>Repository: id_user, email
  Repository-->>Controller: user
  Controller-->>Client: 201 Created
```

### POST /api/login

```mermaid
sequenceDiagram
  actor Client as Cliente
  participant Router as Auth Router
  participant Controller as Auth Controller
  participant Repository as Users Repository
  participant Password as Password Utils
  participant JWT as JWT Utils
  participant DB as PostgreSQL

  Client->>Router: POST /api/login
  Router->>Controller: login(request, response)
  Controller->>Controller: valida email e password
  Controller->>Repository: findUserByEmail(email)
  Repository->>DB: SELECT user by email
  DB-->>Repository: user com password
  Repository-->>Controller: user
  Controller->>Password: verifyPassword(password, user.password)
  Password-->>Controller: boolean
  Controller->>JWT: createToken({ id_user, email })
  JWT-->>Controller: token
  Controller-->>Client: 200 OK com token
```

### POST /api/contacts

```mermaid
sequenceDiagram
  actor Client as Cliente
  participant Router as Contacts Router
  participant Middleware as Auth Middleware
  participant JWT as JWT Utils
  participant Controller as Contacts Controller
  participant Repository as Contacts Repository
  participant DB as PostgreSQL

  Client->>Router: POST /api/contacts com Bearer token
  Router->>Middleware: authMiddleware
  Middleware->>JWT: verifyToken(token)
  JWT-->>Middleware: id_user, email
  Middleware->>Controller: createContact com request.user
  Controller->>Controller: valida name e fone
  Controller->>Repository: insertContact(id_user, name, fone)
  Repository->>DB: INSERT INTO contacts
  DB-->>Repository: contact
  Repository-->>Controller: contact
  Controller-->>Client: 201 Created
```

### GET /api/contacts

```mermaid
sequenceDiagram
  actor Client as Cliente
  participant Router as Contacts Router
  participant Middleware as Auth Middleware
  participant JWT as JWT Utils
  participant Controller as Contacts Controller
  participant Repository as Contacts Repository
  participant DB as PostgreSQL

  Client->>Router: GET /api/contacts com Bearer token
  Router->>Middleware: authMiddleware
  Middleware->>JWT: verifyToken(token)
  JWT-->>Middleware: id_user, email
  Middleware->>Controller: listContacts com request.user
  Controller->>Repository: findContactsByUserId(id_user)
  Repository->>DB: SELECT contacts WHERE id_user = $1
  DB-->>Repository: contacts
  Repository-->>Controller: contacts
  Controller-->>Client: 200 OK com contatos
```
