import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { cookies } from "next/headers";

// Store the token globally for the callback to access
// This is set during the request and cleared after
let currentIntentToken: string | null = null;

export function getCurrentIntentToken() {
  return currentIntentToken;
}

async function handler(req: Request, context: any) {
  try {
    // Read the instructor intent token from cookies
    const cookieStore = await cookies();
    const intentCookie = cookieStore.get("instructor_intent_token");
    currentIntentToken = intentCookie?.value || null;

    // Call NextAuth handler
    const response = await NextAuth(authOptions)(req, context);

    // Clear the token after processing
    currentIntentToken = null;

    return response;
  } catch (error) {
    currentIntentToken = null;
    throw error;
  }
}

export { handler as GET, handler as POST };
