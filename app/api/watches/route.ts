import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeWatch } from "@/lib/serialize-watch";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await prisma.watch.findMany({
    where: { userId: session.user.id },
    include: { syncs: { orderBy: { at: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows.map(serializeWatch));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let name = "Unnamed";
  try {
    const body = await req.json();
    const n = String(body.name ?? "").trim();
    if (n) name = n;
  } catch {
    /* no body */
  }
  const w = await prisma.watch.create({
    data: { userId: session.user.id, name },
  });
  return NextResponse.json(serializeWatch({ ...w, syncs: [] }));
}
