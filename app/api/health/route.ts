import { NextResponse } from "next/server";
import { cleanEnvVar, isTruthyEnv } from "@/lib/env-server";
import { VIBE_SYNC_VERSION } from "@/lib/vibe-version";

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
    /** Matches header “vibe sync · v…” — if this is old, the new bundle is not what Vercel is serving. */
    vibeSyncVersion: VIBE_SYNC_VERSION,
    git: process.env.VERCEL
      ? {
          ref: process.env.VERCEL_GIT_COMMIT_REF ?? null,
          sha: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || null,
        }
      : null,
    google: googleId && googleSecret,
    googleId,
    googleSecret,
    database,
    nextAuth: nextAuthSecret && Boolean(nextAuthUrl),
    nextAuthUrl: nextAuthUrl || null,
  });
}
