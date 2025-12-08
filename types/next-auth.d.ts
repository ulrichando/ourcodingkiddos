import { DefaultSession, DefaultUser } from "next-auth";

export type UserRole = "ADMIN" | "SUPPORT" | "INSTRUCTOR" | "PARENT" | "STUDENT";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    // Google OAuth tokens for Calendar API
    googleAccessToken?: string;
    googleRefreshToken?: string;
    googleTokenExpires?: number;
  }
}
