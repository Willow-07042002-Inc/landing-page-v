import React, { useEffect, useRef, useState } from "react";
import { WRAP } from "@/components/site/blocks";
import { LightHead } from "@/components/site/StayingAhead";
import { FloatStack, WIcon } from "@/components/product/kit";
import { ProCoupleView, ProDocSectionLabel } from "@/components/product/attorney-clients";
import {
  GoogleCalendarLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";

/* Will it fit my practice? The film above shows what Willow does; these tiles
   answer the attorney's next question on a grid of eight squares (four by two
   from 1024px, two columns below, stacked on phones),
   each with a small piece of the real product:
     1-3  Bring the clients you already have: the text, and the Rosens as the
          Clients list shows a couple (importing contacts is being built, Nov 24,
          and Aaron cleared claiming it)
     4    Draft and sign your way: the signed PDFs on a client's plan
     5    Connect: the apps it connects to
     6-8  Built on your preferences: the check-in panel's own switches (Ask me
          before each one goes out, and the check-in questions), which flip
          when clicked */

const UI_SHADOW = "0 1px 2px rgba(16,24,40,0.05), 0 10px 24px -8px rgba(16,24,40,0.14)";
const PRODUCT_FONT = "Figtree, Inter, sans-serif";
const fadeOut = (from = 74) => `linear-gradient(to bottom, #000 ${from}%, transparent 100%)`;
const TILE = "flex flex-col overflow-hidden rounded-xl bg-[#EEF2F1]";

const TileTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[20px] font-medium leading-snug text-[#222222]" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
    {children}
  </h3>
);

const TileBody = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-gray-600">{children}</p>
);

/* A piece of the product running off the bottom of its tile. `fadeFrom`: where
   the fade starts, in percent of the height */
const Bleed = ({ height, fadeFrom, children }: { height: number; fadeFrom?: number; children: React.ReactNode }) => (
  <div aria-hidden className="overflow-hidden px-1 pt-1" style={{ height, WebkitMaskImage: fadeOut(fadeFrom), maskImage: fadeOut(fadeFrom), fontFamily: PRODUCT_FONT }}>
    {children}
  </div>
);

/* A piece of the product laid out at its own width and scaled down to fit when
   its tile is narrower (the small squares between 1024 and 1280px), so its
   labels never wrap or cut off */
const FitWidth = ({ width, children }: { width: number; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref}>
      <div style={scale < 1 ? { width, transform: `scale(${scale})`, transformOrigin: "top left" } : undefined}>{children}</div>
    </div>
  );
};

/* A client's signed plan as the Estate Plan tab lists it (estate-plans-tab.tsx
   DocumentRow), with rows tightened for a small tile */
const DocLine = ({ label, detail }: { label: string; detail?: string }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <WIcon name="document" className="h-5 w-5 flex-shrink-0 text-[#309E96]" />
    <div className="min-w-0 flex-1">
      <p className="truncate text-[14px] font-semibold text-[#1F2933]">{label}</p>
      {detail && <p className="mt-0.5 truncate text-[12px] text-[#9CA3AF]">{detail}</p>}
    </div>
    <WIcon name="more" className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
  </div>
);

const SignedPlan = () => (
  <div className="w-full text-left">
    <ProDocSectionLabel label="Daniel's documents" action="Choose PDFs" />
    <FloatStack>
      <DocLine label="Last Will & Testament" />
      <DocLine label="Revocable Living Trust" detail="Joint trust (married couple)" />
      <DocLine label="Power of Attorney" />
    </FloatStack>
  </div>
);

/* Daniel and Maria as the Clients list shows a couple */
const Couple = () => (
  <div className="w-full max-w-[460px] text-left" style={{ fontFamily: PRODUCT_FONT }}>
    <FloatStack>
      <ProCoupleView a={{ name: "Daniel Rosen", email: "daniel.rosen@gmail.com" }} b={{ name: "Maria Rosen", email: "maria.rosen@gmail.com" }} />
    </FloatStack>
  </div>
);

/* The product's switch (settings/shared.tsx Toggle) and switch line
   (panel-kit.tsx SwitchLine); here a visitor can flip them */
