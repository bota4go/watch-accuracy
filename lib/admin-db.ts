import { isAdminEmail } from "./admin";
import { prisma } from "./prisma";

/** Re-checks email in the database (defense in depth; session is not enough alone). */
export async function isAdminInDatabase(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  return isAdminEmail(u?.email);
}

/** One read for session: canonical email + admin (JWT alone can miss email for `isAdmin`). */
export async function getUserSessionFlagsFromDatabase(userId: string) {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  return {
    email: u?.email ?? null,
    isAdmin: isAdminEmail(u?.email),
  };
}

/** All app users with watches and syncs (oldest-to-newest syncs per watch). */
export function getAllUsersWithWatches() {
  return prisma.user.findMany({
    orderBy: { email: "asc" },
    include: {
      watches: {
        orderBy: { createdAt: "desc" },
        include: { syncs: { orderBy: { at: "asc" } } },
      },
    },
  });
}
