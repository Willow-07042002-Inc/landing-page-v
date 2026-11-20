import React from "react";
import { ArrowRight } from "lucide-react";
import { PageShell, ClosingCta, SectionHead, WRAP, usePageMeta } from "@/components/site/blocks";

/* About Willow, set like harvey.ai's company page: the headline, the
   founder's vision, the two guiding principles, then the coverage. Press
   items link to the real articles. */

const PRESS = [
  {
    outlet: "Business Insider",
    logo: "/press-business-insider.svg",
    title: "$124 Trillion Is Changing Hands. Willow Announces Pilot to Prepare Estate-Planning Attorneys for the Next Generation",
    date: "September 15, 2026",
    href: "https://markets.businessinsider.com/news/currencies/124-trillion-is-changing-hands-willow-announces-pilot-to-prepare-estate-planning-attorneys-for-the-next-generation-1036548412",
  },
  {
    outlet: "USA Today",
    logo: "/press-usa-today.svg",
    title: "Digital Estate Planning Arrived Six Years Ago. The Technology Is Finally Catching Up.",
    date: "September 9, 2026",
    href: "https://www.usatoday.com/press-release/story/42659/digital-estate-planning-arrived-six-years-ago-the-technology-is-finally-catching-up/",
  },
];

/* Willow's two guiding principles, in Aaron's own words from his emails to
   attorneys (Nov 18 "Your feedback helped build Willow", the Saratoga
   follow-ups, the April one-liner and the Early Look emails) */
const BELIEFS = [
  {
    title: "Attorneys stay at the center.",
    body: "Willow keeps the attorney at the heart of the planning experience. We automate check-ins, make it easy for clients to book a call when it's time to update their plan, and attorneys approve every summary their clients see.",
  },
  {
    title: "Clients stay in control.",
    body: "Clients get one secure place for everything their executors and family will need: a visual summary of their plan and their documents. They decide who sees what, and when.",
  },
];

const AboutPage = () => {
  usePageMeta(
    "About Willow | The Estate Planning Platform for Attorneys",
    "Willow keeps the estate plan, and the attorney who wrote it, within reach of the family for as long as they need them."
  );
  return (
    <PageShell>
      {/* Top, as on harvey.ai's company page: a small label and the headline
          set large and light on the page itself, left-aligned, no photograph */}
      <section className="pt-[var(--hv-lg)]">
        <div className={`${WRAP} enter`}>
          <p className="hv-body-2 font-medium text-[#222222]">About Willow</p>
          <h1 className="hv-h1 mt-[var(--hv-md)] max-w-4xl font-heading font-light text-[#222222]">
            Estate plans shouldn't live in binders.
          </h1>
        </div>
      </section>

      {/* The vision, in Aaron's words, centred on its own right under the top */}
      <section className="pt-[var(--hv-xl)]">
        <div className={WRAP}>
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-heading text-[1.25rem] leading-relaxed text-[#222222] md:text-[1.55rem]" style={{ textWrap: "balance" }}>
            “Our vision is to give every estate attorney the tools their clients deserve, and to keep the attorney at the center of that relationship. A plan shouldn't disappear into a drawer the day it's signed. It should stay with the family, current and within reach, and so should the lawyer who built it.”
          </blockquote>
          <figcaption className="mt-8 flex items-center justify-center gap-3">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
              <img src="/Burlacoff Headshot.svg" alt="" className="h-full w-full object-cover" style={{ objectPosition: "center 25%", transform: "scale(1.7)" }} />
            </span>
            <span className="text-left">
              <span className="block text-[15px] font-semibold text-[#222222]">Aaron Burlacoff</span>
              <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">Founder &amp; CEO</span>
            </span>
          </figcaption>
        </figure>
        </div>
      </section>

      {/* Then the two guiding principles, set like Harvey's figures row: a
          ruled column each, a large light serif line, a sentence */}
      <section className="pb-[var(--hv-xl)] pt-[var(--hv-xl)]">
        <div className={WRAP}>
          <h2 className="hv-body-2 font-sans font-medium text-[#222222]">Two guiding principles behind every decision we make</h2>
          <div className="mt-[var(--hv-md)] grid gap-y-12 md:grid-cols-2 md:gap-x-12">
            {BELIEFS.map((b) => (
              <div key={b.title} className="border-t border-gray-300 pt-[var(--hv-md)]">
                <h3 className="hv-h2 font-heading font-light text-[#222222]">{b.title}</h3>
                <p className="hv-body-1 mt-[var(--hv-sm)] max-w-[30em] text-gray-600">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <SectionHead eyebrow="In the news" title="Coverage of Willow." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PRESS.map((p) => (
              <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" className="lift group flex flex-col rounded-xl border border-gray-200 bg-white p-7">
                <img src={p.logo} alt={p.outlet} className="h-6 w-auto self-start opacity-80" />
                <div className="mt-6 font-heading text-[1.2rem] font-bold leading-snug text-[#222222]">{p.title}</div>
                <div className="mt-auto flex items-center justify-between pt-6 text-[14px] text-gray-500">
                  {p.date}
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0C7370]">
                    Read <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </PageShell>
  );
};

export default AboutPage;