const SwitchLine = ({ label, initial }: { label: string; initial: boolean }) => {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className="flex w-full items-center gap-4 border-b border-[#E5E7EB] py-2.5 text-left"
    >
      <span className="min-w-0 flex-1 text-[14px] text-[#1F2933]">{label}</span>
      <span className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${on ? "bg-[#309E96]" : "bg-[#D1D5DB]"}`}>
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
      </span>
    </button>
  );
};

/* The check-in's settings, with the real labels: Ask me before each one goes
   out, then the survey's questions (packages/types/surveys.ts), one of them
   off near the top so the switches read as choices */
const Preferences = () => (
  <div className="w-full overflow-hidden rounded-t-2xl bg-white px-5 pt-4 text-left" style={{ boxShadow: UI_SHADOW, fontFamily: PRODUCT_FONT }}>
    <p className="text-[15px] font-semibold text-[#1F2933]">Client check-in</p>
    <div className="mt-1">
      <SwitchLine label="Ask me before each one goes out" initial />
    </div>
    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Questions to ask</p>
    <div className="mt-1">
      <SwitchLine label="Has your family changed?" initial />
      <SwitchLine label="Have you changed a beneficiary on an account or policy?" initial={false} />
      <SwitchLine label="Have you moved, or bought or sold property?" initial />
      <SwitchLine label="Have your wishes for medical care changed?" initial />
    </div>
  </div>
);

const GmailLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="52 42 88 66" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
    <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
    <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
    <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
    <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
  </svg>
);

type Logo = (p: { className?: string }) => React.ReactElement;
const CONNECTORS: { name: string; Logo: Logo }[] = [
  { name: "Google Calendar", Logo: GoogleCalendarLogo },
  { name: "Outlook", Logo: OutlookLogo },
  { name: "Gmail", Logo: GmailLogo },
  { name: "Google Meet", Logo: GoogleMeetLogo },
  { name: "Zoom", Logo: ZoomLogo },
  { name: "Microsoft Teams", Logo: MicrosoftTeamsLogo },
];

const WhatYouDeliver = () => (
  <section className="bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <LightHead title="Built to work with" accent="the practice you already run." />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:grid-rows-[minmax(252px,auto)_minmax(252px,auto)]">
        <article className={`${TILE} gap-6 p-6 sm:col-span-2 sm:flex-row sm:items-center lg:col-span-3`}>
          <div className="sm:w-[40%] sm:flex-shrink-0 sm:self-start">
            <TileTitle>Bring the clients you already have</TileTitle>
            <TileBody>Import your contacts, add the plans you&rsquo;ve already signed, and see every client in one list.</TileBody>
          </div>
          <div aria-hidden className="flex min-w-0 flex-1 justify-center">
            <Couple />
          </div>
        </article>

        <article className={`${TILE} px-6 pt-6`}>
          <TileTitle>Draft and sign your way</TileTitle>
          <TileBody>Keep your process. Willow starts from the signed PDF.</TileBody>
          <div className="mt-auto pt-4">
            <Bleed height={124}>
              <FitWidth width={236}>
                <SignedPlan />
              </FitWidth>
            </Bleed>
          </div>
        </article>

        <article id="integrations" className={`${TILE} scroll-mt-24 p-6`}>
          <TileTitle>Connect</TileTitle>
          <TileBody>Your calendar, video and contacts, connected once.</TileBody>
          <ul className="mt-auto grid grid-cols-3 gap-1.5 pt-4">
            {CONNECTORS.map(({ name, Logo }) => (
              <li key={name} title={name} className="flex h-10 items-center justify-center rounded-md bg-white">
                <Logo className="h-5 w-5 object-contain" />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${TILE} gap-6 px-6 pt-6 sm:col-span-2 sm:flex-row lg:col-span-3`}>
          <div className="sm:w-[40%] sm:flex-shrink-0 sm:pb-6">
            <TileTitle>Built on your preferences</TileTitle>
            <TileBody>Choose the questions clients are asked, how often they hear from you, and what waits for your approval.</TileBody>
          </div>
          <div className="min-w-0 flex-1 self-end">
            <div className="px-1 pt-1" style={{ height: 228, overflow: "clip", WebkitMaskImage: fadeOut(84), maskImage: fadeOut(84) }}>
              <Preferences />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default WhatYouDeliver;
