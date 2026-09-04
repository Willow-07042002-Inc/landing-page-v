import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, ChevronRight, Link2, Plus } from "lucide-react";
import {
  CheckInDemoVignette,
  ClientDetailJourneyVignette,
  ActiveClientsNextStepsVignette,
  SigningVignette,
  AssetBreakdownVignette,
  SharingRecommendationVignette,
} from "@/components/ProductVignettes";

/**
 * Renders a full-size (1440×855) recreation of a product screen, scaled to
 * fit its parent. Building at real app dimensions lets the markup reuse the
 * exact spacing and type sizes from the actual product code.
 */
const ScaledScreen = ({ children }: { children: React.ReactNode }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 50) setScale(w / 1440);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outerRef} className="absolute inset-0 overflow-hidden">
      <div style={{ width: 1440, height: 855, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
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

const ClientEstatePlanScreen = () => (
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
const HERO_PHRASES = [
  "actually understand their plans.",
  "can sign from anywhere.",
  "never lose a document.",
  "keep executors and guardians prepared.",
  "keep coming back to you.",
];

const ROTATE_MS = 2800;

const HeroRotator = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [fits, setFits] = useState<number[]>(() => HERO_PHRASES.map(() => 1));
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

  // Scale any phrase wider than the headline down to fit, at every viewport size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const cw = el.getBoundingClientRect().width;
      if (cw < 200) return; // ignore degenerate layouts (hidden/collapsed viewport)
      const inners = el.querySelectorAll<HTMLElement>("[data-phrase]");
      const next: number[] = [];
      inners.forEach((inner) => {
        const prev = inner.style.transform;
        inner.style.transform = "none";
        const w = inner.getBoundingClientRect().width;
        inner.style.transform = prev;
        next.push(w > cw ? (cw / w) * 0.98 : 1);
      });
      setFits(next);
    };
    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    // Italic faces load lazily on first paint — re-measure when any font finishes loading
    document.fonts?.addEventListener?.("loadingdone", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      document.fonts?.removeEventListener?.("loadingdone", measure);
    };
  }, []);

  return (
    <span ref={containerRef} className="block relative overflow-hidden text-[#138F8B] italic" style={{ height: "1.3em" }} aria-live="polite">
      {HERO_PHRASES.map((phrase, i) => (
        <span
          key={phrase}
          className="absolute left-0 right-0 top-0 whitespace-nowrap"
          style={{
            transform: i === index ? "translateY(0)" : i === prevIndex ? "translateY(-110%)" : "translateY(110%)",
            opacity: i === index ? 1 : 0,
            transition: reduced ? "none" : "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s",
          }}
        >
          <span data-phrase className="inline-block" style={{ transform: `scale(${fits[i] ?? 1})`, transformOrigin: "center bottom" }}>
            {phrase}
          </span>
        </span>
      ))}
    </span>
  );
};

/**
 * The attorney/client windowpane. Scrolling pins the section and sweeps the
 * divider from the attorney view to the client view (and back on scroll up).
 * The panes are live UI, not screenshots: everything is hoverable, and any
 * click inside a pane goes to booking a meeting.
 */
