import React, { useEffect, useRef, useState } from "react";
import { VignetteFrame } from "@/components/ProductVignettes";
import { ClientEstatePlanTodayScreen } from "@/components/product/client-app";
import { ScaledScreen } from "@/components/product/kit";
import { PageShell, PageHero, PrintFrame, usePageMeta, WRAP, H2_CLS, H2_STYLE, ACCENT_CLS, LEAD_CLS, LEAD_STYLE, H3_CLS, H3_STYLE, BODY_CLS } from "@/components/site/blocks";
import StayInTouchFilm from "@/components/site/StayInTouchFilm";
import {
  TeamRosterVignette,
  StepInVignette,
  WhoGetsWhatVignette,
  TrustVignette,
  DocumentsVaultVignette,
  CategoriesVignette,
  ReleaseTimingVignette,
  RoleChangeVignette,
  SectionShareVignette,
} from "@/components/ClientVignettes";

/* ── The five summary chapters, shown in a continuous (wrap-around) carousel:
     the active screen sits centered while its neighbours peek in from both
     sides, so chapter 5 is visible to the left of chapter 1. ── */
const CHAPTERS: { label: string; vis: React.ReactNode }[] = [
  { label: "Your team", vis: <TeamRosterVignette /> },
  { label: "Who's responsible if someone needs to step in", vis: <StepInVignette /> },
  { label: "Where everything goes", vis: <WhoGetsWhatVignette /> },
  { label: "Testamentary trust", vis: <TrustVignette /> },
  { label: "Your documents", vis: <DocumentsVaultVignette /> },
];

