export function formatMoney(n: number, masked: boolean): string {
  if (masked) return "$ ······";
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type Account = {
  name: string;
  sub: string;
  value: number;
  ytd: string;
  up: boolean;
};

export const accounts: Account[] = [
  {
    name: "Whitfield Family Trust",
    sub: "Discretionary · ···8241",
    value: 7214850,
    ytd: "+9.2% YTD",
    up: true,
  },
  {
    name: "Retirement IRA",
    sub: "Discretionary · ···5507",
    value: 2904607,
    ytd: "+7.8% YTD",
    up: true,
  },
  {
    name: "Municipal Bond Portfolio",
    sub: "Laddered · ···1193",
    value: 1812936,
    ytd: "+3.9% YTD",
    up: true,
  },
  {
    name: "Cash Reserve",
    sub: "Treasury program · ···6620",
    value: 914120,
    ytd: "4.1% APY",
    up: true,
  },
];

export const totalPortfolioValue = 12846513;
export const dayChangeAmount = "+$41,286 (+0.32%)";
export const dayChangeMasked = "+ ······ (+0.32%)";
export const incomeYtd = 196400;
export const cashValue = 914120;

export type ActivityItem = {
  label: string;
  date: string;
  amount: string;
  maskedAmount: string;
  color: "green" | "gray";
};

export const activity: ActivityItem[] = [
  {
    label: "Dividend received — VTI",
    date: "Jul 1",
    amount: "+$6,214",
    maskedAmount: "+ ····",
    color: "green",
  },
  {
    label: "Municipal coupon payment",
    date: "Jun 30",
    amount: "+$18,900",
    maskedAmount: "+ ····",
    color: "green",
  },
  {
    label: "Quarterly advisory fee",
    date: "Jun 30",
    amount: "−$8,050",
    maskedAmount: "− ····",
    color: "gray",
  },
  {
    label: "Rebalance — trimmed MSFT",
    date: "Jun 24",
    amount: "4 trades",
    maskedAmount: "4 trades",
    color: "gray",
  },
];

export type Holding = {
  ticker: string;
  name: string;
  account: string;
  qty: string;
  price: number | null;
  value: number;
  day: string;
  dayTrend: 1 | 0 | -1;
  gain: string;
  gainUp: boolean;
};

export const allHoldings: Holding[] = [
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    account: "Family Trust",
    qty: "11,650",
    price: 312.44,
    value: 3639926,
    day: "+0.4%",
    dayTrend: 1,
    gain: "+18.2%",
    gainUp: true,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    account: "Family Trust",
    qty: "2,400",
    price: 512.3,
    value: 1229520,
    day: "+0.8%",
    dayTrend: 1,
    gain: "+34.1%",
    gainUp: true,
  },
  {
    ticker: "VXUS",
    name: "Vanguard Total International ETF",
    account: "Family Trust",
    qty: "16,900",
    price: 71.08,
    value: 1201252,
    day: "−0.2%",
    dayTrend: -1,
    gain: "+9.6%",
    gainUp: true,
  },
  {
    ticker: "BRK.B",
    name: "Berkshire Hathaway Class B",
    account: "Family Trust",
    qty: "1,068",
    price: 498.15,
    value: 532024,
    day: "+0.1%",
    dayTrend: 1,
    gain: "+12.4%",
    gainUp: true,
  },
  {
    ticker: "PCF III",
    name: "Private Credit Fund III",
    account: "Family Trust",
    qty: "—",
    price: null,
    value: 612128,
    day: "—",
    dayTrend: 0,
    gain: "+11.2%",
    gainUp: true,
  },
  {
    ticker: "AGG",
    name: "iShares Core U.S. Aggregate Bond",
    account: "Retirement IRA",
    qty: "17,200",
    price: 102.61,
    value: 1764892,
    day: "+0.1%",
    dayTrend: 1,
    gain: "+4.2%",
    gainUp: true,
  },
  {
    ticker: "SCHD",
    name: "Schwab U.S. Dividend Equity ETF",
    account: "Retirement IRA",
    qty: "38,700",
    price: 29.45,
    value: 1139715,
    day: "+0.3%",
    dayTrend: 1,
    gain: "+8.8%",
    gainUp: true,
  },
  {
    ticker: "VWIUX",
    name: "Vanguard Intermediate Muni Fund",
    account: "Municipal",
    qty: "84,100",
    price: 14.32,
    value: 1204312,
    day: "0.0%",
    dayTrend: 0,
    gain: "+3.6%",
    gainUp: true,
  },
  {
    ticker: "MUB",
    name: "iShares National Muni Bond ETF",
    account: "Municipal",
    qty: "5,540",
    price: 109.86,
    value: 608624,
    day: "+0.1%",
    dayTrend: 1,
    gain: "+3.1%",
    gainUp: true,
  },
  {
    ticker: "T-BILLS",
    name: "U.S. Treasury Bill Ladder",
    account: "Cash Reserve",
    qty: "—",
    price: null,
    value: 914120,
    day: "—",
    dayTrend: 0,
    gain: "+2.0%",
    gainUp: true,
  },
];

export const accountFilterNames = [
  "All",
  "Family Trust",
  "Retirement IRA",
  "Municipal",
  "Cash Reserve",
];

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

export type PortalMessage = {
  who: "advisor" | "me";
  text: string;
  meta: string;
};

export const initialMessages: PortalMessage[] = [
  {
    who: "advisor",
    text: "Good morning Eleanor — the Q2 statements are posted under Documents. Nothing requires action, but do note the municipal ladder reinvestment summarized on page 4.",
    meta: "Marcus · Jul 2, 9:14 AM",
  },
  {
    who: "me",
    text: "Thank you, Marcus. Could we revisit the 529 funding for the grandchildren before September?",
    meta: "You · Jul 3, 8:02 AM",
  },
  {
    who: "advisor",
    text: "Of course. I will prepare projections for each of the three plans and propose some times for next week.",
    meta: "Marcus · Jul 3, 10:41 AM",
  },
];
