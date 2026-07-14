"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChatClient,
  fetchMyConversation,
  formatMessageMeta,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/chat";
import type { Client } from "@stomp/stompjs";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const clientRef = useRef<Client | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let stomp: Client | null = null;

    fetchMyConversation()
      .then((conv) => {
        if (cancelled) return;
        setConversationId(conv.conversationId);
        setMessages(conv.messages);

        stomp = createChatClient();
        stomp.onConnect = () => {
          stomp?.subscribe(`/topic/conversations/${conv.conversationId}`, (frame) => {
            const incoming = JSON.parse(frame.body) as ChatMessage;
            setMessages((prev) =>
              prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
            );
          });
        };
        stomp.activate();
        clientRef.current = stomp;
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load messages. Please try again shortly.");
        }
      });

    return () => {
      cancelled = true;
      stomp?.deactivate();
      clientRef.current = null;
    };
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  function send() {
    const text = draft.trim();
    const client = clientRef.current;
    if (!text || !client || !client.connected || conversationId == null) return;
    sendChatMessage(client, conversationId, text);
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
