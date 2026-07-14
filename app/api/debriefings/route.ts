import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      title, 
      date, 
      location, 
      agentsPresent, 
      interventionType, 
      summary, 
      progression, 
      result, 
      observations 
    } = body;

    if (!userId || !title || !location || !summary || !progression || !result) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new intervention report
    const report = await prisma.interventionReport.create({
      data: {
        userId,
        title,
        date: new Date(date),
        location,
        agentsPresent,
        interventionType,
        summary,
        progression,
        result,
        observations,
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
      { message: "Report created", report },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating debriefing:", error);
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
    const search = searchParams.get("search");

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const reports = await prisma.interventionReport.findMany({
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
        date: "desc",
      },
    });

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error("Error fetching debriefings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
