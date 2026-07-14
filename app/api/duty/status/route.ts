import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(
      { activeSession },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking duty status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
