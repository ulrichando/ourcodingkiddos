import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

const demoEmail = process.env.DEMO_ADMIN_EMAIL ?? "demo@ourcodingkiddos.com";
const demoPassword = process.env.DEMO_ADMIN_PASSWORD ?? "demo1234";
const demoParentEmail = process.env.DEMO_PARENT_EMAIL ?? "demo.parent@ourcodingkiddos.com";
const demoInstructorEmail = process.env.DEMO_INSTRUCTOR_EMAIL ?? "demo.instructor@ourcodingkiddos.com";
const demoUserPassword = process.env.DEMO_USER_PASSWORD ?? "demo1234";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
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

        // Primary: look up user in DB
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
          // Swallow DB errors and allow fallback to demo login
        }

        // Fallback: allow demo admin login (env-configurable, with safe defaults)
        if (email === demoEmail && password === demoPassword) {
          return {
            id: "demo-admin",
            name: "Demo Admin",
            email: demoEmail,
            role: "ADMIN",
          };
        }

        // Demo parent
        if (email === demoParentEmail && password === demoUserPassword) {
          return {
            id: "demo-parent",
            name: "Demo Parent",
            email: demoParentEmail,
            role: "PARENT",
          };
        }

        // Demo instructor
        if (email === demoInstructorEmail && password === demoUserPassword) {
          return {
            id: "demo-instructor",
            name: "Demo Instructor",
            email: demoInstructorEmail,
            role: "INSTRUCTOR",
          };
        }

        return null;
      },
    }),
  ],
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
