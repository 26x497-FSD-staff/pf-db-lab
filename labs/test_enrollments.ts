import { prisma } from "./getPrisma.ts";
import { Program } from "@prisma/client";
import { Prisma } from "@prisma/client";

const insertStudent = async (studentId: string, program: Program) => {
  const n = Math.floor(Math.random() * 100);
  const fname = `Student${n}`;
  try {
    const results = await prisma.student.create({
      data: {
        studentId: studentId,
        firstName: fname,
        lastName: "Something-${n}",
        program: program,
      },
    });
    console.log(results);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Something is wrong: insertStudent()", error.message);
      // console.error(error);
    }
  } finally {
    await prisma.$disconnect();
  }
};

const insertCourse = async (
  courseNo: string,
  courseTitle = "Awesome course"
) => {
  const n = Math.floor(Math.random() * 100);
  try {
    const results = await prisma.course.create({
      data: {
        courseNo: courseNo,
        title: `${courseTitle} - ${n}`,
      },
    });
    console.log(results);
  } catch (error) {
    console.error("Something is wrong: insertCourse()");
    // console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const addEnrollment = async (courseNo: string, studentId: string) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        courseNo,
      },
    });

    if (!course) {
      console.error("Course does not exist");
      return;
    }

    try {
      await prisma.enrollment.create({
        data: {
          studentId,
          courseNo,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          console.error("You already registered this course");
        } else {
          console.error("Oops!, please try again later", error.message);
        }
      }
    }
  } catch (error) {
    console.error("Something is wrong in addEnrollment()");
  } finally {
    await prisma.$disconnect();
  }
};

// Test

// insertStudent("640610555", Program.CPE);
// insertStudent("640610666", Program.CPE);
// insertStudent("640610777", Program.CPE);
// insertStudent("640615001", Program.ISNE);
// insertStudent("640615002", Program.CPE);

// insertCourse("261102");
// insertCourse("261207");
// insertCourse("261336");
// insertCourse("261494");
// insertCourse("269103");
// insertCourse("269494");

addEnrollment("261102", "640610555");
addEnrollment("261102", "640610666");
addEnrollment("261336", "640610555");
addEnrollment("261336", "640615001");
addEnrollment("269494", "640615001");
addEnrollment("261102", "640610555");
