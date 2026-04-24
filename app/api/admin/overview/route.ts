import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAllUsersWithWatches, isAdminInDatabase } from "@/lib/admin-db";
import { authOptions } from "@/lib/auth";
import { serializeWatch } from "@/lib/serialize-watch";

/**
 * All users, watches, and sync entries. Only the configured app admin (see `lib/admin.ts` / `ADMIN_EMAIL`).
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdminInDatabase(session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getAllUsersWithWatches();

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      watches: u.watches.map(serializeWatch),
    }))
  );
}