const SplitShowcase = ({ onBook }: { onBook: () => void }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const clientPaneRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const clientPillRef = useRef<HTMLSpanElement>(null);
  const attorneyPillRef = useRef<HTMLSpanElement>(null);
  const draggingRef = useRef(false);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const render = useCallback((p: number) => {
    const pct = Math.max(0, Math.min(1, p)) * 100;
    if (clientPaneRef.current) clientPaneRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    if (dividerRef.current) dividerRef.current.style.left = `${pct}%`;
    // One label at a time: whichever view holds the majority of the frame
    const clientMajority = p >= 0.5;
    if (clientPillRef.current) clientPillRef.current.style.opacity = clientMajority ? "1" : "0";
    if (attorneyPillRef.current) attorneyPillRef.current.style.opacity = clientMajority ? "0" : "1";
  }, []);

  useEffect(() => {
    if (reduced) {
      render(0.5);
      return;
    }
    const onScroll = () => {
      if (draggingRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      // Phones (unpinned): the sweep runs off raw scroll position — it starts
      // the instant you scroll and completes within the first ~third of a
      // screen, while the section itself scrolls away naturally.
      if (window.innerWidth < 768) {
        const t = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.35)));
        render(t * t * (3 - 2 * t));
        return;
      }
      const total = trackRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const raw = -rect.top / total;
      const t = Math.max(0, Math.min(1, (raw - 0.12) / 0.7));
      render(t * t * (3 - 2 * t));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, render]);

  const setFromX = (clientX: number) => {
    if (!frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    render(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
  };

  return (
    <section
      ref={trackRef}
      // Phones don't pin at all — a 100vh sticky stage around a ~300px frame
      // reads as a screen of blank. The section flows naturally and the pane
      // sweeps across during the first stretch of scroll. Desktop/tablet keep
      // the pinned scrollytelling (iPad portrait trims the track's tail).
      className={`relative pointer-events-none mt-4 md:mt-[-70px] ${reduced ? "" : "md:h-[280vh] md:max-lg:portrait:-mb-[20vh]"}`}
      style={{ marginTop: reduced ? 0 : undefined }}
    >
      <div className={`${reduced ? "" : "md:sticky md:top-0 md:h-screen"} pointer-events-none flex items-center justify-center px-4 pb-6 pt-6 md:pt-[88px]`}>
        <div
          className="pointer-events-auto relative"
          style={{ width: "min(1160px, 94vw, calc((100vh - 170px) * 1.6842))" }}
        >
          {/* Indicator — a small quiet label above the frame, never covering the UI */}
          <div className="absolute -top-7 left-1 h-5">
            <span
              ref={clientPillRef}
              className="absolute left-0 top-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C7370] transition-opacity duration-300"
              style={{ opacity: 0 }}
            >
              Purpose built for clients
            </span>
            <span
              ref={attorneyPillRef}
              className="absolute left-0 top-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C7370] transition-opacity duration-300"
              style={{ opacity: 1 }}
            >
              Purpose built for attorneys
            </span>
          </div>

          <div
            className="relative w-full rounded-2xl border border-gray-300 shadow-2xl overflow-hidden"
            style={{ aspectRatio: "16 / 9.5" }}
          >
            {/* Print frame — the golden-gate print mats the product shot,
                mirroring the framed capability cards further down the page */}
            <img src="/golden-gate.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />

          <div
            ref={frameRef}
            className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden bg-[#F1F5F7]"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)", touchAction: "pan-y" }}
          >

          {/* Attorney view (base layer) — faithful recreation of the professionals dashboard */}
          <div className="absolute inset-0">
            <ScaledScreen>
              <AttorneyDashboardScreen />
            </ScaledScreen>
          </div>

          {/* Client view (revealed layer) — faithful recreation of the My Estate Plan screen */}
          <div ref={clientPaneRef} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
            <ScaledScreen>
              <ClientEstatePlanScreen />
            </ScaledScreen>
          </div>

          {/* Divider — a wider invisible strip keeps it draggable without any visible handle */}
          <div
            ref={dividerRef}
            className="absolute top-0 bottom-0 w-[3px] bg-[#138F8B] cursor-col-resize"
            style={{ left: 0, transform: "translateX(-1.5px)" }}
            onPointerDown={(e) => {
              draggingRef.current = true;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              setFromX(e.clientX);
              e.preventDefault();
            }}
            onPointerMove={(e) => { if (draggingRef.current) setFromX(e.clientX); }}
            onPointerUp={() => { draggingRef.current = false; }}
            onPointerCancel={() => { draggingRef.current = false; }}
          >
            <div className="absolute top-0 bottom-0 -left-2 w-5" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// The four core capabilities. Left list activates as you scroll; the
// screenshots on the right slide up and stack over one another.
const CAPABILITIES: { title: string; body: string; print: string; visual: React.ReactNode; fitAspect?: string; fitWidth?: string }[] = [
  {
    title: "Every client, organized from engagement to signing.",
    body:
      "See who's waiting on you and who you're waiting on. Send documents straight to your client's portal, so everything for the matter lives in one place.",
    print: "/central-park.jpg",
    visual: <ActiveClientsNextStepsVignette />,
    fitAspect: "900 / 400",
  },
  {
    title: "Sign digitally — from anywhere, or right in your office.",
    body:
      "Every signature is captured digitally, whether your client is across the country or across your conference table. No paper to lose. (Remote signing available in select states.)",
    print: "/golden-gate.jpg",
    visual: (
      <div className="absolute inset-0">
        <img src="/lovable-uploads/Signing Product Shot.png" alt="Willow digital signing ceremony" className="h-full w-full object-cover object-center" />
      </div>
    ),
    fitAspect: "2056 / 1258",
  },
  {
    title: "Keep every document safe — and easy to understand.",
    body:
      "Signed documents live in secure online storage built around your state's regulations, with every gift, condition, and account written out in language the family can follow.",
    print: "/florida-coast.jpg",
    visual: <AssetBreakdownVignette />,
    fitAspect: "900 / 650",
  },
  {
    title: "Ensure your executors and guardians are prepared.",
    body:
      "Willow understands everyone's role, recommends what each person should have access to, and releases it exactly when they need it — never a day earlier.",
    print: "/hudson-bridge.jpg",
    visual: <SharingRecommendationVignette h={660} />,
    fitAspect: "760 / 660",
    fitWidth: "76%",
  },
  {
    title: "Grow client relationships — and build new ones with their families.",
    body:
      "As your client's life moves forward, you always stay in the loop. When their executors, guardians, and the people around them need plans of their own, we'll put them in touch with the attorney who knows their family best.",
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
                      maxHeight: i === active ? "9rem" : 0,
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
                      className="willow-btn mt-3 h-10 px-5 text-[15px] font-medium"
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
            {i === CAPABILITIES.length - 1 && (
              <Button
                className="willow-btn mb-4 h-10 px-5 text-[15px] font-medium"
                onClick={() => (window.location.href = "/request-access")}
              >
                Let's get started
              </Button>
            )}
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
      "No. Digital execution is optional — and available in select states.",
      "Keep your signing ceremony exactly as it is today — pen, paper, conference room — then upload the executed documents. Your clients still get everything else: plain-language summaries, secure storage, sharing on their terms, and a plan that stays current for life.",
    ],
  },
  {
    topic: "practice",
    q: "How can I get started?",
    a: [
      "It starts with a short conversation.",
      "We take time to understand your practice and jurisdiction to ensure your firm is a good fit. From there, we guide you through a brief onboarding call, walk through the platform, and answer any questions before you begin using Willow with clients. No process overhaul — just a better way to deliver what you already do.",
    ],
  },
  {
    topic: "practice",
    q: "Does Willow help create estate planning documents?",
    a: [
      "You remain fully responsible for advising clients and drafting estate planning documents.",
      "Willow does not provide legal advice. Instead, we support the execution, storage, and long-term management of the documents you prepare — allowing you to focus your time on what you do best while we help elevate the client experience.",
    ],
  },
  {
    topic: "practice",
    q: "How does the signing ceremony work, and can I tailor it to my practice?",
    a: [
      "Willow supports attorney-led digital execution that aligns with state requirements around witnessing, recordings, and notarization. You remain in control of the ceremony and can pause at any time or build in breaks to review materials with your client.",
      "For practices that prefer a more tailored approach, we can support custom execution flows built around existing regulations. Our goal is to make digital execution compliant and reliable — without forcing you into a one-size-fits-all format.",
    ],
  },
  {
    topic: "practice",
    q: "Who can access my clients' documents?",
    a: [
      "Access is fully controlled by the client.",
      "Only individuals the client explicitly authorizes — such as family members, executors, or fiduciaries — can view documents through their own secure accounts. Permissions can be granted or revoked at any time, ensuring access remains intentional and appropriate.",
    ],
  },
  {
    topic: "practice",
    q: "How does Willow support revisiting plans over time?",
    a: [
      "As life moves forward, Willow helps surface natural moments when an update may be needed — and routes clients back to their attorney.",
      "Clients can book time directly through your connected calendar, and both you and the client receive reminders along with a clear summary of relevant background and documents ahead of the conversation.",
    ],
  },
  {
    topic: "compliance",
    q: "Are there estate planning lawyers on the Willow team?",
    a: [
      "Yes. Our team includes estate planning attorneys with over 35 years of combined experience.",
      "They help shape our workflows, compliance standards, and long-term storage practices to ensure the platform aligns with how estate planning is practiced in the real world. Willow does not provide legal advice, and you remain the attorney of record.",
    ],
  },
  {
    topic: "compliance",
    q: "Is Willow compliant with applicable state laws?",
    a: [
      "Yes. Willow operates only in states where electronic wills are legally recognized, and all execution and storage workflows are designed to align with applicable state law.",
    ],
  },
  {
    topic: "compliance",
    q: "How are documents and recordings stored long term?",
    a: [
      "Our storage is designed for long-term reliability, ensuring signed documents and required supporting materials are securely preserved over time.",
    ],
  },
  {
    topic: "compliance",
    q: "What happens if Willow is no longer operating?",
    a: [
      "Like any law practice planning for continuity, Willow maintains a formal succession plan in the unlikely event we no longer offer our services.",
      "In that situation, custodianship of each will and its associated records would be transferred in accordance with applicable state standards — and the decision about where a will is transferred always remains with the client.",
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
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-[#FCFCFD] pt-[env(safe-area-inset-top)] max-md:flex max-md:min-h-[52svh] max-md:items-center">
        <div className="container mx-auto px-4 pt-20 md:pt-24 pb-1">
          <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full">
            <h1 className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] mb-2 font-heading font-light text-[#222222]" style={{ lineHeight: 1.25 }}>
              Ensure your clients
              <HeroRotator />
            </h1>
            <p className="mb-6 max-w-xl text-[15px] sm:text-base md:text-[17px] font-normal text-gray-500" style={{ lineHeight: 1.5, letterSpacing: "0.01em" }}>
              Modernize your practice with our all-in-one platform purpose-built for estate planning attorneys and the clients they serve.
            </p>
            <Button
              size="lg"
              className="willow-btn px-6 py-5 text-base"
              style={{ boxShadow: "0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)" }}
              onClick={() => navigate("/request-access")}
              data-hero-demo-button
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Attorney/client windowpane */}
      <SplitShowcase onBook={() => setBookOpen(true)} />

      {/* Reviews — two attorney quotes, plain and quiet */}
      <section className="bg-[#FCFCFD] py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {[
              {
                quote:
                  "This is something the industry has needed for a while. It's exciting to see a modern estate planning solution that respects and enhances the expertise of lawyers.",
                name: null,
                role: "Florida Estate Planning Attorney",
              },
              {
                quote:
                  "What appeals to me about Willow's approach is the flexibility it offers — attorneys don't have to choose between jumping into the deep end or playing catch-up later.",
                name: null,
                role: "New York Estate Planning Attorney",
              },
            ].map((r) => (
              <figure key={r.quote} className="flex flex-col text-center">
                <blockquote className="font-heading text-base md:text-[17px] lg:text-lg leading-relaxed text-[#222222]" style={{ textWrap: "balance" }}>
                  "{r.quote}"
                </blockquote>
                <figcaption className="mt-4 pt-3">
                  <span className="mx-auto mb-3 block w-10 border-t border-gray-300" />
                  {r.name && <span className="block text-base font-semibold text-[#222222]">{r.name}</span>}
                  <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">{r.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Core capabilities */}
      <section className="bg-[#FCFCFD]">
        <StackedCapabilities />
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Our commitment to lawyers — the Golden Gate print fills the rounded
          box; a smaller white box floats over it and carries the content */}
      <section className="bg-white py-10 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <img src="/golden-gate.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "center 45%" }} />
            <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.15)" }} />
            <div className="relative z-10 p-6 md:p-14 lg:p-16">
              <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 md:p-12" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
          <div className="md:grid md:grid-cols-[1.55fr_1fr] md:gap-14 items-center">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">A note from our founder</div>
              <blockquote className="mt-5 font-heading text-[17px] md:text-[19px] leading-relaxed text-[#222222]">
                <p>
                  "Estate attorneys bring judgment, discretion, and decades of earned trust. Technology brings access, continuity, and permanence. Together, they change what an estate plan can do for the people it was written for.
                </p>
                <p className="mt-4">
                  Our vision is to give every estate attorney the tools their clients deserve, and to keep the attorney at the center of that relationship. A plan shouldn't disappear into a drawer the day it's signed. It should stay with the family, current and within reach, and so should the lawyer who built it.
                </p>
                <p className="mt-4">
                  We're building more than a product. Alongside estate attorneys, we're setting a new standard for how plans are signed, stored, and carried forward — a future where families are never left guessing, and every attorney is free to do what they do best."
                </p>
              </blockquote>
            </div>
            <div className="mt-10 flex flex-col items-center text-center md:mt-0">
              <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-gray-200">
                <img
                  src="/Burlacoff Headshot.svg"
                  alt="Aaron Burlacoff"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 25%", transform: "scale(1.7)", transformOrigin: "center center" }}
                />
              </div>
              <div className="mt-4 text-[17px] font-semibold text-[#222222]">Aaron Burlacoff</div>
              <div className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">Founder &amp; CEO, Willow</div>
              <span className="my-5 block w-12 border-t border-gray-200" />
              <Button
                size="lg"
                className="willow-btn h-11 px-6 text-[15px] font-medium"
                onClick={() => navigate("/request-access")}
              >
                Elevate your practice today
              </Button>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Book-a-meeting popup — opened by clicking inside the product windowpane */}
      {bookOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={() => setBookOpen(false)}
        >
          <div
            className="w-full max-w-[440px] rounded-2xl bg-white p-8 text-center"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 font-heading text-2xl font-bold text-[#222222]">Book a meeting</h3>
            <p className="mb-7 text-base leading-relaxed text-gray-600">
              See both sides of Willow live — a short walkthrough of the attorney workspace and the client experience.
            </p>
            <Button
              size="lg"
              className="willow-btn w-full py-6 text-base"
              onClick={() => navigate("/request-access")}
            >
              Book a Demo
            </Button>
            <button
              className="mt-3 w-full py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
              onClick={() => setBookOpen(false)}
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
