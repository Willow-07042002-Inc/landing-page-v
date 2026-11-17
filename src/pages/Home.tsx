import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AttorneyQuotes from "@/components/AttorneyQuotes";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, ChevronRight, Link2, Plus } from "lucide-react";
import { SharingHomeShot } from "@/components/ClientVignettes";
import { Link } from "react-router-dom";
import { LinkCards, SecurityBand } from "@/components/site/blocks";
import { CARDS } from "@/content/pages";
import {
  CheckInDemoVignette,
  ClientDetailJourneyVignette,
  ActiveClientsNextStepsVignette,
  SigningVignette,
  AssetBreakdownVignette,
  SharingRecommendationVignette,
} from "@/components/ProductVignettes";

/**
 * Renders a full-size product screen (1440×855 by default; pass `w` for a
 * wider canvas) scaled to fit its parent. Building at real app dimensions lets
 * the markup reuse the exact spacing and type sizes from the product code.
 */
const ScaledScreen = ({ children, w = 1440 }: { children: React.ReactNode; w?: number }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 50) setScale(width / w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={outerRef} className="absolute inset-0 overflow-hidden">
      <div style={{ width: w, height: 855, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
};

// Tints the real product SVG icons (which rely on currentColor) via CSS mask
const MaskIcon = ({ src, color, size = 18 }: { src: string; color: string; size?: number }) => (
  <span
    aria-hidden
    style={{
      display: "inline-block",
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMask: `url(${src}) center / contain no-repeat`,
      mask: `url(${src}) center / contain no-repeat`,
    }}
  />
);

// ---- Attorney dashboard, recreated from apps/professionals ----
const PRO_CARD_SHADOW =
  "0 2px 4px rgba(16,24,40,0.05), 0 18px 36px -12px rgba(16,24,40,0.20), 0 40px 72px -24px rgba(16,24,40,0.18)";

const ProColumn = ({
  icon,
  title,
  count,
  action,
  footer,
  rounding,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  action?: React.ReactNode;
  footer?: string;
  rounding: string;
  children: React.ReactNode;
}) => (
  <div className={`overflow-hidden ${rounding}`} style={{ boxShadow: PRO_CARD_SHADOW }}>
    <div className="flex h-full flex-col bg-white">
      <div className="flex min-h-[57px] items-center justify-between gap-3 border-b border-[#EEF0F2] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          {icon}
          <h4 className="text-[15px] font-semibold text-[#1F2933]">{title}</h4>
          <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[12px] font-semibold text-[#6B7280]">{count}</span>
        </div>
        {action}
      </div>
      <div className="flex flex-1 flex-col divide-y divide-[#EEF0F2]">{children}</div>
      {footer && (
        <div className="flex items-center justify-between border-t border-[#EEF0F2] px-5 py-3 text-[13px] font-medium text-[#309E96] hover:bg-[#F8FAFA]">
          {footer}
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </div>
      )}
    </div>
  </div>
);

const JourneyTrack = ({ step }: { step: number }) => (
  <span className="flex w-[72px] flex-shrink-0 gap-[3px]">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className="h-[3px] flex-1 rounded-full"
        style={{ backgroundColor: s < step ? "#128F8B" : s === step ? "rgba(18,143,139,0.3)" : "#E5E7EB" }}
      />
    ))}
  </span>
);


/* SignedPlansIcon — verbatim from packages/ui/components/icons/signed-plans-icon.tsx
   (added to the platform icon library Sept 2). */
const PlansSignedIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor" className="text-[#309E96]">
    <path fillRule="evenodd" clipRule="evenodd" d="M7 2.5h6.5L18.6 7.6V19.4A2.1 2.1 0 0 1 16.5 21.5H7A2.1 2.1 0 0 1 4.9 19.4V4.6A2.1 2.1 0 0 1 7 2.5Zm6.6 1.1V6.8A1.1 1.1 0 0 0 14.7 7.9H17.9z" />
  </svg>
);

