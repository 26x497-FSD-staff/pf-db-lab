# Database Design Lab

---

## Install additional packages

```bash
pnpm install @prisma/client uuid
pnpm install -D prisma @types/uuid
```

- `prisma`: Prisma CLI
- `@prisma/client`: Prisma Client, an auto-generated and query builder
- `uuid`: JavaScript for generating Universally Unique Identifiers
- `@types/uuid`: TypsScript definitions for `uuid`

---

## Install VSCode Prisma extension

Install Prisma extension (from prisma.io)

---

## Setup project

- Create `.env` from `.env.example.*`
  - `.env.example.postgres` : `.env` template for **PostgreSQL** project
  - `.env.example.mongodb` : `.env` template for **MongoDB** project
- Create `.npmrc` from `.npmrc.example` (only for Windows user)
  - For Windows, run `npm run eol` (take care of CRLF issue)

## Create database schema for `Prisma ORM`

- Inside `prisma` directory, create `schema.prisma` from `schema.*.*`
  - `schema.postgres.todos` : schema for **upgraded Todo** application
  - `schema.postgres.posts` : schema for **Social** application
  - `schema.mongo.enrollments` : schema for **Student enrollments** application

## Start database container

- Run `docker compose -f <compose-file> up -d` to database container
  - `-f compose-postgres.yml` for PostgreSQL database
  - `-f compose-postgres.yml` for MongoDB database

## Generate prisma client according to the schema and sync with datatbase

- Run `npx prisma generate` to generate `PrismaClient`
- Run `npx prisma db push` to sync up schema to the database

---

## Checkout `labs` directory

- `getPrisma.ts` : create prisma client object using `DATABASE_URL` connection string
- `test_todos.ts` : test CRUD operations with "Todos" in PostgreSQL
- `test_posts.ts` : test CRUD operations with "Posts" in PostgreSQL
- `test_enrollments.ts` : test CRUD operations with "Enrollments" in MongoDB
