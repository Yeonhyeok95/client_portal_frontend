import { API_URL } from "./api";
import { clearAuthState, getToken } from "./portalAuth";

export type AdminUser = {
  id: number;
  email: string;
  displayName: string;
  role: "CLIENT" | "ADVISOR" | "ADMIN";
  enabled: boolean;
  createdAt: string;
};

export type CreateUserInput = {
  email: string;
  displayName: string;
  role: "CLIENT" | "ADVISOR";
  initialPassword: string;
};

/**
 * 관리자 API 공용 fetch — 토큰 만료(401)면 로그인부터 다시,
 * 그 외 실패는 서버의 {message}를 Error로 던진다 (화면에서 그대로 표시).
 */
async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/admin${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${getToken() ?? ""}`,
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again shortly.");
  }
  if (res.status === 401) {
    // 토큰 만료 — 로그인부터 다시 (portfolio.ts와 동일한 규칙)
    clearAuthState();
    window.location.href = "/portal/login";
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    throw new Error(await extractMessage(res));
  }
  return res;
}

export async function fetchUsers(): Promise<AdminUser[]> {
  const res = await adminFetch("/users");
  return (await res.json()) as AdminUser[];
}

export async function createUser(input: CreateUserInput): Promise<AdminUser> {
  const res = await adminFetch("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return (await res.json()) as AdminUser;
}

export async function setUserEnabled(
  id: number,
  enabled: boolean,
): Promise<AdminUser> {
  const res = await adminFetch(`/users/${id}/enabled`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
  return (await res.json()) as AdminUser;
}

/** 임시 비밀번호는 사용자 이메일로만 발송된다 — 응답 본문 없음. */
export async function resetUserPassword(id: number): Promise<void> {
  await adminFetch(`/users/${id}/password-reset`, { method: "POST" });
}

export async function deleteUser(id: number): Promise<void> {
  await adminFetch(`/users/${id}`, { method: "DELETE" });
}

async function extractMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.message === "string") return data.message;
  } catch {
    // 본문이 JSON이 아니면 기본 메시지
  }
  return "The request failed. Please try again.";
}
