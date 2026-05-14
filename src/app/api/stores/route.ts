import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      name: true,
      logo: true,
      color: true,
      couponCount: true,
    },
    orderBy: { couponCount: "desc" },
  });

  return NextResponse.json(stores);
}
