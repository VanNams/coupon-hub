import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      coupons: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  return NextResponse.json({
    store: {
      name: store.name,
      slug: store.slug,
      description: store.description,
      website: store.website,
    },
    coupons: store.coupons.map((c) => ({
      id: c.id,
      title: c.title,
      code: c.code,
      discount: c.discount,
      condition: c.condition,
      type: c.type,
      endDate: c.endDate,
      usageCount: c.usageCount,
    })),
  });
}
