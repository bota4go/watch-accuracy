/** NextAuth /api/auth/* error query values (see app/auth/error and AuthErrorBanner). */
export const AUTH_ERROR_HINTS: Record<string, string> = {
  OAuthSignin:
    "Google sign-in could not start. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env, add the redirect URI in Google Cloud Console, and use a valid NEXTAUTH_URL (e.g. http://localhost:3000 with no trailing slash).",
  /**
   * NextAuth 4 uses this name for several failures. If `/api/health` is all green, check (1) Google’s query on
   * the callback URL, (2) Vercel logs, (3) Neon pooled `DATABASE_URL` for serverless.
   */
  Callback:
    "If Vercel logs show P2022 or `User.uiTheme` does not exist, run `npx prisma db push` against your production `DATABASE_URL` (or `docs/sql/add_user_uiTheme.sql` in Neon). If `/api/health` has `userModelOk: false` after a deploy, same fix. Otherwise: (1) Network: first `/api/auth/callback/google` URL for `error=` from Google. (2) Logs: `[next-auth]` and `OAUTH_CALLBACK_HANDLER_ERROR` for the real message. (3) Neon pooled `DATABASE_URL` for serverless. (4) `NEXTAUTH_DEBUG=1` in Vercel. Distinct from `OAuthCallback` (token/redirect).",
  OAuthCallback:
    "The token exchange with Google failed (state/PKCE or redirect). Authorized redirect URI must be exactly {NEXTAUTH_URL}/api/auth/callback/google and match NEXTAUTH_URL (no trailing slash).",
  OAuthCreateAccount:
    "Account could not be created in the database. Check DATABASE_URL and run: npx prisma db push",
  AccessDenied: "You denied access or the account is not allowed.",
  Configuration: "Server configuration error (check NEXTAUTH_SECRET and providers).",
  Verification: "The verification token has expired or is invalid.",
};
