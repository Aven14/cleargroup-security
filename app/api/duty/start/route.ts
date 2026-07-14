import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user already has an active session
    const activeSession = await prisma.dutySession.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (activeSession) {
      return NextResponse.json(
        { error: "User already has an active duty session" },
        { status: 400 }
      );
    }

    // Create new duty session
    const dutySession = await prisma.dutySession.create({
      data: {
        userId,
        startTime: new Date(),
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Duty session started", session: dutySession },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error starting duty:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
