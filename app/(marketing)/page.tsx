import Link from "next/link";
import Button from "@/components/Button";
import HeroScrollIntro from "@/components/HeroScrollIntro";
import Icon from "@/components/Icon";
import NewsTeaser from "@/components/NewsTeaser";

const stats = [
  { value: "$4.2B", label: "Assets under advisement" },
  { value: "2001", label: "Independent since" },
  { value: "12:1", label: "Families per advisor" },
  { value: "97%", label: "Ten-year client retention" },
];

const services = [
  {
    icon: "invest" as const,
    title: "Investment management",
    body: "Globally diversified portfolios built around each family's objectives, constraints, and tolerance for drawdown.",
  },
  {
    icon: "estate" as const,
    title: "Estate and trust planning",
    body: "Structures that move wealth across generations deliberately, with counsel coordinated and documents kept current.",
  },
  {
    icon: "tax" as const,
    title: "Tax strategy",
    body: "Asset location, realization timing, and charitable structures that keep more of each return compounding.",
  },
];

const commitments = [
  {
    n: "01",
    title: "Listen first",
    body: "Every engagement begins with the family, not the portfolio — objectives, obligations, and the purposes the money serves.",
  },
  {
    n: "02",
    title: "Plan in writing",
    body: "A written investment policy governs every decision. Nothing is bought, sold, or restructured outside of it.",
  },
  {
    n: "03",
    title: "Steward, not sell",
    body: "A flat advisory fee and no commissions. The firm holds no products, earns no referral revenue, and answers only to clients.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      {/* -mt matches the sticky header's height so the image fills the
          viewport behind it */}
      <HeroScrollIntro image="/image.webp" className="-mt-[156px]">
      <div className="px-6 sm:px-10">
        <div className="max-w-[1280px] mx-auto bg-navy rounded-[20px] py-20 sm:py-[110px] px-8 sm:px-20 text-center">
          <div className="text-sm font-bold tracking-[2.4px] text-blue-tint uppercase mb-7">
            Private wealth management
          </div>
          <h1 className="mx-auto max-w-[760px] text-[38px] sm:text-[58px] font-bold leading-[1.15] text-white text-balance">
            Wealth, quietly managed
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] text-lg leading-[1.6] text-white/72">
            Discreet advisory and investment management for individuals and
            families of significant means. Independent, fee-only, and
            accountable to no one but the client.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center mt-10">
            <Button href="/contact" variant="filled" size="lg">
              Request an introduction
            </Button>
            <Link
              href="/services"
              className="inline-flex items-center justify-center border border-white/40 rounded-[5px] px-9 py-4 text-sm font-bold tracking-[0.2px] text-white no-underline"
            >
              Our services
            </Link>
          </div>
        </div>
      </div>
      </HeroScrollIntro>

      {/* Stats */}
      <div className="max-w-[1120px] mx-auto px-6 sm:px-10 pt-20 pb-[70px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-[32px] sm:text-[40px] font-bold text-navy">
                {s.value}
              </div>
              <div className="text-sm font-semibold text-body mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services preview */}
      <div className="bg-offwhite px-6 sm:px-10 py-20">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-[54px]">
            <div className="text-sm font-bold tracking-[2px] text-blue uppercase">
              What we do
            </div>
            <h2 className="mt-3.5 text-[32px] sm:text-[40px] font-bold text-navy">
              A narrow practice, done well
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.07)] py-9 px-8"
              >
                <div className="w-12 h-12 rounded-full bg-blue/10 text-blue flex items-center justify-center mb-5">
                  <Icon name={s.icon} size={22} />
                </div>
                <h3 className="text-xl font-bold text-navy">{s.title}</h3>
                <p className="mt-3 text-sm leading-[1.6] text-body">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-11">
            <Button href="/services" variant="outline" size="md">
              All services
            </Button>
          </div>
        </div>
      </div>

      {/* Approach */}
      <div className="max-w-[1120px] mx-auto px-6 sm:px-10 py-[90px]">
        <div className="grid grid-cols-1 sm:grid-cols-[380px_1fr] gap-[70px] items-start">
          <div>
            <div className="text-sm font-bold tracking-[2px] text-blue uppercase">
              How we work
            </div>
            <h2 className="mt-3.5 text-[32px] sm:text-[40px] font-bold leading-[1.2] text-navy text-balance">
              Three commitments, kept for decades
            </h2>
          </div>
          <div className="flex flex-col gap-9">
            {commitments.map((c) => (
              <div key={c.n} className="flex gap-6">
                <div className="text-[40px] font-bold text-line leading-none">
                  {c.n}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy">{c.title}</h3>
                  <p className="mt-2 text-sm leading-[1.6] text-body max-w-[520px]">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights preview — 실시간 뉴스 3건 (실패 시 섹션 자체를 숨김) */}
      <NewsTeaser />

      {/* CTA band */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-[90px]">
        <div className="text-center max-w-[620px] mx-auto">
          <h2 className="text-[32px] sm:text-[40px] font-bold text-navy">
            A conversation, in confidence
          </h2>
          <p className="mt-4 text-base leading-[1.6] text-body">
            Introductions are unhurried and without obligation. Most begin
            with a single meeting and a review of what is already in place.
          </p>
          <div className="inline-flex mt-8">
            <Button href="/contact" variant="filled" size="lg">
              Request an introduction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
