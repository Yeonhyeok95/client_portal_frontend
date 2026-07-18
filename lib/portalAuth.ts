export type PortalAuthState = "none" | "twofa" | "signedin";

export type PortalUser = {
  email: string;
  name: string;
  role: "CLIENT" | "ADVISOR" | "ADMIN";
};

/** 로그인 직후/재진입 시 역할별 홈 경로. */
export function homePathFor(role: PortalUser["role"] | undefined): string {
  if (role === "ADVISOR") return "/portal/advisor";
  if (role === "ADMIN") return "/portal/admin";
  return "/portal/dashboard";
}

import { API_URL } from "./api";

const KEY = "tsaptest_portal_auth";
const TOKEN_KEY = "tsaptest_portal_token";
const USER_KEY = "tsaptest_portal_user";
const PRE_AUTH_KEY = "tsaptest_portal_preauth";
const MASKED_EMAIL_KEY = "tsaptest_portal_masked_email";

export { API_URL };

export function getAuthState(): PortalAuthState {
  if (typeof window === "undefined") return "none";
  const v = window.sessionStorage.getItem(KEY);
  return v === "twofa" || v === "signedin" ? v : "none";
}

export function setAuthState(state: PortalAuthState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, state);
}

export function clearAuthState() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(PRE_AUTH_KEY);
  window.sessionStorage.removeItem(MASKED_EMAIL_KEY);
}

export function getMaskedEmail(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(MASKED_EMAIL_KEY) ?? "";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function getUser(): PortalUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PortalUser;
  } catch {
    return null;
  }
}

export type LoginResult =
  | { ok: true; twofaRequired: boolean }
  | { ok: false; message: string };

export type VerifyResult = { ok: true } | { ok: false; message: string };

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return {
      ok: false,
      message: "Cannot reach the server. Please try again shortly.",
    };
  }
  if (!res.ok) {
    return { ok: false, message: await extractMessage(res, "Unable to sign in. Please try again.") };
  }
  const data = (await res.json()) as {
    preAuthToken?: string;
    maskedEmail?: string;
    token?: string;
    user?: PortalUser;
  };
  if (data.token && data.user) {
    // 서버의 2FA 토글이 꺼져 있음 (TWOFA_ENABLED=false) — 바로 로그인 완료
    window.sessionStorage.setItem(TOKEN_KEY, data.token);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setAuthState("signedin");
    return { ok: true, twofaRequired: false };
  }
  // 1단계 통과 — 정식 토큰이 아니라 pre-auth 토큰만 받는다 (코드는 이메일로)
  window.sessionStorage.setItem(PRE_AUTH_KEY, data.preAuthToken ?? "");
  window.sessionStorage.setItem(MASKED_EMAIL_KEY, data.maskedEmail ?? "");
  setAuthState("twofa");
  return { ok: true, twofaRequired: true };
}

export async function verifyCode(code: string): Promise<VerifyResult> {
  const preAuth = window.sessionStorage.getItem(PRE_AUTH_KEY);
  if (!preAuth) {
    return { ok: false, message: "Your sign-in session has expired. Please sign in again." };
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${preAuth}`,
      },
      body: JSON.stringify({ code }),
    });
  } catch {
    return { ok: false, message: "Cannot reach the server. Please try again shortly." };
  }
  if (!res.ok) {
    return { ok: false, message: await extractMessage(res, "Verification failed. Please try again.") };
  }
  const data = (await res.json()) as { token: string; user: PortalUser };
  window.sessionStorage.setItem(TOKEN_KEY, data.token);
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  window.sessionStorage.removeItem(PRE_AUTH_KEY);
  window.sessionStorage.removeItem(MASKED_EMAIL_KEY);
  setAuthState("signedin");
  return { ok: true };
}

export async function resendCode(): Promise<boolean> {
  const preAuth = window.sessionStorage.getItem(PRE_AUTH_KEY);
  if (!preAuth) return false;
  try {
    const res = await fetch(`${API_URL}/api/auth/resend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${preAuth}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function extractMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.message === "string") return data.message;
  } catch {
    // 응답 본문이 JSON이 아니면 기본 메시지 사용
  }
  return fallback;
}
