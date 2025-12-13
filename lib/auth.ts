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
import { logger } from "./logger";

// In-memory store for instructor signup intents (token -> {timestamp, resumeUrl})
// Entries auto-expire after 10 minutes
const instructorSignupIntents = new Map<string, { timestamp: number; resumeUrl?: string }>();
const INTENT_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export function markInstructorSignupIntent(token: string, resumeUrl?: string) {
  instructorSignupIntents.set(token, { timestamp: Date.now(), resumeUrl });
}

function hasInstructorSignupIntent(token: string): boolean {
  const data = instructorSignupIntents.get(token);
  if (!data) return false;

  // Check if expired
  if (Date.now() - data.timestamp > INTENT_EXPIRY_MS) {
    instructorSignupIntents.delete(token);
    return false;
  }

  return true;
}

function getInstructorResumeUrl(token: string): string | undefined {
  const data = instructorSignupIntents.get(token);
  if (!data) return undefined;

  // Check if expired
  if (Date.now() - data.timestamp > INTENT_EXPIRY_MS) {
    instructorSignupIntents.delete(token);
    return undefined;
  }

  return data.resumeUrl;
}

function clearInstructorSignupIntent(token: string) {
  instructorSignupIntents.delete(token);
}

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
        logger.auth.debug('Looking up user', { email });
        const user = await prismaBase.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            accountStatus: true,
            hashedPassword: true,
          }
        });
        logger.auth.debug('User lookup result', { found: !!user, email: user?.email });

        if (user?.hashedPassword) {
          const valid = await bcrypt.compare(password, user.hashedPassword);
          logger.auth.debug('Password validation result', { valid, email });
          if (!valid) {
            logFailedLogin(email, "Invalid password").catch(() => {});
            return null;
          }

          // Check account status
          if (user.accountStatus === "PENDING") {
            logFailedLogin(email, "Account pending approval").catch(() => {});
            throw new Error("Your account is pending approval. An admin will review your application soon.");
          }
          if (user.accountStatus === "REJECTED") {
            logFailedLogin(email, "Account rejected").catch(() => {});
            throw new Error("Your account application was not approved. Please contact support for more information.");
          }
          if (user.accountStatus === "SUSPENDED") {
            logFailedLogin(email, "Account suspended").catch(() => {});
            throw new Error("Your account has been suspended. Please contact support for assistance.");
          }

          // Check maintenance mode - only allow ADMIN and SUPPORT login
          if (user.role !== "ADMIN" && user.role !== "SUPPORT") {
            const maintenance = await isMaintenanceMode();
            if (maintenance) {
              logger.auth.info('Login blocked during maintenance for non-admin', { email });
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
        logger.auth.debug('No hashed password found for user', { email });
        logFailedLogin(email, "No password set for account").catch(() => {});
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        logger.auth.error('Database error during login', e, { email });
        logFailedLogin(email, `Database error: ${errorMessage}`).catch(() => {});
      }

      return null;
    },
  }),
].filter(Boolean) as NextAuthOptions["providers"];

