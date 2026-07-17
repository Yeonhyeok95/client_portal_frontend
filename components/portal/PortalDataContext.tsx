"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import type { Client } from "@stomp/stompjs";
import {
  createChatClient,
  fetchUnread,
  markConversationRead,
  type ChatMessage,
} from "@/lib/chat";
import { fetchPortfolio, type Portfolio } from "@/lib/portfolio";
import { getUser } from "@/lib/portalAuth";

type PortalDataContextValue = {
  masked: boolean;
  toggleMasked: () => void;
  /** 실제 서버 데이터 기반 안읽음 수 (WS로 실시간 갱신). */
  unreadCount: number;
  markMessagesRead: () => void;
  /** 포털 전체가 공유하는 STOMP 연결 — messages 페이지도 이걸 쓴다. */
  chatClient: Client | null;
  chatConnected: boolean;
  conversationId: number | null;
  downloaded: Record<string, boolean>;
  markDownloaded: (name: string) => void;
  portfolio: Portfolio | null;
  portfolioError: string;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [masked, setMasked] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [chatConnected, setChatConnected] = useState(false);
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [portfolioError, setPortfolioError] = useState("");
  const chatClientRef = useRef<Client | null>(null);
  // 구독 콜백은 생성 시점의 값을 기억하므로(stale closure) 현재 경로는 ref로 읽는다
  const onMessagesPageRef = useRef(false);

  useEffect(() => {
    onMessagesPageRef.current = pathname.startsWith("/portal/messages");
  }, [pathname]);

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

  useEffect(() => {
    // 채팅(배지 포함)은 고객 전용 — 상담사는 이 레이아웃을 쓰지 않지만 방어적으로 확인
    if (getUser()?.role !== "CLIENT") return;
    let cancelled = false;
    let stomp: Client | null = null;

    fetchUnread()
      .then(({ conversationId: convId, unreadCount: count }) => {
        if (cancelled) return;
        setConversationId(convId);
        setUnreadCount(count);

        stomp = createChatClient();
        stomp.onConnect = () => {
          setChatConnected(true);
          // 재연결 때도 onConnect가 다시 불리므로 구독이 자동 복구된다
          stomp?.subscribe(`/topic/conversations/${convId}`, (frame) => {
            const incoming = JSON.parse(frame.body) as ChatMessage;
            if (incoming.senderRole !== "ADVISOR") return; // 내 메시지는 배지 대상 아님
            if (onMessagesPageRef.current) {
              // 메시지 화면을 보는 중 — 즉시 읽음 처리, 배지 안 켬
              markConversationRead(convId);
            } else {
              setUnreadCount((prev) => prev + 1);
            }
          });
        };
        stomp.onDisconnect = () => setChatConnected(false);
        stomp.onWebSocketClose = () => setChatConnected(false);
        stomp.activate();
        chatClientRef.current = stomp;
      })
      .catch(() => {
        // 배지는 부가 기능 — 실패해도 포털 사용에는 지장 없음
      });

    return () => {
      cancelled = true;
      stomp?.deactivate();
      chatClientRef.current = null;
      setChatConnected(false);
    };
  }, []);

  function markMessagesRead() {
    setUnreadCount(0);
    if (conversationId != null) markConversationRead(conversationId);
  }

  return (
    <PortalDataContext.Provider
      value={{
        masked,
        toggleMasked: () => setMasked((m) => !m),
        unreadCount,
        markMessagesRead,
        chatClient: chatClientRef.current,
        chatConnected,
        conversationId,
        downloaded,
        markDownloaded: (name) =>
          setDownloaded((prev) => ({ ...prev, [name]: true })),
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
