import { API_URL } from "./api";

export type NewsCategory = "MARKETS" | "BUSINESS" | "TAX_ACCOUNTING";

export type NewsArticle = {
  id: number;
  source: string;
  category: NewsCategory;
  title: string;
  summary: string | null;
  url: string;
  imageUrl: string;
  publishedAt: string | null;
};

/** 카테고리 pill/배지에 쓰는 표시용 라벨 */
export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  MARKETS: "Markets",
  BUSINESS: "Business",
  TAX_ACCOUNTING: "Tax & Accounting",
};

/** 썸네일 로드 실패 시(핫링크 차단 등) 카드가 비지 않도록 까는 폴백 배경 */
export const CATEGORY_GRADIENTS: Record<NewsCategory, string> = {
  MARKETS: "linear-gradient(135deg, rgb(219,190,255), rgb(142,194,242))",
  BUSINESS: "linear-gradient(135deg, rgb(196,242,220), rgb(142,194,242))",
  TAX_ACCOUNTING: "linear-gradient(135deg, rgb(255,208,196), rgb(219,190,255))",
};

/**
 * 공개 API — 인증 불필요. 백엔드(Render 무료 티어)가 슬립 중이면
 * 콜드 스타트로 오래 걸리거나 실패할 수 있으므로 호출부는 로딩/에러 UI를 갖춘다.
 */
export async function fetchNews(): Promise<NewsArticle[]> {
  const res = await fetch(`${API_URL}/api/news`);
  if (!res.ok) {
    throw new Error(`news request failed: ${res.status}`);
  }
  return (await res.json()) as NewsArticle[];
}

/** "Jul 18, 2026 · CNBC" 형태의 카드 meta 문자열 */
export function formatNewsMeta(a: NewsArticle): string {
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  return date ? `${date} · ${a.source}` : a.source;
}
