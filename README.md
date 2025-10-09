# API de Inventário e Logs de Mídia 📄

[](https://nodejs.org/)
[](https://nestjs.com/)
[](https://www.google.com/search?q=LICENSE)

## 🚀 Visão Geral

API RESTful construída com **NestJS** e **TypeScript** para gerir um inventário de ativos de mídia. Este projeto possui um foco especial em **Segurança** e **Rastreabilidade**, implementando **Autenticação JWT** e um sistema de **Auditoria (Logging)** que rastreia as ações com o ID real do utilizador autenticado.

-----

## ✨ Funcionalidades Principais

  - **Autenticação Completa (JWT):** Fluxo de Registo (`/auth/register`) e Login (`/auth/login`) com emissão de JSON Web Tokens.
  - **Segurança de Senha:** Hashing de senhas utilizando **Bcrypt** no *pre-save hook* do Mongoose.
  - **Auditoria Real:** `LoggingInterceptor` utiliza o ID do utilizador (`actorId`) **extraído do token JWT** para registrar ações (`CREATE`/`DELETE`), garantindo a rastreabilidade.
  - **Proteção de Rotas:** Uso de `JwtAuthGuard` para restringir o acesso a endpoints de escrita (CRUD).
  - Endpoints CRUD reutilizáveis através de herança (ex.: `BaseMediaController` → `/news`).
  - Validação com `class-validator` + transformação com `class-transformer`.
  - Persistência em MongoDB via Mongoose.

-----

## 🛠 Tecnologias

  - **Framework:** NestJS, TypeScript
  - **Banco de Dados:** Mongoose + MongoDB
  - **Autenticação:** `bcryptjs`, `passport`, `@nestjs/jwt`, `@nestjs/passport`
  - **Utilidades:** `class-validator` / `class-transformer`, RxJS (`tap`)

-----

## ⚙️ Pré-requisitos

  - Node.js (LTS recomendado — v16+ / v18+)
  - MongoDB (local ou remoto)
  - npm ou yarn

-----

## 🔧 Instalação

```bash
# clonar repositório
git clone [SEU_REPO_URL]
cd media-inventory-api

# instalar dependências
npm install
# ou
# yarn install
```

### Variáveis de ambiente

Crie um `.env` na raiz com as seguintes variáveis essenciais:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/media_inventory_db
PORT=3000
# CHAVE SECRETA USADA PARA ASSINAR O JWT
JWT_SECRET=sua_chave_secreta_aqui_e_bem_longa
```

> **Atenção:** Nunca compartilhe a chave `JWT_SECRET` nem o ficheiro `.env` em repositórios públicos.

### Scripts úteis

```json
# package.json (trecho)
"scripts": {
  "start": "nest start",
  "start:dev": "nest start --watch",
  "build": "nest build",
  "lint": "eslint . --ext .ts",
  "test": "jest"
}
```

-----

## ▶️ Executando em desenvolvimento

```bash
# modo dev (watch)
npm run start:dev
```

A API estará disponível em `http://localhost:3000` (ou porta definida em `.env`).

-----

## 📝 Endpoints Principais

### 🔒 Autenticação

| Método | URL | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Cria um novo utilizador. |
| `POST` | `/auth/login` | Autentica um utilizador e retorna o `access_token`. |

**Exemplo de Login (Obtendo o Token):**

**POST** `/auth/login`
Body: `{"email": "seu@email.com", "password": "SuaSenhaSegura"}`

**Resposta (201)**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJpZCI6IjYwY...OQ4fL6jH7S_Zl"
}
```

### 📰 Criar Notícia (Rota Protegida)

Esta rota requer o token JWT obtido no login, enviado no cabeçalho `Authorization`.

**POST** `/news`
**Headers:** `Authorization: Bearer [access_token]`
Body:

```json
{
  "title": "Notícia Criada com JWT",
  "url": "https://site.com/teste-auditoria",
  "type": "NEWS"
}
```

**curl**

```bash
curl -X POST http://localhost:3000/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [SEU_TOKEN_AQUI]" \
  -d '{"title":"Notícia Criada com JWT","url":"https://site.com/teste-auditoria","type":"NEWS"}'
```

**Resposta (201)** — exemplo de Log (Proof of Audit):

Após sucesso, o registro em `logs` terá:

```json
{
  "action": "MEDIA_ASSET_CREATED",
  "mediaAssetId": "650f1a...abc",
  "actorId": "68e7a465873c45f8b1bbaebf", // 💡 ID REAL DO UTILIZADOR EXTRAÍDO DO JWT
  "details": { "title": "Notícia Criada com JWT" }
}
```

-----

### Listar Notícias

**GET** `/news`

**curl**

```bash
curl http://localhost:3000/news
```

**Resposta (200)** — array de objetos mídia (filtrado por `type: NEWS`).

-----

### Deletar ativo (Rota Protegida)

**DELETE** `/media/:id`
**Headers:** `Authorization: Bearer [access_token]`

Em caso de sucesso, o interceptor registra `action: "MEDIA_ASSET_DELETED"` com o `actorId` real no `logs`.

-----

## 🧩 Estrutura sugerida (resumo)

```
src/
├─ app.module.ts
├─ auth/               <-- NOVO
│  ├─ auth.controller.ts
│  ├─ auth.service.ts
│  ├─ dto/
│  │  └─ login.dto.ts
│  ├─ guards/
│  │  └─ jwt-auth.guard.ts
│  └─ strategy/
│     └─ jwt.strategy.ts
├─ user/               <-- NOVO
│  ├─ user.module.ts
│  ├─ user.service.ts
│  └─ schemas/
│     └─ user.schema.ts (com Bcrypt hook)
├─ media/
│  └─ (Controladores e Serviços)
├─ log/
│  └─ interceptors/
│     └─ logging.interceptor.ts (Ajustado)
```

-----

## 🐛 Troubleshooting (problemas comuns)

  - **`UnauthorizedException` em rota protegida (`/news`)**

      - O token está ausente, expirado, ou a chave `JWT_SECRET` no `.env` está incorreta.

  - **Erro de tipagem `Property 'user' does not exist on type 'Request'`**

      - O tipo `Request` precisa ser estendido com uma interface customizada (`AuthRequest`) que inclua a propriedade `user`, conforme a implementação do Passport/JWT.

  - **`MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`**

      - Verifique se `mongod` está rodando.
      - Use `127.0.0.1` na string de conexão.

-----

## 📦 Postman / Insomnia — Collection (importar)

*Use esta coleção apenas como base. Você precisará adicionar as rotas `/auth/register` e `/auth/login` e usar as **variáveis de ambiente** para armazenar o token e testar as rotas protegidas.*

```json
{
  "info": {
    "name": "Media Inventory API",
    "_postman_id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "description": "Coleção básica para testar endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth - Register",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"tester@empresa.com\",\n  \"password\": \"Password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"tester@empresa.com\",\n  \"password\": \"Password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "login"]
        }
      }
    },
    {
      "name": "Create News (Requires JWT)",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Authorization", "value": "Bearer {{access_token}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Notícia Protegida com JWT\",\n  \"url\": \"https://site.com/noticia-protegida\",\n  \"type\": \"NEWS\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/news",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["news"]
        }
      }
    },
    {
      "name": "List News",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/news",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["news"]
        }
      }
    },
    {
      "name": "Delete Media (Requires JWT)",
      "request": {
        "method": "DELETE",
        "header": [
          { "key": "Authorization", "value": "Bearer {{access_token}}" }
        ],
        "url": {
          "raw": "http://localhost:3000/media/:id",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["media", ":id"]
        }
      }
    }
  ]
}
```

-----

## 📜 Licença

MIT — veja o ficheiro `LICENSE` para detalhes.
