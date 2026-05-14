import { schedule, validate, type ScheduledTask } from "node-cron";
import prisma from "./prisma";
import { runAllCrawlers, deleteOldCoupons } from "./crawlers";

let task: ScheduledTask | null = null;

async function run() {
  console.log("[Scheduler] Running scheduled job...");
  try {
    const [crawlerResults, deletedCount] = await Promise.all([
      runAllCrawlers(),
      deleteOldCoupons(),
    ]);
    console.log(`[Scheduler] Done. Deleted ${deletedCount} old coupons.`, crawlerResults);
  } catch (err) {
    console.error("[Scheduler] Error:", err);
  }
}

export async function startScheduler() {
  if (task) {
    task.stop();
    task = null;
  }

  try {
    let config = await prisma.cronConfig.findUnique({ where: { id: "default" } });
    if (!config) {
      config = await prisma.cronConfig.create({
        data: { id: "default", schedule: "0 0 * * *", isActive: true },
      });
    }
    if (!config.isActive) {
      console.log("[Scheduler] Disabled");
      return;
    }

    if (!validate(config.schedule)) {
      console.error(`[Scheduler] Invalid schedule: ${config.schedule}`);
      return;
    }

    task = schedule(config.schedule, run);
    console.log(`[Scheduler] Started (${config.schedule})`);
  } catch (err) {
    console.error("[Scheduler] Init error:", err);
  }
}

export async function getSchedulerStatus() {
  return { running: task !== null };
}
