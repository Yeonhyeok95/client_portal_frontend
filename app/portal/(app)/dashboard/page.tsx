"use client";

import { usePortalData } from "@/components/portal/PortalDataContext";
import { formatMoney } from "@/lib/portalData";
import { formatAsOf } from "@/lib/portfolio";
import { getUser } from "@/lib/portalAuth";

const allocation = [
  { label: "Global equities 52%", color: "rgb(37,43,66)" },
  { label: "Fixed income 28%", color: "rgb(35,166,240)" },
  { label: "Alternatives 9%", color: "rgb(142,194,242)" },
  { label: "Real assets 6%", color: "rgb(45,192,113)" },
  { label: "Cash 5%", color: "rgb(229,229,229)" },
];

export default function DashboardPage() {
  const { masked, portfolio, portfolioError } = usePortalData();

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

  const { summary, accounts, activity } = portfolio;
  const firstName = (getUser()?.name ?? "").split(" ")[0];

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6">
        <div>
          <div className="text-[13px] font-semibold text-body">
            {formatAsOf(portfolio.asOf)}
          </div>
          <h1 className="mt-1.5 text-[26px] sm:text-[30px] font-bold text-navy">
            Good morning{firstName ? `, ${firstName}` : ""}
          </h1>
        </div>
        <div className="text-xs font-semibold text-muted">
          Custodied at Fidelity Institutional
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-5">
        <div className="bg-navy rounded-[10px] py-7 px-7.5 text-white sm:col-span-1">
          <div className="text-xs font-bold tracking-[1px] text-white/50 uppercase">
            Total portfolio
          </div>
          <div className="text-[32px] sm:text-[38px] font-bold mt-2.5">
            {formatMoney(summary.totalValue, masked)}
          </div>
          <div className="text-[13px] font-semibold text-green mt-2">
            {masked ? summary.dayChangeMasked : summary.dayChange} today
          </div>
        </div>
        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-7 px-6.5">
          <div className="text-xs font-bold tracking-[1px] text-muted uppercase">
            YTD return
          </div>
          <div className="text-[28px] sm:text-[30px] font-bold text-green mt-2.5">
            {summary.ytdReturn}
          </div>
          <div className="text-xs font-semibold text-body mt-2">
            Net of all fees
          </div>
        </div>
        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-7 px-6.5">
          <div className="text-xs font-bold tracking-[1px] text-muted uppercase">
            Income YTD
          </div>
          <div className="text-[28px] sm:text-[30px] font-bold text-navy mt-2.5">
            {formatMoney(summary.incomeYtd, masked)}
          </div>
          <div className="text-xs font-semibold text-body mt-2">
            Dividends and coupons
          </div>
        </div>
        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-7 px-6.5">
          <div className="text-xs font-bold tracking-[1px] text-muted uppercase">
            Cash available
          </div>
          <div className="text-[28px] sm:text-[30px] font-bold text-navy mt-2.5">
            {formatMoney(summary.cashAvailable, masked)}
          </div>
          <div className="text-xs font-semibold text-body mt-2">
            Earning {summary.cashApy}
          </div>
        </div>
      </div>

      {/* Chart + allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-5">
        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-7 px-7.5">
          <div className="flex justify-between items-center mb-4.5">
            <h2 className="text-lg font-bold text-navy">
              Performance, trailing 12 months
            </h2>
            <div className="text-xs font-semibold text-body">
              Total portfolio, net
            </div>
          </div>
          <svg viewBox="0 0 600 230" className="w-full h-auto block">
            <line x1="0" y1="55" x2="600" y2="55" stroke="rgb(237,237,237)" strokeWidth="1" />
            <line x1="0" y1="110" x2="600" y2="110" stroke="rgb(237,237,237)" strokeWidth="1" />
            <line x1="0" y1="165" x2="600" y2="165" stroke="rgb(237,237,237)" strokeWidth="1" />
            <path
              d="M 0 150 L 50 142 L 100 148 L 150 128 L 200 132 L 250 118 L 300 124 L 350 104 L 400 96 L 450 102 L 500 84 L 550 78 L 600 66 L 600 230 L 0 230 Z"
              fill="rgba(35,166,240,0.08)"
            />
            <path
              d="M 0 150 L 50 142 L 100 148 L 150 128 L 200 132 L 250 118 L 300 124 L 350 104 L 400 96 L 450 102 L 500 84 L 550 78 L 600 66"
              fill="none"
              stroke="rgb(35,166,240)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx="600" cy="66" r="4.5" fill="rgb(35,166,240)" />
          </svg>
          <div className="flex justify-between mt-2.5 text-[11px] font-semibold text-muted">
            <span>Jul &apos;25</span>
            <span>Sep</span>
            <span>Nov</span>
            <span>Jan &apos;26</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
          </div>
        </div>
        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-7 px-7.5">
          <h2 className="text-lg font-bold text-navy mb-5.5">Allocation</h2>
          <div className="flex items-center gap-6.5">
            <div className="relative w-[130px] h-[130px] shrink-0">
              <div
                className="w-[130px] h-[130px] rounded-full"
                style={{
                  background:
                    "conic-gradient(rgb(37,43,66) 0% 52%, rgb(35,166,240) 52% 80%, rgb(142,194,242) 80% 89%, rgb(45,192,113) 89% 95%, rgb(229,229,229) 95% 100%)",
                }}
              />
              <div className="absolute inset-6.5 rounded-full bg-white" />
            </div>
            <div className="flex flex-col gap-2.5 text-xs font-semibold text-body">
              {allocation.map((a) => (
                <div key={a.label} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-[3px] inline-block"
                    style={{ background: a.color }}
                  />
                  {a.label}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-[rgb(237,237,237)] text-xs leading-[1.55] text-body">
            Within policy ranges. Last rebalanced June 24, 2026.
          </div>
        </div>
      </div>

      {/* Accounts + activity + advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-7 px-7.5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-navy">Accounts</h2>
            <a
              href="/portal/holdings"
              className="text-[13px] font-bold text-blue no-underline"
            >
              View holdings
            </a>
          </div>
          {accounts.map((acc) => (
            <div
              key={acc.name}
              className="flex justify-between items-center py-4 border-b border-[rgb(237,237,237)] last:border-b-0"
            >
              <div>
                <div className="text-sm font-bold text-navy">{acc.name}</div>
                <div className="text-xs font-semibold text-muted mt-0.5">
                  {acc.sub}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold text-navy">
                  {formatMoney(acc.value, masked)}
                </div>
                <div
                  className={`text-xs font-semibold mt-0.5 ${
                    acc.up ? "text-green" : "text-red"
                  }`}
                >
                  {acc.ytd}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-6.5 px-7">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-navy text-white text-base font-bold flex items-center justify-center shrink-0">
                MB
              </div>
              <div>
                <div className="text-sm font-bold text-navy">
                  Marcus Bell, CFP®
                </div>
                <div className="text-xs font-semibold text-body mt-0.5">
                  Your advisor
                </div>
              </div>
            </div>
            <a
              href="/portal/messages"
              className="block mt-4.5 border border-blue rounded-[5px] py-2.5 text-center text-[13px] font-bold text-blue no-underline"
            >
              Send a secure message
            </a>
          </div>
          <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-6.5 px-7">
            <h2 className="text-base font-bold text-navy mb-1.5">
              Recent activity
            </h2>
            {activity.map((act) => (
              <div
                key={act.label}
                className="flex justify-between gap-3 py-2.5 border-b border-[rgb(237,237,237)] last:border-b-0 text-[12.5px]"
              >
                <div>
                  <div className="font-bold text-navy">{act.label}</div>
                  <div className="font-semibold text-muted mt-0.5">
                    {act.date}
                  </div>
                </div>
                <div
                  className={`font-bold whitespace-nowrap ${
                    act.color === "green" ? "text-green" : "text-body"
                  }`}
                >
                  {masked ? act.maskedAmount : act.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
