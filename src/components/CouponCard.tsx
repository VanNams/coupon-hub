"use client";

import { useState } from "react";
import { copyToClipboard, getTimeRemaining } from "@/lib/utils";
import Link from "next/link";

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
  const [showCondition, setShowCondition] = useState(false);

  const remaining = endDate ? getTimeRemaining(endDate, referenceDate) : null;
  const isExpired = endDate ? new Date(endDate) < new Date(referenceDate) : false;
  const isDeal = type === "deal";
  const masked = code ? `${code.slice(0, 3)}${"*".repeat(code.length - 3)}` : "";

  function handleCopy() {
    if (!code) return;
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`border border-dashed rounded-lg transition hover:shadow-md ${
        isExpired ? "opacity-50 bg-gray-50" : "bg-white border-gray-300 hover:border-red-400"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/${storeSlug}`}
                className="text-xs font-semibold text-red-600 uppercase hover:underline"
              >
                {storeName}
              </Link>
              {isExpired && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Hết hạn</span>
              )}
              {isDeal && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">Deal</span>
              )}
            </div>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1">{title}</h3>
            <span className="text-lg font-bold text-red-600">{discount}</span>
          </div>

          <div className="shrink-0 text-center">
            {isDeal ? (
              <Link
                href={`/${storeSlug}`}
                className="inline-block rounded-lg bg-red-600 text-white px-5 py-2 text-sm font-semibold hover:bg-red-700"
              >
                Xem deal
              </Link>
            ) : (
              <div>
                {code && (
                  <div className="mb-2 font-mono text-sm font-bold text-gray-800 tracking-wider bg-gray-100 px-3 py-1.5 rounded">
                    {copied ? code : masked}
                  </div>
                )}
                <button
                  onClick={handleCopy}
                  disabled={!code}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                    copied
                      ? "bg-green-500 text-white"
                      : code
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {copied ? "Đã copy!" : "Lấy mã"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
          {remaining && <span className="text-gray-500">Còn {remaining}</span>}
          <span>{usageCount} lượt dùng</span>
          {condition && (
            <button
              onClick={() => setShowCondition(!showCondition)}
              className="text-red-600 hover:underline ml-auto"
            >
              Điều kiện
            </button>
          )}
        </div>

        {showCondition && condition && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 leading-relaxed">
            {condition}
          </div>
        )}
      </div>
    </div>
  );
}
