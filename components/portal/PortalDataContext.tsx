"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchPortfolio, type Portfolio } from "@/lib/portfolio";

type PortalDataContextValue = {
  masked: boolean;
  toggleMasked: () => void;
  unread: boolean;
  markMessagesRead: () => void;
  downloaded: Record<string, boolean>;
  markDownloaded: (name: string) => void;
  portfolio: Portfolio | null;
  portfolioError: string;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [masked, setMasked] = useState(false);
  const [unread, setUnread] = useState(true);
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
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
