import prisma from "@/lib/prisma";
import CouponCard from "@/components/CouponCard";
import JsonLd from "@/components/JsonLd";
import { jsonLdStore, jsonLdFAQ, jsonLdBreadcrumb, generateSiteTitle } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ store: string }>;
}

export async function generateStaticParams() {
  const stores = await prisma.store.findMany({ select: { slug: true } });
  return stores.map((s) => ({ store: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store: slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return {};
  return {
    title: generateSiteTitle(`Mã giảm giá ${store.name} mới nhất`),
    description: `Tổng hợp mã giảm giá ${store.name} mới nhất hôm nay. Cập nhật liên tục, đã kiểm tra còn hạn.`,
    openGraph: {
      title: `Mã giảm giá ${store.name}`,
      description: `Tổng hợp mã giảm giá ${store.name} mới nhất.`,
    },
  };
}

export default async function StorePage({ params }: Props) {
  const { store: slug } = await params;
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      coupons: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!store || !store.isActive) notFound();

  const referenceDate = new Date();
  const referenceDateIso = referenceDate.toISOString();
  const activeCoupons = store.coupons.filter(
    (c) => !c.endDate || new Date(c.endDate) >= referenceDate
  );
  const expiredCoupons = store.coupons.filter(
    (c) => c.endDate && new Date(c.endDate) < referenceDate
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([
        { name: "Trang chủ", url: "https://couponhub.dev" },
        { name: store.name, url: `https://couponhub.dev/${store.slug}` },
      ])} />
      <JsonLd
        data={jsonLdStore({
          name: store.name,
          description: store.description ?? undefined,
          url: store.website ?? undefined,
        })}
      />
      <JsonLd
        data={jsonLdFAQ([
          {
            question: `Làm sao để sử dụng mã giảm giá ${store.name}?`,
            answer:
              "Copy mã, vào trang thanh toán của " +
              store.name +
              ", dán mã vào ô mã giảm giá/khuyến mãi.",
          },
          {
            question: `Mã giảm giá ${store.name} còn hạn không?`,
            answer:
              "Tất cả mã trên CouponHub đều được kiểm tra và cập nhật hàng ngày.",
          },
        ])}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Mã giảm giá {store.name}
        </h1>
        {store.description && (
          <p className="text-gray-500 mt-1">{store.description}</p>
        )}
        {store.website && (
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline inline-block mt-1"
          >
            {store.website}
          </a>
        )}
      </div>

      {activeCoupons.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Mã đang còn hạn ({activeCoupons.length})
          </h2>
          <div className="grid gap-3">
            {activeCoupons.map((coupon) => (
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
                storeName={store.name}
                storeSlug={store.slug}
              />
            ))}
          </div>
        </section>
      )}

      {expiredCoupons.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-500">
            Mã đã hết hạn ({expiredCoupons.length})
          </h2>
          <div className="grid gap-3">
            {expiredCoupons.map((coupon) => (
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
                storeName={store.name}
                storeSlug={store.slug}
              />
            ))}
          </div>
        </section>
      )}

      {store.coupons.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          Chưa có mã giảm giá nào cho {store.name}. Vui lòng quay lại sau.
        </p>
      )}
    </div>
  );
}
