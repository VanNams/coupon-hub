import prisma from "@/lib/prisma";
import CouponCard from "@/components/CouponCard";
import StoreCard from "@/components/StoreCard";
import JsonLd from "@/components/JsonLd";
import { jsonLdHowTo, jsonLdFAQ } from "@/lib/seo";

export const revalidate = 300;

export default async function HomePage() {
  const referenceDate = new Date();

  const [stores, latestCoupons] = await Promise.all([
    prisma.store.findMany({
      where: { isActive: true },
      orderBy: { couponCount: "desc" },
    }),
    prisma.coupon.findMany({
      where: { endDate: { gte: referenceDate } },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { store: true },
    }),
  ]);
  const referenceDateIso = referenceDate.toISOString();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <JsonLd
        data={jsonLdHowTo([
          "Tìm mã giảm giá phù hợp với nhu cầu",
          "Copy mã giảm giá",
          "Mở ứng dụng/website của shop",
          "Dán mã tại bước thanh toán",
          "Xác nhận giảm giá thành công",
        ])}
      />
      <JsonLd
        data={jsonLdFAQ([
          {
            question: "Mã giảm giá có miễn phí không?",
            answer: "Tất cả mã giảm giá trên CouponHub đều miễn phí.",
          },
          {
            question: "Làm sao biết mã còn hạn?",
            answer:
              "Chúng tôi kiểm tra và cập nhật mã giảm giá hàng ngày. Mỗi mã đều có hạn sử dụng hiển thị rõ.",
          },
        ])}
      />

      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">
          Mã giảm giá mới nhất hôm nay
        </h1>
        <p className="text-gray-500 mb-6">
          Tổng hợp mã giảm giá từ Shopee, Lazada, Tiki, GrabFood và hơn 50
          thương hiệu. Cập nhật mỗi ngày.
        </p>
        <div className="grid gap-3">
          {latestCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              id={coupon.id}
              title={coupon.title}
              code={coupon.code}
              discount={coupon.discount}
              condition={coupon.condition}
              type={coupon.type}
              endDate={coupon.endDate}
              referenceDate={referenceDateIso}
              usageCount={coupon.usageCount}
              storeName={coupon.store.name}
              storeSlug={coupon.store.slug}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Thương hiệu</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              name={store.name}
              slug={store.slug}
              logo={store.logo}
              color={store.color}
              couponCount={store.couponCount}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
