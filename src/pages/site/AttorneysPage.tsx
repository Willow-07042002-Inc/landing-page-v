import React from "react";
import { PageShell, PageHero, ClosingCta, WRAP, usePageMeta } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";
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
   FAQ's type and spacing (heading left, rows right that open on click), and
   the demo. No attorney reviews on this page. */

const Belief = () => (
  <section className="bg-[#F8FAFC] pb-16 md:pb-24">
    <div className={`${WRAP} max-w-5xl`}>
      <blockquote className="text-center">
        <p className="mx-auto max-w-[54rem] text-[1.0625rem] text-[#222222] sm:text-[1.1875rem] md:text-[1.375rem]" style={{ lineHeight: 1.5, textWrap: "balance" }}>
          At Willow, our goal is to ensure every attorney can{" "}
          <em className="whitespace-nowrap font-medium not-italic text-[#138F8B]">sell their practice</em> to the next attorney in line when they&rsquo;re ready to retire, rather than close it down because their relationships have faded over time.
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
    <PageShell>
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
      <KeepingThingsEasy />
      <SecurityControls />
      <ClosingCta shot={<ScaledScreen><AttorneyDashboardScreen /></ScaledScreen>} />
    </PageShell>
  );
};

export default AttorneysPage;
