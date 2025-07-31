import { prisma } from "./getPrisma.ts";

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

const queryUserWithPosts2 = async (userId: number, published = true) => {
  try {
    const results = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
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

// ***** Testing ****

// insertUser();
// for (let i = 0; i < 10; i++) insertUser();

// const numPosts = 30;
// for (let i = 0; i < numPosts; i++) {
//   const userId = Math.floor(Math.random() * 10);
//   insertPost(userId);
// }

// queryUserWithPosts(5);
// queryUserWithPosts(8);

// queryUserWithPosts2(5, false);
// queryUserWithPosts2(8, false);

// queryPostWithUser(37);
// queryPostWithUser(40);

// updatePost(5, 3);
// updatePost(5, 8);
// updatePost(5, 51);
// updatePost(5, 54);
