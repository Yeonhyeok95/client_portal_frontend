export type PortalAuthState = "none" | "twofa" | "signedin";

const KEY = "tsaptest_portal_auth";

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
}
