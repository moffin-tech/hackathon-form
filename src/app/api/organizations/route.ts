import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import Organization from "@/models/Organization";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const db = await getDatabase();
    const organizations = await db
      .collection("organizations")
      .find({
        createdBy: session.user.id,
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
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

    const { name, slug, moffinApiKey, moffinBaseUrl } = await request.json();

    if (!name || !slug || !moffinApiKey) {
      return NextResponse.json(
        { message: "Nombre, slug y API key son requeridos" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if slug already exists
    const existingOrg = await db.collection("organizations").findOne({ slug });
    if (existingOrg) {
      return NextResponse.json(
        { message: "El slug ya existe" },
        { status: 400 }
      );
    }

    const organization = await db.collection("organizations").insertOne({
      name,
      slug,
      moffinApiKey,
      moffinBaseUrl: moffinBaseUrl || "https://staging.moffin.mx/api/v1",
      isActive: true,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdOrg = await db.collection("organizations").findOne({
      _id: organization.insertedId,
    });

    return NextResponse.json(createdOrg, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

