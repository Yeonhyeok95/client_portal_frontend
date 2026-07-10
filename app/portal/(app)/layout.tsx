"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthState } from "@/lib/portalAuth";
import { PortalDataProvider } from "@/components/portal/PortalDataContext";
import PortalNav from "@/components/portal/PortalNav";

export default function PortalAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // sessionStorage is only readable client-side, so the signed-in check
    // can't happen during the server render — this effect is the earliest
    // safe point, and gating `children` on its result avoids ever painting
    // protected content before authorization is confirmed.
    if (getAuthState() === "signedin") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthorized(true);
    } else {
      router.replace("/portal/login");
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <PortalDataProvider>
      <PortalNav />
      {children}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pb-7 flex justify-between text-[11px] text-muted">
        <span>© 2026 TSAPtest Private Wealth LLC · Values shown net of fees</span>
        <Link href="/" className="text-body font-semibold no-underline">
          tsaptest.com
        </Link>
      </div>
    </PortalDataProvider>
  );
}
