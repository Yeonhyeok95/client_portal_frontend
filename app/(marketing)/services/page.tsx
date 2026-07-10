import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Services — TSAPtest Private Wealth",
};

const disciplines = [
  {
    n: "01",
    title: "Investment management",
    body: "Discretionary portfolios of listed securities, funds, and where appropriate, private holdings. Rebalanced against a written policy; reported plainly, after all fees.",
  },
  {
    n: "02",
    title: "Financial planning",
    body: "Cash-flow, retirement, and liquidity planning across entities and generations — revisited annually, and whenever life changes faster than the calendar.",
  },
  {
    n: "03",
    title: "Estate and trust",
    body: "Design and upkeep of wills, trusts, and beneficiary structures, coordinated with the family's own counsel and kept aligned as law and circumstance move.",
  },
  {
    n: "04",
    title: "Tax strategy",
    body: "Asset location, loss harvesting, realization timing, and entity selection — executed with the family's accountants, not around them.",
  },
  {
    n: "05",
    title: "Philanthropy",
    body: "Donor-advised funds, private foundations, and charitable trusts — structured so generosity is durable and administratively light.",
  },
  {
    n: "06",
    title: "Family governance",
    body: "Family meetings, education for rising generations, and the quiet work of preparing heirs for wealth rather than wealth for heirs.",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageHero eyebrow="Services" title="Six disciplines, one relationship" />

      <div className="max-w-[1120px] mx-auto px-6 sm:px-10 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {disciplines.map((d) => (
            <div
              key={d.n}
              className="bg-white border border-line rounded-[10px] py-9 px-9"
            >
              <div className="flex items-baseline gap-4.5">
                <span className="text-[30px] font-bold text-blue">{d.n}</span>
                <h3 className="text-2xl font-bold text-navy">{d.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-[1.65] text-body">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-offwhite px-6 sm:px-10 py-20">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-[32px] sm:text-[40px] font-bold text-navy">
            How we charge
          </h2>
          <p className="mx-auto mt-4.5 max-w-[620px] text-base leading-[1.65] text-body">
            A single advisory fee, stated in writing, assessed on assets under
            advisement. No commissions, no product revenue, no referral
            arrangements. The fee is the entire compensation.
          </p>
          <div className="inline-flex mt-8">
            <Button href="/contact" variant="filled" size="md">
              Discuss an engagement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