const AttorneyDashboardScreen = () => (
  <div className="flex h-full w-full bg-[#F0F2F5] text-left" style={{ fontFamily: "Figtree, Inter, sans-serif", height: 855 }}>
    {/* Sidebar */}
    <div className="flex w-[68px] flex-shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
      <div className="flex h-16 items-center px-[14px]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#309E96] text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 20, lineHeight: 1, paddingTop: 2 }}>
          W
        </span>
      </div>
      <div className="mx-3 border-t border-[#E5E7EB]" />
      <div className="flex flex-col gap-0.5 px-2 pt-6">
        <span className="flex items-center justify-center rounded-lg px-3 py-2">
          <MaskIcon src="/mock/dashboard-icon.svg" color="#309E96" />
        </span>
        <span className="flex items-center justify-center rounded-lg px-3 py-2 hover:bg-[#F8FAFA]">
          <MaskIcon src="/mock/clients-icon.svg" color="#9CA3AF" />
        </span>
      </div>
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      {/* Top bar */}
      <div className="flex h-16 flex-shrink-0 items-center border-b border-[#E5E7EB] bg-white px-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="ml-auto flex items-center gap-1">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F8FAFA]">
            <Bell className="h-5 w-5" strokeWidth={1.8} />
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#309E96] px-1 text-[10px] font-bold text-white ring-2 ring-white">3</span>
          </span>
          <span className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-[#F8FAFA]">
            <span className="text-right">
              <span className="block text-[13px] font-semibold leading-tight text-[#1F2933]">Rachel Alvarez</span>
              <span className="mt-0.5 block text-[11px] leading-tight text-[#9CA3AF]">Alvarez Family Law</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F9F9] text-[11px] font-bold text-[#309E96] ring-1 ring-black/5">RA</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1400px] px-12 py-12">
        <h3 className="text-[40px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.15, fontFamily: "Figtree, Inter, sans-serif" }}>
          Good morning, Rachel.
        </h3>

        <div className="mt-8 grid grid-cols-3 gap-1.5">
          <ProColumn
            icon={<MaskIcon src="/mock/leads-icon.svg" color="#309E96" size={20} />}
            title="New leads"
            count={3}
            rounding="rounded-l-2xl"
            action={
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium text-[#128F8B] hover:bg-[#F0F9F9] hover:text-[#0F7673]">
                <Link2 className="h-3.5 w-3.5" strokeWidth={2} /> Copy link
              </span>
            }
          >
            {[
              { n: "Jordan Lee", i: "JL", m: "Start a new estate plan", t: "Thursday at 2:30 PM" },
              { n: "Amara Patel", i: "AP", m: "Update an existing plan", t: "Friday at 11:00 AM" },
              { n: "Chris Novak", i: "CN", m: "Start a new estate plan", t: "Tue, Sep 15 at 9:15 AM" },
            ].map((r) => (
              <div key={r.n} className="group flex min-h-[84px] items-center justify-between gap-3 bg-white px-5 py-4 transition-colors hover:bg-[#F8FAFA]">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[13px] font-semibold text-[#9CA3AF] ring-1 ring-black/5 group-hover:bg-[#F0F9F9] group-hover:text-[#309E96]">{r.i}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{r.n}</span>
                    <span className="block truncate text-[#9CA3AF]" style={{ fontSize: 13 }}>{r.m}</span>
                  </span>
                </div>
                <span className="flex-shrink-0 whitespace-nowrap text-[12px] text-[#9CA3AF]">{r.t}</span>
              </div>
            ))}
          </ProColumn>

          <ProColumn
            icon={<MaskIcon src="/mock/clients-icon.svg" color="#309E96" size={20} />}
            title="Active clients"
            count={10}
            footer="View all 10 clients"
            rounding="rounded-none"
            action={
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium text-[#128F8B] hover:bg-[#F0F9F9] hover:text-[#0F7673]">
                <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add
              </span>
            }
          >
            {[
              { n: "Daniel Rosen", i: "DR", step: 3, label: "Step 3 of 5 · Planning meeting" },
              { n: "Maria Rosen", i: "MR", step: 2, label: "Step 2 of 5 · Your information" },
              { n: "Elena Ruiz", i: "ER", step: 5, label: "Step 5 of 5 · Signing" },
              { n: "Marcus Webb", i: "MW", step: 4, label: "Step 4 of 5 · Review meeting" },
            ].map((r) => (
              <div key={r.n} className="group flex min-h-[84px] items-center justify-between gap-3 bg-white px-5 py-4 transition-colors hover:bg-[#F8FAFA]">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[13px] font-semibold text-[#9CA3AF] ring-1 ring-black/5 group-hover:bg-[#F0F9F9] group-hover:text-[#309E96]">{r.i}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{r.n}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <JourneyTrack step={r.step} />
                      <span className="truncate text-[#9CA3AF]" style={{ fontSize: 12.5 }}>{r.label}</span>
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </ProColumn>

          <ProColumn
            icon={<PlansSignedIcon />}
            title="Plans signed"
            count={206}
            footer="View all 206 clients"
            rounding="rounded-r-2xl"
          >
            {[
              { n: "Sam Whitfield", i: "SW", m: "sam.whitfield@gmail.com" },
              { n: "Priya Anand", i: "PA", m: "priya.anand@outlook.com" },
              { n: "Grace Liu", i: "GL", m: "grace.liu@yahoo.com" },
              { n: "Olivia Grant", i: "OG", m: "olivia.grant@gmail.com" },
            ].map((r) => (
              <div key={r.n} className="group flex min-h-[84px] items-center justify-between gap-3 bg-white px-5 py-4 transition-colors hover:bg-[#F8FAFA]">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[13px] font-semibold text-[#9CA3AF] ring-1 ring-black/5 transition-colors group-hover:bg-[#F0F9F9] group-hover:text-[#309E96]">{r.i}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{r.n}</span>
                    <span className="block truncate text-[#9CA3AF]" style={{ fontSize: 13 }}>{r.m}</span>
                  </span>
                </div>
                <span className="flex-shrink-0 rounded-full bg-[#E6F5F4] px-2.5 py-0.5 text-[11px] font-semibold text-[#0C7370]">Active</span>
              </div>
            ))}
          </ProColumn>
        </div>
      </div>
    </div>
  </div>
);

// ---- Client "My Estate Plan" screen, recreated from apps/clients ----
const ClientCard = ({
  icon,
  title,
  subtitle,
  open,
  disabled,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  open?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}) => (
  <div className={`bg-white ${disabled ? "opacity-50 grayscale" : ""}`}>
    <div className={`flex items-center gap-4 p-6 text-left ${disabled ? "cursor-default" : "transition-colors hover:bg-[#F4F5F6]"}`}>
      <img src={icon} alt="" className="h-14 w-14 flex-shrink-0 object-contain" />
      <span className="min-w-0 flex-1">
        <span className="mb-0.5 block font-semibold text-[#1F2933]" style={{ fontSize: 16 }}>{title}</span>
        <span className="block text-[#9CA3AF]" style={{ fontSize: 14 }}>{subtitle}</span>
      </span>
      {!disabled && <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`} />}
    </div>
    {open && <div className="px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>}
  </div>
);

const ShareBar = ({ name, pct, note }: { name: string; pct: number; note: string }) => (
  <div className="mb-4">
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="font-medium text-[#1F2933]" style={{ fontSize: 14 }}>{name}</span>
      <span className="font-semibold text-[#128F8B]" style={{ fontSize: 14 }}>{pct}%</span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
      <div className="h-full rounded-full bg-[#128F8B]" style={{ width: `${pct}%` }} />
    </div>
    <div className="mt-1.5 text-[#9CA3AF]" style={{ fontSize: 13 }}>{note}</div>
  </div>
);

export const ClientEstatePlanScreen = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#FAFBFC] text-left" style={{ fontFamily: "Inter, sans-serif", height: 855 }}>
    {/* Header */}
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="relative mx-auto flex w-full max-w-[1300px] items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <span className="px-4 py-2 text-base font-medium text-[#128F8B] underline decoration-2 underline-offset-4">My Estate Plan</span>
          <span className="flex items-center gap-1 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Shared <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        <img src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" alt="Willow" className="absolute left-1/2 h-10 -translate-x-1/2" />
        <div className="text-right">
          <span className="block text-sm font-semibold text-gray-900">Daniel Rosen</span>
          <span className="block text-xs text-gray-500">daniel.rosen@gmail.com</span>
        </div>
      </div>
    </div>

    {/* Hero band */}
    <div className="border-b border-gray-100 bg-white px-6 pb-7 pt-8 text-center">
      <h3 className="mb-2 text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: 38, fontWeight: 600 }}>
        Your Plan's Playbook
      </h3>
      <p className="mx-auto max-w-[540px] text-[#6B7280]" style={{ fontSize: 17, lineHeight: 1.6 }}>
        We've made it simple for you to understand everything.
      </p>
    </div>

    {/* Card stack */}
    <div className="mx-auto max-w-[900px] px-4 pt-6">
      <div className="space-y-1.5 overflow-hidden rounded-2xl bg-gray-100" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <ClientCard icon="/mock/family-icon.png" title="You & Your Family" subtitle="The people at the center of your plan" />
        <ClientCard icon="/mock/shield-icon.png" title="If You Need Someone to Step In" subtitle="What happens if you can't make decisions for yourself" />
        <ClientCard icon="/mock/tree-icon.png" title="What You'll Leave Behind" subtitle="How your estate is managed and distributed" />
        <ClientCard icon="/mock/docs-icon.png" title="Your Documents" subtitle="Signed documents, recordings, and compliance files" />
      </div>
    </div>

    {/* Ask Eva */}
    <div className="absolute bottom-6 right-6 flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-5 shadow-lg hover:shadow-xl">
      <img src="/mock/eva.png" alt="Eva" className="h-10 w-10 rounded-full object-cover" style={{ backgroundColor: "rgba(84,167,154,0.1)" }} />
      <span className="font-medium text-[#1F2933]" style={{ fontSize: 15 }}>Ask Eva</span>
    </div>
  </div>
);

// Rotating phrases for the hero. The stem commands the attorney ("Ensure your
// clients…"), so every phrase is an outcome they guarantee by using Willow.
// Every phrase sits in the same grid cell, so the headline is always as tall
// as its longest phrase at the current width and never jumps as they change.
const HERO_PHRASES = [
  "actually understand their plans.",
  "share their plan on their terms.",
  "never lose a document.",
  "keep executors and guardians prepared.",
  "keep coming back to you.",
];

const ROTATE_MS = 2800;

const HeroRotator = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => {
        setPrevIndex(i);
        return (i + 1) % HERO_PHRASES.length;
      });
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    // The padding/negative margin pair widens the clip box so descenders and
    // italic overhangs aren't cut, without changing the layout.
    <span className="-my-[0.12em] grid overflow-hidden py-[0.12em] pr-[0.1em] italic text-[#138F8B]">
      {HERO_PHRASES.map((p, i) => (
        <span
          key={p}
          aria-hidden={i !== index}
          className="[grid-area:1/1]"
          style={{
            textWrap: "balance",
            transform: i === index ? "translateY(0)" : i === prevIndex ? "translateY(-110%)" : "translateY(110%)",
            opacity: i === index ? 1 : 0,
            transition: reduced ? "none" : "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",
          }}
        >
          {p}
        </span>
      ))}
    </span>
  );
};

/* One product shot under the hero, matted in a print the way harvey.ai frames
   its hero screenshot, with no scroll effects. Harvey's frame is 1376×750 at
   1440 (radius 4px, 8px from 1025px) and its screen window sits centred with
   an even mat, 83% of the frame's width. The screen here is the attorney
   dashboard exactly as it appears on willow-inc.com today, shown to the same
   window shape (1440×775 of its 1440×855 canvas). On a phone the screen runs
   off the bottom-right edge so it stays legible. */
const HeroShot = () => (
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] md:aspect-[1376/750] min-[1025px]:rounded-[8px]">
    <img src="/golden-gate.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
    <div
      role="img"
      aria-label="The Willow attorney dashboard: active clients and plans signed."
      className="absolute left-[6%] top-[7%] w-[170%] overflow-hidden rounded-lg bg-[#F0F2F5] [aspect-ratio:1440/855] md:left-[8.43%] md:top-[8.93%] md:w-[83.14%] md:[aspect-ratio:1440/775]"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
    >
      <ScaledScreen>
        <AttorneyDashboardScreen />
      </ScaledScreen>
    </div>
  </div>
);

/* Two doors, as on harvey.ai: hovering a card widens it to a 1.4 share of the
   row and dims its neighbour (.aud-row / .aud-card in index.css). Both screens
   are product shots already on willow-inc.com, drawn wider than the card, so
   widening shows more of them. */
const AUDIENCES: { title: string; body: string; cta: string; to: string; image: string; shot: React.ReactNode }[] = [
  {
    title: "For attorneys",
    body: "Every client and every next step in one place, from the first meeting to the signed plan and every year after.",
    cta: "Explore Willow for attorneys",
    to: "/platform",
    image: "/nyc-skyline.jpg",
    shot: (
      <div className="relative w-[130vw] max-w-[1440px] min-[1025px]:w-[68vw]" style={{ aspectRatio: "900 / 400" }}>
        <ActiveClientsNextStepsVignette />
      </div>
    ),
  },
  {
    title: "For clients & their team",
    body: "A plan clients understand, kept in one place and shared with executors, guardians and agents on their terms.",
    cta: "Explore Willow for clients",
    to: "/for-clients",
    image: "/west-side-hwy.jpg",
    shot: (
      <div className="relative w-[130vw] max-w-[1440px] min-[1025px]:w-[68vw]" style={{ aspectRatio: "1440 / 855" }}>
        <ScaledScreen>
          <ClientEstatePlanScreen />
        </ScaledScreen>
      </div>
    ),
  },
];

/* Set on harvey.ai's AudienceRouterSection: heading-2 and a 560px sentence,
   a large step down to a row that is twice as wide as it is tall from 1025px
   (stacked 3:4 cards below that, at most 500px tall). Each card's print is
   pinned to its outer edge at 5:4, so it doesn't move as the card widens. */
const AudienceRouter = () => (
  <section className="bg-[#FCFCFD] pt-[var(--hv-lg)]">
    <div className="hv-wrap hv-grid">
      <div className="hv-content">
        <div className="col-span-full flex flex-col gap-[var(--hv-lg)]">
          <div className="flex flex-col items-center gap-[var(--hv-sm)] text-center">
            <h2 className="hv-h2 font-heading font-light text-[#222222]">
              One platform, <span className="text-[#138F8B]">for the attorney and the family.</span>
            </h2>
            <p className="hv-body-2 max-w-[560px] text-gray-600">
              Attorneys run every client relationship from one place. Clients and the people they name get a plan they understand, shared on their terms.
            </p>
          </div>

          <div className="aud-row flex flex-col gap-[var(--hv-sm)] overflow-hidden min-[1025px]:aspect-[2/1] min-[1025px]:flex-row">
            {AUDIENCES.map((a, i) => (
              <Link
                key={a.to}
                to={a.to}
                className="aud-card group relative flex aspect-[3/4] max-h-[500px] flex-1 flex-col overflow-hidden rounded-[8px] text-white min-[1025px]:aspect-auto min-[1025px]:max-h-none"
              >
                <div className={`absolute inset-0 min-[1025px]:aspect-[5/4] ${i === 0 ? "min-[1025px]:right-auto" : "min-[1025px]:left-auto"}`}>
                  <img src={a.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.72)" }} />
                <div className="relative flex flex-col items-start gap-[var(--hv-sm)] px-[var(--hv-md)] pt-[var(--hv-md)]">
                  <h3 className="hv-h3 font-heading font-normal min-[1025px]:max-w-[420px]">{a.title}</h3>
                  <p className="hv-body-2 max-w-[480px] text-white/85 min-[1025px]:max-w-[300px]">{a.body}</p>
                  <span className="inline-flex h-8 w-max items-center rounded-[4px] border border-white/80 px-3 text-[13px] font-medium transition-colors duration-300 group-hover:bg-white/10">
                    {a.cta}
                  </span>
                </div>
                <div className="relative mt-[var(--hv-md)] pl-[var(--hv-md)]">
                  <div className="w-max overflow-hidden rounded-tl-[8px] bg-white min-[1025px]:ml-12" style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }}>
                    {a.shot}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// The four core capabilities. Left list activates as you scroll; the
// screenshots on the right slide up and stack over one another.
const CAPABILITIES: { title: string; body: string; print: string; visual: React.ReactNode; fitAspect?: string; fitWidth?: string }[] = [
  {
    title: "Every client, and every action waiting on you.",
    body:
      "New leads from your booking page, every active client, and one list of what needs you: summaries to approve, release requests, emails ready to send.",
    print: "/central-park.jpg",
    visual: <ActiveClientsNextStepsVignette />,
    fitAspect: "900 / 400",
  },
  {
    title: "Keep your signing ceremony. Lose the binder.",
    body:
      "Sign the way you do today and upload the executed documents. Willow's own signing ceremony is built, and it opens state by state as the law allows.",
    print: "/golden-gate.jpg",
    visual: (
      <div className="absolute inset-0">
        <img src="/lovable-uploads/Signing Product Shot.png" alt="Willow digital signing ceremony" className="h-full w-full object-cover object-center" />
      </div>
    ),
    fitAspect: "2056 / 1258",
  },
  {
    title: "Every document safe, and easy to understand.",
    body:
      "Signed documents and every past version live in one secure place, with every gift, condition and power written out in plain English you've approved.",
    print: "/florida-coast.jpg",
    visual: <AssetBreakdownVignette />,
    fitAspect: "900 / 650",
  },
  {
    title: "Ensure your executors and guardians are prepared.",
    body:
      "Willow understands each person's role and recommends what they should see. Anything sealed stays sealed until you verify a passing.",
    print: "/hudson-bridge.jpg",
    visual: <SharingRecommendationVignette h={660} />,
    fitAspect: "760 / 660",
    fitWidth: "76%",
  },
  {
    title: "Relationships that last, and new ones with the family.",
    body:
      "A yearly rhythm of check-ins and updates, each one approved by you, brings clients back when life changes, and introduces you to the executors and family who'll need an attorney next.",
    print: "/willow-street.jpg",
    visual: <CheckInDemoVignette h={520} />,
    fitAspect: "900 / 520",
  },
];

const StackedCapabilities = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const n = CAPABILITIES.length;
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    const onScroll = () => {
      if (!trackRef.current || !isDesktop() || reduced) return;
      const rect = trackRef.current.getBoundingClientRect();
      const total = trackRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const prog = Math.max(0, Math.min(0.999, -rect.top / total)) * n;
      // Incoming cards start below the SCREEN and travel up into the frame,
      // not out of the frame's own bottom edge
      const visual = panelRefs.current[0]?.parentElement;
      const offscreen = visual ? window.innerHeight - visual.getBoundingClientRect().top + 60 : 800;
      panelRefs.current.forEach((panel, j) => {
        if (!panel) return;
        if (j === 0) {
          panel.style.transform = `scale(${1 - 0.03 * Math.max(0, Math.min(2, prog))})`;
          return;
        }
        const t = Math.max(0, Math.min(1, j - prog));
        const sc = 1 - 0.03 * Math.max(0, Math.min(2, prog - j));
        panel.style.transform = `translateY(${t * offscreen}px) scale(${sc})`;
      });
      setActive(Math.min(n - 1, Math.floor(prog)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [n, reduced]);

  return (
    <>
      {/* Section intro — scrolls away before the pin, like General Magic */}
      <div className="container mx-auto px-4 pt-14 md:px-6 md:pt-16 lg:px-10 max-w-7xl">
        <div className="flex items-center gap-3 text-[15px] font-semibold uppercase tracking-widest text-gray-500">
          <span className="w-6 h-1.5 rounded-full bg-[#138F8B]" />
          Core capabilities
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-heading font-bold text-[#222222] mt-3 max-w-3xl" style={{ lineHeight: 1.25 }}>
          Purpose-built for estate attorneys and the families they protect.
        </h2>
      </div>

      {/* Desktop: pinned scrollytelling — half copy, half product image */}
      <div ref={trackRef} className="relative hidden md:block" style={{ height: reduced ? "auto" : `${n * 55 + 100}vh`, marginTop: reduced ? 0 : -60 }}>
        <div className={`${reduced ? "" : "sticky top-0 h-screen"} flex flex-col`} style={{ paddingTop: 76 }}>
          <div className="flex flex-1 items-center min-h-0">
          <div className="container mx-auto px-6 lg:px-10 max-w-7xl grid md:grid-cols-[38.2fr_61.8fr] gap-8 lg:gap-10 items-center w-full">
            <div className="flex flex-col">
              {CAPABILITIES.map((cap, i) => (
                <div key={cap.title} className={`py-4 ${i === 0 ? "border-t-2 border-[#222222]" : "border-t border-gray-200"}`}>
                  <h3
                    className={`font-heading font-bold text-xl lg:text-2xl transition-colors duration-300 cursor-default ${
                      i === active ? "text-[#222222]" : "text-gray-400"
                    }`}
                  >
                    {cap.title}
                  </h3>
                  {/* Accordion: one open at a time. Max-height and fade share one easing
                      so the expanding item absorbs the collapsing one without a visible jump. */}
                  {/* One shared duration + easing for closing and opening bodies:
                      the expanding item absorbs the collapsing one, so the list
                      makes a single curtain-pull movement in step with the image. */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: i === active ? "10.5rem" : 0,
                      transition: "max-height 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <p
                      className="text-[17px] lg:text-lg text-gray-600 leading-relaxed mt-2.5 pr-2"
                      style={{
                        opacity: i === active ? 1 : 0,
                        transform: i === active ? "none" : "translateY(10px)",
                        transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {cap.body}
                    </p>
                  </div>
                  {i === CAPABILITIES.length - 1 && (
                    <Button
                      className="willow-btn mt-6 h-10 px-5 text-[15px] font-medium"
                      onClick={() => (window.location.href = "/request-access")}
                    >
                      Let's get started
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="relative w-full justify-self-end" style={{ aspectRatio: "1 / 1", maxHeight: "calc(100vh - 170px)", maxWidth: "min(100%, calc(100vh - 170px))" }}>
              {CAPABILITIES.map((cap, i) => (
                <div
                  key={cap.title}
                  ref={(el) => (panelRefs.current[i] = el)}
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: i === 0 ? "none" : "translateY(110%)", zIndex: i }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl">
                    <img src={cap.print} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
                    <div
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white ${cap.fitAspect ? "" : "h-[70%]"}`}
                      style={{ width: cap.fitWidth ?? "92%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", ...(cap.fitAspect ? { aspectRatio: cap.fitAspect } : {}) }}
                    >
                      {cap.visual}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile: simple stacked list */}
      <div className="md:hidden container mx-auto px-4 pt-10 pb-6 flex flex-col gap-10">
        {CAPABILITIES.map((cap, i) => (
          <div key={cap.title}>
            <h3 className="font-heading font-bold text-xl text-[#222222] mb-2">{cap.title}</h3>
            <p className="text-[17px] text-gray-600 leading-relaxed mb-4">{cap.body}</p>
            <div className="relative w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl" style={{ aspectRatio: "1 / 1" }}>
              <img src={cap.print} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white ${cap.fitAspect ? "" : "h-[70%]"}`}
                style={{ width: cap.fitWidth ?? "92%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", ...(cap.fitAspect ? { aspectRatio: cap.fitAspect } : {}) }}
              >
                {cap.visual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


/* ── FAQ — what lawyers want to know. Line-based (no boxes), accordion on the
     left, heading + contact on the right. Content carried over from the
     existing lawyer FAQ, plus the signing-is-optional question. ── */
const FAQ_ITEMS: { topic: "practice" | "compliance"; q: string; a: string[] }[] = [
  {
    topic: "practice",
    q: "Do my clients have to sign through Willow?",
    a: [
      "No. Keep your signing ceremony exactly as it is today: pen, paper, conference room. Then upload the executed documents.",
      "Your clients still get everything else: plain-English summaries, secure storage, sharing on their terms, and a yearly rhythm of staying in touch. Willow's own signing ceremony opens state by state as the law allows.",
    ],
  },
  {
    topic: "practice",
    q: "How can I get started?",
    a: [
      "It starts with a short conversation.",
      "We take time to understand your practice and your state, set up your account with you, walk through the platform, and load your first clients together. No process overhaul, just a better way to deliver what you already do.",
    ],
  },
  {
    topic: "practice",
    q: "Does Willow help create estate planning documents?",
    a: [
      "No. You remain fully responsible for advising clients and drafting their documents.",
      "Willow doesn't give legal advice. It stores the signed plan, drafts a plain-English summary for you to review and approve, shares it with the people your client names, and keeps you in touch as life moves forward.",
    ],
  },
  {
    topic: "practice",
    q: "Who can access my clients' documents?",
    a: [
      "Access is controlled by the client.",
      "Only the people a client names, such as executors, guardians or agents, can see documents, through their own accounts. Anything sealed until a passing stays sealed until you verify it. Sharing can be changed at any time, and every change is recorded.",
    ],
  },
  {
    topic: "practice",
    q: "How does Willow help clients come back for updates?",
    a: [
      "Once a plan is approved, Willow keeps a yearly rhythm of check-ins, short surveys and updates from your firm, each one approved by you before it's sent.",
      "When a client says something has changed, you hear about it on your dashboard, and they can book time through your booking page.",
    ],
  },
  {
    topic: "compliance",
    q: "Where is Willow available?",
    a: [
      "Willow is available to firms and clients in every state and Washington, D.C., except Washington State.",
      "Digital signing is separate: it switches on state by state as the law allows, and Where we're live lists each state as it opens.",
    ],
  },
  {
    topic: "compliance",
    q: "How are documents stored?",
    a: [
      "Copies of signed documents and their past versions are stored in the United States, encrypted in transit and at rest. Every view, download and release is recorded, and the record is kept for seven years.",
      "Willow keeps copies; originals stay with you, as they do today.",
    ],
  },
  {
    topic: "compliance",
    q: "Is client information used to train AI?",
    a: [
      "Never. Documents are read only to draft summaries for your review, AI processing stays in the United States, and nothing from a connected email or calendar account is ever sent to an AI provider.",
    ],
  },
  {
    topic: "compliance",
    q: "Is Willow built with estate planning attorneys?",
    a: [
      "Yes. Willow is shaped alongside practicing estate planning attorneys, who use it with real clients and tell us what to build next. Willow does not provide legal advice, and you remain the attorney of record.",
    ],
  },
];

const FaqSection = () => {
  const [topic, setTopic] = useState<"practice" | "compliance">("practice");
  const [open, setOpen] = useState<number | null>(0);
  const items = FAQ_ITEMS.filter((i) => i.topic === topic);
  const pick = (t: "practice" | "compliance") => {
    setTopic(t);
    setOpen(null);
  };
  return (
    <section className="bg-[#FCFCFD] py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Accordion — lines, not boxes */}
          <div className="order-2 md:order-1 md:w-3/5">
            {/* Topic tabs — the professional underline pattern from the product's tab bars */}
            <div className="mb-4 flex gap-7 border-b border-gray-200">
              {([["practice", "Your Practice"], ["compliance", "Compliance"]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => pick(key)}
                  className={`relative pb-3 text-[16px] font-medium transition-colors ${topic === key ? "text-[#138F8B]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {label}
                  {topic === key && <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#138F8B]" />}
                </button>
              ))}
            </div>
            {items.map((item, i) => (
              <div key={item.q} className="border-b border-gray-200">
                <button
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-heading text-xl md:text-2xl font-semibold text-[#222222]" style={{ lineHeight: 1.25 }}>{item.q}</span>
                  <span className="flex-shrink-0 text-2xl leading-none text-gray-400" aria-hidden>
                    {open === i ? "×" : "+"}
                  </span>
                </button>
                <div
                  className="overflow-hidden"
                  style={{ maxHeight: open === i ? "24rem" : 0, transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)" }}
                >
                  <div className="pb-6 pr-8">
                    {item.a.map((para) => (
                      <p key={para.slice(0, 24)} className="mb-3 max-w-2xl text-[17px] md:text-lg leading-relaxed text-gray-600 last:mb-0">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Heading + contact */}
          <div className="order-1 md:order-2 md:w-2/5 md:pl-6">
            <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">FAQ</div>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold text-[#222222]" style={{ lineHeight: 1.25 }}>
              Common Questions
            </h2>
            <p className="mt-4 max-w-sm text-[17px] md:text-lg leading-relaxed text-gray-600">
              Still can't find what you're looking for? We're happy to walk through anything specific to your practice or your jurisdiction.
            </p>
            <Button
              size="lg"
              className="willow-btn mt-6 px-7 py-5 text-base"
              onClick={() => (window.location.href = "/request-access")}
            >
              Let's Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />

      {/* Hero, on harvey.ai's grid (.hv-* in index.css): the headline on the
          left half; from 1025px the sentence and the one button sit in the
          right half with their bottom on the headline's last line. */}
      <section className="w-full bg-[#FCFCFD] pt-[calc(72px+env(safe-area-inset-top)+var(--hv-lg))]">
        <div className="hv-wrap hv-grid">
          <div className="hv-content enter">
            <h1 className="hv-h1 col-span-full font-heading font-light text-[#222222] min-[1025px]:col-span-3 min-[1445px]:col-span-6">
              <span className="block">Ensure your clients</span>
              <HeroRotator />
            </h1>
            <div className="col-span-full mt-[var(--hv-md)] flex flex-col items-start gap-[var(--hv-lg)] min-[1025px]:col-span-3 min-[1025px]:col-start-4 min-[1025px]:mb-[var(--hv-xs)] min-[1025px]:mt-0 min-[1025px]:gap-[var(--hv-md)] min-[1025px]:self-end min-[1445px]:col-span-4 min-[1445px]:col-start-7">
              <p className="hv-body-1 max-w-[560px] text-gray-600 min-[1025px]:max-w-none" style={{ textWrap: "pretty" }}>
                Modernize your practice with our all-in-one platform purpose-built for estate planning attorneys and the clients they serve.
              </p>
              <Link
                to="/request-access"
                className="press inline-flex h-12 w-max items-center justify-center rounded-[4px] bg-[#128F8B] px-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-[#0C7370]"
                style={{ boxShadow: "0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)" }}
                data-hero-demo-button
              >
                Request a demo
              </Link>
            </div>
          </div>
        </div>
        <div className="hv-wrap mt-[var(--hv-lg)]">
          <HeroShot />
        </div>
      </section>

      {/* As seen in, set like harvey.ai's customer-logo band: a centred
          heading, then the logos in cells the size of Harvey's (a sixth of the
          measure, 96px tall). Yahoo Finance as on the live site, and the two
          linked articles. */}
      <section className="bg-[#FCFCFD] py-[var(--hv-xl)]">
        <div className="hv-wrap hv-grid">
          <div className="hv-content">
            <div className="col-span-full flex flex-col items-center gap-[var(--hv-lg)]">
              <h2 className="hv-h3 text-center font-heading font-light text-[#222222]">As seen in</h2>
              <div className="grid w-full grid-cols-3 min-[1025px]:w-1/2">
                <div className="flex h-16 items-center justify-center min-[1025px]:h-24">
                  <img src="/press-yahoo-finance.svg" alt="Yahoo Finance" className="h-auto max-h-7 w-auto max-w-[66%] opacity-55 grayscale" />
                </div>
                <a href="https://markets.businessinsider.com/news/currencies/124-trillion-is-changing-hands-willow-announces-pilot-to-prepare-estate-planning-attorneys-for-the-next-generation-1036548412" target="_blank" rel="noopener noreferrer" className="flex h-16 items-center justify-center opacity-55 grayscale transition-opacity duration-300 hover:opacity-90 min-[1025px]:h-24">
                  <img src="/press-business-insider.svg" alt="Business Insider" className="h-auto max-h-9 w-auto max-w-[66%]" />
                </a>
                <a href="https://www.usatoday.com/press-release/story/42659/digital-estate-planning-arrived-six-years-ago-the-technology-is-finally-catching-up/" target="_blank" rel="noopener noreferrer" className="flex h-16 items-center justify-center opacity-55 grayscale transition-opacity duration-300 hover:opacity-90 min-[1025px]:h-24">
                  <img src="/press-usa-today.svg" alt="USA Today" className="h-auto max-h-7 w-auto max-w-[66%]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For attorneys / For clients & their team */}
      <AudienceRouter />

      {/* Core capabilities */}
      <section className="bg-[#FCFCFD]">
        <StackedCapabilities />
      </section>

      {/* The platform, page by page */}
      <LinkCards
        eyebrow="The platform"
        title="Everything after the signature,"
        accent="in one place."
        cards={["/platform/client-dashboard", "/platform/plan-summaries", "/platform/vault", "/platform/sharing", "/platform/check-ins", "/platform/booking"].map((p) => ({ ...CARDS[p], to: p }))}
      />

      {/* FAQ */}
      <FaqSection />

      <SecurityBand />

      {/* The founder's quote, set on harvey.ai's QuoteCarouselSection: a
          square portrait on the left, the quote in heading-3 on the right,
          centred on the portrait; a slightly deeper ground than the page.
          The first line is the one from the careers page; the rest is from
          the founder's note it replaces. The photo is the live headshot,
          cropped square. */}
      <section className="bg-[#F1F4F7] pb-[var(--hv-lg)] pt-[var(--hv-xl)]">
        <div className="hv-wrap hv-grid">
          <div className="hv-content">
            <figure className="col-span-full grid grid-cols-2 gap-[var(--hv-lg)] min-[1025px]:grid-cols-6 min-[1025px]:gap-[var(--hv-sm)] min-[1445px]:grid-cols-10">
              <div className="col-span-2 min-[1025px]:col-span-3 min-[1445px]:col-span-4">
                <img
                  src="/founder-aaron-burlacoff.jpg"
                  alt="Aaron Burlacoff, founder and CEO of Willow"
                  className="aspect-square w-full rounded-[8px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="col-span-2 flex flex-col justify-center gap-10 min-[1025px]:col-span-3 min-[1025px]:pl-4 min-[1445px]:col-span-5 min-[1445px]:col-start-6 min-[1445px]:pl-0">
                <blockquote className="hv-h3 font-heading font-light text-[#222222]" style={{ textWrap: "pretty" }}>
                  <span className="-ml-[0.45em]">“</span>Estate plans shouldn't live in binders. A plan shouldn't disappear into a drawer the day it's signed. It should stay with the family, current and within reach, and so should the lawyer who built it.”
                </blockquote>
                <figcaption>
                  <p className="hv-body-1 font-medium text-[#222222]">Aaron Burlacoff</p>
                  <p className="hv-body-2 text-gray-600">Founder &amp; CEO, Willow</p>
                </figcaption>
                <Link to="/about" className="hv-body-1 group inline-flex w-max items-center gap-1.5 font-medium text-[#222222]">
                  About Willow
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* For clients — the darkened print card: white copy on the left, the
          client sharing home surfacing out of the bottom-right corner */}
      <section className="bg-white pb-12 md:pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <img src="/west-side-hwy.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.72)" }} />
            <div className="relative z-10 grid md:grid-cols-[1fr_1.15fr]">
              <div className="p-8 md:p-14 lg:p-16 md:pr-4">
                <h2 className="font-heading text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-white" style={{ lineHeight: 1.2, textWrap: "balance" }}>
                  Learn how we keep{" "}
                  <br className="hidden md:block" />
                  your clients connected.
                </h2>
                <p className="mt-6 max-w-xl text-[15px] md:text-[17px] text-white/85" style={{ lineHeight: 1.65 }}>
                  Willow becomes a lasting touchpoint between your practice and the entire family. Everyone understands the plan, gets answers in moments, and is prepared long before when it matters most.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/for-clients")}
                  className="mt-8 inline-flex h-11 items-center rounded-md border border-white/70 bg-transparent px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Explore the client experience
                </button>
              </div>
              <div className="relative h-[340px] sm:h-[400px] md:h-auto md:min-h-[520px]">
                <div className="absolute -bottom-12 -right-12 left-6 top-6 overflow-hidden rounded-tl-xl bg-white md:left-[8%] md:top-[11%]" style={{ boxShadow: "0 16px 56px rgba(0,0,0,0.35)" }}>
                  <SharingHomeShot />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes close the page on every marketing page */}
      <AttorneyQuotes />


      <Footer />

    </div>
  );
};

export default Home;
