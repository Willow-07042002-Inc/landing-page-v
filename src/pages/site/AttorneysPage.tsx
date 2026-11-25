import React from "react";
import { PageShell, PageHero, WRAP, usePageMeta } from "@/components/site/blocks";
import CheckInStory from "@/components/site/CheckInStory";
import StayingAhead from "@/components/site/StayingAhead";
import KeepingThingsEasy from "@/components/site/KeepingThingsEasy";
import WhatYouDeliver from "@/components/site/WhatYouDeliver";
import SecurityControls from "@/components/site/SecurityControls";

/* For attorneys, with the look of harvey.ai's solution pages and a layout of
   its own: the hero, what Willow believes, how attorneys stay ahead for every
   client (task by task, on the real product), how it fits the practice they
   already run (quiet tiles with pieces of the product), the admin Willow
   takes off their plate (keeping things easy: the signed plan in, the
   summary out, the reaching out on schedule), then security in the homepage
   FAQ's type and spacing (heading left, rows right that open on click). No
   closing cards: the demo ask is the footer's top line, as on harvey.ai
   (Aaron, Nov 24). No attorney reviews on this page. */

/* The belief, as Aaron's own words: set like the About page's founder quote
   (light serif in curly quotes, then the round headshot with his name and
   "Founder & CEO, Willow"), a step smaller than it so it sits under the
   hero without shouting, on a wider measure than the hero's subtitle. */
const Belief = () => (
  <section className="bg-[#F8FAFC] pb-20 md:pb-32">
    <div className={`${WRAP} max-w-6xl`}>
      <figure className="text-center">
        <blockquote>
          <p className="mx-auto max-w-[62rem] font-heading text-[1.1875rem] font-light text-[#222222] sm:text-[1.375rem] md:text-[1.625rem]" style={{ lineHeight: 1.45, letterSpacing: "-0.005em", textWrap: "balance" }}>
            &ldquo;At Willow, our goal is to ensure every attorney can{" "}
            <em className="whitespace-nowrap font-normal not-italic text-[#138F8B]">sell their practice</em> to the next attorney in line when they&rsquo;re ready to retire, rather than close it down because their relationships have faded over time.&rdquo;
          </p>
        </blockquote>
        <figcaption className="mt-7 flex items-center justify-center gap-3 md:mt-8">
          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-200">
            <img src="/Burlacoff Headshot.svg" alt="" className="h-full w-full object-cover" style={{ objectPosition: "center 25%", transform: "scale(1.7)" }} />
          </span>
          <span className="text-left">
            <span className="block text-[15px] font-medium text-[#222222]">Aaron Burlacoff</span>
            <span className="block text-[14px] text-gray-600">Founder &amp; CEO, Willow</span>
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
);

const AttorneysPage = () => {
  usePageMeta(
    "Willow for Estate Planning Attorneys",
    "Keep clients coming back for updates and become the obvious choice for their family and executors. Willow starts from the plan you've already signed."
  );
  return (
    <PageShell>
      <PageHero
        eyebrow="For attorneys"
        title="Signing shouldn't be the last time"
        accent="you hear from a client."
        subtitle={
          <>
            Willow ensures clients come back year after year, and makes
            {/* Aaron's break, from tablet width up (Nov 25) */}
            <br className="hidden md:inline" /> you the obvious choice for their family and executors.
          </>
        }
        visualAspect="1128 / 670"
        visual={<CheckInStory />}
      />
      <Belief />
      <StayingAhead />
      <WhatYouDeliver />
      <KeepingThingsEasy />
      <SecurityControls />
    </PageShell>
  );
};

export default AttorneysPage;
