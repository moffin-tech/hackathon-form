import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { token, userData } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // If userData is not provided, try to extract from token
    let extractedUserData = userData;
    if (!extractedUserData) {
      try {
        // Decode JWT token to extract user data
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const tokenData = JSON.parse(jsonPayload);
        extractedUserData = {
          email: tokenData.user?.email,
          name: tokenData.user?.name,
          lastName: tokenData.user?.lastName,
          role: tokenData.user?.role,
          organizationId: tokenData.organization?.id,
          permissions: tokenData.user?.permissions || [],
        };
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        return NextResponse.json(
          { error: "Invalid token format" },
          { status: 400 }
        );
      }
    }

    if (!extractedUserData?.email) {
      return NextResponse.json(
        { error: "User data could not be extracted from token" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Find or create user in MongoDB
    let user = await db.collection("users").findOne({
      email: extractedUserData.email,
    });

    if (!user) {
      // Create user if doesn't exist
      const newUser = await db.collection("users").insertOne({
        email: extractedUserData.email,
        name: extractedUserData.name,
        lastName: extractedUserData.lastName,
        role: extractedUserData.role,
        organizationId: extractedUserData.organizationId,
        permissions: extractedUserData.permissions,
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

    // At this point, user is guaranteed to be non-null
    const userRecord = user as NonNullable<typeof user>;

    // Create NextAuth session manually
    const sessionData = {
      user: {
        id: userRecord._id.toString(),
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role,
        organizationId: userRecord.organizationId,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    // Store session in MongoDB (NextAuth format)
    await db.collection("sessions").insertOne({
      sessionToken: token,
      userId: userRecord._id,
      expires: sessionData.expires,
      createdAt: new Date(),
      updatedAt: new Date(),
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
