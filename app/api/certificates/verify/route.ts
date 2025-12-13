import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Find the certificate by verification code
    const certificate = await prisma.certificate.findFirst({
      where: {
        verificationCode: code.toUpperCase(),
      },
      include: {
        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                language: true,
                level: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { valid: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.id,
        studentName: certificate.studentName,
        courseTitle: certificate.courseTitle || certificate.enrollment?.course?.title,
        achievementType: certificate.achievementType,
        issuedAt: certificate.issuedAt,
        verificationCode: certificate.verificationCode,
        course: certificate.enrollment?.course
          ? {
              language: certificate.enrollment.course.language,
              level: certificate.enrollment.course.level,
            }
          : null,
      },
    });
  } catch (error) {
    logger.db.error("GET /api/certificates/verify error", error);
    return NextResponse.json(
      { error: "Failed to verify certificate" },
      { status: 500 }
    );
  }
}
