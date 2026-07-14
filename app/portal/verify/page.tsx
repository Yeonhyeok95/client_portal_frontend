"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  getAuthState,
  getMaskedEmail,
  getUser,
  resendCode,
  verifyCode,
} from "@/lib/portalAuth";

function homeForRole(): string {
  return getUser()?.role === "ADVISOR" ? "/portal/advisor" : "/portal/dashboard";
}

export default function PortalVerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");

  useEffect(() => {
    const auth = getAuthState();
    if (auth === "signedin") router.replace(homeForRole());
    else if (auth === "none") router.replace("/portal/login");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setMaskedEmail(getMaskedEmail());
  }, [router]);

  async function doVerify() {
    if (pending) return;
    if (code.replace(/\D/g, "").length !== 6) {
      setError("Please enter the six-digit code.");
      return;
    }
    setPending(true);
    const result = await verifyCode(code);
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push(homeForRole());
  }

  async function doResend() {
    setError("");
    setNotice("");
    if (await resendCode()) {
      setNotice("A new code has been sent.");
    } else {
      setError("Could not send a new code. Please sign in again.");
    }
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
        <div className="bg-white rounded-[10px] shadow-[0_6px_24px_rgba(0,0,0,0.07)] py-10.5 px-10 text-center">
          <div className="w-13 h-13 rounded-full bg-blue/10 text-blue flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M 8 10 V 7 a 4 4 0 0 1 8 0 v 3"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-navy">Verify it is you</h1>
          <p className="mt-2.5 mb-6.5 text-[13px] leading-[1.6] text-body">
            A six-digit code was sent to{" "}
            <strong className="text-navy">{maskedEmail || "your email"}</strong>.
          </p>
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && doVerify()}
            maxLength={6}
            placeholder="000000"
            className="w-full h-[62px] border border-line rounded-[5px] bg-offwhite-2 text-center font-sans text-[28px] font-bold tracking-[12px] text-navy outline-none"
          />
          {error && (
            <div className="mt-3 text-[13px] font-semibold text-red">
              {error}
            </div>
          )}
          {notice && (
            <div className="mt-3 text-[13px] font-semibold text-green">
              {notice}
            </div>
          )}
          <div
            className="mt-5"
            style={{ opacity: code.length === 6 ? 1 : 0.45 }}
          >
            <Button
              onClick={doVerify}
              disabled={pending}
              className="w-full justify-center"
            >
              {pending ? "Verifying…" : "Verify and sign in"}
            </Button>
          </div>
          <button
            onClick={doResend}
            className="mt-4.5 text-[13px] font-semibold text-blue cursor-pointer bg-transparent border-0 p-0"
          >
            Send a new code
          </button>
        </div>
        <div className="text-center mt-5.5 text-xs text-muted">
          Demo: the code is delivered to the firm&apos;s admin inbox.
        </div>
      </div>
    </div>
  );
}
