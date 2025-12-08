import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prismaBase } from "./prisma";
import type { UserRole } from "../types/next-auth";
import { checkLoginRateLimit, resetLoginRateLimit } from "./upstash-rate-limit";
import { logLogin, logFailedLogin } from "./audit";

// Check if site is in maintenance mode
async function isMaintenanceMode(): Promise<boolean> {
  try {
    const settings = await prismaBase.platformSettings.findUnique({
      where: { id: "default" },
      select: { maintenanceMode: true },
    });
    return settings?.maintenanceMode ?? false;
  } catch {
    return false;
  }
}

// Email provider is enabled only if SMTP settings are present
const emailProvider =
  process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM
    ? EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT) || 465,
          auth: {
            user: process.env.EMAIL_SERVER_USER || "resend",
            pass: process.env.EMAIL_SERVER_PASSWORD || "",
          },
        },
        from: process.env.EMAIL_FROM,
        maxAge: 24 * 60 * 60, // 24h
      })
    : null;

// Google OAuth provider for instructors (with Calendar API access for Google Meet)
const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "openid email profile https://www.googleapis.com/auth/calendar",
          },
        },
      })
    : null;

const providers: NextAuthOptions["providers"] = [
  emailProvider,
  googleProvider,
  CredentialsProvider({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toLowerCase().trim();
      const password = credentials?.password;
      if (!email || !password) {
        logFailedLogin(email || "unknown", "Missing credentials").catch(() => {});
        return null;
      }

      // Rate limiting: prevent brute force attacks (using Upstash Redis)
      const rateLimitResult = await checkLoginRateLimit(email);
      if (!rateLimitResult.success) {
        logFailedLogin(email, "Rate limit exceeded").catch(() => {});
        throw new Error("Too many login attempts. Please try again later.");
      }

      // Look up user in DB only (no demo fallbacks)
      // Using prismaBase (without Accelerate extension) for auth
      try {
        console.log('[Auth] Looking up user:', email);
        const user = await prismaBase.user.findUnique({ where: { email } });
        console.log('[Auth] User found:', !!user, user?.email);

        if (user?.hashedPassword) {
          const valid = await bcrypt.compare(password, user.hashedPassword);
          console.log('[Auth] Password valid:', valid);
          if (!valid) {
            logFailedLogin(email, "Invalid password").catch(() => {});
            return null;
          }

          // Check maintenance mode - only allow ADMIN and SUPPORT login
          if (user.role !== "ADMIN" && user.role !== "SUPPORT") {
            const maintenance = await isMaintenanceMode();
            if (maintenance) {
              console.log('[Auth] Login blocked during maintenance for non-admin:', email);
              logFailedLogin(email, "Login blocked during maintenance mode").catch(() => {});
              throw new Error("Site is under maintenance. Please try again later.");
            }
          }

          // Reset rate limit on successful login
          resetLoginRateLimit(email).catch(() => {});

          // Log successful login
          logLogin(email, user.id).catch(() => {});

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image ?? undefined,
            role: user.role as UserRole,
          };
        }
        console.log('[Auth] No hashed password found for user');
        logFailedLogin(email, "No password set for account").catch(() => {});
      } catch (e: any) {
        console.error('[Auth] Database error:', e.message);
        logFailedLogin(email, `Database error: ${e.message}`).catch(() => {});
      }

      return null;
    },
  }),
].filter(Boolean) as NextAuthOptions["providers"];

export const authOptions: NextAuthOptions = {
  // Using type assertion because our custom Prisma output path creates type incompatibility
  adapter: PrismaAdapter(prismaBase as any),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // Store Google account info for Calendar API access
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
        token.googleTokenExpires = account.expires_at;
      }
      // Fetch role from DB if not set (for OAuth users)
      if (!token.role && token.email) {
        const dbUser = await prismaBase.user.findUnique({
          where: { email: token.email },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role as UserRole;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For Google OAuth, link to existing account if email matches
      if (account?.provider === "google" && user.email) {
        const existingUser = await prismaBase.user.findUnique({
          where: { email: user.email },
          include: { accounts: { where: { provider: "google" } } },
        });

        // Check maintenance mode for non-admin/support OAuth users
        if (!existingUser || (existingUser.role !== "ADMIN" && existingUser.role !== "SUPPORT")) {
          const maintenance = await isMaintenanceMode();
          if (maintenance) {
            console.log('[Auth] OAuth login blocked during maintenance for:', user.email);
            throw new Error("Site is under maintenance. Please try again later.");
          }
        }

        if (existingUser) {
          // User exists - check if Google account is already linked
          if (existingUser.accounts.length === 0) {
            // Link Google account to existing user
            console.log('[Auth] Linking Google account to existing user:', user.email);
            await prismaBase.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          } else {
            // Update existing Google account tokens
            console.log('[Auth] Updating Google tokens for:', user.email);
            await prismaBase.account.update({
              where: { id: existingUser.accounts[0].id },
              data: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              },
            });
          }
          // Use existing user ID for the session
          user.id = existingUser.id;
          user.role = existingUser.role as UserRole;
        } else {
          // New Google user - create as PARENT with parent profile
          console.log('[Auth] Creating new Google OAuth user as PARENT:', user.email);
          const newUser = await prismaBase.user.create({
            data: {
              email: user.email,
              name: user.name || profile?.name || "Google User",
              image: user.image || (profile as any)?.picture,
              role: "PARENT",
              parentProfile: {
                create: {
                  phone: null,
                },
              },
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              },
            },
          });
          user.id = newUser.id;
          user.role = "PARENT" as UserRole;
          // Prevent the adapter from creating a duplicate user
          return true;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
