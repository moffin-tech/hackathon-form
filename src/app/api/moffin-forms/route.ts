import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { MoffinApiService } from "@/services/moffin-api";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { name, slug, accountType, serviceQueries, organizationId } =
      await request.json();

    if (!name || !slug || !accountType || !organizationId) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Get organization configuration
    const organization = await db.collection("organizations").findOne({
      _id: organizationId,
      createdBy: session.user.id,
      isActive: true,
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organización no encontrada" },
        { status: 404 }
      );
    }

    // Initialize Moffin API service with organization credentials
    const moffinApi = new MoffinApiService({
      baseUrl: organization.moffinBaseUrl,
      clientId: organization.moffinApiKey,
      clientSecret: organization.moffinApiKey, // Assuming same key for both
    });

    // Create form in Moffin
    const moffinForm = await moffinApi.createFormConfig({
      name,
      slug,
      accountType,
      serviceQueries,
    });

    // Save form to our database
    const form = await db.collection("moffinforms").insertOne({
      name,
      slug,
      accountType,
      serviceQueries,
      moffinFormId: moffinForm.id || moffinForm._id,
      organizationId,
      createdBy: session.user.id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdForm = await db.collection("moffinforms").findOne({
      _id: form.insertedId,
    });

    return NextResponse.json(createdForm, { status: 201 });
  } catch (error) {
    console.error("Error creating Moffin form:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

