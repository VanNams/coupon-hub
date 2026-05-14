import Link from "next/link";
import SearchBar from "./SearchBar";

const categories = [
  { name: "Shopee", slug: "/shopee" },
  { name: "Lazada", slug: "/lazada" },
  { name: "Tiki", slug: "/tiki" },
  { name: "Grab", slug: "/grab" },
  { name: "Klook", slug: "/klook" },
  { name: "FPT Shop", slug: "/fpt-shop" },
  { name: "CellphoneS", slug: "/cellphones" },
  { name: "Sendo", slug: "/sendo" },
];

const menuItems = [
  { name: "Nhà cung cấp", href: "#", children: categories },
  { name: "Chuyên mục", href: "#" },
  { name: "Khuyến mãi", href: "/" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="font-bold text-xl text-red-600 shrink-0">
            CouponHub
          </Link>
          <div className="flex-1 max-w-lg">
            <SearchBar />
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.slug}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
