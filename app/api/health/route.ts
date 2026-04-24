import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * No secrets — tells the UI which env blocks are set (for local dev).
 */
export function GET() {
  const googleId = Boolean(process.env.GOOGLE_CLIENT_ID?.trim());
  const googleSecret = Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim());
  const durl = process.env.DATABASE_URL?.trim() ?? "";
  const database = Boolean(durl) && !durl.includes("USER:PASSWORD") && /^postgres(ql)?:\/\//i.test(durl);
  const nsec = process.env.NEXTAUTH_SECRET?.trim() ?? "";
  const nextAuthSecret =
    Boolean(nsec) && nsec.length >= 16 && !/^replace-with/i.test(nsec);
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim() ?? "";
  return NextResponse.json({
    google: googleId && googleSecret,
    database,
    nextAuth: nextAuthSecret && Boolean(nextAuthUrl),
    /** Shown in UI as a hint; must match browser origin (include port). */
    nextAuthUrl: nextAuthUrl || null,
  });
}
