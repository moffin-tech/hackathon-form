import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();

    // Try to find public form first
    let form = await db.collection("forms").findOne({
      _id: new ObjectId(params.id),
      isPublic: true,
    });

    // If not public, check if user owns it
    if (!form) {
      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
      }

      form = await db.collection("forms").findOne({
        _id: new ObjectId(params.id),
        createdBy: session.user.id,
      });
    }

    if (!form) {
      return NextResponse.json(
        { message: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const formData = await request.json();
    const db = await getDatabase();

    // Check if user owns the form
    const existingForm = await db.collection("forms").findOne({
      _id: new ObjectId(params.id),
      createdBy: session.user.id,
    });

    if (!existingForm) {
      return NextResponse.json(
        { message: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    const updatedForm = await db.collection("forms").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...formData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const db = await getDatabase();

    // Check if user owns the form
    const existingForm = await db.collection("forms").findOne({
      _id: new ObjectId(params.id),
      createdBy: session.user.id,
    });

    if (!existingForm) {
      return NextResponse.json(
        { message: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    await db.collection("forms").deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({ message: "Formulario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

