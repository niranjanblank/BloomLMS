import {PrismaClient} from "@prisma/client"


declare global {
    var prisma: PrismaClient | undefined;
}

// to avoid creating PrismaClient continuously on hot reloads
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
  }