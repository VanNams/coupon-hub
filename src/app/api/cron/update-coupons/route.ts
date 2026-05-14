import { NextRequest, NextResponse } from "next/server";
import { runAllCrawlers, deleteOldCoupons } from "@/lib/crawlers";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [results, deletedCount] = await Promise.all([
    runAllCrawlers(),
    deleteOldCoupons(),
  ]);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
    deletedOldCoupons: deletedCount,
  });
}
