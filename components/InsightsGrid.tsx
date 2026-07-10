"use client";

import { useState } from "react";
import { articles, type Article } from "@/lib/articles";

const CATEGORIES: Array<Article["cat"] | "All"> = [
  "All",
  "Markets",
  "Planning",
  "Tax",
];

export default function InsightsGrid() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered =
    cat === "All" ? articles : articles.filter((a) => a.cat === cat);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5 justify-center mb-12">
        {CATEGORIES.map((c) => {
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
              {c}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {filtered.map((a) => (
          <div
            key={a.title}
            className="bg-white rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.07)] overflow-hidden"
          >
            <div className="h-[150px]" style={{ background: a.gradient }} />
            <div className="p-6">
              <div className="text-xs font-bold text-blue tracking-[1px] uppercase">
                {a.cat}
              </div>
              <h3 className="mt-2.5 text-lg font-bold leading-[1.4] text-navy">
                {a.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-[1.55] text-body">
                {a.blurb}
              </p>
              <div className="mt-3.5 text-xs text-muted font-semibold">
                {a.meta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
