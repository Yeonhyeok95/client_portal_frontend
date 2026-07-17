"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchMyConversation,
  fetchThread,
  formatMessageMeta,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/chat";
import { usePortalData } from "@/components/portal/PortalDataContext";

export default function MessagesPage() {
  // WS 연결은 PortalDataContext가 소유(배지와 공유) — 이 페이지는 빌려 쓴다
  const { chatClient, chatConnected, markMessagesRead } = usePortalData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    let cancelled = false;
    fetchMyConversation()
      .then((conv) => {
        if (cancelled) return;
        setConversationId(conv.conversationId);
        setMessages(conv.messages);
        setHasMore(conv.hasMore);
        markMessagesRead(); // 최신 페이지를 봤으니 읽음 처리 + 배지 소등
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load messages. Please try again shortly.");
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 실시간 수신: 컨텍스트의 연결이 준비된 뒤 이 화면 전용 구독을 하나 더 얹는다.
  // (컨텍스트의 배지 구독과 별개 — 같은 연결의 다중 구독은 STOMP에서 정상)
  useEffect(() => {
    if (!chatConnected || !chatClient || conversationId == null) return;
    const subscription = chatClient.subscribe(
      `/topic/conversations/${conversationId}`,
      (frame) => {
        const incoming = JSON.parse(frame.body) as ChatMessage;
        setMessages((prev) =>
          prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
        );
        if (incoming.senderRole === "ADVISOR") markMessagesRead();
      },
    );
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatConnected, chatClient, conversationId]);

  useEffect(() => {
    if (stickToBottomRef.current) {
      threadEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages]);

  function loadEarlier() {
    if (conversationId == null || messages.length === 0 || loadingEarlier) return;
    setLoadingEarlier(true);
    stickToBottomRef.current = false; // 과거를 보는 중 — 맨 아래로 끌어내리지 않는다
    fetchThread(conversationId, messages[0].id)
      .then((page) => {
        setMessages((prev) => [...page.messages, ...prev]);
        setHasMore(page.hasMore);
      })
      .catch(() => setError("Unable to load earlier messages."))
      .finally(() => setLoadingEarlier(false));
  }

  function send() {
    const text = draft.trim();
    if (!text || !chatClient || !chatConnected || conversationId == null) return;
    stickToBottomRef.current = true;
    sendChatMessage(chatClient, conversationId, text);
    setDraft("");
  }

  return (
    <div className="max-w-[880px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
      <div className="flex justify-between items-end mb-5 gap-3">
        <h1 className="text-[26px] sm:text-[30px] font-bold text-navy">
          Secure messages
        </h1>
        <div className="flex items-center gap-2 text-xs font-semibold text-green">
          <span className="w-2 h-2 rounded-full bg-green inline-block" />
          Encrypted channel
        </div>
      </div>

      <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center gap-3.5 py-4.5 px-6.5 border-b border-[rgb(237,237,237)]">
          <div className="w-10.5 h-10.5 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center">
            MB
          </div>
          <div>
            <div className="text-sm font-bold text-navy">
              Marcus Bell, CFP®
            </div>
            <div className="text-xs font-semibold text-body">
              Partner, Client Advisory · Replies within one business day
            </div>
          </div>
        </div>
        <div className="p-6.5 flex flex-col gap-4 min-h-[320px] max-h-[480px] overflow-y-auto">
          {error && (
            <div className="text-[13px] font-semibold text-red">{error}</div>
          )}
          {hasMore && (
            <button
              onClick={loadEarlier}
              disabled={loadingEarlier}
              className="cursor-pointer self-center text-xs font-bold text-blue bg-offwhite rounded-full px-4 py-2 disabled:opacity-50"
            >
              {loadingEarlier ? "Loading…" : "Load earlier messages"}
            </button>
          )}
          {messages.map((m) => {
            const mine = m.senderRole === "CLIENT";
            return (
              <div
                key={m.id}
                className="flex flex-col"
                style={{ alignItems: mine ? "flex-end" : "flex-start" }}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[68%] rounded-xl py-3.5 px-4.5 text-[13.5px] leading-[1.55] ${
                    mine ? "bg-navy text-white" : "bg-offwhite text-ink"
                  }`}
                >
                  {m.content}
                </div>
                <div className="text-[11px] font-semibold text-muted mt-1.5">
                  {formatMessageMeta(m, mine)}
                </div>
              </div>
            );
          })}
          <div ref={threadEndRef} />
        </div>
        <div className="flex gap-3 py-4.5 px-6.5 border-t border-[rgb(237,237,237)] bg-offwhite">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Write a message — sent over the firm's secure channel"
            className="flex-1 h-12 border border-line rounded-[5px] bg-white px-4 font-sans text-[13.5px] text-navy outline-none"
          />
          <button
            onClick={send}
            className="cursor-pointer bg-blue rounded-[5px] px-6.5 flex items-center text-[13px] font-bold text-white"
          >
            Send
          </button>
        </div>
      </div>
      <div className="mt-3.5 text-xs text-muted">
        For urgent matters please call the advisory line: +1 212 555 0148.
      </div>
    </div>
  );
}
