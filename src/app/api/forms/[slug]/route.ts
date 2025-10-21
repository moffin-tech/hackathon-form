import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();

    // Get form by slug (public access)
    const form = await db.collection("forms").findOne({ slug });
    
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Return form without sensitive data
    const { createdBy, organizationId, ...publicForm } = form;
    
    return NextResponse.json({ form: publicForm });
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
