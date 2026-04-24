/** NextAuth /api/auth/* error query values (see app/auth/error and AuthErrorBanner). */
export const AUTH_ERROR_HINTS: Record<string, string> = {
  OAuthSignin:
    "Google sign-in could not start. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env, add the redirect URI in Google Cloud Console, and use a valid NEXTAUTH_URL (e.g. http://localhost:3000 with no trailing slash).",
  /**
   * NextAuth 4: if you see this (not `OAuthCallback`), Google already returned — failure is usually **after** the token
   * step: Prisma creating/linking the user, or the JWT step. Check Vercel **Runtime logs** for `OAUTH_CALLBACK_HANDLER_ERROR`.
   * Open `/api/health`: `databaseConnected` and `userModelOk` must be true. From your machine: `npx prisma db push` with production `DATABASE_URL`.
   */
  Callback:
    "This error usually means Google succeeded but saving the sign-in in Postgres failed, or a server callback threw. Check Vercel **Logs** (search for OAUTH_CALLBACK_HANDLER_ERROR). In `/api/health` ensure databaseConnected and userModelOk are true. Apply schema to your Neon DB: `DATABASE_URL=… npx prisma db push`. (If you instead saw `OAuthCallback`, the redirect URI / token step failed — Google Cloud must list …/api/auth/callback/google.)",
  OAuthCallback:
    "The token exchange with Google failed (state/PKCE or redirect). Authorized redirect URI must be exactly {NEXTAUTH_URL}/api/auth/callback/google and match NEXTAUTH_URL (no trailing slash).",
  OAuthCreateAccount:
    "Account could not be created in the database. Check DATABASE_URL and run: npx prisma db push",
  AccessDenied: "You denied access or the account is not allowed.",
  Configuration: "Server configuration error (check NEXTAUTH_SECRET and providers).",
  Verification: "The verification token has expired or is invalid.",
};
