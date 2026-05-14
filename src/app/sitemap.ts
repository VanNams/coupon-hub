import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    {
      url: "https://couponhub.dev",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...stores.map((store) => ({
      url: `https://couponhub.dev/${store.slug}`,
      lastModified: store.updatedAt,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
  ];
}
