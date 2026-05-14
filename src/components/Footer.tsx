import Link from "next/link";

const providers = [
  { name: "Shopee", slug: "/shopee" },
  { name: "Lazada", slug: "/lazada" },
  { name: "Tiki", slug: "/tiki" },
  { name: "Sendo", slug: "/sendo" },
  { name: "Klook", slug: "/klook" },
  { name: "FPT Shop", slug: "/fpt-shop" },
  { name: "Grab", slug: "/grab" },
  { name: "CellphoneS", slug: "/cellphones" },
];

const categories = [
  "Thời trang & Phụ kiện",
  "Điện tử & Công nghệ",
  "Điện thoại, Máy tính bảng",
  "Du lịch & Giải trí",
  "Điện tử gia dụng",
  "Nhà cửa đời sống",
  "Sức khỏe & Làm đẹp",
  "Mẹ & Bé",
  "Sách",
  "Ẩm thực",
];

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Giới thiệu</h3>
            <p className="leading-relaxed">
              CouponHub là nơi chia sẻ mã giảm giá, thông tin khuyến mãi từ các trang thương mại điện tử lớn tại Việt Nam.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Nhà cung cấp nổi bật</h3>
            <ul className="space-y-1.5">
              {providers.map((p) => (
                <li key={p.name}>
                  <Link href={p.slug} className="hover:text-red-600 transition-colors">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Chuyên mục nổi bật</h3>
            <ul className="space-y-1.5">
              {categories.slice(0, 8).map((c) => (
                <li key={c}>
                  <Link href={`/category/${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="hover:text-red-600 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Về chúng tôi</h3>
            <ul className="space-y-1.5">
              <li><Link href="/blog" className="hover:text-red-600 transition-colors">Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-red-600 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/terms" className="hover:text-red-600 transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link href="/contact" className="hover:text-red-600 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} CouponHub. Tất cả mã giảm giá được tổng hợp từ các nguồn công khai.
        </div>
      </div>
    </footer>
  );
}
