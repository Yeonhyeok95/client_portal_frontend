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
};

export type MyConversation = {
  conversationId: number;
  messages: ChatMessage[];
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

export function fetchConversations(): Promise<ConversationSummary[]> {
  return authedGet("/api/chat/conversations");
}

export function fetchThread(conversationId: number): Promise<ChatMessage[]> {
  return authedGet(`/api/chat/conversations/${conversationId}/messages`);
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
