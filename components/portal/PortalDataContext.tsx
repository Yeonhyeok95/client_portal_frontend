"use client";

import { createContext, useContext, useRef, useState } from "react";
import { initialMessages, type PortalMessage } from "@/lib/portalData";

type PortalDataContextValue = {
  masked: boolean;
  toggleMasked: () => void;
  unread: boolean;
  markMessagesRead: () => void;
  downloaded: Record<string, boolean>;
  markDownloaded: (name: string) => void;
  messages: PortalMessage[];
  draft: string;
  setDraft: (v: string) => void;
  sendMessage: () => void;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [masked, setMasked] = useState(false);
  const [unread, setUnread] = useState(true);
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<PortalMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { who: "me", text, meta: "You · Just now" }]);
    setDraft("");
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          who: "advisor",
          text: "Thank you — received. I will review and come back to you shortly.",
          meta: "Marcus · Just now",
        },
      ]);
    }, 1400);
  }

  return (
    <PortalDataContext.Provider
      value={{
        masked,
        toggleMasked: () => setMasked((m) => !m),
        unread,
        markMessagesRead: () => setUnread(false),
        downloaded,
        markDownloaded: (name) =>
          setDownloaded((prev) => ({ ...prev, [name]: true })),
        messages,
        draft,
        setDraft,
        sendMessage,
      }}
    >
      {children}
    </PortalDataContext.Provider>
  );
}

export function usePortalData() {
  const ctx = useContext(PortalDataContext);
  if (!ctx) {
    throw new Error("usePortalData must be used within PortalDataProvider");
  }
  return ctx;
}
