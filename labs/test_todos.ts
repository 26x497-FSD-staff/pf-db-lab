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

const queryData = async () => {
  try {
    const results = await prisma.todo.findMany();
    console.log(results);
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};

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

// ***** Testing ****

// for (let i = 0; i < 10; i++) insertData();

// queryData();

// const todoId = "0eb0efca-2b33-4312-9e0b-246c677ea3a0";
// updateData(todoId);

// const todoId = "48f5ecd3-7918-4110-b78c-9c87e012a404";
// deleteData(todoId);
