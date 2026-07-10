"use client";

import { useState } from "react";
import Button from "./Button";

export default function ContactForm({
  initialMessage = "",
}: {
  initialMessage?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState(initialMessage);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    if (!name.trim() || !email.trim() || email.indexOf("@") < 0) {
      setError("Please provide a name and a valid email address.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-offwhite rounded-[10px] py-16 px-12 text-center">
        <div className="w-14 h-14 rounded-full bg-green/12 text-green flex items-center justify-center mx-auto mb-5.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M 4 12.5 L 9.5 18 L 20 6.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-navy">Received, thank you</h3>
        <p className="mx-auto mt-3 max-w-[380px] text-sm leading-[1.6] text-body">
          A partner will reply within two business days from a personal
          address. No newsletters will follow.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-navy">Name *</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Full name"
            className="h-[50px] border border-line rounded-[5px] bg-offwhite-2 px-4.5 font-sans text-sm text-navy outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-navy">Email *</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="name@example.com"
            className="h-[50px] border border-line rounded-[5px] bg-offwhite-2 px-4.5 font-sans text-sm text-navy outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-navy">Telephone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Optional"
          className="h-[50px] border border-line rounded-[5px] bg-offwhite-2 px-4.5 font-sans text-sm text-navy outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-navy">
          What would you like to discuss?
        </label>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="A sentence or two is plenty."
          className="h-[140px] border border-line rounded-[5px] bg-offwhite-2 px-4.5 py-3.5 font-sans text-sm text-navy outline-none resize-y"
        />
      </div>
      <div className="text-xs leading-[1.5] text-body">
        Correspondence is held in confidence and is not added to any
        marketing list.
      </div>
      {error && (
        <div className="text-[13px] font-semibold text-red">{error}</div>
      )}
      <div className="self-start">
        <Button size="md" onClick={submit}>
          Send request
        </Button>
      </div>
    </div>
  );
}
