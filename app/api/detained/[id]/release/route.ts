import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;
    const detainedPersonId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update detained person status
    const detainedPerson = await prisma.detainedPerson.update({
      where: { id: detainedPersonId },
      data: {
        status: "RELEASED",
        releasedAt: new Date(),
        releasedBy: userId,
      },
    });

    return NextResponse.json(
      { message: "Person released", detainedPerson },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error releasing person:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
