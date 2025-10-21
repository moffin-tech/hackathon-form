import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { token, userData } = await request.json();

    if (!token || !userData) {
      return NextResponse.json(
        { error: "Token and user data required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Find or create user in MongoDB
    let user = await db.collection("users").findOne({
      email: userData.email,
    });

    if (!user) {
      // Create user if doesn't exist
      const newUser = await db.collection("users").insertOne({
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        role: userData.role,
        organizationId: userData.organizationId,
        permissions: userData.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await db.collection("users").findOne({ _id: newUser.insertedId });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create NextAuth session manually
    const sessionData = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    // Store session in MongoDB (NextAuth format)
    await db.collection("sessions").insertOne({
      sessionToken: token,
      userId: user._id,
      expires: sessionData.expires,
    });

    return NextResponse.json({
      success: true,
      sessionToken: token,
      user: sessionData.user,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    return NextResponse.json({
      session,
      user: session.user,
    });
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
