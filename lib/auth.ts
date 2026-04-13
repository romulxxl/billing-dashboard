import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import { db } from "@/lib/db";

// Only register GitHub provider when credentials are configured.
// Without this guard the provider is registered with empty strings and
// throws a cryptic OAuth error when the user clicks "Continue with GitHub".
const githubProvider =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? [GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })]
    : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: githubProvider,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn({ user }) {
      // Only the admin account may sign in via GitHub OAuth.
      // Demo access is handled separately through the demo-login route.
      return user.email === "gravitybest@gmail.com";
    },
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
