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

## Organização do código

- `routes`: definem os endpoints e os middlewares de cada rota.
- `controllers`: tratam `request`, `response`, status HTTP e validações de entrada.
- `services`: concentram regras de negócio e orquestram repositories e utils.
- `repositories`: executam consultas SQL e acessam o PostgreSQL.
- `middlewares`: executam passos comuns antes dos controllers, como autenticação.
- `utils`: agrupam funções auxiliares de JWT e senha.

## Subir o projeto

Execute:

```bash
npm run dev
```

Com o `.env` acima, a API ficará disponível em:

```text
http://localhost:3001
```

## Por que esta aplicação é RESTful?

Esta aplicação pode ser considerada uma API RESTful porque expõe recursos do sistema por meio de URLs e usa os métodos HTTP para indicar a operação que será realizada. Os principais recursos da aplicação são `users` e `contacts`, acessados por rotas como `/api/users` e `/api/contacts`.

Em vez de chamar funções diretamente, o cliente interage com a API enviando requisições HTTP. Por exemplo, `POST /api/users` cria um usuário, `GET /api/contacts` lista os contatos do usuário autenticado, `POST /api/contacts` cria um novo contato, `PATCH /api/contacts/:id_contact/name` atualiza parte de um contato e `DELETE /api/contacts/:id_contact` remove um contato.

A aplicação também retorna respostas em JSON e utiliza códigos de status HTTP para representar o resultado das operações, como `201 Created` ao criar registros, `400 Bad Request` quando faltam dados obrigatórios e `404 Not Found` quando um recurso não é encontrado.

Outro ponto importante é que a API trabalha de forma stateless. Cada requisição para rotas protegidas precisa enviar o token JWT no cabeçalho `Authorization`, permitindo que o servidor identifique o usuário autenticado sem depender de uma sessão armazenada entre as requisições.

Portanto, esta aplicação segue os principais princípios REST ao organizar suas funcionalidades em recursos, usar métodos HTTP adequados, retornar dados padronizados em JSON, aplicar status HTTP e manter a comunicação independente entre cliente e servidor.

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

### Atualizar nome do contato

```bash
curl -X PATCH http://localhost:3001/api/contacts/1/name \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_GERADO" \
  -d '{"name":"Maria Souza"}'
```

Resposta esperada:

```json
{
  "id_contact": 1,
  "id_user": 1,
  "name": "Maria Souza",
  "fone": "(12) 900010001"
}
```

### Atualizar telefone do contato

```bash
curl -X PATCH http://localhost:3001/api/contacts/1/fone \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_GERADO" \
  -d '{"fone":"(12)98888-7777"}'
```

Resposta esperada:

```json
{
  "id_contact": 1,
  "id_user": 1,
  "name": "Maria Souza",
  "fone": "(12)98888-7777"
}
```

### Excluir contato

```bash
curl -X DELETE http://localhost:3001/api/contacts/1 \
  -H "Authorization: Bearer JWT_GERADO"
```

Resposta esperada:

```json
{
  "message": "Contato excluído com sucesso."
}
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
  Services[Services]
  Repositories[Repositories]
  Utils[Utils JWT e Password]
  Database[(PostgreSQL)]

  Client --> Server
  Server --> Routes
  Routes --> AuthMiddleware
  Routes --> Controllers
  AuthMiddleware --> Utils
  AuthMiddleware --> Controllers
  Controllers --> Services
  Services --> Repositories
  Services --> Utils
  Repositories --> Database
```

## Diagramas de sequência

### POST /api/users

```mermaid
sequenceDiagram
  actor Client as Cliente
  participant Router as Users Router
  participant Controller as Users Controller
  participant Service as Users Service
  participant Repository as Users Repository
  participant Password as Password Utils
  participant DB as PostgreSQL

  Client->>Router: POST /api/users
  Router->>Controller: createUser(request, response)
  Controller->>Controller: valida email e password
  Controller->>Service: createUser(email, password)
  Service->>Password: hashPassword(password)
  Password-->>Service: password hash
  Service->>Repository: insertUsuario(email, passwordHash)
  Repository->>DB: INSERT INTO users
  DB-->>Repository: id_user, email
  Repository-->>Service: user
  Service-->>Controller: user
  Controller-->>Client: 201 Created
```

### POST /api/login

```mermaid
sequenceDiagram
  actor Client as Cliente
  participant Router as Auth Router
  participant Controller as Auth Controller
  participant Service as Auth Service
  participant Repository as Users Repository
  participant Password as Password Utils
  participant JWT as JWT Utils
  participant DB as PostgreSQL

  Client->>Router: POST /api/login
  Router->>Controller: login(request, response)
  Controller->>Controller: valida email e password
  Controller->>Service: authenticateUser(email, password)
  Service->>Repository: findUserByEmail(email)
  Repository->>DB: SELECT user by email
  DB-->>Repository: user com password
  Repository-->>Service: user
  Service->>Password: verifyPassword(password, user.password)
  Password-->>Service: boolean
  Service->>JWT: createToken({ id_user, email })
  JWT-->>Service: token
  Service-->>Controller: token e user
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
  participant Service as Contacts Service
  participant Repository as Contacts Repository
  participant DB as PostgreSQL

  Client->>Router: POST /api/contacts com Bearer token
  Router->>Middleware: authMiddleware
  Middleware->>JWT: verifyToken(token)
  JWT-->>Middleware: id_user, email
  Middleware->>Controller: createContact com request.user
  Controller->>Controller: valida name e fone
  Controller->>Service: createContact(id_user, name, fone)
  Service->>Repository: insertContact(id_user, name, fone)
  Repository->>DB: INSERT INTO contacts
  DB-->>Repository: contact
  Repository-->>Service: contact
  Service-->>Controller: contact
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
  participant Service as Contacts Service
  participant Repository as Contacts Repository
  participant DB as PostgreSQL

  Client->>Router: GET /api/contacts com Bearer token
  Router->>Middleware: authMiddleware
  Middleware->>JWT: verifyToken(token)
  JWT-->>Middleware: id_user, email
  Middleware->>Controller: listContacts com request.user
  Controller->>Service: listContacts(id_user)
  Service->>Repository: findContactsByUserId(id_user)
  Repository->>DB: SELECT contacts WHERE id_user = $1
  DB-->>Repository: contacts
  Repository-->>Service: contacts
  Service-->>Controller: contacts
  Controller-->>Client: 200 OK com contatos
```
