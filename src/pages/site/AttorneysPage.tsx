import React from "react";
import { PageShell, PageHero, SecurityBand, ClosingCta, WRAP, usePageMeta } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";
import CheckInStory from "@/components/site/CheckInStory";
import StayingAhead from "@/components/site/StayingAhead";
import WhatYouDeliver from "@/components/site/WhatYouDeliver";

/* For attorneys, with the look of harvey.ai's solution pages and a layout of
   its own: the hero, what Willow believes, how attorneys stay ahead for every
   client (task by task, on the real product), what the practice delivers
   (quiet tiles with pieces of the product), then security and the demo. */

const Belief = () => (
  <section className="bg-[#F8FAFC] pb-16 md:pb-24">
    <div className={`${WRAP} max-w-5xl`}>
      <blockquote className="border-y border-gray-200 py-12 text-center md:py-16">
        <p className="font-heading text-[1.5rem] font-light text-[#222222] sm:text-[1.875rem] md:text-[2.375rem]" style={{ lineHeight: 1.35, textWrap: "balance" }}>
          At Willow, we believe you should build a practice you can{" "}
          <em className="whitespace-nowrap text-[#138F8B]">truly sell</em> when you&rsquo;re ready to retire, to the next attorney in line, rather than close it down because the relationships aren&rsquo;t there.
        </p>
      </blockquote>
    </div>
  </section>
);

const AttorneysPage = () => {
  usePageMeta(
    "Willow for Estate Planning Attorneys",
    "Keep clients coming back for updates and become the obvious choice for their family and executors. Willow starts from the plan you've already signed."
  );
  return (
    <PageShell quotes>
      <PageHero
        eyebrow="For attorneys"
        title="Signing shouldn't be the last time"
        accent="you hear from a client."
        subtitle="Willow keeps clients coming back for updates and makes you the obvious choice for their family and executors."
        visualAspect="1128 / 670"
        visual={<CheckInStory />}
      />
      <Belief />
      <StayingAhead />
      <WhatYouDeliver />
      <SecurityBand />
      <ClosingCta shot={<ScaledScreen><AttorneyDashboardScreen /></ScaledScreen>} />
    </PageShell>
  );
};

export default AttorneysPage;
