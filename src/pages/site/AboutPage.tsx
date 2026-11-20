import React from "react";
import { PageShell, ClosingCta, SectionHead, WRAP, Eyebrow, usePageMeta } from "@/components/site/blocks";
import NewsCard from "@/components/site/NewsCard";
import { NEWS_ARTICLES } from "@/content/news";
import { ScaledScreen } from "@/components/product/kit";
import { SummaryReviewScreenCropped, SUMMARY_REVIEW_CROP_HEIGHT } from "@/components/product/attorney-review";
import { ClientShareTimingScreen } from "@/components/product/client-app";

/* About Willow, set like harvey.ai's company page: the headline, the
   founder's vision, the two guiding principles, then the coverage (the same
   cards as the In the news page, from content/news.ts). */

/* Willow's two guiding principles, in Aaron's own words from his emails to
   attorneys (Nov 18 "Your feedback helped build Willow", the Saratoga
   follow-ups, the April one-liner and the Early Look emails). Each card is
   set like the landing page's "keep your clients connected" box: a print
   under the dark teal wash, white copy, and a real product screen rising
   out of the bottom-right corner. The screen shows the principle at work:
   the attorney approving a client's summary; the client choosing who sees
   their will, and when. `crop` is where the card's window opens on the
   screen, in screen pixels: its top-left corner (x, y) and how much of the
   screen's width the window spans (w). */
const BELIEFS: {
  title: string;
  body: string;
  print: string;
  screen: React.ReactNode;
  screenH: number;
  crop: { x: number; y: number; w: number };
}[] = [
  {
    title: "Attorneys stay at the center.",
    body: "Willow keeps the attorney at the heart of the planning experience. We automate check-ins, make it easy for clients to book a call when it's time to update their plan, and attorneys approve every summary their clients see.",
    print: "/nyc-skyline.jpg",
    screen: <SummaryReviewScreenCropped />,
    screenH: SUMMARY_REVIEW_CROP_HEIGHT,
    crop: { x: 290, y: 0, w: 1010 },
  },
  {
    title: "Clients stay in control.",
    body: "Clients get one secure place for everything their executors and family will need: a visual summary of their plan and their documents. They decide who sees what, and when.",
    print: "/west-side-hwy.jpg",
    screen: <ClientShareTimingScreen />,
    screenH: 855,
    crop: { x: 300, y: 120, w: 920 },
  },
];


/* The figures, as on harvey.ai's company page, all from the Horizon deck
   (Oct 2026): $124 trillion large across the top, then four stats in two
   columns of two rows. No sources line on the page (Aaron's call, Nov 19
   2026); where each one comes from, for whoever asks:
   - $124 trillion through 2048: Cerulli Associates, Dec 2024,
     https://www.cerulli.com/press-releases/cerulli-anticipates-124-trillion-in-wealth-will-transfer-through-2048
   - 72%: USLegalWills.com survey, June 2016 (the deck's 71% is 72% there),
     https://prnewswire.com/news-releases/uslegalwills-survey-reveals-that-72-of-americans-do-not-have-an-up-to-date-will-300290732.html
   - 52%: Caring.com survey, March 2015,
     https://www.caring.com/caregivers/estate-planning/wills-survey/2015-survey
   - 89% and 46%: no primary source found (the 89% traces to a 2026
     ClearEstate poll of Canadians that measured something else); on the
     page because Aaron chose to keep them.
   The deck's 18 e-will states and 10 years between updates were dropped at
   his request. */
const LEAD_FIGURE = { figure: "$124 trillion", label: "is set to change hands from one generation to the next" };

