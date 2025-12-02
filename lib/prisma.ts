import { PrismaClient } from "../generated/prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Ensure a single Prisma client across hot reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaBase?: PrismaClient;
};

// Check if Accelerate is configured (DATABASE_URL starts with prisma://)
const useAccelerate = process.env.DATABASE_URL?.startsWith("prisma://");

function createPrismaClient(): PrismaClient {
  // Use Accelerate if configured, otherwise use regular PrismaClient
  if (useAccelerate) {
    return new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient;
  }
  return new PrismaClient();
}

// Main client - with Accelerate if configured, otherwise regular
const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

// Base client for NextAuth adapter (doesn't work with extensions)
// Uses direct Postgres URL for auth operations
const directDbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const prismaBase: PrismaClient = globalForPrisma.prismaBase ?? new PrismaClient({
  datasources: directDbUrl ? {
    db: {
      url: directDbUrl,
    },
  } : undefined,
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaBase = prismaBase;
}

export default prisma;
export { prismaBase };
