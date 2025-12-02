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
// Uses direct Postgres URL since Accelerate URL requires the extension
const prismaBase = globalForPrisma.prismaBase ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaBase = prismaBase;
}

export default prisma;
export { prismaBase };
