import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { cleanEnvVar } from "./env-server";

/** Google OAuth only if both vars are set — avoids empty strings causing OAuthSignin. */
export function getAuthProviders(): NextAuthOptions["providers"] {
  const id = cleanEnvVar(process.env.GOOGLE_CLIENT_ID);
  const secret = cleanEnvVar(process.env.GOOGLE_CLIENT_SECRET);
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
  return Boolean(
    cleanEnvVar(process.env.GOOGLE_CLIENT_ID) && cleanEnvVar(process.env.GOOGLE_CLIENT_SECRET)
  );
}
