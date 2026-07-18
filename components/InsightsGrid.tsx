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

const FILTERS: Array<NewsCategory | "All"> = [
  "All",
  "MARKETS",
  "BUSINESS",
  "TAX_ACCOUNTING",
];

export default function InsightsGrid() {
  const [cat, setCat] = useState<(typeof FILTERS)[number]>("All");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  const filtered =
    cat === "All" ? articles : articles.filter((a) => a.category === cat);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5 justify-center mb-12">
        {FILTERS.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`cursor-pointer px-5.5 py-2.5 rounded-full text-[13px] font-bold tracking-[0.2px] border transition-colors ${
                active
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-body border-line"
              }`}
            >
              {c === "All" ? "All" : CATEGORY_LABELS[c]}
            </button>
          );
        })}
      </div>
      {loading && (
        <div className="text-center text-sm font-semibold text-muted py-16">
          Loading the latest insights…
        </div>
      )}
      {error && (
        <div className="text-center text-sm font-semibold text-muted py-16">
          News is temporarily unavailable. Please check back in a moment.
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-sm font-semibold text-muted py-16">
          No articles in this category yet.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {filtered.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.07)] overflow-hidden no-underline"
          >
            <div
              className="h-[150px]"
              style={{ background: CATEGORY_GRADIENTS[a.category] }}
            />
            <div className="p-6">
              <div className="text-xs font-bold text-blue tracking-[1px] uppercase">
                {CATEGORY_LABELS[a.category]}
              </div>
              <h3 className="mt-2.5 text-lg font-bold leading-[1.4] text-navy">
                {a.title}
              </h3>
              {a.summary && (
                <p className="mt-2.5 text-[13px] leading-[1.55] text-body line-clamp-3">
                  {a.summary}
                </p>
              )}
              <div className="mt-3.5 text-xs text-muted font-semibold">
                {formatNewsMeta(a)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
