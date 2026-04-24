/** NextAuth /api/auth/* error query values (see app/auth/error and AuthErrorBanner). */
export const AUTH_ERROR_HINTS: Record<string, string> = {
  OAuthSignin:
    "Google sign-in could not start. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env, add the redirect URI in Google Cloud Console, and use a valid NEXTAUTH_URL (e.g. http://localhost:3000 with no trailing slash).",
  /** NextAuth 4: generic name for OAuth response handling failure (token exchange, profile, or redirect URI). */
  Callback:
    "The Google OAuth callback failed. In Google Cloud → Credentials, add Authorized redirect URI exactly: your site origin + /api/auth/callback/google. Set Vercel NEXTAUTH_URL to that same origin (no trailing slash). Use the same OAuth client (ID + secret) as in Vercel env.",
  OAuthCallback:
    "The OAuth callback failed. Usually the redirect URI in Google Cloud does not match your app (must be exactly {NEXTAUTH_URL}/api/auth/callback/google).",
  OAuthCreateAccount:
    "Account could not be created in the database. Check DATABASE_URL and run: npx prisma db push",
  AccessDenied: "You denied access or the account is not allowed.",
  Configuration: "Server configuration error (check NEXTAUTH_SECRET and providers).",
  Verification: "The verification token has expired or is invalid.",
};
