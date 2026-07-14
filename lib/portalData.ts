export function formatMoney(n: number, masked: boolean): string {
  if (masked) return "$ ······";
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 계좌·활동·보유종목 더미 데이터는 백엔드 DB로 이관됨 (lib/portfolio.ts의 API 참조)

export type DocumentItem = {
  name: string;
  cat: "Statements" | "Reports" | "Tax" | "Agreements";
  meta: string;
};

export const allDocuments: DocumentItem[] = [
  {
    name: "Q2 2026 Consolidated Statement",
    cat: "Statements",
    meta: "July 2, 2026 · PDF · 1.4 MB",
  },
  {
    name: "2026 Mid-Year Outlook",
    cat: "Reports",
    meta: "June 20, 2026 · PDF · 2.1 MB",
  },
  {
    name: "Q1 2026 Consolidated Statement",
    cat: "Statements",
    meta: "April 3, 2026 · PDF · 1.3 MB",
  },
  {
    name: "2025 K-1 — Private Credit Fund III",
    cat: "Tax",
    meta: "March 28, 2026 · PDF · 310 KB",
  },
  {
    name: "2025 Tax Package — 1099 Composite",
    cat: "Tax",
    meta: "February 12, 2026 · PDF · 890 KB",
  },
  {
    name: "Investment Policy Statement, rev. 2026",
    cat: "Agreements",
    meta: "January 15, 2026 · PDF · 460 KB",
  },
  {
    name: "Advisory Fee Schedule",
    cat: "Agreements",
    meta: "January 2, 2026 · PDF · 120 KB",
  },
  {
    name: "Whitfield Family Trust Agreement",
    cat: "Agreements",
    meta: "November 8, 2024 · PDF · 2.8 MB",
  },
];

export const documentCategories = [
  "All",
  "Statements",
  "Tax",
  "Agreements",
  "Reports",
];

// 채팅 더미(initialMessages)는 백엔드 chat_messages 시드로 이관됨 (lib/chat.ts 참조)
