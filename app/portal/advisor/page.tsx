"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@stomp/stompjs";
import {
  createChatClient,
  fetchConversations,
  fetchThread,
  formatMessageMeta,
  sendChatMessage,
  type ChatMessage,
  type ConversationSummary,
} from "@/lib/chat";
import { clearAuthState, getAuthState, getUser } from "@/lib/portalAuth";

export default function AdvisorPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [thread, setThread] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const clientRef = useRef<Client | null>(null);
  const selectedIdRef = useRef<number | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (getAuthState() === "signedin" && getUser()?.role === "ADVISOR") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthorized(true);
    } else {
      router.replace("/portal/login");
    }
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;

    fetchConversations()
      .then((list) => {
        if (cancelled) return;
        setConversations(list);
        if (list.length > 0) selectConversation(list[0].id);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load conversations. Please try again shortly.");
        }
      });

    const stomp = createChatClient();
    stomp.onConnect = () => {
      // 상담사는 전용 토픽 하나로 모든 대화방의 새 메시지를 받는다
      stomp.subscribe("/topic/advisor", (frame) => {
        const incoming = JSON.parse(frame.body) as ChatMessage;
        setConversations((prev) =>
          prev.map((c) =>
            c.id === incoming.conversationId
              ? { ...c, lastMessage: incoming.content, lastMessageAt: incoming.sentAt }
              : c,
          ),
        );
        if (incoming.conversationId === selectedIdRef.current) {
          setThread((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
          );
        }
      });
    };
    stomp.activate();
    clientRef.current = stomp;

    return () => {
      cancelled = true;
      stomp.deactivate();
      clientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [thread]);

  function selectConversation(id: number) {
    setSelectedId(id);
    selectedIdRef.current = id;
    setThread([]);
    fetchThread(id)
      .then(setThread)
      .catch(() => setError("Unable to load this conversation."));
  }

  function send() {
    const text = draft.trim();
    const client = clientRef.current;
    if (!text || !client || !client.connected || selectedId == null) return;
    sendChatMessage(client, selectedId, text);
    setDraft("");
  }

  function signOut() {
    clearAuthState();
    router.push("/portal/login");
  }

  if (!authorized) return null;

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className="min-h-screen">
      <div className="px-6 sm:px-10 pt-5">
        <div className="max-w-[1280px] mx-auto bg-navy rounded-[34px] min-h-[60px] flex flex-wrap items-center justify-between gap-3 py-2 pl-7 pr-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-bold text-[19px] text-white">TSAPtest</span>
            <span className="text-[11px] font-semibold tracking-[1.4px] text-white/45 uppercase">
              Advisor desk
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="text-[13px] font-semibold text-white">
              {getUser()?.name}
            </span>
            <button
              onClick={signOut}
              className="cursor-pointer text-xs font-bold text-white/55 px-3"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
        <h1 className="text-[26px] sm:text-[30px] font-bold text-navy mb-5">
          Client conversations
        </h1>
        {error && (
          <div className="mb-4 text-[13px] font-semibold text-red">{error}</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-5 items-start">
          <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            {conversations.length === 0 && (
              <div className="py-8 px-6 text-[13px] font-semibold text-muted">
                No conversations yet.
              </div>
            )}
            {conversations.map((c) => {
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`cursor-pointer w-full text-left py-4 px-5.5 border-b border-[rgb(237,237,237)] last:border-b-0 ${
                    active ? "bg-offwhite" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-sm font-bold text-navy">
                      {c.clientName}
                    </span>
                    <span className="text-[11px] font-semibold text-muted whitespace-nowrap">
                      {new Date(c.lastMessageAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-body mt-1 truncate">
                    {c.lastMessage || "No messages yet"}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="py-4.5 px-6.5 border-b border-[rgb(237,237,237)]">
              <div className="text-sm font-bold text-navy">
                {selected ? selected.clientName : "Select a conversation"}
              </div>
              {selected && (
                <div className="text-xs font-semibold text-muted mt-0.5">
                  {selected.clientEmail}
                </div>
              )}
            </div>
            <div className="p-6.5 flex flex-col gap-4 min-h-[360px] max-h-[520px] overflow-y-auto">
              {thread.map((m) => {
                const mine = m.senderRole === "ADVISOR";
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
                placeholder={
                  selected ? `Reply to ${selected.clientName}` : "Select a conversation first"
                }
                disabled={!selected}
                className="flex-1 h-12 border border-line rounded-[5px] bg-white px-4 font-sans text-[13.5px] text-navy outline-none disabled:opacity-50"
              />
              <button
                onClick={send}
                className="cursor-pointer bg-blue rounded-[5px] px-6.5 flex items-center text-[13px] font-bold text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
