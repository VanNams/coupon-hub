import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const store = searchParams.get("store");
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const where: Record<string, unknown> = {
    ...(store ? { store: { slug: store } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { code: { contains: q } },
            { discount: { contains: q } },
          ],
        }
      : {}),
  };

  const coupons = await prisma.coupon.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
    include: { store: true },
  });

  return NextResponse.json(
    coupons.map((c) => ({
      id: c.id,
      title: c.title,
      code: c.code,
      discount: c.discount,
      condition: c.condition,
      type: c.type,
      endDate: c.endDate,
      usageCount: c.usageCount,
      storeName: c.store.name,
      storeSlug: c.store.slug,
    }))
  );
}
