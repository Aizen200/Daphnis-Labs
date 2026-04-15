// ─── Prisma Client Singleton ────────────────────────────────────────
// WHY: We create a single PrismaClient instance so we don't open
// multiple database connections during development (nodemon restarts).

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
