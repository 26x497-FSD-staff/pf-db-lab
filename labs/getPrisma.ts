// Note: import PrismaClient from node_modules
// file: schema.prisma
// generator client {
//   provider = "prisma-client-js"
//   output   = "../node_modules/.prisma/client"
// }
import { PrismaClient } from "@prisma/client";

// Node: import PrismaClient from generated client
// file: schema.prisma
// generator client {
//   provider = "prisma-client"
//   output   = "../generated/prisma"
// }
// import { PrismaClient } from "generated/prisma/client";

export const prisma = new PrismaClient();
