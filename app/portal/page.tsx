"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthState } from "@/lib/portalAuth";

export default function PortalEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuthState();
    if (auth === "signedin") router.replace("/portal/dashboard");
    else if (auth === "twofa") router.replace("/portal/verify");
    else router.replace("/portal/login");
  }, [router]);

  return null;
}
