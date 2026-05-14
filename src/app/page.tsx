import prisma from "@/lib/prisma";
import CouponCard from "@/components/CouponCard";
import StoreCard from "@/components/StoreCard";
import JsonLd from "@/components/JsonLd";
import { jsonLdHowTo, jsonLdFAQ } from "@/lib/seo";
import Link from "next/link";

export const revalidate = 300;

export default async function HomePage() {
  const referenceDate = new Date();

  const [stores, latestCoupons, hotCoupons] = await Promise.all([
    prisma.store.findMany({
      where: { isActive: true },
      orderBy: { couponCount: "desc" },
    }),
    prisma.coupon.findMany({
      where: { endDate: { gte: referenceDate } },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { store: true },
    }),
    prisma.coupon.findMany({
      where: { endDate: { gte: referenceDate }, isExclusive: true },
      orderBy: { usageCount: "desc" },
      take: 5,
      include: { store: true },
    }),
  ]);
  const referenceDateIso = referenceDate.toISOString();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <JsonLd data={jsonLdHowTo(["Tìm mã giảm giá phù hợp", "Copy mã", "Dán tại thanh toán", "Xác nhận giảm giá"])} />
      <JsonLd data={jsonLdFAQ([{ question: "Mã giảm giá có miễn phí không?", answer: "Tất cả mã giảm giá trên CouponHub đều miễn phí." }, { question: "Làm sao biết mã còn hạn?", answer: "Chúng tôi kiểm tra và cập nhật mã giảm giá hàng ngày." }])} />

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Nhà cung cấp nổi bật</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {stores.slice(0, 12).map((store) => (
            <StoreCard key={store.id} name={store.name} slug={store.slug} logo={store.logo} color={store.color} couponCount={store.couponCount} />
          ))}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Mã giảm giá mới nhất</h1>
              <p className="text-sm text-gray-500 mt-0.5">Cập nhật mã giảm giá từ các thương hiệu lớn</p>
            </div>
          </div>
          <div className="space-y-3">
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
        </div>

        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">🔥 HOT</h3>
              <div className="space-y-3">
                {hotCoupons.map((coupon) => (
                  <Link key={coupon.id} href={`/${coupon.store.slug}`} className="block group">
                    <div className="text-xs text-red-600 font-semibold">{coupon.store.name}</div>
                    <div className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors line-clamp-2">
                      {coupon.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{coupon.usageCount} lượt dùng</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">Chuyên mục</h3>
              <div className="space-y-1.5">
                {["Thời trang", "Điện tử", "Điện thoại", "Du lịch", "Gia dụng", "Nhà cửa", "Sức khỏe", "Mẹ & Bé"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="block text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-10 mb-6">
        <h2 className="text-lg font-bold mb-4">Thương hiệu</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {stores.map((store) => (
            <StoreCard key={store.id} name={store.name} slug={store.slug} logo={store.logo} color={store.color} couponCount={store.couponCount} />
          ))}
        </div>
      </section>
    </div>
  );
}
