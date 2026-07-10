import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — TSAPtest Private Wealth",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { intent } = await searchParams;
  const initialMessage = intent === "account" ? `Request for Account Creation.\nReason: ` : "";

  return (
    <div>
      <PageHero eyebrow="Contact" title="Request an introduction" />

      <div className="max-w-[1120px] mx-auto px-6 sm:px-10 pt-16 pb-[90px] grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-14 items-start">
        <ContactForm initialMessage={initialMessage} />

        <div className="flex flex-col gap-5">
          <div className="bg-navy rounded-[10px] py-8 px-7 text-white">
            <h3 className="text-base font-bold">New York</h3>
            <p className="mt-2.5 text-[13px] leading-[1.7] text-white/70">
              640 Madison Avenue, 21st Floor
              <br />
              New York, NY 10022
            </p>
          </div>
          <div className="bg-offwhite rounded-[10px] py-8 px-7">
            <h3 className="text-base font-bold text-navy">By telephone</h3>
            <p className="mt-2.5 text-[13px] leading-[1.7] text-body">
              +1 212 555 0148
              <br />
              Weekdays, 8:00–18:00 ET
            </p>
          </div>
          <div className="bg-offwhite rounded-[10px] py-8 px-7">
            <h3 className="text-base font-bold text-navy">Existing clients</h3>
            <p className="mt-2.5 text-[13px] leading-[1.7] text-body">
              Please use the client portal for account matters and secure correspondence.
            </p>
            <Link
              href="/portal"
              className="inline-block mt-3 text-[13px] font-bold text-blue no-underline"
            >
              Go to client portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
