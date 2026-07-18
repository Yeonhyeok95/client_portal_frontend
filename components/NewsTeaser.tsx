"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_GRADIENTS,
  CATEGORY_LABELS,
  fetchNews,
  formatNewsMeta,
  type NewsArticle,
} from "@/lib/news";

/**
 * 홈 "Insights preview" 섹션 — 최신 뉴스 3건.
 * 마케팅 홈에 에러 문구를 노출하지 않기 위해 로딩/실패 시 섹션 전체를 감춘다.
 */
export default function NewsTeaser() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchNews()
      .then((list) => {
        if (!cancelled) setArticles(list.slice(0, 3));
      })
      .catch(() => {
        // 백엔드 콜드 스타트/장애 — 섹션을 그리지 않는다
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (articles.length === 0) return null;

  return (
    <div className="bg-offwhite px-6 sm:px-10 py-20">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex justify-between items-end mb-11">
          <div>
            <div className="text-sm font-bold tracking-[2px] text-blue uppercase">
              Insights
            </div>
            <h2 className="mt-3.5 text-[32px] sm:text-[40px] font-bold text-navy">
              Market headlines
            </h2>
          </div>
          <Link
            href="/insights"
            className="text-sm font-bold text-blue no-underline"
          >
            All insights
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {articles.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.07)] overflow-hidden no-underline"
            >
              <div
                className="h-40"
                style={{ background: CATEGORY_GRADIENTS[a.category] }}
              />
              <div className="p-6">
                <div className="text-xs font-bold text-blue tracking-[1px] uppercase">
                  {CATEGORY_LABELS[a.category]}
                </div>
                <h3 className="mt-2.5 text-lg font-bold leading-[1.4] text-navy">
                  {a.title}
                </h3>
                <div className="mt-3.5 text-xs text-muted font-semibold">
                  {formatNewsMeta(a)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
