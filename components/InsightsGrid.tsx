"use client";

import { useEffect, useState } from "react";
import {
  CATEGORY_GRADIENTS,
  CATEGORY_LABELS,
  fetchNews,
  formatNewsMeta,
  type NewsArticle,
  type NewsCategory,
} from "@/lib/news";

const SECTIONS: NewsCategory[] = ["MARKETS", "BUSINESS", "TAX_ACCOUNTING"];
const PAGE_SIZE = 9;
// 서버도 카테고리별 45건(5페이지)까지만 보존하지만, 화면에서도 방어적으로 캡
const MAX_PAGES = 5;

function NewsCard({ a }: { a: NewsArticle }) {
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.07)] overflow-hidden no-underline"
    >
      <div className="h-[150px]" style={{ background: CATEGORY_GRADIENTS[a.category] }}>
        {/* 핫링크 차단 등으로 썸네일이 깨지면 그라디언트 배경만 남긴다 */}
        <img
          src={a.imageUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="p-6">
        <div className="text-xs font-bold text-blue tracking-[1px] uppercase">{a.source}</div>
        <h3 className="mt-2.5 text-lg font-bold leading-[1.4] text-navy">{a.title}</h3>
        {a.summary && (
          <p className="mt-2.5 text-[13px] leading-[1.55] text-body line-clamp-3">{a.summary}</p>
        )}
        <div className="mt-3.5 text-xs text-muted font-semibold">{formatNewsMeta(a)}</div>
      </div>
    </a>
  );
}

export default function InsightsGrid() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // "All"이면 세 섹션 전부, 카테고리를 고르면 그 섹션만
  const [filter, setFilter] = useState<NewsCategory | "ALL">("ALL");
  const [pages, setPages] = useState<Record<NewsCategory, number>>({
    MARKETS: 1,
    BUSINESS: 1,
    TAX_ACCOUNTING: 1,
  });

  useEffect(() => {
    let cancelled = false;
    fetchNews()
      .then((list) => {
        if (!cancelled) setArticles(list);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center text-sm font-semibold text-muted py-16">
        Loading the latest insights…
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-sm font-semibold text-muted py-16">
        News is temporarily unavailable. Please check back in a moment.
      </div>
    );
  }

  const visibleSections = filter === "ALL" ? SECTIONS : SECTIONS.filter((s) => s === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5 justify-center mb-12">
        {(["ALL", ...SECTIONS] as const).map((c) => {
          const active = c === filter;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`cursor-pointer px-5.5 py-2.5 rounded-full text-[13px] font-bold tracking-[0.2px] border transition-colors ${
                active ? "bg-navy text-white border-navy" : "bg-white text-body border-line"
              }`}
            >
              {c === "ALL" ? "All" : CATEGORY_LABELS[c]}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-16">
        {visibleSections.map((section) => {
          const all = articles
            .filter((a) => a.category === section)
            .slice(0, PAGE_SIZE * MAX_PAGES);
          const totalPages = Math.min(Math.max(Math.ceil(all.length / PAGE_SIZE), 1), MAX_PAGES);
          const page = Math.min(pages[section], totalPages);
          const shown = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

          return (
            <section key={section}>
              <h2 className="text-[24px] font-bold text-navy mb-6">{CATEGORY_LABELS[section]}</h2>
              {shown.length === 0 ? (
                <div className="text-sm font-semibold text-muted py-8">
                  No articles in this section yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {shown.map((a) => (
                    <NewsCard key={a.id} a={a} />
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPages((prev) => ({ ...prev, [section]: p }))}
                      aria-label={`${CATEGORY_LABELS[section]} page ${p}`}
                      className={`cursor-pointer w-9 h-9 rounded-full text-[13px] font-bold border transition-colors ${
                        p === page
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-body border-line"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
