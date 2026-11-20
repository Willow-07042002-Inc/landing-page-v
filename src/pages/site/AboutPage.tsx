import React from "react";
import { ArrowRight } from "lucide-react";
import { PageShell, ClosingCta, SectionHead, WRAP, Eyebrow, usePageMeta } from "@/components/site/blocks";

/* About Willow: why it exists, its two guiding principles, and the coverage
   it has had, closed by the founder's vision.
   Press items link to the real articles. */

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
      {/* Hero: a statement over a photograph */}
      <section className="px-5 pb-6 pt-6 md:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
          <img src="/central-park.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(6,45,44,0.86) 0%, rgba(6,45,44,0.55) 60%, rgba(6,45,44,0.25) 100%)" }} />
          <div className="enter relative px-7 py-20 md:px-16 md:py-32">
            <Eyebrow light>About Willow</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-heading text-[2.5rem] font-bold leading-[1.1] text-white md:text-[4rem]" style={{ textWrap: "balance" }}>
              Estate plans shouldn't live in binders.
            </h1>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/85">
              Willow is the estate planning platform for attorneys and the families they serve. We keep the plan, and the attorney who wrote it, within reach for as long as the family needs them.
            </p>
          </div>
        </div>
      </section>

      {/* Why we started */}
      <section className="py-16 md:py-24">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20`}>
          <SectionHead center={false} eyebrow="Why we started" title="When it mattered most," accent="we couldn't find the will." />
          <div className="space-y-5 text-[17.5px] leading-relaxed text-gray-700">
            <p>
              Willow began after a difficult family experience: when it mattered most, we couldn't access a loved one's will. The plan existed. The family simply couldn't reach it, or the people who knew it.
            </p>
          </div>
        </div>
      </section>

      {/* What we believe */}
      <section className="bg-white py-16 md:py-24">
        <div className={WRAP}>
          <SectionHead eyebrow="What we believe" title="Two guiding principles behind" accent="every decision we make." />
          <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-16">
            {BELIEFS.map((b) => (
              <div key={b.title} className="border-t-2 border-[#222222] pt-5">
                <h3 className="font-heading text-xl font-bold leading-snug text-[#222222]">{b.title}</h3>
                <p className="mt-3 text-[16.5px] leading-relaxed text-gray-600">{b.body}</p>
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

          {/* The vision, in Aaron's words, set on its own under the coverage */}
          <figure className="mx-auto mt-16 max-w-3xl text-center md:mt-24">
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

      <ClosingCta />
    </PageShell>
  );
};

export default AboutPage;
