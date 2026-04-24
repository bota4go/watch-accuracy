import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const id = process.env.GOOGLE_CLIENT_ID?.trim();
const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();

/** Google OAuth only if both vars are set — avoids empty strings causing OAuthSignin. */
export function getAuthProviders(): NextAuthOptions["providers"] {
  if (id && secret) {
    return [
      GoogleProvider({
        clientId: id,
        clientSecret: secret,
        authorization: { params: { prompt: "select_account" } },
      }),
    ];
  }
  // Dev / misconfigured: no provider — health UI explains missing .env
  return [];
}

export function isGoogleOAuthConfigured() {
  return Boolean(id && secret);
}
