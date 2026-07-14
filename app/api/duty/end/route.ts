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

    // Find active session
    const activeSession = await prisma.dutySession.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!activeSession) {
      return NextResponse.json(
        { error: "No active duty session found" },
        { status: 400 }
      );
    }

    // End the session
    const updatedSession = await prisma.dutySession.update({
      where: { id: activeSession.id },
      data: {
        endTime: new Date(),
        isActive: false,
      },
    });

    return NextResponse.json(
      { message: "Duty session ended", session: updatedSession },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error ending duty:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
