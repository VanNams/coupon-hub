import Link from "next/link";

interface StoreCardProps {
  name: string;
  slug: string;
  logo?: string | null;
  color?: string | null;
  couponCount: number;
}

export default function StoreCard({ name, slug, logo, color, couponCount }: StoreCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="rounded-xl border bg-white p-4 flex items-center gap-3 hover:shadow-md transition"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
        style={{ backgroundColor: color ?? "#6366f1" }}
      >
        {logo ? (
          <img src={logo} alt={name} className="w-8 h-8 object-contain" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-xs text-gray-500">{couponCount} mã giảm giá</p>
      </div>
    </Link>
  );
}
