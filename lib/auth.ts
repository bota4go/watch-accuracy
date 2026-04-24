import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { getAuthProviders } from "./auth-providers";
import { isAdminEmail } from "./admin";
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
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        if (token.email) session.user.email = token.email as string;
        session.user.isAdmin = isAdminEmail(session.user.email);
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
