"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import type { Session } from "next-auth";
import ActivityTracker from "../ActivityTracker";
import InactivityWarning from "../auth/InactivityWarning";

type Props = { children: ReactNode; session?: Session | null };

export default function AuthProvider({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <ActivityTracker />
      <InactivityWarning />
      {children}
    </SessionProvider>
  );
}
