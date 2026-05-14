import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="font-bold text-xl shrink-0">
          CouponHub
        </Link>
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Trang chủ
          </Link>
          <Link href="/blog" className="hover:text-black">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
