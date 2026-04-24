"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AUTH_ERROR_HINTS } from "@/lib/auth-error-hints";

function AuthErrorBody() {
  const searchParams = useSearchParams();
  const code = searchParams.get("error") ?? "Unknown";
  const hint = AUTH_ERROR_HINTS[code] ?? `Error code: ${code}`;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#03040f] text-[#c8d8f0]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] [background:linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-12">
        <div className="rounded-xl border-2 border-[#0d1630] bg-[#070b1a]/90 p-8 shadow-[0_0_0_1px_#00f5ff44,0_0_20px_#00f5ff22]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-red-400/80">Sign-in error</p>
          <h1 className="mt-2 text-2xl font-bold text-cyan-200">Could not sign you in</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{hint}</p>
          <p className="mt-2 font-mono text-xs text-slate-500">code: {code}</p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-cyan-200 hover:bg-cyan-500/20"
          >
            Back to app
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#03040f] text-cyan-500 text-xs tracking-widest">
          LOADING…
        </div>
      }
    >
      <AuthErrorBody />
    </Suspense>
  );
}
