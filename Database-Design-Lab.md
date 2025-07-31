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

## Start database container

- Run `docker compose -f <compose-file> up -d` to database container
  - `-f compose-postgres.yml` for PostgreSQL database
  - `-f compose-postgres.yml` for MongoDB database

## Create database schema for `Prisma ORM`

- Inside `prisma` directory, create `schema.prisma` from `schema.*.*`
  - `schema.postgres.todos` : schema for **upgraded Todo** application
  - `schema.postgres.posts` : schema for **Social** application
    - Create a new database and specify its own according to `POSTGRES_DB` and `POSTGRES_APP_USER`
  - `schema.mongo.enrollments` : schema for **Student enrollments** application

## Generate prisma client according to the schema and sync with datatbase

- Run `npx prisma generate` to generate `PrismaClient`
- Run `npx prisma db push` to sync up schema to the database

---

## Checkout `labs` directory

- `getPrisma.ts` : create prisma client object using `DATABASE_URL` connection string
- `test_todos.ts` : test CRUD operations with "Todos" in PostgreSQL
- `test_posts.ts` : test CRUD operations with "Posts" in PostgreSQL
- `test_enrollments.ts` : test CRUD operations with "Enrollments" in MongoDB

---

## 1. Test CRUD on Todo database (`test_todos.ts`)

### Create a new Todo item

```typescript
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./getPrisma.ts";

const insertData = async () => {
  try {
    const results = await prisma.todo.create({
      data: {
        id: uuidv4(),
        todo_text: `Item: ${Date.now().toString()}`,
      },
    });
    console.log(results);
  } catch (error) {
    console.error("Something is wrong: insertData()");
  } finally {
    await prisma.$disconnect();
  }
};

// Test
for (let i = 0; i < 10; i++) insertData();
```

### Query all Todo items

```typescript
const queryData = async () => {
  try {
    const results = await prisma.todo.findMany();
    console.log(results);
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};

// Test
// queryData();
```

### Update a specific Todo item (by its Id)

```typescript
const updateData = async (todoId: string, isDone: boolean = true) => {
  try {
    const todoItem = await prisma.todo.findFirst({
      where: {
        id: todoId,
      },
    });

    if (!todoItem) {
      console.log(`Item not found: ${todoId}`);
      return;
    }
  } catch (error) {
    console.error("Something is wrong: updateData()");
    return;
  } finally {
    await prisma.$disconnect();
  }

  try {
    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        todo_text: `Update: ${Date.now().toPrecision(3)}`,
        is_done: isDone,
      },
    });
    console.log("Todo updated successfully:", updatedTodo);
    return updatedTodo;
  } catch (error) {
    console.error("Error updating todo:", todoId);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Test
const todoId = "0eb0efca-2b33-4312-9e0b-246c677ea3a0";
updateData(todoId);
```

### Delete a specific Todo item (by its Id)

```typescript
const deleteData = async (todoId: string) => {
  try {
    const deletedTodo = await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });
    console.log("Deleted Todo:", deletedTodo);
  } catch (error) {
    console.error("Error deleting Todo:", todoId);
  } finally {
    await prisma.$disconnect();
  }
};

// Test
const todoId = "48f5ecd3-7918-4110-b78c-9c87e012a404";
deleteData(todoId);
```

---

## Using PostgreSQL to store NoSQL data

[Working with JSON field with Prisma](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields)

We will create a new PostgreSQL column with `jsonb` data type. This can be used to store JSON data (object, array).

### Update database schema

Add a `sub_tasks` column to the `todos` table by modifying `schema.prisma` as followed

```typescript
model Todo {
  id         String   @id @default(uuid()) @db.Uuid
  todo_text  String   @db.VarChar(255)
  is_done    Boolean  @default(false)
  sub_tasks  Json?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("todos") // map Todo model to the "todos" table
}
```

Push schema update to the table

```bash
npx prisma db push
```

**Optional**: create `TodoItem` and `TaskItem` interfaces as type

```typescript
// ./labs/types.ts

export interface TaskItem {
  title: string;
  isDone: boolean;
  assigned_to?: string;
  tags?: string[];
}

export interface TodoItem {
  id: string;
  todoText: string;
  isDone: boolean;
  subTasks: TaskItem[] | null;
  createdAt: string;
  updatedAt: string;
}
```
### Add a `Task item` to specific `Todo item`

```typescript
import { Prisma } from "@prisma/client";

const updateDataWithTask = async (todoId: string) => {
  let subtasks = null;

  try {
    const todoItem = await prisma.todo.findFirst({
      where: {
        id: todoId,
      },
    });

    if (!todoItem) {
      console.log(`Todo Item not found: ${todoId}`);
      return;
    }

    // Get current subtasks from a Todo item
    if (
      typeof todoItem?.sub_tasks === "object" &&
      Array.isArray(todoItem?.sub_tasks)
    ) {
      // Casting Postgres Jsonb (Prisma.JsonValue) as Prisma.JsonArray
      subtasks = todoItem?.sub_tasks as Prisma.JsonArray;
    } else {
      subtasks = [] as Prisma.JsonArray;
    }

    console.log(todoItem);
  } catch (error) {
    console.error("Something is wrong: updateDataWithTask()");
    return;
  } finally {
    await prisma.$disconnect();
  }

  // Auto generated task
  const no = Math.floor(Math.random() * 100);
  const taskItem = {
    title: `Sub-task: ${Date.now().toString()}`,
    isDone: false,
    assigned_to: `user-${no}`,
    tags: no % 2 ? ["tag1", "tag2", "tag3"] : [],
  };

  subtasks.push(taskItem);

  try {
    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        todo_text: `Update subtask: ${Date.now().toPrecision(3)}`,
        sub_tasks: subtasks,
      },
    });
    console.log("Subtask updated successfully:", updatedTodo);
    return updatedTodo;
  } catch (error) {
    console.error("Error updating subtask:", todoId);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Test
const todoId = "40015b4e-a613-45c1-b41e-026b4b4a5de3";
updateDataWithTask(todoId);
```

