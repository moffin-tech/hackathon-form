import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Get the effective user ID (either real user or impersonated user)
    const effectiveUserId = session.user.isImpersonating
      ? session.user.impersonatedUserId
      : session.user.id;

    const db = await getDatabase();
    const forms = await db
      .collection("forms")
      .find({
        createdBy: effectiveUserId,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Get the effective user ID (either real user or impersonated user)
    const effectiveUserId = session.user.isImpersonating
      ? session.user.impersonatedUserId
      : session.user.id;

    const formData = await request.json();

    if (
      !formData.title ||
      !formData.sections ||
      formData.sections.length === 0
    ) {
      return NextResponse.json(
        { message: "Título y al menos una sección son requeridos" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    const form = await db.collection("forms").insertOne({
      ...formData,
      createdBy: effectiveUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdForm = await db.collection("forms").findOne({
      _id: form.insertedId,
    });

    return NextResponse.json(createdForm, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
