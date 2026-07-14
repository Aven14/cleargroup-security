import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, firstName, lastName, reason, location, notes } = body;

    if (!userId || !firstName || !lastName || !reason || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new detained person record
    const detainedPerson = await prisma.detainedPerson.create({
      data: {
        userId,
        firstName,
        lastName,
        reason,
        location,
        notes,
        status: "IN_CUSTODY",
        detainedAt: new Date(),
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
      { message: "Detained person recorded", detainedPerson },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating detained person:", error);
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
    const search = searchParams.get("search");

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (activeOnly) {
      where.status = "IN_CUSTODY";
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { reason: { contains: search, mode: "insensitive" } },
      ];
    }

    const detainedPersons = await prisma.detainedPerson.findMany({
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
        detainedAt: "desc",
      },
    });

    return NextResponse.json({ detainedPersons }, { status: 200 });
  } catch (error) {
    console.error("Error fetching detained persons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
