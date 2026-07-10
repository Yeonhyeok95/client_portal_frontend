"use client";

import { useState } from "react";
import { usePortalData } from "@/components/portal/PortalDataContext";
import { allDocuments, documentCategories } from "@/lib/portalData";

export default function DocumentsPage() {
  const { downloaded, markDownloaded } = usePortalData();
  const [filter, setFilter] = useState("All");

  const shown =
    filter === "All"
      ? allDocuments
      : allDocuments.filter((d) => d.cat === filter);

  return (
    <div className="max-w-[1080px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
      <h1 className="text-[26px] sm:text-[30px] font-bold text-navy mb-6">
        Documents
      </h1>

      <div className="flex gap-2.5 mb-5.5 flex-wrap">
        {documentCategories.map((label) => {
          const active = filter === label;
          return (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`cursor-pointer px-5 py-2.5 rounded-full text-[13px] font-bold border ${
                active
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-body border-line"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        {shown.map((d) => (
          <div
            key={d.name}
            className="flex items-center gap-5 py-4.5 px-7 border-b border-[rgb(237,237,237)] last:border-b-0"
          >
            <div className="w-10.5 h-10.5 rounded-lg bg-blue/8 text-blue flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M 6 2 h 8 l 5 5 v 14 a 1 1 0 0 1 -1 1 H 6 a 1 1 0 0 1 -1 -1 V 3 a 1 1 0 0 1 1 -1 Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M 14 2 v 5 h 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-navy">{d.name}</div>
              <div className="text-xs font-semibold text-muted mt-0.5">
                {d.meta}
              </div>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-bold tracking-[0.6px] uppercase text-body bg-offwhite border border-[rgb(237,237,237)] rounded-full py-1.5 px-3.5">
              {d.cat}
            </span>
            <button
              onClick={() => markDownloaded(d.name)}
              title="Download"
              aria-label={`Download ${d.name}`}
              className={`cursor-pointer w-9.5 h-9.5 rounded-full flex items-center justify-center bg-offwhite shrink-0 ${
                downloaded[d.name] ? "text-green" : "text-body"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M 12 3 v 12 m 0 0 l -5 -5 m 5 5 l 5 -5 M 4 20 h 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
