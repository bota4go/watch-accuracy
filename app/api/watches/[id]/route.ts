import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const w = await prisma.watch.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!w) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.watch.delete({ where: { id: w.id } });
  return new NextResponse(null, { status: 204 });
}
