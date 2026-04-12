import "server-only"; // DB must never be accessed client-side
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";

  // path.resolve is needed locally so the SQLite file is found regardless of cwd.
  // In production it must be skipped: process.cwd() causes Turbopack's NFT tracer
  // to bundle the entire project directory (triggers "Encountered unexpected file
  // in NFT list" warning and inflates the serverless function bundle).
  const resolvedUrl =
    process.env.NODE_ENV !== "production" && dbUrl.startsWith("file:./")
      ? `file:${path.resolve(process.cwd(), dbUrl.slice(7))}`
      : dbUrl;

  const adapter = new PrismaBetterSqlite3({ url: resolvedUrl });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
