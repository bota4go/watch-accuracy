import { NextResponse } from "next/server";
import { cleanEnvVar, isTruthyEnv } from "@/lib/env-server";

export const dynamic = "force-dynamic";

/**
 * No secrets — tells the UI which env blocks are set.
 * Reads `process.env` at request time (works on Vercel after deploy).
 */
export function GET() {
  const googleId = isTruthyEnv(process.env.GOOGLE_CLIENT_ID);
  const googleSecret = isTruthyEnv(process.env.GOOGLE_CLIENT_SECRET);
  const durl = cleanEnvVar(process.env.DATABASE_URL);
  const database =
    Boolean(durl) && !durl.includes("USER:PASSWORD") && /^postgres(ql)?:\/\//i.test(durl);
  const nsec = cleanEnvVar(process.env.NEXTAUTH_SECRET);
  const nextAuthSecret =
    Boolean(nsec) && nsec.length >= 16 && !/^replace-with/i.test(nsec);
  const nextAuthUrl = cleanEnvVar(process.env.NEXTAUTH_URL);
  return NextResponse.json({
    google: googleId && googleSecret,
    googleId,
    googleSecret,
    database,
    nextAuth: nextAuthSecret && Boolean(nextAuthUrl),
    nextAuthUrl: nextAuthUrl || null,
  });
}
