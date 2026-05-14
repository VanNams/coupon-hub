"use client";

import { useState } from "react";
import { copyToClipboard, getTimeRemaining } from "@/lib/utils";

interface CouponCardProps {
  id: string;
  title: string;
  code?: string | null;
  discount: string;
  condition?: string | null;
  type: string;
  endDate?: string | Date | null;
  referenceDate: string;
  usageCount: number;
  storeName: string;
  storeSlug: string;
}

export default function CouponCard({
  title,
  code,
  discount,
  condition,
  type,
  endDate,
  referenceDate,
  usageCount,
  storeName,
  storeSlug,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const remaining = endDate ? getTimeRemaining(endDate, referenceDate) : null;
  const isExpired = endDate ? new Date(endDate) < new Date(referenceDate) : false;
  const isDeal = type === "deal";

  function handleCopy() {
    if (!code) return;
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`rounded-xl border p-4 transition hover:shadow-md ${
        isExpired ? "opacity-50 bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 uppercase">
              {storeName}
            </span>
            {isExpired && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                Hết hạn
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-blue-600">{discount}</span>
            {isDeal && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                Deal
              </span>
            )}
          </div>
          {condition && (
            <p className="text-xs text-gray-500 mt-1">Điều kiện: {condition}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            {remaining && <span>Còn {remaining}</span>}
            <span>{usageCount} lượt dùng</span>
          </div>
        </div>

        <div className="shrink-0">
          {isDeal ? (
            <a
              href={`/${storeSlug}`}
              className="inline-block rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Xem deal
            </a>
          ) : code ? (
            <button
              onClick={handleCopy}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copied ? "Đã copy!" : "Copy mã"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
