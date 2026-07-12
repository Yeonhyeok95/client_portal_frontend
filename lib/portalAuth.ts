export type PortalAuthState = "none" | "twofa" | "signedin";

export type PortalUser = {
  email: string;
  name: string;
  role: "CLIENT" | "ADVISOR";
};

import { API_URL } from "./api";

const KEY = "tsaptest_portal_auth";
const TOKEN_KEY = "tsaptest_portal_token";
const USER_KEY = "tsaptest_portal_user";

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

export type LoginResult = { ok: true } | { ok: false; message: string };

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
    let message = "Unable to sign in. Please try again.";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") message = data.message;
    } catch {
      // 응답 본문이 JSON이 아니면 기본 메시지 사용
    }
    return { ok: false, message };
  }
  const data = (await res.json()) as { token: string; user: PortalUser };
  window.sessionStorage.setItem(TOKEN_KEY, data.token);
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  setAuthState("twofa");
  return { ok: true };
}
