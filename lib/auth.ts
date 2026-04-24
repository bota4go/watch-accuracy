import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { getAuthProviders } from "./auth-providers";
import { getUserSessionFlagsFromDatabase } from "./admin-db";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: getAuthProviders(),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email ?? token.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        let email: string | null = null;
        let isAdmin = false;
        try {
          const flags = await getUserSessionFlagsFromDatabase(token.sub);
          email = flags.email;
          isAdmin = flags.isAdmin;
        } catch {
          if (token.email) email = token.email as string;
        }
        if (email) {
          session.user.email = email;
        } else if (token.email) {
          session.user.email = token.email as string;
        }
        session.user.isAdmin = isAdmin;
      } else if (session.user) {
        session.user.isAdmin = false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  /** App Router: default /api/auth/error often 404s; use a real page instead. */
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
};
