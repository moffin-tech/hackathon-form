import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { FormTemplate } from "@/types/auth";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const effectiveUserId = session.user.isImpersonating
      ? session.user.impersonatedUserId
      : session.user.id;

    // Get organization from user info
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(effectiveUserId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get forms by organization
    const forms = await db
      .collection("forms")
      .find({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ forms });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const effectiveUserId = session.user.isImpersonating
      ? session.user.impersonatedUserId
      : session.user.id;

    // Get user and organization info
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(effectiveUserId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData: Omit<FormTemplate, "_id" | "createdAt" | "updatedAt"> =
      await request.json();

    // Generate unique slug
    const baseSlug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await db.collection("forms").findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const form = await db.collection("forms").insertOne({
      ...formData,
      slug,
      organizationId: user.organizationId,
      createdBy: effectiveUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      formId: form.insertedId,
      slug,
    });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
