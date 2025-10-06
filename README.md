# API de Inventário e Logs de Mídia 📄

[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-orange)](https://nestjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 Visão Geral

API RESTful construída com **NestJS** e **TypeScript** para gerir um inventário de ativos de mídia (Notícias e Vídeos). Implementa logging automático de auditoria no MongoDB para operações de criação e deleção, com design modular e validação de entrada via DTOs.

---

## ✨ Funcionalidades Principais

- Endpoints para criação, listagem e remoção de ativos de mídia.
- Logging automático via `LoggingInterceptor` (grava `action`, `mediaAssetId`, `actorId`, `details`).
- Controllers reutilizáveis através de herança (ex.: `BaseMediaController` → `/news`).
- Validação com `class-validator` + transformação com `class-transformer`.
- Persistência em MongoDB via Mongoose.

---

## 🛠 Tecnologias

- NestJS, TypeScript
- Mongoose + MongoDB
- class-validator / class-transformer
- RxJS (`tap`) para efeitos colaterais (logs)

---

## ⚙️ Pré-requisitos

- Node.js (LTS recomendado — v16+ / v18+)
- MongoDB (local ou remoto)
- npm ou yarn

---

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

Crie um `.env` na raiz com algo parecido com:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/media_inventory_db
PORT=3000
```

> Use `127.0.0.1` em vez de `localhost` quando houver problemas de conexão.

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

---

## ▶️ Executando em desenvolvimento

```bash
# modo dev (watch)
npm run start:dev
```

A API estará disponível em `http://localhost:3000` (ou porta definida em `.env`).

---

## 📝 Endpoints Principais

> Observação: o projeto utiliza DTOs/validações — `type` deve corresponder ao enum (`VIDEOS` ou `NEWS`).

### Criar Notícia

**POST** `/news`
Body:

```json
{
  "title": "Nova Descoberta Científica",
  "url": "https://site.com/noticia-cientifica",
  "type": "NEWS"
}
```

**curl**

```bash
curl -X POST http://localhost:3000/news \
  -H "Content-Type: application/json" \
  -d '{"title":"Nova Descoberta Científica","url":"https://site.com/noticia-cientifica","type":"NEWS"}'
```

**Resposta (201)** — exemplo

```json
{
  "_id": "650f1a...abc",
  "title": "Nova Descoberta Científica",
  "url": "https://site.com/noticia-cientifica",
  "type": "NEWS",
  "actor": "60c72b9f9b1d8e0015f8e5b4",
  "createdBy": "60c72b9f9b1d8e0015f8e5b4",
  "updatedBy": "60c72b9f9b1d8e0015f8e5b4",
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

Após sucesso, um registro é criado em `logs` com:

```json
{
  "action": "MEDIA_ASSET_CREATED",
  "mediaAssetId": "650f1a...abc",
  "actorId": "60c72b9f9b1d8e0015f8e5b4",
  "details": { "title": "Nova Descoberta Científica" }
}
```

---

### Listar Notícias

**GET** `/news`

**curl**

```bash
curl http://localhost:3000/news
```

**Resposta (200)** — array de objetos mídia (filtrado por `type: NEWS`).

---

### Deletar ativo

**DELETE** `/media/:id`

**curl**

```bash
curl -X DELETE http://localhost:3000/media/<ID_DO_ATIVO>
```

Em caso de sucesso, o interceptor registra `action: "MEDIA_ASSET_DELETED"` no `logs`.

---

## 🧩 Estrutura sugerida (resumo)

```
src/
├─ app.module.ts
├─ media/
│  ├─ base.controller.ts
│  ├─ media.controller.ts
│  ├─ media.service.ts
│  ├─ dto/
│  │  └─ create-media.dto.ts
│  └─ schemas/
│     └─ media.schema.ts
├─ log/
│  ├─ log.module.ts
│  ├─ log.service.ts
│  ├─ schemas.ts
│  └─ interceptors/
│     └─ logging.interceptor.ts
```

---

## 🐛 Troubleshooting (problemas comuns)

- **`MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`**
  - Verifique se `mongod` está rodando.
  - Use `127.0.0.1` na string de conexão.
  - Se usar Docker, conecte pelo hostname do serviço Docker (não `localhost`).

- **`Cannot read properties of undefined (reading 'create')` dentro do `BaseMediaController`**
  - Garanta que cada `Controller` que estende `BaseMediaController` injete `MediaService` e passe ao `super()`:

    ```ts
    constructor(mediaService: MediaService) {
      super(mediaService);
    }
    ```

- **Erros de validação Mongoose (enum / required)**
  - Normalize `type` para uppercase (`NEWS`/`VIDEOS`).
  - Preencha `createdBy`, `updatedBy`, `actorId` antes de salvar (controller) ou use pre-hooks no schema.

- **Interceptor não resolve `LogService`**
  - Exporte `LogService` em `LogModule` e importe `LogModule` no `MediaModule`.
  - Declare `LoggingInterceptor` nos `providers` do módulo onde será aplicado e registre com `APP_INTERCEPTOR` se desejar escopo global.

---

## 📦 Postman / Insomnia — Collection (importar)

Copie o JSON abaixo para um ficheiro `postman_collection_media.json` e importe no Postman (File → Import) ou converta para Insomnia.

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
      "name": "Create News",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Nova Descoberta Científica\",\n  \"url\": \"https://site.com/noticia-cientifica\",\n  \"type\": \"NEWS\"\n}"
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
      "name": "Delete Media",
      "request": {
        "method": "DELETE",
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

---

## ✅ Boas práticas & observações finais

- Normalize e valide os inputs no DTO (use `Transform` para normalizar `type`).
- Trate falhas ao persistir logs (try/catch) para não quebrar a resposta principal.
- Padronize nomes dos campos entre schema/DTOs/interceptors/services (camelCase).
- Documente o esquema do banco em `docs/` se o projeto crescer.

---

## 📜 Licença

MIT — veja o ficheiro `LICENSE` para detalhes.
