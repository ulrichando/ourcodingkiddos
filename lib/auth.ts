import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

// Email provider is enabled only if SMTP settings are present
const emailProvider =
  process.env.EMAIL_SERVER && process.env.EMAIL_FROM
    ? EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        maxAge: 24 * 60 * 60, // 24h
      })
    : null;

const providers: NextAuthOptions["providers"] = [
  emailProvider,
  CredentialsProvider({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toLowerCase().trim();
      const password = credentials?.password;
      if (!email || !password) return null;

      // Look up user in DB only (no demo fallbacks)
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user?.hashedPassword) {
          const valid = await bcrypt.compare(password, user.hashedPassword);
          if (!valid) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image ?? undefined,
            role: user.role,
          };
        }
      } catch (e) {
        // Swallow DB errors and reject authentication gracefully
      }

      return null;
    },
  }),
].filter(Boolean) as NextAuthOptions["providers"];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "STUDENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user = {
          ...session.user,
          id: token.id as string,
          role: (token as any).role,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
