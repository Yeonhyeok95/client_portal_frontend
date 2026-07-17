"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePortalData } from "./PortalDataContext";
import { clearAuthState, getUser } from "@/lib/portalAuth";

const TABS = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "Holdings", href: "/portal/holdings" },
  { label: "Documents", href: "/portal/documents" },
  { label: "Messages", href: "/portal/messages" },
];

export default function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { masked, toggleMasked, unreadCount, markMessagesRead } = usePortalData();

  const userName = getUser()?.name ?? "";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function signOut() {
    clearAuthState();
    router.push("/portal/login");
  }

  return (
    <div className="px-6 sm:px-10 pt-5">
      <div className="max-w-[1280px] mx-auto bg-navy rounded-[34px] min-h-[60px] flex flex-wrap items-center justify-between gap-3 py-2 pl-7 pr-3.5">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="flex items-baseline gap-2.5">
            <span className="font-bold text-[19px] text-white">TSAPtest</span>
            <span className="text-[11px] font-semibold tracking-[1.4px] text-white/45 uppercase">
              Portal
            </span>
          </div>
          <nav className="flex gap-1.5 flex-wrap">
            {TABS.map((tab) => {
              const active = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => {
                    if (tab.href === "/portal/messages") markMessagesRead();
                  }}
                  className={`px-4.5 py-2 rounded-full text-[13px] font-bold tracking-[0.2px] no-underline flex items-center gap-2 ${
                    active ? "bg-white text-navy" : "bg-transparent text-white/75"
                  }`}
                >
                  {tab.label}
                  {tab.href === "/portal/messages" && unreadCount > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-blue text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3.5">
          <button
            onClick={toggleMasked}
            title="Hide values"
            aria-label="Toggle value masking"
            className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center bg-white/8 ${
              masked ? "text-blue" : "text-white/70"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M 2 12 C 4.5 7 8 4.5 12 4.5 C 16 4.5 19.5 7 22 12 C 19.5 17 16 19.5 12 19.5 C 8 19.5 4.5 17 2 12 Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5 bg-white/8 rounded-full py-[5px] pr-4 pl-[5px]">
            <div className="w-[34px] h-[34px] rounded-full bg-blue text-white text-[13px] font-bold flex items-center justify-center">
              {initials}
            </div>
            <span className="text-[13px] font-semibold text-white">
              {userName}
            </span>
          </div>
          <button
            onClick={signOut}
            className="cursor-pointer text-xs font-bold text-white/55 px-3"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
