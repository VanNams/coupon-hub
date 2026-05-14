import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const stores = [
  {
    name: "Shopee",
    slug: "shopee",
    description: "Sàn thương mại điện tử hàng đầu Việt Nam",
    color: "#ee4d2d",
    website: "https://shopee.vn",
    coupons: [
      { title: "Mã giảm giá Shopee 50K toàn sàn", code: "SHOPEE50K", discount: "50K", condition: "Đơn từ 200K", type: "code" },
      { title: "Mã freeship Shopee toàn quốc", code: "FREESHIP", discount: "Miễn phí vận chuyển", condition: "Đơn từ 50K", type: "code" },
      { title: "Giảm 30K cho đơn từ 150K", code: "SHOP30", discount: "30K", condition: "Đơn từ 150K", type: "code" },
      { title: "Flash Sale đồng giá 1K", code: null, discount: "Từ 1.000đ", type: "deal" },
    ],
  },
  {
    name: "Lazada",
    slug: "lazada",
    description: "Sàn thương mại điện tử hàng đầu Đông Nam Á",
    color: "#0f1460",
    website: "https://lazada.vn",
    coupons: [
      { title: "Mã giảm giá Lazada 100K", code: "LAZ100K", discount: "100K", condition: "Đơn từ 500K", type: "code" },
      { title: "Freeship Max Lazada", code: "FREESHIPMAX", discount: "Miễn phí vận chuyển", condition: "Đơn từ 49K", type: "code" },
      { title: "Giảm 50K cho đơn từ 299K", code: "LAZ50", discount: "50K", condition: "Đơn từ 299K", type: "code" },
    ],
  },
  {
    name: "Tiki",
    slug: "tiki",
    description: "Sàn thương mại điện tử Việt Nam",
    color: "#1a91ff",
    website: "https://tiki.vn",
    coupons: [
      { title: "Mã giảm giá Tiki 20%", code: "TIKI20", discount: "20%", condition: "Tối đa 50K, đơn từ 0đ", type: "code" },
      { title: "Freeship Tiki", code: "FREESHIP", discount: "Miễn phí vận chuyển", condition: "Đơn từ 149K", type: "code" },
    ],
  },
  {
    name: "GrabFood",
    slug: "grabfood",
    description: "Giao đồ ăn nhanh",
    color: "#00b14f",
    website: "https://grabfood.vn",
    coupons: [
      { title: "Giảm 50% đơn từ 50K", code: "GFOOD50", discount: "50%", condition: "Tối đa 30K", type: "code" },
      { title: "Miễn phí giao hàng", code: "GFFREE", discount: "Free ship", type: "code" },
    ],
  },
  {
    name: "Highlands Coffee",
    slug: "highlands",
    description: "Chuỗi cà phê Việt Nam",
    color: "#c8102e",
    website: "https://highlandscoffee.com.vn",
    coupons: [
      { title: "Mua 1 tặng 1", code: "HL1T1", discount: "Mua 1 tặng 1", type: "code" },
      { title: "Giảm 40K hóa đơn từ 169K", code: "HL40K", discount: "40K", condition: "Hóa đơn từ 169K", type: "code" },
    ],
  },
  {
    name: "Booking.com",
    slug: "booking-com",
    description: "Đặt phòng khách sạn trực tuyến",
    color: "#003580",
    website: "https://booking.com",
    coupons: [
      { title: "Giảm 15% đặt phòng khách sạn", code: "BOOK15", discount: "15%", type: "code" },
    ],
  },
  {
    name: "CGV",
    slug: "cgv",
    description: "Rạp chiếu phim hàng đầu Việt Nam",
    color: "#e31e24",
    website: "https://cgv.vn",
    coupons: [
      { title: "Giảm 50% vé xem phim", code: "CGV50", discount: "50%", type: "code" },
    ],
  },
];

async function main() {
  console.log("Seeding...");

  for (const storeData of stores) {
    const store = await prisma.store.upsert({
      where: { slug: storeData.slug },
      update: { name: storeData.name },
      create: {
        name: storeData.name,
        slug: storeData.slug,
        description: storeData.description,
        color: storeData.color,
        website: storeData.website,
        couponCount: storeData.coupons.length,
      },
    });

    for (const coupon of storeData.coupons) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 60) + 10);

      await prisma.coupon.create({
        data: {
          storeId: store.id,
          title: coupon.title,
          code: coupon.code,
          discount: coupon.discount,
          condition: coupon.condition ?? null,
          type: coupon.type,
          endDate,
          isVerified: true,
          usageCount: Math.floor(Math.random() * 500) + 10,
          clickCount: Math.floor(Math.random() * 1000) + 50,
        },
      });
    }

    console.log(`  ✓ ${storeData.name} (${storeData.coupons.length} coupons)`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
