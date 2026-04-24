import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeWatch } from "@/lib/serialize-watch";

type Ctx = { params: { id: string } };

export async function POST(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const watch = await prisma.watch.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!watch) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let body: { offsetSec?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const offsetSec = Number(body.offsetSec);
  if (Number.isNaN(offsetSec)) {
    return NextResponse.json({ error: "offsetSec must be a number" }, { status: 400 });
  }
  await prisma.syncEntry.create({
    data: { watchId: watch.id, offsetSec, at: new Date() },
  });
  const full = await prisma.watch.findFirstOrThrow({
    where: { id: watch.id },
    include: { syncs: { orderBy: { at: "asc" } } },
  });
  return NextResponse.json(serializeWatch(full));
}
