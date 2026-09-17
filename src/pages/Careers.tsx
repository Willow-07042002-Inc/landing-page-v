import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/components/LegalPage";

/* Careers — layout modeled on the hero → open positions → role detail →
   who-we-are pattern Aaron supplied (General Magic reference), rendered in
   Willow's design language: FCFCFD ground, serif light headings, teal
   accents, line-based rows instead of boxes. JD drafted from Willow context
   (no LinkedIn source text found) — swap wording freely. */

const APPLY_MAILTO =
  "mailto:aaronburlacoff@willow-inc.com?subject=Founding%20Attorney%20%E2%80%94%20Application";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-[#F0F9F9] px-3 py-1 text-[12.5px] font-medium text-[#0C7370]">{children}</span>
);

const SectionRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-3 border-t border-gray-200 py-10 md:grid-cols-[240px_1fr] md:gap-12 md:py-14">
    <h3 className="font-heading text-xl font-bold text-[#222222]">{label}</h3>
    <div className="space-y-4 text-base leading-relaxed text-gray-600">{children}</div>
  </div>
);

const Careers = () => {
  usePageMeta(
    "Careers | Willow",
    "Join Willow — we build the estate planning platform for attorneys and the clients they serve."
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />
      <main className="flex-grow pt-32 md:pt-36 pb-24">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Careers</div>
            <h1 className="font-heading text-3xl font-light text-[#222222] sm:text-4xl lg:text-[2.75rem]" style={{ lineHeight: 1.25 }}>
              Estate planning has run on paper for a century. We're rebuilding it.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] text-gray-500 md:text-base" style={{ lineHeight: 1.6 }}>
              Willow is the platform estate planning attorneys use to prepare, execute, and carry plans forward — and the place
              their clients actually understand them. Better tools for attorneys, better outcomes for families.
            </p>
            <Button
              size="lg"
              className="willow-btn mt-8 h-11 px-6 text-[15px] font-medium"
              onClick={() => document.getElementById("open-positions")?.scrollIntoView({ behavior: "smooth" })}
            >
              See open positions
            </Button>
          </div>

          {/* Open positions */}
          <div id="open-positions" className="mx-auto mt-20 max-w-3xl scroll-mt-28 md:mt-28">
            <h2 className="font-heading text-2xl font-bold text-[#222222] md:text-3xl">Open positions</h2>
            <a
              href="#founding-attorney"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("founding-attorney")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group mt-6 flex flex-col gap-3 border-t-2 border-[#222222] py-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-heading text-xl font-bold text-[#222222] transition-colors group-hover:text-[#128F8B]">
                Founding Attorney
              </span>
              <span className="flex flex-wrap items-center gap-2">
                <Chip>Full-time</Chip>
                <Chip>Remote</Chip>
                <span className="ml-1 hidden text-gray-400 transition-transform group-hover:translate-x-0.5 sm:block">&rarr;</span>
              </span>
            </a>
            <div className="border-t border-gray-200" />
          </div>

          {/* Role detail */}
          <div id="founding-attorney" className="mx-auto mt-20 max-w-3xl scroll-mt-28 md:mt-28">
            <h2 className="font-heading text-3xl font-light text-[#222222] sm:text-4xl" style={{ lineHeight: 1.2 }}>
              Founding Attorney
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-gray-600">
              Sit at the center of the product and the practice: shape how estate plans are prepared, executed, and understood
              on Willow.
            </p>
            <Button size="lg" className="willow-btn mt-6 h-11 px-6 text-[15px] font-medium" onClick={() => (window.location.href = APPLY_MAILTO)}>
              Apply now
            </Button>

            <div className="mt-12 space-y-10">
              <div>
                <h3 className="font-heading text-xl font-bold text-[#222222]">About the role</h3>
                <p className="mt-3 text-base leading-relaxed text-gray-600">
                  Willow is an end-to-end estate planning platform for attorneys — intake, drafting support, digital execution,
                  plain-English plan summaries, and lifelong document care, in one place. Attorneys stay the attorney of record;
                  we carry the administrative weight around their practice.
                </p>
                <p className="mt-3 text-base leading-relaxed text-gray-600">
                  We're hiring a founding attorney to be the practitioner inside the building. You'll shape what the product
                  does before a line of it ships: how documents are assembled, how signing ceremonies meet each state's
                  requirements, how a 40-page plan becomes a summary a family can actually follow, and where the line sits
                  between what software should do and what only a lawyer should.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#222222]">What you'll do</h3>
                <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-600">
                  <li>Review every attorney- and client-facing flow for legal accuracy, from intake through execution and beyond</li>
                  <li>Keep our signing and notarization workflows aligned with state execution requirements as they evolve</li>
                  <li>Work directly with our design-partner firms — hear what's broken in their practice and turn it into product</li>
                  <li>Own the wording of plan summaries, stipulations, and client-facing language across the platform</li>
                  <li>Help define what Willow will never do: no legal advice, no drafting judgment, no stepping between attorney and client</li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#222222]">What we're looking for</h3>
                <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-600">
                  <li>A licensed attorney in good standing with real trusts and estates experience — you've drafted, executed, and administered plans</li>
                  <li>A plain-English writer: you can turn statute into sentences a client's family understands</li>
                  <li>Genuine curiosity about software — you don't need to code, but you want to shape how it's built</li>
                  <li>Comfort with an early-stage pace: small team, direct access, decisions made in days rather than quarters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Who we are / How we work */}
          <div className="mx-auto mt-20 max-w-3xl md:mt-28">
            <SectionRow label="Who we are">
              <p>
                Willow is built by a small team working closely with the estate planning attorneys who use it — boutique trusts
                and estates firms who shape the product as design partners. We're guided by practitioners with decades in the
                field, and we ship quickly and deliberately.
              </p>
              <p>
                Our conviction is simple: the attorney-client relationship is the most valuable thing in estate planning, and
                the tools should strengthen it — never replace it.
              </p>
            </SectionRow>
            <SectionRow label="How we work">
              <p>
                Remote-first, writing-heavy, and low on ceremony. You'll work directly with the founder, and what you decide
                shows up in the product the same week. We handle what people would rather ignore — so we care about doing it
                carefully.
              </p>
            </SectionRow>
            <div className="border-t border-gray-200 pt-10 text-center md:pt-14">
              <p className="text-base text-gray-600">Think you're the right fit?</p>
              <Button size="lg" className="willow-btn mt-4 h-11 px-8 text-[15px] font-medium" onClick={() => (window.location.href = APPLY_MAILTO)}>
                Apply now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
