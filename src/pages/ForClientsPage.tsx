import React, { useEffect, useRef, useState } from "react";
import { VignetteFrame } from "@/components/ProductVignettes";
import { ClientEstatePlanTodayScreen } from "@/components/product/client-app";
import { ScaledScreen } from "@/components/product/kit";
import { PageShell, PageHero, PrintFrame, SecondaryButton, WRAP, usePageMeta, H2_CLS, H2_STYLE, ACCENT_CLS, LEAD_CLS, LEAD_STYLE } from "@/components/site/blocks";
import { CLIENT_LOGIN } from "@/content/siteMap";
import StayInTouchFilm from "@/components/site/StayInTouchFilm";
import { ChapterFilmSection } from "@/components/site/StayingAhead";
import PrepareFilm, { PREPARE_CHAPTERS } from "@/components/site/PrepareFilm";
import {
  TeamRosterVignette,
  StepInVignette,
  WhoGetsWhatVignette,
  TrustVignette,
  DocumentsVaultVignette,
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

/* ── The page's close, for the client reading it (Aaron, Nov 25): Willow
      comes through their attorney, so the ask is to bring it up with them,
      by an email they write themselves, or to sign in if they already have
      it. Set like the home page's founder note: the light print fills the
      rounded box and a white card floats over it. The attorney's demo ask is
      the footer's top line, just below. ── */
const ATTORNEY_EMAIL = `mailto:?subject=${encodeURIComponent("Willow for my estate plan")}&body=${encodeURIComponent(
  "Hi,\n\nI came across Willow, which keeps an estate plan, and the attorney who wrote it, in one place for the whole family: https://www.willow-inc.com/for-clients\n\nIs it something you offer, or could set up for my plan?\n\nThank you,"
)}`;

const ClientAsk = () => (
  <section className="bg-[#F8FAFC] pb-16 md:pb-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <div className="relative overflow-hidden rounded-3xl">
        <img src="/williamsburg.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
        <div className="relative z-10 p-5 sm:p-10 md:p-16">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white px-6 py-10 text-center sm:px-10 md:px-14 md:py-14" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
            <h2 className={`${H2_CLS} text-[#222222]`} style={H2_STYLE}>
              Want Willow for your plan? <span className={ACCENT_CLS}>Ask your attorney.</span>
            </h2>
            <p className={`mx-auto mt-5 max-w-xl ${LEAD_CLS} text-gray-500`} style={LEAD_STYLE}>
              Willow comes through the attorney who drafted your plan. Send them a note about it, or sign in if you already have Willow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={ATTORNEY_EMAIL}
                className="press inline-flex h-11 items-center justify-center rounded-md bg-[#128F8B] px-6 text-[15px] font-medium text-white hover:bg-[#0C7370]"
              >
                Email your attorney about Willow
              </a>
              <SecondaryButton href={CLIENT_LOGIN}>Log in to your plan</SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
      <section className="relative overflow-hidden bg-[#F8FAFC] py-16 md:py-24">
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

      {/* Preparing their team: chapters left, the client's screen right, as
          For attorneys sets out "A practice families keep coming back to" */}
      <ChapterFilmSection
        name="prepare"
        title="Prepare your team now,"
        accent="so no one's left scrambling."
        label="Preparing the people you've named"
        chapters={PREPARE_CHAPTERS}
        Film={PrepareFilm}
        sectionClass="bg-[#F8FAFC] py-16 md:py-24"
      />

      <ClientAsk />
    </PageShell>
  );
};

export default ForClientsPage;
