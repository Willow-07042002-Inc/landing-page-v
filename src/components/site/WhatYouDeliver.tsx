import React, { useEffect, useRef, useState } from "react";
import { WRAP } from "@/components/site/blocks";
import { LightHead } from "@/components/site/StayingAhead";
import { FloatStack } from "@/components/product/kit";
import { ProClientRowView, ProCoupleView } from "@/components/product/attorney-clients";
import { CheckIcon } from "@/components/product/willow-icons";
import {
  GoogleCalendarLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";

/* Will it fit my practice? The film above shows what Willow does; these tiles
   answer the attorney's next question in the Harvey-like sizes Aaron prefers
   (a tall half-width tile, two small ones beside it, a wide one under them),
   each with a small piece of the real product:
     tall   Bring the clients you already have: the Clients list, Daniel and
            Maria first, running off the bottom (importing contacts is being
            built, Nov 24, and Aaron cleared claiming it)
     small  Willow fits around your process: the check-in panel's own
            switches (Ask me before each one goes out, and the questions),
            which flip when clicked
     small  Connect: the apps it connects to
     wide   Speak to clients in your own voice: Approve Summary over a plan
            summary mid-edit (the Keeping things easy film's edit), and the
            button can be pressed. Summaries, check-in emails (Tailor: a
            personal note, subject and message), firm updates (Settings >
            Dashboard content) and the welcome note are all editable on main
            (Nov 24); the line names only those, not "anything". Willow
            learning the attorney's voice is not built, so the tile doesn't
            claim it */

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
   the fade starts, in percent of the height. `live`: it holds something a
   visitor can press, so it stays in the accessibility tree */
const Bleed = ({
  height,
  heightClass = "",
  fadeFrom,
  live = false,
  children,
}: {
  height?: number;
  heightClass?: string;
  fadeFrom?: number;
  live?: boolean;
  children: React.ReactNode;
}) => (
  <div
    aria-hidden={live ? undefined : true}
    className={`px-1 pt-1 ${heightClass}`}
    style={{ height, overflow: "clip", WebkitMaskImage: fadeOut(fadeFrom), maskImage: fadeOut(fadeFrom), fontFamily: PRODUCT_FONT }}
  >
    {children}
  </div>
);

/* A piece of the product laid out at its own width and scaled down to fit when
   its tile is narrower, so its labels never wrap or cut off */
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

/* The Clients list once a firm's clients are in: Daniel and Maria as a
   couple, then clients on their own, running off the bottom of the tile */
const ClientList = () => (
  <div className="mx-auto w-full max-w-[500px] text-left">
    <FloatStack>
      <ProCoupleView a={{ name: "Daniel Rosen", email: "daniel.rosen@gmail.com" }} b={{ name: "Maria Rosen", email: "maria.rosen@gmail.com" }} />
      <ProClientRowView c={{ name: "Elena Ruiz", email: "elena.ruiz@gmail.com" }} />
      <ProClientRowView c={{ name: "Marcus Webb", email: "marcus.webb@outlook.com" }} />
      <ProClientRowView c={{ name: "Jordan Lee", email: "jordan.lee@gmail.com" }} />
      <ProClientRowView c={{ name: "Priya Anand", email: "priya.anand@outlook.com" }} />
      <ProClientRowView c={{ name: "Grace Liu", email: "grace.liu@yahoo.com" }} />
    </FloatStack>
  </div>
);

/* A plan summary in the attorney's words: the review page's Approve Summary
   (attorney-review.tsx SummaryHead), over the real property power's meaning
   as the attorney has reworded it, in its edit outline: the powers table of
   the step-in card mid-edit, with Done, as the Keeping things easy film shows
   it (EasyFilm.tsx StepInBody). Pressing Approve marks it approved. */
const POWERS = [
  { power: "Real property transactions", desc: null },
  { power: "Chattel and goods transactions", desc: "Buy, sell, or manage personal property, tangible goods, and safe deposit box contents" },
  { power: "Bond, share and commodity transactions", desc: "Buy, sell, or manage stocks, bonds, mutual funds, and other securities on your behalf" },
];

const SummaryEdit = () => {
  const [approved, setApproved] = useState(false);
  return (
    <div className="text-left">
      <button
        type="button"
        onClick={() => setApproved(true)}
        disabled={approved}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium text-white transition-[background-color,transform] duration-150 ${approved ? "bg-[#309E96]" : "bg-[#128F8B] hover:bg-[#0F7673] active:scale-[0.97]"}`}
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        <CheckIcon className="h-4 w-4" />
        {approved ? "Approved" : "Approve Summary"}
      </button>
      <div aria-hidden className="mt-3 rounded-t-2xl bg-white px-4 pb-4 pt-4" style={{ boxShadow: UI_SHADOW }}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">Financial Agent powers</p>
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#309E96]">
            <CheckIcon className="h-3.5 w-3.5" />
            Done
          </span>
        </div>
        <div className="overflow-hidden rounded-xl" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div className="flex bg-[#128F8B] text-[12.5px] font-semibold text-white">
            <div className="w-[36%] flex-shrink-0 px-3.5 py-2.5">Power</div>
            <div className="min-w-0 flex-1 px-3.5 py-2.5">What this means</div>
          </div>
          {POWERS.map((w, i) => (
            <div key={w.power} className={`flex items-start border-b border-[#E5E7EB] last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}>
              <div className="w-[36%] flex-shrink-0 px-3.5 py-3 text-[13px] font-medium text-[#1F2933]">{w.power}</div>
              <div className="min-w-0 flex-1 px-3.5 py-3 text-[13px] leading-[1.5] text-[#6B7280]">
                {w.desc ?? (
                  <span className="block rounded-[3px] text-[#1F2933]" style={{ boxShadow: "0 0 0 1px #309E96, 0 0 0 4px rgba(48,158,150,0.14)" }}>
                    Buy, sell, lease, mortgage, or manage your home and any other real estate
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
      className="flex w-full items-center gap-3 border-b border-[#E5E7EB] py-2.5 text-left"
    >
      <span className="min-w-0 flex-1 text-[13.5px] leading-snug text-[#1F2933]">{label}</span>
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
  <div className="w-full rounded-t-2xl bg-white px-4 pt-3.5 text-left" style={{ boxShadow: UI_SHADOW }}>
    <p className="text-[14px] font-semibold text-[#1F2933]">Client check-in</p>
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

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-12 lg:grid-rows-[minmax(252px,auto)_minmax(252px,auto)]">
        <article className={`${TILE} px-6 pt-6 sm:col-span-2 lg:col-span-6 lg:row-span-2`}>
          <TileTitle>Bring the clients you already have</TileTitle>
          <TileBody>Import your contacts, add the plans you&rsquo;ve already signed, and see every client in one list.</TileBody>
          {/* The list fills the tile however tall the two rows beside it get */}
          <div className="relative mt-5 min-h-[385px] flex-1">
            <Bleed heightClass="absolute inset-0" fadeFrom={68}>
              <ClientList />
            </Bleed>
          </div>
        </article>

        <article className={`${TILE} px-6 pt-6 lg:col-span-3`}>
          <TileTitle>Willow fits around your process</TileTitle>
          <TileBody>Keep your safeguards and choose what waits for your approval.</TileBody>
          <div className="mt-auto pt-4">
            <Bleed height={108} fadeFrom={58} live>
              <FitWidth width={250}>
                <Preferences />
              </FitWidth>
            </Bleed>
          </div>
        </article>

        <article id="integrations" className={`${TILE} scroll-mt-24 p-6 lg:col-span-3`}>
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

        {/* Side by side where the tile is wide enough for the summary's
            table; between 1024 and 1200px it sits under the text instead */}
        <article className={`${TILE} gap-6 px-6 pt-6 sm:col-span-2 sm:flex-row lg:col-span-6 lg:flex-col lg:gap-4 min-[1200px]:flex-row min-[1200px]:gap-6`}>
          <div className="sm:w-[40%] sm:flex-shrink-0 sm:pb-6 lg:w-auto lg:pb-0 min-[1200px]:w-[35%] min-[1200px]:pb-6">
            <TileTitle>Speak to clients in your own voice</TileTitle>
            <TileBody>Edit any summary, check-in email or firm update your clients see, so every word sounds like it came from you.</TileBody>
          </div>
          <div className="min-w-0 flex-1 self-end lg:mt-auto lg:w-full lg:flex-none lg:self-stretch min-[1200px]:mt-0 min-[1200px]:w-auto min-[1200px]:flex-1 min-[1200px]:self-end">
            <Bleed heightClass="h-[228px] lg:h-[206px] min-[1200px]:h-[228px]" fadeFrom={82} live>
              <SummaryEdit />
            </Bleed>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default WhatYouDeliver;
