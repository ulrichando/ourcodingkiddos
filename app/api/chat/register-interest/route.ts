import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { emails } from "@/lib/emails";

export const dynamic = "force-dynamic";

// POST - Save parent interest from chatbot
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      parentName,
      parentEmail: submittedEmail,
      phone,
      childName,
      childAge,
      interests, // what they want to learn
      notes, // any additional notes
    } = body;

    // Use session email if authenticated, otherwise use submitted email
    const parentEmail = session?.user?.email || submittedEmail;

    if (!parentEmail || !childName) {
      return NextResponse.json(
        { error: "Parent email and child name are required" },
        { status: 400 }
      );
    }

    // Check if this parent-child combination already exists
    const existingInterest = await prisma.freeTrialBooking.findFirst({
      where: {
        parentEmail,
        childName,
      },
    });

    if (existingInterest) {
      // Update the existing record with new info
      await prisma.freeTrialBooking.update({
        where: { id: existingInterest.id },
        data: {
          parentName: parentName || existingInterest.parentName,
          phone: phone || existingInterest.phone,
          childAge: childAge || existingInterest.childAge,
          conversionNotes: notes
            ? `${existingInterest.conversionNotes || ""}\n---\nUpdated interest (${new Date().toISOString()}):\n${notes}\nInterests: ${interests || "Not specified"}`
            : existingInterest.conversionNotes,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Interest updated",
        isUpdate: true,
      });
    }

    // Determine age group based on child age
    let ageGroup: "AGES_7_10" | "AGES_11_14" | "AGES_15_18" | undefined;
    if (childAge) {
      if (childAge >= 7 && childAge <= 10) ageGroup = "AGES_7_10";
      else if (childAge >= 11 && childAge <= 14) ageGroup = "AGES_11_14";
      else if (childAge >= 15 && childAge <= 18) ageGroup = "AGES_15_18";
    }

    // Create new interest record
    const newInterest = await prisma.freeTrialBooking.create({
      data: {
        parentEmail,
        parentName: parentName || session?.user?.name || undefined,
        childName,
        childAge: childAge || undefined,
        ageGroup,
        phone: phone || undefined,
        status: "PENDING",
        conversionNotes: `Source: Chat Widget\nInterests: ${interests || "Not specified"}\n${notes ? `Notes: ${notes}` : ""}`,
      },
    });

    // Send notification email to admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Registration Interest!</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 16px 0; color: #1e293b;">Parent Information</h3>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Name: <strong style="color: #1e293b;">${parentName || "Not provided"}</strong></p>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Email: <strong style="color: #1e293b;">${parentEmail}</strong></p>
                ${phone ? `<p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Phone: <strong style="color: #1e293b;">${phone}</strong></p>` : ""}

                <h3 style="margin: 16px 0 16px 0; color: #1e293b;">Child Information</h3>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Child's Name: <strong style="color: #1e293b;">${childName}</strong></p>
                ${childAge ? `<p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Age: <strong style="color: #1e293b;">${childAge} years old</strong></p>` : ""}
                ${interests ? `<p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Interests: <strong style="color: #1e293b;">${interests}</strong></p>` : ""}
                ${notes ? `<p style="margin: 0; color: #64748b; font-size: 14px;">Notes: <strong style="color: #1e293b;">${notes}</strong></p>` : ""}
              </div>
              <div style="text-align: center;">
                <a href="https://ourcodingkiddos.com/dashboard/admin/free-trials"
                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  View in Dashboard
                </a>
              </div>
              <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
                This interest was submitted via the website chat widget.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: emails.support,
      subject: `New Registration Interest: ${childName} (Age ${childAge || "?"})`,
      html: adminEmailHtml,
      text: `New registration interest from ${parentName || parentEmail}:\n\nChild: ${childName}\nAge: ${childAge || "Not specified"}\nEmail: ${parentEmail}\nPhone: ${phone || "Not provided"}\nInterests: ${interests || "Not specified"}\nNotes: ${notes || "None"}\n\nView in dashboard: https://ourcodingkiddos.com/dashboard/admin/free-trials`,
    });

    // Send confirmation email to parent
    const parentEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Thanks for Your Interest!</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6;">
                Hi ${parentName || "there"},
              </p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Thank you for expressing interest in Our Coding Kiddos for <strong>${childName}</strong>! We're excited to help your child start their coding journey.
              </p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Our team will reach out to you shortly to discuss available programs and schedule a free trial class.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ourcodingkiddos.com/programs"
                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Explore Our Programs
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                Questions? Reply to this email or chat with us on our website!
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: parentEmail,
      subject: `Thanks for Your Interest - Our Coding Kiddos`,
      html: parentEmailHtml,
      text: `Hi ${parentName || "there"},\n\nThank you for expressing interest in Our Coding Kiddos for ${childName}! We're excited to help your child start their coding journey.\n\nOur team will reach out to you shortly to discuss available programs and schedule a free trial class.\n\nExplore our programs: https://ourcodingkiddos.com/programs\n\nQuestions? Reply to this email or chat with us on our website!`,
    });

    return NextResponse.json({
      success: true,
      message: "Interest saved successfully",
      id: newInterest.id,
    });
  } catch (error) {
    console.error("Error saving registration interest:", error);
    return NextResponse.json(
      { error: "Failed to save interest" },
      { status: 500 }
    );
  }
}
