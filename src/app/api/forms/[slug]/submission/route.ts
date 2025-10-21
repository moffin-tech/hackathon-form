import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();

    // Get form to validate it exists
    const form = await db.collection("forms").findOne({ slug });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const submissionData = await request.json();

    // Generate session ID for multi-session support
    const sessionId =
      submissionData.sessionId ||
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save or update submission
    const submission = await db.collection("formSubmissions").findOneAndUpdate(
      {
        formId: new ObjectId(form._id),
        sessionId: sessionId,
      },
      {
        $set: {
          formId: new ObjectId(form._id),
          sessionId: sessionId,
          data: submissionData.data,
          status: submissionData.status || "draft",
          updatedAt: new Date(),
          ...(submissionData.status === "submitted" && {
            submittedAt: new Date(),
          }),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return NextResponse.json({
      success: true,
      submissionId: submission._id,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Error saving form submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Get form
    const form = await db.collection("forms").findOne({ slug });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get submission
    const submission = await db.collection("formSubmissions").findOne({
      formId: new ObjectId(form._id),
      sessionId: sessionId,
    });

    return NextResponse.json({
      submission: submission || null,
      form: form,
    });
  } catch (error) {
    console.error("Error fetching form submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
