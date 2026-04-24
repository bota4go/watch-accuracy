import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isUiThemeId, parseUiThemeId } from "@/lib/ui-themes";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const u = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { uiTheme: true },
  });
  return NextResponse.json({ uiTheme: parseUiThemeId(u?.uiTheme) });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { uiTheme?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const t = body.uiTheme;
  if (typeof t !== "string" || !isUiThemeId(t)) {
    return NextResponse.json({ error: "Invalid uiTheme" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: session.user.id },
    data: { uiTheme: t },
  });
  return NextResponse.json({ uiTheme: t });
}
