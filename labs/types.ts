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

export interface Course {
  courseNo: string;
  title: string;
}

import { Program } from "@prisma/client";

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: Program;
}

export interface Enrollment {
  studentId: string;
  courseNo: string;
}