export const authOptions: NextAuthOptions = {
  // Using type assertion because our custom Prisma output path creates type incompatibility
  adapter: PrismaAdapter(prismaBase as any),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours - session expires after this time
    updateAge: 60 * 60, // 1 hour - refresh session if user is active
  },
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
    async signIn({ user, account, profile, credentials }) {
      // For Google OAuth, link to existing account if email matches
      if (account?.provider === "google" && user.email) {
        // IMPORTANT: Restrict instructor Google OAuth to company domain only
        const isCompanyEmail = user.email.endsWith('@ourcodingkiddos.com');

        // Check if user is trying to sign up/login as an instructor
        const existingUser = await prismaBase.user.findUnique({
          where: { email: user.email },
          include: { accounts: { where: { provider: "google" } } },
        });

        // If existing user is an instructor, require company email
        if (existingUser?.role === 'INSTRUCTOR' && !isCompanyEmail) {
          throw new Error("Instructors must use a company email address (@ourcodingkiddos.com) to sign in. Please contact your administrator.");
        }

        // For new signups via instructor intent, allow personal emails for applications
        // They will be assigned company emails after approval
        let intentToken: string | null = null;
        try {
          const { getCurrentIntentToken } = await import("../app/api/auth/[...nextauth]/route");
          intentToken = getCurrentIntentToken();
        } catch (e) {
          // If import fails, continue without token
        }

        const hasInstructorIntent = intentToken ? hasInstructorSignupIntent(intentToken) : false;
        // Note: We allow personal emails for instructor applications (PENDING status)
        // Once approved, admin will assign them a company email

        // Check account status for existing users (but not for brand new signups)
        // If the user exists AND has a Google account linked, they're trying to log in (not sign up)
        if (existingUser && existingUser.accounts.length > 0) {
          if (existingUser.accountStatus === "PENDING") {
            throw new Error("Your instructor application is pending approval. An admin will review your application soon. You'll receive an email once your account is approved.");
          }
          if (existingUser.accountStatus === "REJECTED") {
            throw new Error("Your account application was not approved. Please contact support for more information.");
          }
          if (existingUser.accountStatus === "SUSPENDED") {
            throw new Error("Your account has been suspended. Please contact support for assistance.");
          }
        }

        // Check maintenance mode for non-admin/support OAuth users
        if (!existingUser || (existingUser.role !== "ADMIN" && existingUser.role !== "SUPPORT")) {
          const maintenance = await isMaintenanceMode();
          if (maintenance) {
            logger.auth.info('OAuth login blocked during maintenance', { email: user.email });
            throw new Error("Site is under maintenance. Please try again later.");
          }
        }

        if (existingUser) {
          // User exists - check if Google account is already linked
          if (existingUser.accounts.length === 0) {
            // Link Google account to existing user
            logger.auth.info('Linking Google account to existing user', { email: user.email });
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
            logger.auth.debug('Updating Google tokens', { email: user.email });
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
          // New Google user - determine role from signup intent or email patterns
          // Try to import the token getter function
          let intentToken: string | null = null;
          try {
            const { getCurrentIntentToken } = await import("../app/api/auth/[...nextauth]/route");
            intentToken = getCurrentIntentToken();
          } catch (e) {
            // If import fails, continue without token
          }

          const hasIntent = intentToken ? hasInstructorSignupIntent(intentToken) : false;
          const resumeUrl = intentToken ? getInstructorResumeUrl(intentToken) : undefined;

          // IMPORTANT: Only allow company emails to be instructors
          // Personal emails detected as "instructor-like" will be rejected
          const isLikelyInstructor =
            user.email?.includes('teacher') ||
            user.email?.includes('instructor') ||
            user.email?.includes('edu');

          // Allow instructor applications with personal emails
          // They will be PENDING and admin will assign company email after approval
          let role: "PARENT" | "INSTRUCTOR" = "PARENT";
          if (hasIntent || isLikelyInstructor) {
            role = "INSTRUCTOR";
            // Personal email instructors get PENDING status
            // Company email instructors also get PENDING status (admin approval required)
          }

          const accountStatus = role === "INSTRUCTOR" ? "PENDING" : "APPROVED";

          logger.auth.info('Creating new Google OAuth user', {
            email: user.email,
            role,
            accountStatus,
            hasIntent,
            isLikelyInstructor,
            hasResumeUrl: !!resumeUrl
          });

          // Clear the intent after using it
          if (intentToken && hasIntent) {
            clearInstructorSignupIntent(intentToken);
          }

          const newUser = await prismaBase.user.create({
            data: {
              email: user.email,
              name: user.name || profile?.name || "Google User",
              image: user.image || (profile as any)?.picture,
              role,
              accountStatus,
              ...(resumeUrl && role === "INSTRUCTOR" ? { resumeUrl, resumeUploadedAt: new Date() } : {}),
              ...(role === "PARENT"
                ? {
                    parentProfile: {
                      create: {
                        phone: null,
                      },
                    },
                  }
                : {}),
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

          // If instructor with PENDING status, block signin immediately
          if (accountStatus === "PENDING") {
            throw new Error("Your instructor application is pending approval. An admin will review your application soon. You'll receive an email once your account is approved.");
          }

          user.id = newUser.id;
          user.role = role as UserRole;
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
