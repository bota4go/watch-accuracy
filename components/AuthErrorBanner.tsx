"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_ERROR_HINTS } from "@/lib/auth-error-hints";

/** When `pages.signIn` is `/`, failed OAuth returns `/?error=...` (not /auth/error). */
export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");

  const dismiss = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("error");
    next.delete("callbackUrl");
    const q = next.toString();
    router.replace(q ? `/?${q}` : "/");
  }, [router, searchParams]);

  if (!code) return null;

  const hint = AUTH_ERROR_HINTS[code] ?? `Sign-in error (code: ${code}). See SETUP_OAUTH.md.`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-2 pt-4 sm:px-6 lg:px-8">
    <div
      className="rounded-lg border-2 border-red-500/50 bg-red-950/50 px-4 py-3 text-sm text-red-100/95 shadow-[0_0_20px_rgba(239,68,68,0.12)]"
      role="alert"
    >
      <p className="font-bold uppercase tracking-widest text-[10px] text-red-300/90">Sign-in failed</p>
      <p className="mt-1 leading-relaxed">{hint}</p>
      {callbackUrl && (
        <p className="mt-1 font-mono text-[10px] text-red-200/60 break-all">callback: {callbackUrl}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="rounded border border-red-400/50 bg-red-900/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-100 hover:bg-red-900/60"
        >
          Dismiss
        </button>
        <Link
          href={`/auth/error?error=${encodeURIComponent(code)}`}
          className="inline-flex items-center rounded border border-red-400/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-200/90 hover:border-red-300/50"
        >
          Full help
        </Link>
      </div>
    </div>
    </div>
  );
}
