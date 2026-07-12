"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { initialMessages, type PortalMessage } from "@/lib/portalData";
import { fetchPortfolio, type Portfolio } from "@/lib/portfolio";

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
  portfolio: Portfolio | null;
  portfolioError: string;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [masked, setMasked] = useState(false);
  const [unread, setUnread] = useState(true);
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<PortalMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [portfolioError, setPortfolioError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio()
      .then((data) => {
        if (!cancelled) setPortfolio(data);
      })
      .catch(() => {
        if (!cancelled) {
          setPortfolioError(
            "Unable to load portfolio data. Please try again shortly.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
        portfolio,
        portfolioError,
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
