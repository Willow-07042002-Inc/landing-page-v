import React, { useEffect, useRef, useState } from "react";
import { VignetteFrame } from "@/components/ProductVignettes";
import { ClientEstatePlanTodayScreen } from "@/components/product/client-app";
import { ScaledScreen } from "@/components/product/kit";
import { PageShell, PageHero, PrintFrame, PrimaryButton, Faq, WRAP, usePageMeta, H2_CLS, H2_STYLE, ACCENT_CLS, LEAD_CLS, LEAD_STYLE } from "@/components/site/blocks";
import ReachOutButton from "@/components/site/AttorneyReferral";
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
  { label: "Their team", vis: <TeamRosterVignette /> },
  { label: "Who's responsible if someone needs to step in", vis: <StepInVignette /> },
  { label: "Where everything goes", vis: <WhoGetsWhatVignette /> },
  { label: "Testamentary trust", vis: <TrustVignette /> },
  { label: "Their documents", vis: <DocumentsVaultVignette /> },
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

/* ── The questions an attorney asks about their clients' side of Willow,
      asked and answered to the attorney, as the whole site speaks (Aaron,
      Nov 25). The answers restate what the page and the product already
      say; the one new fact, that the people a client names don't pay, is
      Aaron's. Kept plain so "at any time" never reads as "before it's been
      released". ── */
const CLIENT_FAQ = [
  {
    q: "Who can see a client’s plan?",
    a: "Your client and your firm. Nobody else sees anything until your client shares it, and they decide who gets each document and when.",
  },
  {
    q: "Do the people my clients share with have to pay?",
    a: "No. It’s part of your client’s plan. Everyone they name gets their own account at no cost, and sees what’s been shared with them.",
  },
  {
    q: "Can clients keep parts of their plan private until they pass?",
    a: "Yes. Your clients have full authority to choose what’s shared now and what waits until they pass away. Anything held back stays sealed until you verify the passing; until then, the people they’ve named see only that something is waiting for them.",
  },
  {
    q: "Can clients change who has access later?",
    a: "Yes, at any time. They can add or remove people and change what each one has. When you update a plan, Willow suggests what to change in what they’ve already shared, and your client approves it.",
  },
  {
    q: "Who writes the plain-English summary?",
    a: "Willow drafts it from the signed documents, and you review and approve it before your client sees a word.",
  },
  {
    q: "Is client information used to train AI?",
    a: "Never. Documents are read only to draft the summary you review, and that processing stays in the United States.",
  },
  {
    q: "How do my clients get Willow?",
    a: "Drop in their signed documents. Willow goes through the details, creates their accounts and sends the invites to their portal.",
  },
];

/* ── The page's close, for the client reading it (Aaron, Nov 25): Willow
      comes through their attorney, so Willow offers to reach out to them.
      The button opens a small window asking only for the attorney's name
      and email (AttorneyReferral.tsx). Set like the home page's founder
      note, a white card floating over the print, with the print a little
      darker than the page's other frames so the card stands off it. The
      attorney's demo ask is the footer's top line, just below. ── */
const ClientAsk = () => (
  <section className="bg-[#F8FAFC] pb-24 md:pb-32">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <div className="relative overflow-hidden rounded-3xl">
        <img src="/williamsburg.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.4)" }} />
        <div className="relative z-10 p-5 sm:p-10 md:p-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-10 text-center sm:px-10 md:px-14 md:py-14" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
            <h2 className={`${H2_CLS} text-[#222222]`} style={H2_STYLE}>
              Want Willow for your plan? <span className={ACCENT_CLS}>We&rsquo;ll reach out to your attorney.</span>
            </h2>
            <p className={`mx-auto mt-5 max-w-xl ${LEAD_CLS} text-gray-500`} style={LEAD_STYLE}>
              Tell us who drafted your plan, and we&rsquo;ll get in touch with them about Willow.
            </p>
            <div className="mt-8">
              <ReachOutButton />
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
    "An estate plan your clients understand: their plan and their people in one place, and a direct line back to you whenever life changes."
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
        subtitle="Modern enough for the next generation. Simple enough for their parents. Your clients get their plan and their people in one place, and a direct line back to you whenever life changes."
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
      <section className="relative overflow-hidden bg-[#F8FAFC] pb-24 md:pb-32">
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <h2 className={`${H2_CLS} text-[#222222]`} style={H2_STYLE}>
              Forget the legalese. <span className={ACCENT_CLS}>We&rsquo;ll summarize everything.</span>
            </h2>
            <p className={`mx-auto mt-5 max-w-2xl ${LEAD_CLS} text-gray-500`} style={LEAD_STYLE}>
              Willow turns every plan into a story the family can actually follow, reviewed and approved by you before they see a word.
            </p>
          </div>
          <ChapterCarousel />
        </div>
      </section>

      {/* Preparing their team: chapters left, the client's screen right, as
          For attorneys sets out "A practice families keep coming back to" */}
      <ChapterFilmSection
        name="prepare"
        title="Prepare their team now,"
        accent="so no one's left scrambling."
        label="Preparing the people your clients name"
        chapters={PREPARE_CHAPTERS}
        Film={PrepareFilm}
        sectionClass="bg-[#F8FAFC] pb-24 md:pb-32"
      />

      <Faq
        items={CLIENT_FAQ}
        blurb="Want to see it from your client's side? We'll walk you through it."
        action={<PrimaryButton>Request a demo</PrimaryButton>}
        sectionClass="bg-[#F8FAFC] pb-24 md:pb-32"
      />

      <ClientAsk />
    </PageShell>
  );
};

export default ForClientsPage;
