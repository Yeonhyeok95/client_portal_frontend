"use client";

import { useState } from "react";
import { usePortalData } from "@/components/portal/PortalDataContext";
import { formatMoney } from "@/lib/portalData";

export default function HoldingsPage() {
  const { masked, portfolio, portfolioError } = usePortalData();
  const [filter, setFilter] = useState("All");

  if (portfolioError) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-14 px-10 text-center text-sm font-semibold text-body">
          {portfolioError}
        </div>
      </div>
    );
  }
  if (!portfolio) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
        <div className="text-[13px] font-semibold text-muted">Loading…</div>
      </div>
    );
  }

  const shown =
    filter === "All"
      ? portfolio.holdings
      : portfolio.holdings.filter((h) => h.account === filter);
  const total = shown.reduce((t, h) => t + h.value, 0);

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6">
        <h1 className="text-[26px] sm:text-[30px] font-bold text-navy">
          Holdings
        </h1>
        <div className="text-[13px] font-semibold text-body">
          {shown.length} positions · {formatMoney(total, masked)}
        </div>
      </div>

      <div className="flex gap-2.5 mb-5.5 flex-wrap">
        {portfolio.accountFilters.map((label) => {
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
        <div className="hidden md:grid grid-cols-[2.4fr_1.2fr_0.9fr_1fr_1.2fr_0.9fr_1fr] gap-3 py-4 px-7 bg-offwhite text-[11px] font-bold tracking-[0.8px] text-body uppercase">
          <span>Security</span>
          <span>Account</span>
          <span className="text-right">Quantity</span>
          <span className="text-right">Price</span>
          <span className="text-right">Value</span>
          <span className="text-right">Day</span>
          <span className="text-right">Total gain</span>
        </div>
        {shown.map((h) => (
          <div
            key={h.ticker}
            className="grid grid-cols-2 md:grid-cols-[2.4fr_1.2fr_0.9fr_1fr_1.2fr_0.9fr_1fr] gap-3 py-4 px-7 border-t border-[rgb(237,237,237)] text-sm items-center"
          >
            <div className="col-span-2 md:col-span-1">
              <div className="font-bold text-navy">{h.ticker}</div>
              <div className="text-xs font-semibold text-muted mt-0.5">
                {h.name}
              </div>
            </div>
            <span className="font-semibold text-body text-[12.5px]">
              {h.account}
            </span>
            <span className="text-right font-semibold text-body">
              {h.qty}
            </span>
            <span className="text-right font-semibold text-body">
              {h.price == null ? "—" : masked ? "····" : `$${h.price.toFixed(2)}`}
            </span>
            <span className="text-right font-bold text-navy">
              {formatMoney(h.value, masked)}
            </span>
            <span
              className={`text-right font-bold ${
                h.dayTrend > 0
                  ? "text-green"
                  : h.dayTrend < 0
                    ? "text-red"
                    : "text-muted"
              }`}
            >
              {h.day}
            </span>
            <span
              className={`text-right font-bold ${
                h.gainUp ? "text-green" : "text-red"
              }`}
            >
              {h.gain}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs leading-[1.6] text-muted">
        Prices as of prior close. Private holdings are valued quarterly at the
        fund administrator&apos;s mark.
      </div>
    </div>
  );
}
