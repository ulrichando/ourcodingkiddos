import { NextResponse } from "next/server";
import { markInstructorSignupIntent } from "../../../../lib/auth";
import crypto from "crypto";
import { logger } from "../../../../lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const resumeUrl = body?.resumeUrl?.trim();

    // Generate a random token for this signup attempt
    const token = crypto.randomBytes(32).toString("hex");

    // Mark this token as having instructor signup intent with resume URL
    markInstructorSignupIntent(token, resumeUrl);

    return NextResponse.json(
      { status: "ok", token },
      { status: 200 }
    );
  } catch (e: any) {
    logger.auth.error("Failed to mark instructor intent", e);
    return NextResponse.json(
      { status: "error", message: "Failed to mark intent" },
      { status: 500 }
    );
  }
}
