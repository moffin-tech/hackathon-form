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
    console.log("DELETE /api/forms/delete - Session:", session);
    
    let effectiveUserId: string | undefined;
    const db = await getDatabase();
    
    if (session?.user) {
      effectiveUserId = session.user.isImpersonating
        ? session.user.impersonatedUserId
        : session.user.id;
    } else {
      // Try to get token from Authorization header
      const authHeader = request.headers.get("authorization");
      console.log("DELETE /api/forms/delete - Auth header:", authHeader);
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const token = authHeader.substring(7);
      const sessionRecord = await db.collection("sessions").findOne({
        sessionToken: token
      });
      
      if (!sessionRecord) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const user = await db.collection("users").findOne({
        _id: sessionRecord.userId
      });
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      effectiveUserId = user._id.toString();
    }

    if (!effectiveUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

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
    await db
      .collection("formSubmissions")
      .deleteMany({ formId: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
