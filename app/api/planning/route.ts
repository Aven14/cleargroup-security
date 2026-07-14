import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      title, 
      date, 
      startTime, 
      endTime, 
      location, 
      assignedUnit, 
      description 
    } = body;

    if (!userId || !title || !date || !startTime || !endTime || !location || !assignedUnit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new planning event
    const event = await prisma.planningEvent.create({
      data: {
        userId,
        title,
        date: new Date(date),
        startTime,
        endTime,
        location,
        assignedUnit,
        description,
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
      { message: "Event created", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating planning event:", error);
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
    const fromDate = searchParams.get("fromDate");

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (fromDate) {
      where.date = {
        gte: new Date(fromDate),
      };
    }

    const events = await prisma.planningEvent.findMany({
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
        date: "asc",
      },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching planning events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
