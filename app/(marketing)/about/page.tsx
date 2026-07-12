import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PartnersShowcase from "@/components/PartnersShowcase";

export const metadata: Metadata = {
  title: "About — TSAPtest Private Wealth",
};

const principles = [
  {
    title: "Discretion",
    body: "Client affairs are discussed with no one. The firm does not publish client names, and never will.",
  },
  {
    title: "Independence",
    body: "Employee-owned and free of product relationships. Advice is the only thing the firm sells.",
  },
  {
    title: "Stewardship",
    body: "Capital is treated as something held in trust for the next generation, because it usually is.",
  },
];

const partners = [
  {
    initials: "NT",
    name: "Nigel TSA",
    photo: "/partners/tedBear.png",
    role: "Senior Adviser",
    creds: "MAppFin(CFA&WM) BEc(Fin&FinEc) AdvDipFS(FP) DipFS(FP).",
    bio: "testestesetawefawefaefasef.",
  },
  {
    initials: "AA",
    name: "Aaaa Aaaa",
    role: "Chief Investment Officer",
    creds: "24 years in practice",
    bio: "hahahah\nahhaahh\nahahah\nasdfasdf",
  },
  {
    initials: "BB",
    name: "Bbbb Bbbb",
    role: "Partner, Client Advisory",
    creds: "50 years in practice",
    bio: "asdf\nasdfasdf\nasdf\n",
  },
  {
    initials: "CC",
    name: "Cccc Cccc",
    role: "Partner, Trusts & Estates",
    creds: "100 years in practice",
    bio: "asdf\nasdfasdf\nasdf\n",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero eyebrow="About the firm" title="Built to be small" />

      <div className="max-w-[820px] mx-auto px-6 sm:px-10 pt-20 pb-16">
        <p className="text-lg leading-[1.75] text-ink">
          TSAPtest was founded in 2001 by three advisors who left larger institutions with the same
          conviction: that private wealth is served best by a firm with no products to sell and few
          enough clients to know each one well. Twenty-five years later the firm remains
          employee-owned, fee-only, and deliberately limited in size. Growth, where it happens,
          comes by referral.
        </p>
        <p className="mt-5.5 text-base leading-[1.75] text-body">
          The practice serves a limited number of families, most of whom have been clients for more
          than a decade. Advisors carry no sales targets. The measure of the firm is whether a
          family&apos;s affairs are in order — nothing else.
        </p>
      </div>

      <div className="bg-offwhite px-6 sm:px-10 py-16">
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {principles.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.07)] py-10 px-8 sm:px-2"
            >
              <h3 className="text-xl font-bold text-navy">{p.title}</h3>
              <p className="mt-3 text-sm leading-[1.6] text-body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 sm:px-10 pt-20 pb-[90px]">
        <div className="text-center mb-12">
          <div className="text-sm font-bold tracking-[2px] text-blue uppercase">Team</div>
          <h2 className="mt-3.5 text-[32px] sm:text-[40px] font-bold text-navy">The partners</h2>
        </div>
        <PartnersShowcase partners={partners} />
      </div>
    </div>
  );
}