const FIGURES = [
  { figure: "89%", label: "of executors aren't prepared when the time comes" },
  { figure: "52%", label: "of Americans don't know where their parents' estate plan is" },
  { figure: "46%", label: "of executors don't know they've been named" },
  { figure: "72%", label: "of Americans don't have an up-to-date will" },
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
          <Eyebrow>Our vision</Eyebrow>
          <h1 className="hv-h1 mt-[var(--hv-md)] max-w-4xl font-heading font-light text-[#222222]">
            Estate plans shouldn't live in binders.
          </h1>

          {/* The figures in a box like the homepage's founder note: the
              Golden Gate print fills the rounded box, and a white card floats
              over it. $124 trillion runs large across the top of the card; the
              four stats sit below in two columns of two rows, each under a
              thin rule. dt comes first for screen readers; the figure shows
              on top. */}
          <div className="relative mt-[var(--hv-xl)] overflow-hidden rounded-3xl">
            <img src="/golden-gate.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "center 45%" }} />
            <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.15)" }} />
            <div className="relative z-10 p-4 sm:p-6 md:p-14 lg:p-16">
              <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 sm:p-8 md:p-12" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
                <dl className="flex flex-col">
                  <dt className="hv-body-1 order-2 mt-[var(--hv-sm)] text-gray-600">{LEAD_FIGURE.label}</dt>
                  <dd className="order-1 font-heading text-[clamp(32px,8vw,120px)] font-light leading-none tracking-[-0.02em] text-[#222222]">{LEAD_FIGURE.figure}</dd>
                </dl>
                <dl className="mt-[var(--hv-lg)] grid gap-x-8 gap-y-8 sm:grid-cols-2 md:gap-y-[var(--hv-md)]">
                  {FIGURES.map((f) => (
                    <div key={f.figure} className="flex flex-col border-t border-gray-200 pt-[var(--hv-md)]">
                      <dt className="hv-body-1 order-2 mt-[var(--hv-sm)] max-w-[20em] text-gray-600">{f.label}</dt>
                      <dd className="hv-h1 order-1 font-heading font-light text-[#222222]">{f.figure}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The vision, in Aaron's words, centred on its own right under the
          top. Set as the landing page sets its founder quote: light serif,
          then the name and "Founder & CEO, Willow" in the body sizes. */}
      <section className="pt-[var(--hv-xl)]">
        <div className={WRAP}>
          <figure className="mx-auto max-w-4xl text-center">
            <blockquote className="hv-h3 font-heading font-light text-[#222222]">
              “Our vision is to give every estate attorney the tools their clients deserve, and to keep the attorney at the center of that relationship. A plan shouldn't disappear into a drawer the day it's signed. It should stay with the family, current and within reach, and so should the lawyer who built it.”
            </blockquote>
            <figcaption className="mt-[var(--hv-md)] flex items-center justify-center gap-3">
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
                <img src="/Burlacoff Headshot.svg" alt="" className="h-full w-full object-cover" style={{ objectPosition: "center 25%", transform: "scale(1.7)" }} />
              </span>
              <span className="text-left">
                <span className="hv-body-1 block font-medium text-[#222222]">Aaron Burlacoff</span>
                <span className="hv-body-2 block text-gray-600">Founder &amp; CEO, Willow</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Then the two guiding principles, set like Harvey's figures row: a
          ruled column each, a large light serif line, a sentence */}
      <section className="pb-[var(--hv-xl)] pt-[var(--hv-xl)]">
        <div className={WRAP}>
          <h2 className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Two guiding principles behind every decision we make</h2>
          <div className="mt-[var(--hv-md)] grid gap-6 md:grid-cols-2">
            {BELIEFS.map((b) => (
              <div key={b.title} className="relative flex flex-col overflow-hidden rounded-3xl">
                <img src={b.print} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.72)" }} />
                <div className="relative z-10 p-8 md:p-10 lg:p-12">
                  <h3 className="font-heading text-2xl font-bold text-white md:text-[1.75rem] lg:text-[2rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
                    {b.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-[15px] text-white/85 md:text-[17px]" style={{ lineHeight: 1.65 }}>
                    {b.body}
                  </p>
                </div>
                {/* The product screen, rising out of the bottom-right corner */}
                <div className="relative z-10 mt-auto h-[260px] sm:h-[320px] lg:h-[360px]" aria-hidden>
                  <div className="absolute -bottom-12 -right-12 left-8 top-2 overflow-hidden rounded-tl-xl bg-white md:left-10" style={{ boxShadow: "0 16px 56px rgba(0,0,0,0.35)" }}>
                    <div
                      className="absolute top-0"
                      style={{
                        left: `${(-b.crop.x / b.crop.w) * 100}%`,
                        width: `${(1440 / b.crop.w) * 100}%`,
                        aspectRatio: `1440 / ${b.screenH}`,
                        transform: `translateY(${(-b.crop.y / b.screenH) * 100}%)`,
                      }}
                    >
                      <ScaledScreen h={b.screenH}>{b.screen}</ScaledScreen>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <SectionHead eyebrow="In the news" title="Coverage of Willow." />
          {/* The same cards as the In the news page */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {NEWS_ARTICLES.map((a) => (
              <NewsCard key={a.href} article={a} headingLevel={3} />
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </PageShell>
  );
};

export default AboutPage;
