import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startScheduler, getSchedulerStatus } from "@/lib/scheduler";

const DEFAULT_SCHEDULE = "0 0 * * *";

export async function GET() {
  try {
    let config = await prisma.cronConfig.findUnique({ where: { id: "default" } });
    if (!config) {
      config = await prisma.cronConfig.create({
        data: { id: "default", schedule: DEFAULT_SCHEDULE, isActive: true },
      });
    }
    const status = await getSchedulerStatus();
    return NextResponse.json({ ...config, ...status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { schedule, isActive } = body;

    await prisma.cronConfig.upsert({
      where: { id: "default" },
      update: {
        ...(schedule !== undefined && { schedule }),
        ...(isActive !== undefined && { isActive }),
      },
      create: { id: "default", schedule: schedule ?? DEFAULT_SCHEDULE, isActive: isActive ?? true },
    });

    await startScheduler();

    const config = await prisma.cronConfig.findUnique({ where: { id: "default" } });
    const status = await getSchedulerStatus();
    return NextResponse.json({ ...config, ...status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
