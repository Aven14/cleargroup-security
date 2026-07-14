import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { userId } = body;
    const { id: alertId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update alert status
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: "IN_PROGRESS",
        respondedBy: userId,
        respondedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Alert responded to", alert },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error responding to alert:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
