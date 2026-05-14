export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">CouponHub</h3>
            <p>Tổng hợp mã giảm giá từ các thương hiệu lớn tại Việt Nam.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Sàn TMĐT</h3>
            <ul className="space-y-1">
              <li><a href="/shopee" className="hover:text-black">Shopee</a></li>
              <li><a href="/lazada" className="hover:text-black">Lazada</a></li>
              <li><a href="/tiki" className="hover:text-black">Tiki</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Dịch vụ</h3>
            <ul className="space-y-1">
              <li><a href="/grabfood" className="hover:text-black">GrabFood</a></li>
              <li><a href="/booking-com" className="hover:text-black">Booking.com</a></li>
              <li><a href="/highlands" className="hover:text-black">Highlands</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Về chúng tôi</h3>
            <ul className="space-y-1">
              <li><a href="/blog" className="hover:text-black">Blog</a></li>
              <li><a href="/privacy" className="hover:text-black">Chính sách</a></li>
              <li><a href="/contact" className="hover:text-black">Liên hệ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center">
          &copy; {new Date().getFullYear()} CouponHub. Mã giảm giá được tổng hợp từ các nguồn công khai.
        </div>
      </div>
    </footer>
  );
}
