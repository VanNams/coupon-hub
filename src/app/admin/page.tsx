"use client";

import { useState } from "react";

export default function UpdateCouponsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/cron/update-coupons");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi không xác định");
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Cập nhật mã giảm giá</h1>
      <p className="text-gray-500 mb-6">
        Chạy thủ công crawler để lấy mã giảm giá mới từ các nguồn affiliate.
        <br />
        Tự động chạy mỗi ngày lúc 00:00 UTC qua Vercel Cron.
      </p>

      <button
        onClick={handleRun}
        disabled={loading}
        className="rounded-lg bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Đang chạy..." : "Chạy crawler ngay"}
      </button>

      {result && (
        <pre className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
