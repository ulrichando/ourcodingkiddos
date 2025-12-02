import { PrismaClient } from "../generated/prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Ensure a single Prisma client across hot reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
  prismaBase?: PrismaClient;
};

function createPrismaClient() {
  return new PrismaClient().$extends(withAccelerate());
}

// Extended client with Accelerate for general use
const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Base client for NextAuth adapter (doesn't work with extensions)
const prismaBase = globalForPrisma.prismaBase ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaBase = prismaBase;
}

export default prisma;
export { prismaBase };
