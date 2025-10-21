import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();
    const effectiveUserId = session.user.isImpersonating
      ? session.user.impersonatedUserId
      : session.user.id;

    // Check if user owns the form
    const form = await db.collection("forms").findOne({
      _id: new ObjectId(id),
      createdBy: effectiveUserId,
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the form
    await db.collection("forms").deleteOne({ _id: new ObjectId(id) });

    // Also delete related submissions
    await db.collection("formSubmissions").deleteMany({ formId: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
