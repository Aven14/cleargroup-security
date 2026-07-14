import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, type, description, location } = body;

    if (!userId || !type || !description) {
      return NextResponse.json(
        { error: "User ID, type, and description are required" },
        { status: 400 }
      );
    }

    // Create new alert
    const alert = await prisma.alert.create({
      data: {
        userId,
        type,
        description,
        location: location || null,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Alert created", alert },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (activeOnly) {
      where.status = "ACTIVE";
    }

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ alerts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
