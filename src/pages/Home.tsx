import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AttorneyQuotes from "@/components/AttorneyQuotes";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SharingHomeShot } from "@/components/ClientVignettes";
import { Link } from "react-router-dom";
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
      {/* antialiased, as the product's own <body> is: without it macOS draws
          light-on-dark text (the W mark, white buttons) visibly heavier */}
      <div className="antialiased" style={{ width: w, height: 855, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
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

// ---- Attorney dashboard, recreated from apps/professionals as it is today
// (origin/main = preview, Nov 17): components/dashboard/dashboard-content.tsx,
// dashboard-column.tsx, leads-column.tsx, active-clients-column.tsx,
// reminders-column.tsx, reminders-bell.tsx, top-bar.tsx and sidebar.tsx ----

/* dashboard-content.tsx CARD_SHADOW */
const PRO_CARD_SHADOW =
  "0 2px 4px rgba(16,24,40,0.05), 0 18px 36px -12px rgba(16,24,40,0.20), 0 40px 72px -24px rgba(16,24,40,0.18)";

/* NotificationIcon / RemindersIcon, verbatim from packages/ui */
const ProBellIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12 2.5a1.35 1.35 0 0 0-1.35 1.35v.63C8.05 5.12 6.35 7.32 6.35 9.97c0 3.03-.78 4.63-1.55 5.6-.53.66-.03 1.68.82 1.68h12.76c.85 0 1.35-1.02.82-1.68-.77-.97-1.55-2.57-1.55-5.6 0-2.65-1.7-4.85-4.3-5.49v-.63A1.35 1.35 0 0 0 12 2.5Z" />
    <path d="M9.9 18.7a2.1 2.1 0 0 0 4.2 0Z" />
  </svg>
);

/* sidebar.tsx: the W mark, then Dashboard and Clients (Signings is hidden today) */
const ProSidebar = ({ active }: { active: "dashboard" | "clients" }) => (
  <div className="relative z-30 flex w-[68px] flex-shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
    <div className="flex h-16 items-center px-[14px]">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#309E96] text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 20, lineHeight: 1, paddingTop: 2 }}>
        W
      </span>
    </div>
    <div className="mx-3 border-t border-[#E5E7EB]" />
    <div className="flex flex-col gap-0.5 px-2 pt-6">
      <span className="flex items-center justify-center rounded-lg px-3 py-2">
        <MaskIcon src="/mock/dashboard-icon.svg" color={active === "dashboard" ? "#309E96" : "#9CA3AF"} />
      </span>
      <span className="flex items-center justify-center rounded-lg px-3 py-2">
        <MaskIcon src="/mock/clients-icon.svg" color={active === "clients" ? "#309E96" : "#9CA3AF"} />
      </span>
    </div>
  </div>
);

/* top-bar.tsx: the bell with its unread count, then the attorney and firm */
const ProTopBar = () => (
  <div className="relative z-30 flex h-16 flex-shrink-0 items-center border-b border-[#E5E7EB] bg-white px-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
    <div className="ml-auto flex items-center gap-1">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#6B7280]">
        <ProBellIcon className="h-5 w-5" />
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#309E96] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">3</span>
      </span>
      <span className="flex items-center gap-3 rounded-lg px-2.5 py-2">
        <span className="text-right">
          <span className="block text-[13px] font-semibold leading-tight text-[#1F2933]">Rachel Alvarez</span>
          <span className="mt-0.5 block text-[11px] leading-tight text-[#9CA3AF]">Alvarez Family Law</span>
        </span>
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F9F9] text-[11px] font-bold text-[#309E96] ring-1 ring-black/5">RA</span>
        <WIcon name="chevronDown" className="h-3.5 w-3.5 text-[#9CA3AF]" />
      </span>
    </div>
  </div>
);

/* dashboard-column.tsx DashboardColumn: icon, title, count, a plain text
   action (no icon), rows on hairlines, and an optional footer link */
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
  action?: string;
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
        {action && <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-[13px] font-medium text-[#128F8B]">{action}</span>}
      </div>
      <div className="flex flex-1 flex-col divide-y divide-[#EEF0F2]">{children}</div>
      {footer && (
        <div className="flex items-center justify-between border-t border-[#EEF0F2] px-5 py-3 text-[13px] font-medium text-[#309E96]">
          {footer}
          <WIcon name="chevronRight" className="h-4 w-4" />
        </div>
      )}
    </div>
  </div>
);

/* The grey initials every dashboard row starts with (teal on hover) */
const ProInitials = ({ name }: { name: string }) => (
  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#9CA3AF] ring-1 ring-black/5 transition-colors group-hover:bg-[#F0F9F9] group-hover:text-[#309E96]">
    <span className="text-[13px] font-semibold">{name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
  </span>
);

/* active-clients-column.tsx ClientLine: a single client says "Individual"; half
   of a couple says who they're with, indented beside the couple's tie */
const ProActiveClient = ({ name, sub, indent = false }: { name: string; sub: string; indent?: boolean }) => (
  <div className={`group flex min-h-[84px] items-center justify-between gap-3 bg-white py-4 pr-5 ${indent ? "pl-10" : "pl-5"}`}>
    <div className="flex min-w-0 flex-1 items-center gap-3.5">
      <ProInitials name={name} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{name}</p>
        <p className="truncate text-[#9CA3AF]" style={{ fontSize: 13 }}>{sub}</p>
      </div>
    </div>
  </div>
);

const ProActiveCouple = ({ a, b }: { a: string; b: string }) => (
  <div className="relative bg-white">
    <span aria-hidden className="pointer-events-none absolute bottom-7 left-5 top-7 w-1 rounded-full bg-[#D1D5DB]" />
    <ProActiveClient name={a} sub={`Couple · with ${b.split(" ")[0]}`} indent />
    <div className="ml-10 mr-5 h-px bg-[#F0F1F3]" />
    <ProActiveClient name={b} sub={`Couple · with ${a.split(" ")[0]}`} indent />
  </div>
);

/* reminders-column.tsx: a grey rail (teal on hover), the reminder, the action */
const ProReminder = ({ title, sub, cta }: { title: string; sub?: string; cta: string }) => (
  <div className="group flex min-h-[84px] items-center bg-white px-5 py-4">
    <div className="flex w-full items-stretch gap-3.5">
      <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-[#D1D5DB] transition-colors group-hover:bg-[#7FC5BF]" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{title}</p>
        {sub && <p className="mt-0.5 text-[13px] text-[#9CA3AF]">{sub}</p>}
        <span className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-[#309E96]">
          {cta}
          <WIcon name="arrowRight" className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  </div>
);

const AttorneyDashboardScreen = () => (
  <div className="flex h-full w-full bg-[#F0F2F5] text-left" style={{ fontFamily: "Figtree, Inter, sans-serif", height: 855 }}>
    <ProSidebar active="dashboard" />

    <div className="flex min-w-0 flex-1 flex-col">
      <ProTopBar />

      {/* The greeting types itself out on load and its caret blinks off; this
          is how it rests */}
      <div className="mx-auto w-full max-w-[1400px] px-16 py-12">
        <h3 className="text-[40px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.15, fontFamily: "Figtree, Inter, sans-serif" }}>
          Good morning, Rachel.
        </h3>

        <div className="mt-8 grid grid-cols-3 gap-1.5">
          <ProColumn
            icon={<MaskIcon src="/mock/leads-icon.svg" color="#309E96" size={20} />}
            title="New leads"
            count={3}
            action="Copy link"
            rounding="rounded-l-2xl"
          >
            {[
              { n: "Jordan Lee", m: "Start a new estate plan", t: "Thursday at 2:30 PM" },
              { n: "Amara Patel", m: "Update an existing plan", t: "Friday at 11:00 AM" },
              { n: "Chris Novak", m: "Start a new estate plan", t: "Monday at 9:15 AM" },
            ].map((r) => (
              <div key={r.n} className="group flex min-h-[84px] w-full items-center justify-between gap-3 bg-white px-5 py-4">
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <ProInitials name={r.n} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{r.n}</p>
                    <p className="truncate text-[#9CA3AF]" style={{ fontSize: 13 }}>{r.m}</p>
                  </div>
                </div>
                <span className="flex flex-shrink-0 items-center whitespace-nowrap text-[12px] text-[#9CA3AF]">{r.t}</span>
              </div>
            ))}
          </ProColumn>

          <ProColumn
            icon={<MaskIcon src="/mock/clients-icon.svg" color="#309E96" size={20} />}
            title="Active clients"
            count={10}
            action="Add"
            footer="View all 10 clients"
            rounding="rounded-none"
          >
            <ProActiveCouple a="Daniel Rosen" b="Maria Rosen" />
            <ProActiveClient name="Elena Ruiz" sub="Individual" />
            <ProActiveClient name="Marcus Webb" sub="Individual" />
            <ProActiveCouple a="Sam Whitfield" b="Olivia Grant" />
          </ProColumn>

          <ProColumn
            icon={<ProBellIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />}
            title="Required actions"
            count={4}
            rounding="rounded-r-2xl"
          >
            <ProReminder title="Elena Ruiz's summary is ready for review" cta="Review summary" />
            <ProReminder title="Marcus says something changed" sub="Have you moved, or bought or sold property?" cta="See what changed" />
            <ProReminder title="Priya Anand's summary is ready for review" cta="Review summary" />
            <ProReminder title="Sam says something changed" sub="Has your family dynamic changed?" cta="See what changed" />
          </ProColumn>
        </div>
      </div>
    </div>
  </div>
);

// ---- Attorney Clients page with a client's panel open, recreated from
// apps/professionals (app/dashboard/clients/page.tsx, clients-list.tsx,
// client-card.tsx, client-detail-view.tsx, client-detail/spouse-link.tsx and
// client-detail/estate-plans-tab.tsx, as on the preview branch Nov 17) ----

/* The product's own icons, verbatim from packages/ui/icons/willow-solid */
const WILLOW_ICON_PATHS = {
  search:
    "M17.74 8.43 17.42 7.49 16.98 6.6 16.43 5.77 15.77 5.03 15.03 4.37 14.2 3.82 13.31 3.38 12.37 3.06 11.39 2.87 10.4 2.8 9.41 2.87 8.43 3.06 7.49 3.38 6.6 3.82 5.77 4.37 5.03 5.03 4.37 5.77 3.82 6.6 3.38 7.49 3.06 8.43 2.87 9.41 2.8 10.4 2.87 11.39 3.06 12.37 3.38 13.31 3.82 14.2 4.37 15.03 5.03 15.77 5.77 16.43 6.6 16.98 7.49 17.42 8.43 17.74 9.41 17.93 10.4 18 11.39 17.93 12.37 17.74 13.31 17.42 14.2 16.98 14.51 16.77 19.43 21.67 19.6 21.79 19.99 21.95 20.4 22 20.81 21.95 21.2 21.79 21.53 21.53 21.79 21.2 21.88 21.01 21.99 20.61 21.99 20.19 21.95 19.99 21.79 19.6 21.53 19.27 16.77 14.51 16.98 14.2 17.42 13.31 17.74 12.37 17.93 11.39 18 10.4 17.93 9.41ZM15.13 11.67 14.93 12.28 14.64 12.85 14.29 13.38 13.86 13.86 13.38 14.29 12.85 14.64 12.28 14.93 11.67 15.13 11.04 15.26 10.4 15.3 9.76 15.26 9.13 15.13 8.52 14.93 7.95 14.64 7.42 14.29 6.94 13.86 6.51 13.38 6.16 12.85 5.87 12.28 5.67 11.67 5.54 11.04 5.5 10.4 5.54 9.76 5.67 9.13 5.87 8.52 6.16 7.95 6.51 7.42 6.94 6.94 7.42 6.51 7.95 6.16 8.52 5.87 9.13 5.67 9.76 5.54 10.4 5.5 11.04 5.54 11.67 5.67 12.28 5.87 12.85 6.16 13.38 6.51 13.86 6.94 14.29 7.42 14.64 7.95 14.93 8.52 15.13 9.13 15.26 9.76 15.3 10.4 15.26 11.04Z",
  more:
    "M20.93 11.48 20.85 11.23 20.73 11 20.59 10.78 20.41 10.59 20.22 10.41 20 10.27 19.77 10.15 19.52 10.07 19.26 10.02 19 10 18.74 10.02 18.48 10.07 18.23 10.15 18 10.27 17.78 10.41 17.59 10.59 17.41 10.78 17.27 11 17.15 11.23 17.07 11.48 17.02 11.74 17 12 17.02 12.26 17.07 12.52 17.15 12.77 17.27 13 17.41 13.22 17.59 13.41 17.78 13.59 18 13.73 18.23 13.85 18.48 13.93 18.74 13.98 19 14 19.26 13.98 19.52 13.93 19.77 13.85 20 13.73 20.22 13.59 20.41 13.41 20.59 13.22 20.73 13 20.85 12.77 20.93 12.52 20.98 12.26 21 12 20.98 11.74ZM13.93 11.48 13.85 11.23 13.73 11 13.59 10.78 13.41 10.59 13.22 10.41 13 10.27 12.77 10.15 12.52 10.07 12.26 10.02 12 10 11.74 10.02 11.48 10.07 11.23 10.15 11 10.27 10.78 10.41 10.59 10.59 10.41 10.78 10.27 11 10.15 11.23 10.07 11.48 10.02 11.74 10 12 10.02 12.26 10.07 12.52 10.15 12.77 10.27 13 10.41 13.22 10.59 13.41 10.78 13.59 11 13.73 11.23 13.85 11.48 13.93 11.74 13.98 12 14 12.26 13.98 12.52 13.93 12.77 13.85 13 13.73 13.22 13.59 13.41 13.41 13.59 13.22 13.73 13 13.85 12.77 13.93 12.52 13.98 12.26 14 12 13.98 11.74ZM6.98 11.74 6.93 11.48 6.85 11.23 6.73 11 6.59 10.78 6.41 10.59 6.22 10.41 6 10.27 5.77 10.15 5.52 10.07 5.26 10.02 5 10 4.74 10.02 4.48 10.07 4.23 10.15 4 10.27 3.78 10.41 3.59 10.59 3.41 10.78 3.27 11 3.15 11.23 3.07 11.48 3.02 11.74 3 12 3.02 12.26 3.07 12.52 3.15 12.77 3.27 13 3.41 13.22 3.59 13.41 3.78 13.59 4 13.73 4.23 13.85 4.48 13.93 4.74 13.98 5 14 5.26 13.98 5.52 13.93 5.77 13.85 6 13.73 6.22 13.59 6.41 13.41 6.59 13.22 6.73 13 6.85 12.77 6.93 12.52 6.98 12.26 7 12Z",
  chevronDown:
    "M11.15 15.85 11.4 16.04 11.54 16.11 11.69 16.16 12 16.2 12.31 16.16 12.46 16.11 12.6 16.04 12.85 15.85 18.95 9.73 19.04 9.6 19.16 9.31 19.2 9 19.16 8.69 19.11 8.54 19.04 8.4 18.85 8.15 18.6 7.96 18.31 7.84 18.16 7.81 17.84 7.81 17.69 7.84 17.4 7.96 17.27 8.05 12 13.3 6.73 8.05 6.46 7.89 6.31 7.84 6.16 7.81 5.84 7.81 5.54 7.89 5.27 8.05 5.15 8.15 4.96 8.4 4.84 8.69 4.81 8.84 4.81 9.16 4.84 9.31 4.89 9.46 5.05 9.73Z",
  chevronRight:
    "M15.85 12.85 16.04 12.6 16.11 12.46 16.16 12.31 16.2 12 16.16 11.69 16.11 11.54 16.04 11.4 15.85 11.15 9.73 5.05 9.6 4.96 9.31 4.84 9 4.8 8.69 4.84 8.54 4.89 8.4 4.96 8.15 5.15 7.96 5.4 7.84 5.69 7.81 5.84 7.81 6.16 7.84 6.31 7.96 6.6 8.05 6.73 13.3 12 8.05 17.27 7.96 17.4 7.84 17.69 7.81 17.84 7.81 18.16 7.84 18.31 7.96 18.6 8.15 18.85 8.4 19.04 8.69 19.16 8.84 19.19 9.16 19.19 9.31 19.16 9.46 19.11 9.73 18.95Z",
  arrowRight:
    "M3.4 10.8 3.24 10.81 2.94 10.89 2.67 11.05 2.45 11.27 2.36 11.4 2.24 11.69 2.21 11.84 2.21 12.16 2.24 12.31 2.36 12.6 2.45 12.73 2.67 12.95 2.94 13.11 3.09 13.16 3.4 13.2 14.6 13.2 14.6 15.29 14.62 15.47 14.69 15.64 14.8 15.78 14.95 15.9 15.21 15.98 15.48 15.97 15.72 15.85 20.06 12.56 20.25 12.35 20.34 12.09 20.34 11.91 20.29 11.73 20.19 11.57 20.06 11.44 15.72 8.15 15.56 8.06 15.39 8.01 15.12 8.03 14.87 8.15 14.74 8.28 14.62 8.53 14.6 8.71 14.6 10.8Z",
  document:
    "M7 2.5h6.5L18.6 7.6V19.4A2.1 2.1 0 0 1 16.5 21.5H7A2.1 2.1 0 0 1 4.9 19.4V4.6A2.1 2.1 0 0 1 7 2.5Zm6.6 1.1V6.8A1.1 1.1 0 0 0 14.7 7.9H17.9zM8.3 11.2A0.7 0.7 0 0 0 8.3 12.6H15.2A0.7 0.7 0 0 0 15.2 11.2Zm0 3A0.7 0.7 0 0 0 8.3 15.6H15.2A0.7 0.7 0 0 0 15.2 14.2Zm0 3A0.7 0.7 0 0 0 8.3 18.6H12.6A0.7 0.7 0 0 0 12.6 17.2Z",
} as const;

const WIcon = ({ name, className }: { name: keyof typeof WILLOW_ICON_PATHS; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d={WILLOW_ICON_PATHS[name]} />
  </svg>
);

/* globals.css .float-stack: the group floats as one card; only its outer
   corners round, and each section keeps a whisper of shadow at the seams */
const FLOAT_STACK_SHADOW = "0 1px 2px rgba(16,24,40,0.04), 0 8px 18px -8px rgba(16,24,40,0.12), 0 18px 34px -18px rgba(16,24,40,0.10)";
const FLOAT_SEAM_SHADOW = "0 2px 8px -4px rgba(16,24,40,0.06)";
const FloatStack = ({ children }: { children: React.ReactNode }) => {
  const items = React.Children.toArray(children);
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl" style={{ boxShadow: FLOAT_STACK_SHADOW }}>
      {items.map((child, i) => (
        <div
          key={i}
          className={`overflow-hidden bg-white ${i === 0 ? "rounded-t-2xl" : ""} ${i === items.length - 1 ? "rounded-b-2xl" : ""}`}
          style={{ boxShadow: FLOAT_SEAM_SHADOW }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

type ProClientRow = { name: string; email: string; pill?: "Pending invite" | "Summary awaiting approval" };

const initialsOf = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/* client-card.tsx ClientRow: teal initials, name, email, at most one pill, the arrow */
const ProClientRowView = ({ c, indent = false }: { c: ProClientRow; indent?: boolean }) => (
  <div className={`flex w-full items-center justify-between gap-4 bg-white py-5 pr-8 ${indent ? "pl-[52px]" : "pl-8"}`}>
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F9F9] text-[#309E96] ring-1 ring-black/5">
        <span className="text-[13px] font-semibold">{initialsOf(c.name)}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{c.name}</span>
        <span className="mt-0.5 block truncate text-[#9CA3AF]" style={{ fontSize: 13 }}>{c.email}</span>
      </span>
    </div>
    <div className="flex flex-shrink-0 items-center gap-3">
      {c.pill === "Pending invite" && (
        <span className="inline-flex h-7 items-center whitespace-nowrap rounded-full bg-[#F3F4F6] px-3 text-[12.5px] font-medium text-[#6B7280]">Pending invite</span>
      )}
      {c.pill === "Summary awaiting approval" && (
        <span className="inline-flex h-7 items-center whitespace-nowrap rounded-full bg-[#FBF1E8] px-3 text-[12.5px] font-medium text-[#A9602C]">Summary awaiting approval</span>
      )}
      <WIcon name="chevronRight" className="h-4 w-4 text-[#9CA3AF]" />
    </div>
  </div>
);

/* client-card.tsx ClientCoupleCard: two linked clients (a joint account) as
   one card, tied by the grey rail in the avatars' gutter */
const ProCoupleView = ({ a, b }: { a: ProClientRow; b: ProClientRow }) => (
  <div className="relative bg-white">
    <span aria-hidden className="pointer-events-none absolute bottom-7 left-[25px] top-7 w-1 rounded-full bg-[#D1D5DB]" />
    <ProClientRowView c={a} indent />
    <div className="ml-[52px] mr-8 h-px bg-[#F0F1F3]" />
    <ProClientRowView c={b} indent />
  </div>
);

/* estate-plans-tab.tsx DocumentRow: the bare document icon, label, detail line, ⋯ */
const ProDocRow = ({ label, detail, nested = false }: { label: string; detail?: string; nested?: boolean }) => (
  <div className={nested ? "flex w-full items-center justify-between gap-4 py-1.5" : "flex w-full items-center justify-between gap-4 px-8 py-4"}>
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <WIcon name="document" className={`flex-shrink-0 text-[#309E96] ${nested ? "h-4 w-4" : "h-5 w-5"}`} />
      <div className="min-w-0 flex-1">
        <p className={nested ? "font-medium text-[#1F2933]" : "font-semibold text-[#1F2933]"} style={{ fontSize: nested ? 13.5 : 15 }}>{label}</p>
        {detail && <p className="mt-0.5 truncate text-[12.5px] text-[#9CA3AF]">{detail}</p>}
      </div>
    </div>
    <span className="rounded p-1.5 text-[#9CA3AF]">
      <WIcon name="more" className="h-4 w-4" />
    </span>
  </div>
);

const ProDocSectionLabel = ({ label, action }: { label: string; action?: string }) => (
  <div className="mb-2 flex items-baseline justify-between gap-3">
    <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">{label}</p>
    {action && <span className="text-[13px] font-medium text-[#309E96]">{action}</span>}
  </div>
);

const CLIENT_PANEL_TABS = ["Contact", "Estate Plan", "Team", "Staying in touch", "Notes", "Emails"];

/* The Clients page with Daniel Rosen's panel. `open` slides the panel in from
   the right and dims the list, exactly as the product does (transform and
   opacity, 300ms ease-out); closed, it is the plain list. */
const AttorneyClientsScreen = ({ open }: { open: boolean }) => {
  const motion = "300ms cubic-bezier(0, 0, 0.2, 1)";
  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#F0F2F5] text-left" style={{ fontFamily: "Figtree, Inter, sans-serif", height: 855 }}>
      <ProSidebar active="clients" />

      <div className="flex min-w-0 flex-1 flex-col">
        <ProTopBar />

        {/* Clients */}
        <div className="relative mx-auto w-full max-w-[1400px] px-16 py-12">
          <h3 className="text-[28px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: "Figtree, Inter, sans-serif" }}>Clients</h3>
          <div className="mt-8">
            <div className="flex h-10 items-center justify-between gap-3">
              <div className="relative min-w-0 max-w-md flex-1">
                <WIcon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E8E93]" />
                <div className="flex h-10 w-full items-center rounded-[10px] border border-[#E5E7EB] bg-[#F2F2F7] pl-10 pr-4 text-[15px] text-[#8E8E93]">Search clients</div>
              </div>
              <span className="inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-[#309E96] px-5 text-[15px] font-medium text-white">
                Add client
                <WIcon name="chevronDown" className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-6">
              <FloatStack>
                <ProCoupleView a={{ name: "Daniel Rosen", email: "daniel.rosen@gmail.com" }} b={{ name: "Maria Rosen", email: "maria.rosen@gmail.com" }} />
                <ProClientRowView c={{ name: "Elena Ruiz", email: "elena.ruiz@gmail.com", pill: "Summary awaiting approval" }} />
                <ProClientRowView c={{ name: "Marcus Webb", email: "marcus.webb@outlook.com" }} />
                <ProCoupleView a={{ name: "Sam Whitfield", email: "sam.whitfield@gmail.com" }} b={{ name: "Olivia Grant", email: "olivia.grant@gmail.com" }} />
                <ProClientRowView c={{ name: "Priya Anand", email: "priya.anand@outlook.com" }} />
                <ProClientRowView c={{ name: "Jordan Lee", email: "jordan.lee@gmail.com", pill: "Pending invite" }} />
                <ProClientRowView c={{ name: "Grace Liu", email: "grace.liu@yahoo.com" }} />
              </FloatStack>
            </div>
          </div>
        </div>
      </div>

      {/* The dim over the list while a client is open (bg-black/20) */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[68px] right-0 top-16 z-10 bg-black/20"
        style={{ opacity: open ? 1 : 0, transition: `opacity ${motion}` }}
      />

      {/* The client's panel: 800px wide, sliding in from the right */}
      <div
        className="absolute bottom-0 right-0 top-16 z-20 w-[800px] overflow-hidden bg-[#F0F2F5]"
        style={{
          boxShadow: open ? "-4px 0 24px rgba(0,0,0,0.08)" : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: `transform ${motion}, box-shadow ${motion}`,
        }}
      >
        <div className="px-16 py-10">
          {/* Header: the name, and the spouse their account is joined with */}
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[26px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: "Figtree, Inter, sans-serif" }}>Daniel Rosen</h3>
              <p className="mt-1 text-[15px] text-[#6B7280]">
                Joint account: <span className="font-medium text-[#309E96]">Maria Rosen</span>
              </p>
            </div>
            <span className="rounded p-1.5 text-[#9CA3AF]">
              <WIcon name="more" className="h-5 w-5" />
            </span>
          </div>

          {/* Tabs, Estate Plan open */}
          <div className="border-b border-[#E5E7EB]">
            <div className="flex">
              {CLIENT_PANEL_TABS.map((t) => (
                <span
                  key={t}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-medium ${t === "Estate Plan" ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {/* Documents · Summary */}
            <div className="mb-6 border-b border-[#E5E7EB]">
              <div className="flex">
                <span className="whitespace-nowrap border-b-2 border-[#309E96] px-4 py-3 text-[13px] font-medium text-[#309E96]">Documents</span>
                <span className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-[13px] font-medium text-[#6B7280]">Summary</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <ProDocSectionLabel label="Daniel's documents" action="Choose PDFs" />
                <FloatStack>
                  <ProDocRow label="Last Will & Testament" detail="Simple will" />
                  <ProDocRow label="Power of Attorney" detail="General — broad authority · Durable" />
                  <ProDocRow label="Medical Proxy" />
                </FloatStack>
              </div>
              <div>
                <ProDocSectionLabel label="Joint with Maria" />
                <FloatStack>
                  <div>
                    <ProDocRow label="Revocable Living Trust" detail="Joint trust (married couple)" />
                    <div className="px-8 pb-4">
                      <div className="border-t border-[#E5E7EB]" />
                      <div className="pl-8 pt-3">
                        <ProDocRow nested label="Deed" detail="Trust transfer deed" />
                      </div>
                    </div>
                  </div>
                </FloatStack>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

// Rotating phrases for the hero, as on willow-inc.com ("their plan" singular,
// and "never lose" / "a document." on two lines, at Aaron's word, Nov 17). The
// stem commands the attorney ("Ensure your clients…"), so every phrase is an
// outcome they guarantee by using Willow.
// Every phrase sits in the same grid cell, so the headline is always as tall
// as its longest phrase at the current width and never jumps as they change.
const HERO_PHRASES = [
  "actually understand their\u00A0plan.",
  "can sign from anywhere.",
  "never lose\na document.",
  "keep executors and guardians prepared.",
  "keep coming back to\u00A0you.",
]

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
            whiteSpace: "pre-line",
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
   its hero screenshot. Harvey's frame is 1376×750 at 1440 (radius 4px, 8px
   from 1025px) and its screen window sits centred with an even mat, 83% of the
   frame's width; the window shows 1440×775 of the 1440×855 canvas.
   The screen is the attorney's Clients page, recreated from the product code,
   with Daniel Rosen's panel open beside the dimmed list, as it is after
   clicking a client in the product. On a phone the window is shifted so the
   panel and the list both show. */
const HeroShot = () => (
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] md:aspect-[1376/750] min-[1025px]:rounded-[8px]">
    <img src="/golden-gate.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
    <div
      role="img"
      aria-label="The Willow Clients page: clients and couples with joint accounts, and one client's estate plan documents open beside the list."
      className="absolute left-[-25%] top-[7%] w-[170%] overflow-hidden rounded-lg bg-[#F0F2F5] [aspect-ratio:1440/855] md:left-[8.43%] md:top-[8.93%] md:w-[83.14%] md:[aspect-ratio:1440/775]"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
    >
      <ScaledScreen>
        <AttorneyClientsScreen open />
      </ScaledScreen>
    </div>
  </div>
);

/* Two doors, as on harvey.ai: hovering a card widens it to a 1.4 share of the
   row and dims its neighbour (.aud-row / .aud-card in index.css). The body
   lines and button labels are lines from the live homepage. The attorney
   dashboard and the client's estate plan, both product screens already on
   willow-inc.com, drawn wider than the card, so widening shows more of them. */
const AUDIENCES: { title: string; body: string; cta: string; to: string; image: string; shot: React.ReactNode }[] = [
  {
    title: "For attorneys",
    body: "Every client, organized from engagement to signing.",
    cta: "Request a demo",
    to: "/request-access",
    image: "/nyc-skyline.jpg",
    shot: (
      <div className="relative w-[130vw] max-w-[1440px] min-[1025px]:w-[68vw]" style={{ aspectRatio: "1440 / 855" }}>
        <ScaledScreen>
          <AttorneyDashboardScreen />
        </ScaledScreen>
      </div>
    ),
  },
  {
    title: "For clients",
    body: "Learn how we keep your clients connected.",
    cta: "Explore the client experience",
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

/* Set on harvey.ai's AudienceRouterSection: a row that is twice as wide as it
   is tall from 1025px (stacked 3:4 cards below that, at most 500px tall). Every
   line on the cards is from the live homepage, apart from the two titles. Each card's print is
   pinned to its outer edge at 5:4, so it doesn't move as the card widens. */
const AudienceRouter = () => (
  <section className="bg-[#FCFCFD]">
    <div className="hv-wrap hv-grid">
      <div className="hv-content">
        <div className="col-span-full flex flex-col gap-[var(--hv-lg)]">
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

      {/* Desktop: pinned scrollytelling — half copy, half product image. Only
          with motion allowed: it works by sliding each print up over the last,
          and without the slide the waiting prints sat below the frame, on top
          of the next section. */}
      {!reduced && (
      <div ref={trackRef} className="relative hidden md:block" style={{ height: `${n * 55 + 100}vh`, marginTop: -60 }}>
        <div className="sticky top-0 flex h-screen flex-col" style={{ paddingTop: 76 }}>
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
      )}

      {/* Phones, and any screen with reduced motion: a still list, each
          capability beside its print from 768px */}
      <div className={`${reduced ? "" : "md:hidden"} container mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-6 pt-10 md:gap-20 md:px-6 md:pb-16 md:pt-14 lg:px-10`}>
        {CAPABILITIES.map((cap, i) => (
          <div key={cap.title} className="md:grid md:grid-cols-[38.2fr_61.8fr] md:items-center md:gap-8 lg:gap-10">
            <div className="md:border-t md:border-gray-200 md:pt-4">
              <h3 className="font-heading font-bold text-xl text-[#222222] mb-2 lg:text-2xl">{cap.title}</h3>
              <p className="text-[17px] text-gray-600 leading-relaxed mb-4 lg:text-lg">{cap.body}</p>
              {i === CAPABILITIES.length - 1 && (
                <Button
                  className="willow-btn mt-2 hidden h-10 px-5 text-[15px] font-medium md:inline-flex"
                  onClick={() => (window.location.href = "/request-access")}
                >
                  Let's get started
                </Button>
              )}
            </div>
            <div className="relative w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl md:max-w-[560px] md:justify-self-end" style={{ aspectRatio: "1 / 1" }}>
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

      {/* One line from the founder, set simply: the line from the careers page */}
      <section className="bg-[#FCFCFD] py-[var(--hv-xl)]">
        <div className="hv-wrap hv-grid">
          <figure className="hv-content text-center">
            <blockquote className="hv-h2 col-span-full font-heading font-light text-[#222222]">
              “Estate plans shouldn't live in binders.”
            </blockquote>
            <figcaption className="col-span-full mt-[var(--hv-md)]">
              <p className="hv-body-1 font-medium text-[#222222]">Aaron Burlacoff</p>
              <p className="hv-body-2 text-gray-600">Founder &amp; CEO, Willow</p>
            </figcaption>
          </figure>
        </div>
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
                  Willow becomes a lasting touchpoint between your practice and the entire family — everyone understands the plan, gets answers in moments, and is prepared long before when it matters most.
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
