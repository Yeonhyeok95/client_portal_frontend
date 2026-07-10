import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-navy px-6 sm:px-10 pt-16 mt-5">
      <div className="max-w-[1120px] mx-auto grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-14">
        <div>
          <div className="font-bold text-[22px] text-white">TSAPtest</div>
          <p className="mt-3.5 max-w-[280px] text-[13px] leading-[1.65] text-white/55">
            Independent, fee-only private wealth management for individuals
            and families of significant means.
          </p>
        </div>
        <div>
          <div className="text-[13px] font-bold tracking-[1px] text-white/45 uppercase mb-4">
            Firm
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/about" className="text-sm font-semibold text-white no-underline">
              About
            </Link>
            <Link href="/insights" className="text-sm font-semibold text-white no-underline">
              Insights
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-white no-underline">
              Contact
            </Link>
          </div>
        </div>
        <div>
          <div className="text-[13px] font-bold tracking-[1px] text-white/45 uppercase mb-4">
            Services
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/services" className="text-sm font-semibold text-white no-underline">
              Investment management
            </Link>
            <Link href="/services" className="text-sm font-semibold text-white no-underline">
              Estate and trust
            </Link>
            <Link href="/services" className="text-sm font-semibold text-white no-underline">
              Tax strategy
            </Link>
          </div>
        </div>
        <div>
          <div className="text-[13px] font-bold tracking-[1px] text-white/45 uppercase mb-4">
            Clients
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/portal" className="text-sm font-semibold text-white no-underline">
              Client portal
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-white no-underline">
              Request an introduction
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="max-w-[1120px] mx-auto py-6 flex flex-col sm:flex-row justify-between gap-6 text-[11px] leading-[1.6] text-white/40">
          <span>
            © 2026 TSAPtest Private Wealth LLC. Investment advisory services
            offered through a registered investment adviser. Past performance
            is not indicative of future results.
          </span>
          <span className="whitespace-nowrap">Form ADV · Privacy</span>
        </div>
      </div>
    </div>
  );
}
