"use client";

import { signIn, signOut } from "next-auth/react";
import { AlertCircle, LogOut, Mail } from "lucide-react";
import { useEnvHealth } from "@/hooks/use-env-health";

function originPortHint() {
  if (typeof window === "undefined") return null;
  return `${window.location.protocol}//${window.location.host}`;
}

export function AuthBar({
  isAuthed,
  user,
}: {
  isAuthed: boolean;
  user: { name?: string | null; email?: string | null; image?: string | null } | undefined;
}) {
  const health = useEnvHealth();
  const browserOrigin = originPortHint();
  const canSignIn = health?.google && health?.nextAuth;
  const urlMismatch =
    Boolean(health?.nextAuthUrl && browserOrigin) &&
    (() => {
      try {
        return new URL(health!.nextAuthUrl!).host !== new URL(browserOrigin!).host;
      } catch {
        return false;
      }
    })();

  const isVercel = typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app");

  if (!isAuthed) {
    return (
      <div className="flex w-full max-w-sm flex-col items-stretch gap-2 sm:max-w-none sm:items-end">
        {health && !health.google && (
          <p className="max-w-sm rounded border border-amber-500/30 bg-amber-950/30 p-2 text-left text-[10px] leading-snug text-amber-200/90">
            <span className="inline-flex items-center gap-1 font-bold">
              <AlertCircle className="h-3 w-3" /> Google OAuth
            </span>{" "}
            {isVercel ? (
              <>
                Add <code className="text-cyan-200/80">GOOGLE_CLIENT_ID</code> and{" "}
                <code className="text-cyan-200/80">GOOGLE_CLIENT_SECRET</code> in the Vercel project →
                <strong> Settings</strong> → <strong>Environment Variables</strong> (Production), name must match
                exactly, no spaces. <strong>Redeploy</strong> after saving. For local dev, also add them to{" "}
                <code className="text-cyan-200/80">.env</code> — see <code className="text-cyan-200/80">SETUP_OAUTH.md</code>
              </>
            ) : (
              <>
                Set <code className="text-cyan-200/80">GOOGLE_CLIENT_ID</code> and{" "}
                <code className="text-cyan-200/80">GOOGLE_CLIENT_SECRET</code> in <code className="text-cyan-200/80">.env</code> in
                this project folder, then restart <code className="text-cyan-200/80">npm run dev</code> — see{" "}
                <code className="text-cyan-200/80">SETUP_OAUTH.md</code>
              </>
            )}
            {!health.google && (!health.googleId || !health.googleSecret) && (
              <span className="mt-1 block text-slate-500">
                {!health.googleId && "Server does not see GOOGLE_CLIENT_ID. "}
                {health.googleId && !health.googleSecret && "Server does not see GOOGLE_CLIENT_SECRET. "}
              </span>
            )}
          </p>
        )}
        {health && !health.nextAuth && (
          <p className="max-w-sm rounded border border-amber-500/30 bg-amber-950/30 p-2 text-left text-[10px] text-amber-200/90">
            {isVercel ? (
              <>
                Set <code className="text-cyan-200/80">NEXTAUTH_SECRET</code> and{" "}
                <code className="text-cyan-200/80">NEXTAUTH_URL</code> in Vercel (Production), then redeploy.{" "}
                <code className="text-cyan-200/80">NEXTAUTH_URL</code> must be <code className="text-cyan-200/80">https://…{window.location.host}</code> (no trailing slash).
              </>
            ) : (
              <>
                Set <code className="text-cyan-200/80">NEXTAUTH_SECRET</code> and{" "}
                <code className="text-cyan-200/80">NEXTAUTH_URL</code> in <code className="text-cyan-200/80">.env</code>
              </>
            )}
          </p>
        )}
        {urlMismatch && health?.nextAuthUrl && browserOrigin && (
          <p className="max-w-sm rounded border border-fuchsia-500/30 bg-fuchsia-950/20 p-2 text-left text-[10px] text-fuchsia-200/90">
            <strong>URL mismatch:</strong> <code className="text-cyan-200/80">NEXTAUTH_URL</code> is{" "}
            {health.nextAuthUrl} but this tab is {browserOrigin}. Set Vercel env{" "}
            <code className="text-cyan-200/80">NEXTAUTH_URL={browserOrigin}</code>
            {isVercel ? " and redeploy." : " and restart the dev server."}
          </p>
        )}
        <button
          type="button"
          disabled={!canSignIn}
          onClick={() => signIn("google")}
          title={!canSignIn ? "Configure .env first" : undefined}
          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-cyan-200 shadow-[0_0_16px_rgba(0,245,255,0.15)] transition enabled:hover:border-cyan-300 enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Mail className="h-4 w-4" />
          Sign in with Google
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {user?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="h-8 w-8 flex-shrink-0 rounded-full border border-cyan-500/40"
            width={32}
            height={32}
            referrerPolicy="no-referrer"
          />
        )}
        <div className="min-w-0 text-right sm:text-left">
          <p className="truncate text-sm font-bold text-cyan-200/90">
            {user?.name || user?.email}
          </p>
          {user?.email && user?.name && (
            <p className="truncate text-[10px] text-slate-500">{user.email}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => signOut()}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-600/80 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}
