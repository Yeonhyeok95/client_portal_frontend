import { Client } from "@stomp/stompjs";
import { API_URL } from "./api";
import { getToken } from "./portalAuth";

// http(s)://… → ws(s)://…/ws  (필요하면 NEXT_PUBLIC_WS_URL로 재정의)
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? `${API_URL.replace(/^http/, "ws")}/ws`;

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderRole: "CLIENT" | "ADVISOR";
  senderName: string;
  content: string;
  sentAt: string;
};

export type ConversationSummary = {
  id: number;
  clientName: string;
  clientEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type MyConversation = {
  conversationId: number;
  messages: ChatMessage[];
  hasMore: boolean;
};

export type ThreadPage = {
  messages: ChatMessage[];
  hasMore: boolean;
};

export type Unread = {
  conversationId: number;
  unreadCount: number;
};

async function authedGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export function fetchMyConversation(): Promise<MyConversation> {
  return authedGet("/api/chat/conversation");
}

export function fetchUnread(): Promise<Unread> {
  return authedGet("/api/chat/unread");
}

export function fetchConversations(): Promise<ConversationSummary[]> {
  return authedGet("/api/chat/conversations");
}

/** before = 이 메시지 ID보다 오래된 페이지 (생략 시 최신 페이지). */
export function fetchThread(
  conversationId: number,
  before?: number,
): Promise<ThreadPage> {
  const query = before != null ? `?before=${before}` : "";
  return authedGet(`/api/chat/conversations/${conversationId}/messages${query}`);
}

/** 지금 최신 메시지까지 읽음 처리 (호출자 역할의 마커만 전진). 실패는 무시해도 되는 부가 동작. */
export async function markConversationRead(conversationId: number): Promise<void> {
  try {
    await fetch(`${API_URL}/api/chat/conversations/${conversationId}/read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken() ?? ""}` },
    });
  } catch {
    // 배지가 다음 로드에서 다시 맞춰지므로 조용히 무시
  }
}

/**
 * STOMP 클라이언트 생성. CONNECT 프레임에 JWT를 실어 보낸다.
 * 반환된 client는 activate() 호출 뒤 onConnect에서 구독하면 된다.
 */
export function createChatClient(): Client {
  return new Client({
    brokerURL: WS_URL,
    connectHeaders: { Authorization: `Bearer ${getToken() ?? ""}` },
    reconnectDelay: 5000,
  });
}

export function sendChatMessage(client: Client, conversationId: number, content: string) {
  client.publish({
    destination: `/app/conversations/${conversationId}/send`,
    body: JSON.stringify({ content }),
  });
}

export function formatMessageMeta(m: ChatMessage, mine: boolean): string {
  const d = new Date(m.sentAt);
  const time = d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const who = mine ? "You" : m.senderName.split(" ")[0];
  return `${who} · ${time}`;
}
