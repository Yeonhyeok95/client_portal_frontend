import { API_URL } from "./api";
import { clearAuthState, getToken } from "./portalAuth";

export type PortfolioAccount = {
  name: string;
  sub: string;
  value: number;
  ytd: string;
  up: boolean;
};

export type PortfolioActivity = {
  label: string;
  date: string;
  amount: string;
  maskedAmount: string;
  color: "green" | "gray";
};

export type PortfolioHolding = {
  ticker: string;
  name: string;
  account: string;
  qty: string;
  price: number | null;
  value: number;
  day: string;
  dayTrend: number;
  gain: string;
  gainUp: boolean;
};

export type PortfolioSummary = {
  totalValue: number;
  dayChange: string;
  dayChangeMasked: string;
  ytdReturn: string;
  incomeYtd: number;
  cashAvailable: number;
  cashApy: string;
};

export type Portfolio = {
  asOf: string;
  summary: PortfolioSummary;
  accounts: PortfolioAccount[];
  activity: PortfolioActivity[];
  holdings: PortfolioHolding[];
  accountFilters: string[];
};

export async function fetchPortfolio(): Promise<Portfolio> {
  const res = await fetch(`${API_URL}/api/portfolio`, {
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
  });
  if (res.status === 401) {
    // 토큰 만료 — 로그인부터 다시
    clearAuthState();
    window.location.href = "/portal/login";
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    throw new Error(`portfolio request failed: ${res.status}`);
  }
  return (await res.json()) as Portfolio;
}

export function formatAsOf(asOf: string): string {
  const d = new Date(asOf);
  const datePart = d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} · Values as of ${timePart}`;
}
