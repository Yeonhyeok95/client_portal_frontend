"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(pathname === "/");

  // On the home page the header floats transparently over the hero image;
  // it turns solid once the image section has scrolled past.
  useEffect(() => {
    if (pathname !== "/") {
      setOverHero(false);
      return;
    }
    const onScroll = () => setOverHero(window.scrollY < window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <div
      className={`sticky top-0 z-50 px-6 sm:px-10 pt-6 pb-4 transition-colors duration-300 ${
        overHero ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="max-w-[1280px] h-8 mx-auto bg-navy rounded-[34px] sm:h-12 shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex items-center justify-between px-7 text-xs font-semibold text-white/60 tracking-[0.2px]">
        <div className="hidden sm:flex gap-6 items-center">
          <span>Advisory line +1 212 555 0148</span>
          <span className="text-white/30">·</span>
          <span>clients@tsaptest.com</span>
        </div>
        <Link href="/portal" className="text-white flex items-center gap-2 ml-auto no-underline">
          Client portal
          <svg width="8" height="12" viewBox="0 0 8 14" fill="none">
            <path d="M 0 12 L 5 7 L 0 2 L 1 0 L 8 7 L 1 14 L 0 12 Z" fill="currentColor" />
          </svg>
        </Link>
      </div>

      <div className="max-w-[1280px] mx-auto mt-2.5 bg-white rounded-[34px] h-12 sm:h-14  shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-between px-8 relative">
        <Link href="/" className="font-bold text-[22px] text-navy no-underline">
          TSAPtest
        </Link>
        <nav className="hidden lg:flex gap-7">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm tracking-[0.2px] no-underline ${
                  active ? "text-navy" : "text-body"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:block">
          <Button href="/contact" variant="pill" size="sm">
            Request an introduction
          </Button>
        </div>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
        >
          <span className="w-5 h-[2px] bg-navy" />
          <span className="w-5 h-[2px] bg-navy" />
          <span className="w-5 h-[2px] bg-navy" />
        </button>

        {open && (
          <div className="lg:hidden absolute top-[68px] left-0 right-0 bg-white rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.07)] p-6 flex flex-col gap-5 z-10">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-semibold text-sm tracking-[0.2px] no-underline ${
                    active ? "text-navy" : "text-body"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button href="/contact" variant="filled" size="sm" onClick={() => setOpen(false)}>
              Request an introduction
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
