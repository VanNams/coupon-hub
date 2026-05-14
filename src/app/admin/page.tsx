"use client";

import { useEffect, useState } from "react";

interface CronConfig {
  id: string;
  schedule: string;
  isActive: boolean;
  running: boolean;
  nextRun: string | null;
}

export default function AdminPage() {
  const [config, setConfig] = useState<CronConfig | null>(null);
  const [schedule, setSchedule] = useState("0 0 * * *");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch("/api/admin/cron-config");
      const data = await res.json();
      setConfig(data);
      setSchedule(data.schedule ?? "0 0 * * *");
      setIsActive(data.isActive ?? true);
    } catch {
      setError("Không thể tải cấu hình cron");
    }
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cron-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule, isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setConfig(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleRunNow() {
    setRunLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/cron/update-coupons");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setRunLoading(false);
    }
  }

  if (!config) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Quản lý Cron</h1>
        <p className="text-gray-500 text-sm mt-1">Cấu hình lịch tự động cập nhật mã giảm giá</p>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">Lịch chạy tự động</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cron Expression</label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0 0 * * *"
            />
            <p className="text-xs text-gray-400 mt-1">
              VD: <code className="bg-gray-100 px-1 rounded">0 0 * * *</code> mỗi ngày 00:00,{" "}
              <code className="bg-gray-100 px-1 rounded">0 */6 * * *</code> mỗi 6 tiếng
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Đang bật</span>
            </label>
          </div>
        </div>

        {config.nextRun && (
          <div className="text-sm text-gray-500">
            Lần chạy tiếp theo: <span className="font-medium text-gray-700">{new Date(config.nextRun).toLocaleString("vi-VN")}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-blue-600 text-white px-5 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">Chạy thủ công</h2>
        <p className="text-sm text-gray-500">Chạy crawler và xóa mã giảm giá cũ ngay lập tức</p>

        <button
          onClick={handleRunNow}
          disabled={runLoading}
          className="rounded-lg bg-red-600 text-white px-5 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {runLoading ? "Đang chạy..." : "Chạy ngay"}
        </button>

        {result && (
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto max-h-60">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
