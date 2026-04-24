/** NextAuth /api/auth/* error query values (see app/auth/error and AuthErrorBanner). */
export const AUTH_ERROR_HINTS: Record<string, string> = {
  OAuthSignin:
    "Google sign-in could not start. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env, add the redirect URI in Google Cloud Console, and use a valid NEXTAUTH_URL (e.g. http://localhost:3000 with no trailing slash).",
  /**
   * NextAuth 4 uses this name for several failures. If `/api/health` is all green, check (1) Google’s query on
   * the callback URL, (2) Vercel logs, (3) Neon pooled `DATABASE_URL` for serverless.
   */
  Callback:
    "If `/api/health` shows databaseConnected and userModelOk, the problem is not “missing table”. Next: (1) In DevTools → Network, open the first request to `/api/auth/callback/google` and read the full URL. If you see `error=access_denied` or any `error=` from Google, fix OAuth consent (test user, app verification) or use another account. (2) Vercel → Logs: search for `[next-auth]` and `OAUTH_CALLBACK_ERROR` / `OAUTH_CALLBACK_HANDLER_ERROR` to see the real message. (3) On Neon, use the *pooled* connection string and add `?pgbouncer=true&connect_timeout=15&connection_limit=1` to `DATABASE_URL` for Vercel (Prisma + serverless). (4) Set Vercel env `NEXTAUTH_DEBUG=1`, redeploy, retry, and read extended logs. Distinct from `OAuthCallback` (token/redirect step).",
  OAuthCallback:
    "The token exchange with Google failed (state/PKCE or redirect). Authorized redirect URI must be exactly {NEXTAUTH_URL}/api/auth/callback/google and match NEXTAUTH_URL (no trailing slash).",
  OAuthCreateAccount:
    "Account could not be created in the database. Check DATABASE_URL and run: npx prisma db push",
  AccessDenied: "You denied access or the account is not allowed.",
  Configuration: "Server configuration error (check NEXTAUTH_SECRET and providers).",
  Verification: "The verification token has expired or is invalid.",
};
