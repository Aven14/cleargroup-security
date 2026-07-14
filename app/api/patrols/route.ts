import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, sector, vehicle, partnerId, type, observations } = body;

    if (!userId || !sector) {
      return NextResponse.json(
        { error: "User ID and sector are required" },
        { status: 400 }
      );
    }

    // Create new patrol
    const patrol = await prisma.patrol.create({
      data: {
        userId,
        sector,
        vehicle: vehicle || null,
        partnerId: partnerId || null,
        type: type || "MOBILE",
        observations: observations || null,
        startTime: new Date(),
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
      { message: "Patrol created", patrol },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating patrol:", error);
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
      where.endTime = null;
    }

    const patrols = await prisma.patrol.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        partner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json({ patrols }, { status: 200 });
  } catch (error) {
    console.error("Error fetching patrols:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