### Query a specific Todo item (by its Id)

```typescript
import { type TaskItem } from "./types.ts";

const queryDataByTodoId = async (todoId: string) => {
  try {
    const todoItem = await prisma.todo.findFirst({
      where: {
        id: todoId,
      },
    });
    return todoItem;
  } catch (error) {
    console.error("Something is wrong: queryDataByTodoId()");
  } finally {
    await prisma.$disconnect();
  }
};

// Test
const todoItem = await queryDataByTodoId(todoId);
const subtasks: any = todoItem?.sub_tasks;

console.log(`Todo: ${todoItem?.todo_text}`);
console.log(`Last update: ${todoItem?.updated_at}`);
subtasks?.map((item: TaskItem, index: number) => {
  const task = `  ${index + 1}. ${item?.title} (${item.assigned_to}), ${
    item.tags
  }`;
  console.log(task);
});
```

---

## 2. Test CRUD on Posts database (`test_posts.ts`)

In this example, we implement `one-to-many` relation between Author/User and his/her Posts. We also add a `Foreign Key` into the schema to enfore the relationship.

### Steps-by-Steps:

- Update `prisma/schema.prisma` with the content from `prisma/schema.postgres.posts`
- Update `.env` by changing the variable `POSTGRES_DB` to new value: e.g., `post_database`
- Generate new `Prisma client` according to the new schema
  - `npx prisma generate`
- Update the Postgres database schema
  - `npx prisma db push`
- Open `labs/test_posts.ts`

### Create a new User

```typescript
import { prisma } from "./getPrisma.ts";

// Create a new user (post's author)
const insertUser = async () => {
  const uname = `user${Math.floor(Math.random() * 100)}`;
  try {
    const results = await prisma.user.create({
      data: {
        email: `${uname}@app.com`,
        name: uname,
      },
    });
    console.log(results);
  } catch (error) {
    console.error("Something is wrong: insertUser()");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

// Test - add 10 users
for (let i = 0; i < 10; i++) insertUser();
```

### Create a new Post belonging to specified User (by userId)

```typescript
// Create a new post that belongs to specified user
const insertPost = async (userId: number) => {
  const uname = `user${Math.floor(Math.random() * 100)}`;
  try {
    const results = await prisma.post.create({
      data: {
        title: `Title: ${Date.now().toString()}`,
        authorId: userId,
      },
    });
    console.log(results);
  } catch (error) {
    console.error("Something is wrong: insertPost()");
  } finally {
    await prisma.$disconnect();
  }
};

// Test - add 30 posts (with random userId)
const numPosts = 30;
for (let i = 0; i < numPosts; i++) {
  const userId = Math.floor(Math.random() * 10);
  insertPost(userId);
}

// Test - add a post with invalid userId
// insertPost(11);
````



### Query a Post with its Author information

```typescript
// query a post with author information
const queryPostWithUser = async (postId: number, published = false) => {
  try {
    const results = await prisma.post.findFirst({
      where: {
        id: postId,
        published: published,
      },
      include: {
        author: true,
      },
    });
    console.log(results);
  } catch (error) {
    console.error("Something is wrong: queryPostWithUser()");
  } finally {
    await prisma.$disconnect();
  }
};

// Test
queryPostWithUser(15);
queryPostWithUser(23);
```

### Query a User with all his/her Posts

```typescript
// query a user with his/her posts
const queryUserWithPosts = async (userId: number) => {
  try {
    const results = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        posts: true,
      },
    });
    console.log(results);
  } catch (error) {
    console.error("Something is wrong: queryUserWithPosts()");
  } finally {
    await prisma.$disconnect();
  }
};

// Test
queryUserWithPosts(5);
queryUserWithPosts(8);
```

### Query a User with his/her Posts (with specified published condition)

```typescript
// query a user with his/her posts with published status
const queryUserWithPosts2 = async (userId: number, published = true) => {
  try {
    const results = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        posts: {
          where: {
            published: published,
          },
          select: {
            title: true,
            published: true,
          },
        },
      },
    });
    console.log(results);
  } catch (error) {
    console.error("Something is wrong: queryUserWithPost2()");
  } finally {
    await prisma.$disconnect();
  }
};

// Test
queryUserWithPosts2(5, false);
queryUserWithPosts2(8, false);
queryUserWithPosts2(5);
queryUserWithPosts2(8);


```

### Update a Post (by postId and authorId)

```typescript
// Update a post that belongs to specified user
const updatePost = async (userId: number, postId: number) => {
  try {
    const todoItem = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!todoItem) {
      console.log(`Post(${userId}, ${postId}) not found`);
      return;
    }
  } catch (error) {
    console.error("Something is wrong: updatePost()");
    return;
  } finally {
    await prisma.$disconnect();
  }

  try {
    const todoItem = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!todoItem) {
      console.log(`Post(${userId}, ${postId}) not found`);
      return;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: `Update: ${Date.now().toPrecision(3)}`,
        published: todoItem.published ? false : true,
      },
    });
    console.log("Todo updated successfully:", updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", postId);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Test
updatePost(8, 29);
updatePost(5, 51);
```

