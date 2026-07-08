# Linkvault

![NodeJS](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Jest](https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

API para catalogar e consultar links, conteúdos técnicos e referências.

## Tecnologias

- Node.js
- TypeScript
- NestJS
- Prisma
- PostgreSQL
- JWT + Passport
- bcrypt
- class-validator
- class-transformer
- Jest
- ESLint
- Prettier

## Funcionalidades

- Cadastro de usuários
- Login com JWT
- Hash de senha com bcrypt
- CRUD de categorias
- CRUD de recursos
- Relacionamento entre usuários, categorias e recursos
- Proteção de rotas com autenticação JWT
- Controle de acesso por perfil `USER` e `ADMIN`
- Paginação na listagem de recursos
- Filtro de recursos por categoria
- Validação de dados de entrada

## Pré-requisitos

- Node.js 22+
- npm
- PostgreSQL

## Instalação

```bash
git clone https://github.com/caiolucasbittencourt/linkvault.git
cd linkvault
npm install
```

## Configuração

Crie um arquivo `.env` na raiz baseado no `.env.example`:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Defina as variáveis de ambiente:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/link_docs?schema=public"
JWT_SECRET="uma_chave_grande_e_aleatoria"
JWT_EXPIRES_IN_SECONDS=86400
PORT=3000
```

Crie o banco PostgreSQL, se ainda não existir:

```bash
createdb -h localhost -p 5432 -U postgres link_docs
```

Aplique as migrations:

```bash
npm run prisma:migrate
```

Gere o Prisma Client, se necessário:

```bash
npm run prisma:generate
```

## Executando

### Desenvolvimento

```bash
npm run start:dev
```

Executa a API em modo watch. Por padrão, a aplicação sobe em `http://localhost:3000`.

### Produção local

```bash
npm run build
npm run start:prod
```

`npm run start:prod` executa `dist/src/main.js`.

## Scripts

| Script                    | Descrição                                        |
| ------------------------- | ------------------------------------------------ |
| `npm run build`           | Compila TypeScript para `dist/`                  |
| `npm run start`           | Inicia a API com NestJS                          |
| `npm run start:dev`       | Inicia a API em modo watch                       |
| `npm run start:debug`     | Inicia a API em modo debug                       |
| `npm run start:prod`      | Inicia a API compilada em produção local         |
| `npm run lint`            | Executa ESLint em `src/` e corrige problemas     |
| `npm run format`          | Formata arquivos do projeto com Prettier         |
| `npm run format:prisma`   | Formata o schema do Prisma                       |
| `npm test`                | Executa testes unitários com Jest                |
| `npm run test:watch`      | Executa testes em modo watch                     |
| `npm run test:cov`        | Executa testes com cobertura                     |
| `npm run test:e2e`        | Executa testes end-to-end                        |
| `npm run prisma:generate` | Gera o Prisma Client                             |
| `npm run prisma:migrate`  | Aplica migrations em ambiente de desenvolvimento |

## Estrutura

```text
prisma/
  migrations/
  schema.prisma
src/
  auth/
    decorators/
    dto/
    guards/
    strategies/
    types/
  categories/
    dto/
  prisma/
  resources/
    dto/
  app.module.ts
  main.ts
test/
  jest-e2e.json
```

## Rotas

### Autenticação

| Método | Rota             | Descrição            | Acesso  |
| ------ | ---------------- | -------------------- | ------- |
| POST   | `/auth/register` | Cadastra um usuário  | Público |
| POST   | `/auth/login`    | Autentica um usuário | Público |

### Categorias

| Método | Rota                | Descrição                    | Acesso  |
| ------ | ------------------- | ---------------------------- | ------- |
| GET    | `/categories`       | Lista todas as categorias    | Público |
| GET    | `/categories/:slug` | Busca uma categoria por slug | Público |
| POST   | `/categories`       | Cadastra uma categoria       | ADMIN   |
| PATCH  | `/categories/:id`   | Atualiza uma categoria       | ADMIN   |
| DELETE | `/categories/:id`   | Remove uma categoria         | ADMIN   |

### Recursos

| Método | Rota             | Descrição                              | Acesso        |
| ------ | ---------------- | -------------------------------------- | ------------- |
| GET    | `/resources`     | Lista recursos com paginação e filtros | Público       |
| GET    | `/resources/:id` | Busca um recurso por ID                | Público       |
| POST   | `/resources`     | Cadastra um recurso                    | Autenticado   |
| PATCH  | `/resources/:id` | Atualiza um recurso                    | Dono ou ADMIN |
| DELETE | `/resources/:id` | Remove um recurso                      | Dono ou ADMIN |

Filtros disponíveis em `GET /resources`:

```text
page
limit
categoryId
```

Exemplo:

```bash
GET /resources?page=1&limit=10&categoryId=1
```

## Licença

Este projeto está licenciado sob a licença [MIT](./LICENSE).
