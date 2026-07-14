import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const agents = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            dutySessions: true,
            patrols: true,
            interventionReports: true,
          },
        },
      },
    });

    // Calculate total duty time for each agent
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const dutySessions = await prisma.dutySession.findMany({
          where: { userId: agent.id },
        });

        const totalDutyTime = dutySessions.reduce((sum, session) => {
          if (session.startTime && session.endTime) {
            return sum + (session.endTime.getTime() - session.startTime.getTime()) / 60000;
          }
          return sum;
        }, 0);

        return {
          ...agent,
          totalDutyTime: Math.round(totalDutyTime),
          patrolCount: agent._count.patrols,
          reportCount: agent._count.interventionReports,
        };
      })
    );

    return NextResponse.json({ agents: agentsWithStats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
