"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Partner = {
  initials: string;
  name: string;
  role: string;
  creds: string;
  bio: string;
  photo?: string;
};

function PartnerAvatar({ partner, size }: { partner: Partner; size: "grid" | "card" }) {
  const sizeClasses =
    size === "grid" ? "w-[110px] h-[110px] text-[30px]" : "w-[92px] h-[92px] text-[26px]";
  if (partner.photo) {
    return (
      <img
        src={partner.photo}
        alt={partner.name}
        className={`${sizeClasses} rounded-full object-cover mx-auto`}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses} rounded-full bg-navy text-white font-bold flex items-center justify-center mx-auto`}
    >
      {partner.initials}
    </div>
  );
}

export default function PartnersShowcase({ partners }: { partners: Partner[] }) {
  const [selected, setSelected] = useState<Partner | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {partners.map((p) => (
          <motion.button
            key={p.initials}
            type="button"
            onClick={() => setSelected(p)}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center cursor-pointer flex flex-col items-center justify-start"
          >
            <div className="mb-4.5">
              <PartnerAvatar partner={p} size="grid" />
            </div>
            <h3 className="text-base font-bold text-navy">{p.name}</h3>
            <div className="text-[13px] font-semibold text-blue mt-1.5">{p.role}</div>
            <div className="text-xs text-body mt-1.5">{p.creds}</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          /* Clicking anywhere — backdrop or the card itself — closes it. */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-navy/30 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full max-w-[440px] bg-white rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] py-11 px-9 text-center"
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-body hover:bg-offwhite cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M 1 1 L 13 13 M 13 1 L 1 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <PartnerAvatar partner={selected} size="card" />
              <h3 className="mt-5 text-[22px] font-bold text-navy">{selected.name}</h3>
              <div className="text-sm font-semibold text-blue mt-1.5">{selected.role}</div>
              <div className="text-xs text-body mt-1.5">{selected.creds}</div>
              <p className="mt-5 text-sm leading-[1.7] text-body text-left whitespace-pre-line">{selected.bio}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