const ChapterCarousel = () => {
  const n = CHAPTERS.length;
  const [idx, setIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(1120);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 50) setCw(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const isNarrow = cw < 760;
  // Desktop slide sits near the golden section of the track (≈0.68 of it),
  // so the peeking neighbours carry a deliberate, even share of the frame.
  const slideW = Math.min(740, cw * (isNarrow ? 0.92 : 0.68));
  const gap = isNarrow ? 12 : 28;
  const slideH = (slideW * 560) / 900;

  // Swipe on touch screens — horizontal drags page the ring; vertical scrolling
  // stays with the page via touch-action pan-y on the track.
  const touchX = useRef<number | null>(null);

  // Signed shortest distance around the ring, in [-2, 2]
  const dist = (i: number) => {
    let r = (i - idx) % n;
    if (r > n / 2) r -= n;
    if (r < -n / 2) r += n;
    return r;
  };
  const go = (i: number) => setIdx(((i % n) + n) % n);

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative"
        style={{ height: slideH + 8, touchAction: "pan-y" }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        }}
      >
        {CHAPTERS.map((ch, i) => {
          const d = dist(i);
          const offscreen = Math.abs(d) >= 2;
          const active = d === 0;
          return (
            <div
              key={ch.label}
              className="absolute top-1"
              onClick={() => { if (!active) go(i); }}
              role={active ? undefined : "button"}
              aria-label={active ? undefined : `Go to ${ch.label}`}
              style={{
                width: slideW,
                left: "50%",
                transform: `translateX(calc(-50% + ${d * (slideW + gap)}px)) scale(${active ? 1 : 0.955})`,
                opacity: offscreen ? 0 : active ? 1 : 0.45,
                transition: reduced || offscreen ? "none" : "transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.45s",
                cursor: active ? "default" : "pointer",
                pointerEvents: offscreen ? "none" : "auto",
                zIndex: active ? 2 : 1,
              }}
            >
              <VignetteFrame>{ch.vis}</VignetteFrame>
            </div>
          );
        })}

        {/* Arrows flank the photo — bare chevrons, nothing more */}
        <button
          onClick={() => go(idx - 1)}
          aria-label="Previous"
          className="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-gray-500 transition-colors hover:text-gray-800"
          style={{ left: `calc(50% - ${slideW / 2 + gap / 2}px)` }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button
          onClick={() => go(idx + 1)}
          aria-label="Next"
          className="absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center text-gray-500 transition-colors hover:text-gray-800"
          style={{ right: `calc(50% - ${slideW / 2 + gap / 2}px)` }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* One quiet line naming what's on screen */}
      <div className="mt-6 text-center text-sm font-medium text-gray-500">{CHAPTERS[idx].label}</div>
    </div>
  );
};

/* ── One preparedness row: eyebrow + title + body beside a vignette ── */
const ShareBlock = ({
  eyebrow,
  title,
  body,
  note,
  flip,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  note?: string;
  flip?: boolean;
  children: React.ReactNode;
}) => (
  <div className={`flex flex-col gap-8 lg:gap-12 items-center lg:flex-row ${flip ? "lg:flex-row-reverse" : ""}`}>
    {/* Golden-section split: copy 38.2%, product 61.8% — from lg up; phones and
        iPad portrait stack, so the product keeps its full width */}
    <div className="w-full lg:w-[38.2%]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">{eyebrow}</div>
      <h3 className={`mt-2 ${H3_CLS} text-[#222222]`} style={H3_STYLE}>
        {title}
      </h3>
      <p className={`mt-2 ${BODY_CLS} text-gray-600`}>{body}</p>
      {note && <p className="mt-2 text-[13.5px] text-gray-400">{note}</p>}
    </div>
    <div className="w-full lg:w-[61.8%]">
      <VignetteFrame>{children}</VignetteFrame>
    </div>
  </div>
);

const ForClientsPage = () => {
  usePageMeta(
    "Willow for Clients & Their Team",
    "An estate plan everyone understands: your plan and your people in one place, and a direct line back to your attorney whenever life changes."
  );

  return (
    <PageShell>
      {/* Hero, set as every site page's: the headline, then the client
          dashboard on the print under the deep teal wash, as For attorneys has it,
          every card closed (Aaron, Nov 24). */}
      <PageHero
        eyebrow="For clients"
        title="An estate plan"
        accent="everyone understands."
        subtitle="Modern enough for the next generation. Simple enough for their parents. Your plan and your people in one place, and a direct line back to your attorney whenever life changes."
        visualAspect="1440 / 855"
        visual={
          <PrintFrame print="/florida-coast.jpg" aspect="1440 / 855" className="shadow-2xl">
            <ScaledScreen>
              <ClientEstatePlanTodayScreen closed />
            </ScaledScreen>
          </PrintFrame>
        }
      />

      {/* Staying in touch: the yearly check-in through to a call booked on
          the attorney's calendar */}
      <StayInTouchFilm />

      {/* The summary — five chapters in a continuous carousel. The one
          centred heading on the page after the hero, between two set left,
          as For attorneys alternates them (Aaron, Nov 25). */}
      <section className="relative overflow-hidden bg-[#F8FAFC] pb-16 md:pb-24">
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <h2 className={`${H2_CLS} text-[#222222]`} style={H2_STYLE}>
              Forget the legalese. <span className={ACCENT_CLS}>We&rsquo;ll summarize everything.</span>
            </h2>
            <p className={`mx-auto mt-5 max-w-2xl ${LEAD_CLS} text-gray-500`} style={LEAD_STYLE}>
              Willow turns your plan into a story your family can actually follow, reviewed and approved by your attorney before anyone sees a word.
            </p>
          </div>
          <ChapterCarousel />
        </div>
      </section>

      {/* Preparedness & sharing: the heading set left, as Stay in touch */}
      <section className="relative overflow-hidden bg-[#F8FAFC] pb-16 md:pb-24">
        <div className={`${WRAP} relative z-10 max-w-6xl lg:px-10`}>
          <div className="mb-12 max-w-3xl md:mb-16">
            <h2 className={`${H2_CLS} text-[#222222]`} style={H2_STYLE}>
              Prepare your team now, <span className={ACCENT_CLS}>so no one&rsquo;s left scrambling later.</span>
            </h2>
            <p className={`mt-5 max-w-2xl ${LEAD_CLS} text-gray-500`} style={LEAD_STYLE}>
              Everyone gets exactly what they need, exactly when they need it, from one place you control.
            </p>
          </div>
          <div className="flex flex-col gap-16 md:gap-24">
            <ShareBlock
              eyebrow="Gather"
              title="Everything they'll need, where they'll look for it."
              body="Beyond the legal documents: accounts, insurance, passwords, the pediatrician's number. Willow tells you exactly what to gather and where it goes, so when someone has to step in, it's waiting for them, not buried in a drawer, an inbox, or someone's memory."
            >
              <CategoriesVignette />
            </ShareBlock>
            <ShareBlock
              flip
              eyebrow="Share"
              title="Everyone ends up prepared."
              body="An executor needs different things than a guardian. Willow understands each role and recommends who should receive what. You review it and approve. Everyone you've named gets their own portal, so what's meant for them is there when they sign in."
            >
              <SectionShareVignette />
            </ShareBlock>
            <ShareBlock
              eyebrow="Control"
              title="You control what opens, and when."
              body="Putting something in someone's hands too early can cause friction in a family. So Willow lets you put everything in place today and control when each piece releases. The will stays sealed until your passing is verified by your attorney. Until then, the people you've named can see something is waiting for them, but not what it says."
            >
              <ReleaseTimingVignette />
            </ShareBlock>
            <ShareBlock
              flip
              eyebrow="Stay current"
              title="Nothing goes out of date."
              body="When a plan is updated and responsibilities change hands, Willow notices and proposes exactly what needs to change in what you've already shared. You review it once and approve."
            >
              <RoleChangeVignette />
            </ShareBlock>
          </div>
        </div>
      </section>

    </PageShell>
  );
};

export default ForClientsPage;
