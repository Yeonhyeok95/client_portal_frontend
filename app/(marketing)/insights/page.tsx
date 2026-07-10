import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InsightsGrid from "@/components/InsightsGrid";

export const metadata: Metadata = {
  title: "Insights — TSAPtest Private Wealth",
};

export default function InsightsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Insights"
        title="Writing for clients, shared openly"
      />
      <div className="max-w-[1120px] mx-auto px-6 sm:px-10 pt-16 pb-[90px]">
        <InsightsGrid />
      </div>
    </div>
  );
}
