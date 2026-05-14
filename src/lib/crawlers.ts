import prisma from "@/lib/prisma";

interface CrawlerCoupon {
  title: string;
  code: string | null;
  discount: string;
  condition: string | null;
  type: "code" | "deal";
  url: string | null;
  endDate: Date | null;
}

interface CrawlerResult {
  source: string;
  added: number;
  errors: string[];
}

// --- Mỗi crawler là 1 hàm fetchCoupons, trả về mảng CrawlerCoupon ---

async function fetchFromAccesstrade(): Promise<CrawlerCoupon[]> {
  // Accesstrade là mạng affiliate phổ biến ở VN
  // Cần API key từ https://accesstrade.vn
  return [];
}

async function fetchFromMasoffer(): Promise<CrawlerCoupon[]> {
  // Masoffer - mạng affiliate khác
  return [];
}

async function fetchFromShopeeAffiliate(): Promise<CrawlerCoupon[]> {
  // Shopee Affiliate Program
  return [];
}

// --- Crawler engine ---

const crawlers: {
  name: string;
  fetch: () => Promise<CrawlerCoupon[]>;
}[] = [
  { name: "accesstrade", fetch: fetchFromAccesstrade },
  { name: "masoffer", fetch: fetchFromMasoffer },
  { name: "shopee_affiliate", fetch: fetchFromShopeeAffiliate },
];

async function saveCoupons(
  storeSlug: string,
  coupons: CrawlerCoupon[]
): Promise<number> {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) return 0;

  let added = 0;
  for (const c of coupons) {
    const exists = await prisma.coupon.findFirst({
      where: { storeId: store.id, title: c.title },
    });
    if (exists) continue;

    await prisma.coupon.create({
      data: {
        storeId: store.id,
        title: c.title,
        code: c.code,
        discount: c.discount,
        condition: c.condition,
        type: c.type,
        url: c.url,
        endDate: c.endDate,
        isVerified: false,
        source: "crawl",
      },
    });
    added++;
  }

  if (added > 0) {
    await prisma.store.update({
      where: { id: store.id },
      data: { couponCount: { increment: added } },
    });
  }

  return added;
}

export async function deleteOldCoupons(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 10);

  const deleted = await prisma.coupon.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  for (const store of await prisma.store.findMany()) {
    const count = await prisma.coupon.count({ where: { storeId: store.id } });
    await prisma.store.update({ where: { id: store.id }, data: { couponCount: count } });
  }

  return deleted.count;
}

export async function runAllCrawlers(): Promise<CrawlerResult[]> {
  const results: CrawlerResult[] = [];

  for (const crawler of crawlers) {
    const result: CrawlerResult = { source: crawler.name, added: 0, errors: [] };
    try {
      const coupons = await crawler.fetch();
      result.added = coupons.length;
    } catch (err) {
      result.errors.push(String(err));
    }
    results.push(result);
  }

  return results;
}
