"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { getAuthState, getUser, login } from "@/lib/portalAuth";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const auth = getAuthState();
    if (auth === "signedin") {
      router.replace(
        getUser()?.role === "ADVISOR" ? "/portal/advisor" : "/portal/dashboard",
      );
    } else if (auth === "twofa") {
      router.replace("/portal/verify");
    }
  }, [router]);

  async function doLogin() {
    if (pending) return;
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setPending(true);
    const result = await login(email.trim(), password);
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/portal/verify");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-7.5">
          <div className="font-bold text-[26px] text-navy">TSAPtest</div>
          <div className="text-[13px] font-semibold tracking-[1.6px] text-body uppercase mt-1.5">
            Client portal
          </div>
        </div>
        <div className="bg-white rounded-[10px] shadow-[0_6px_24px_rgba(0,0,0,0.07)] py-10.5 px-10">
          <h1 className="text-2xl font-bold text-navy">Sign in</h1>
          <p className="mt-2 mb-6.5 text-[13px] leading-[1.5] text-body">
            Access is limited to clients of the firm.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-navy">Email</label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && doLogin()}
                placeholder="name@example.com"
                className="h-[50px] border border-line rounded-[5px] bg-offwhite-2 px-4 font-sans text-sm text-navy outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-navy">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && doLogin()}
                placeholder="••••••••••"
                className="h-[50px] border border-line rounded-[5px] bg-offwhite-2 px-4 font-sans text-sm text-navy outline-none"
              />
            </div>
            {error && (
              <div className="text-[13px] font-semibold text-red">
                {error}
              </div>
            )}
            <div className="mt-1">
              <Button
                onClick={doLogin}
                disabled={pending}
                className="w-full justify-center"
              >
                {pending ? "Signing in…" : "Continue"}
              </Button>
            </div>
            <div className="text-center text-[13px] font-semibold text-blue cursor-pointer">
              Forgotten password
            </div>
            <div className="mt-2 pt-5 border-t border-line text-center">
              <div className="text-[13px] text-body mb-3">
                Not yet a client?
              </div>
              <Button
                href="/contact?intent=account"
                variant="outline"
                size="sm"
                className="w-full justify-center"
              >
                Request an account
              </Button>
            </div>
          </div>
        </div>
        <div className="text-center mt-5.5 text-xs text-muted leading-[1.6]">
          Demo: client@tsaptest.com / PortalDemo!2026
          <br />
          <Link href="/" className="text-body font-semibold no-underline">
            Return to website
          </Link>
        </div>
      </div>
    </div>
  );
}
