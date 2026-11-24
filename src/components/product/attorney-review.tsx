import React from "react";
import { ProBellIcon, MaskIcon, WIcon } from "./kit";

// ---- How the attorney reviews and approves what clients see, and acts on
// Required actions. Recreated from apps/professionals and packages/ui as on
// origin/main (Nov 16 2026, d99a54b6):
//   SummaryReviewScreen   app/dashboard/estate-plans/[id]/documents/[docId]/summary/page.tsx
//                         → components/dashboard/scenario-summary-approval.tsx
//                         → packages/ui/components/scenario-will-summary.tsx (CardShell,
//                           FromYourFirmCard, the card bodies), scenario-blocks.tsx
//                           (SubBlock, Hr, P, UpperLabel, MemberCell, PersonChip,
//                           ShareRow, RoleChainView, ProtectionsGrid),
//                           components/dashboard/client-firm-cell.tsx, firm-panel.tsx,
//                           top-bar.tsx + mobile-back.tsx (BackLink), sidebar.tsx;
//                           the wording the summary carries comes from
//                           packages/ui/lib/extracted-will-adapter.ts
//   SendOrSkipDrawer      components/dashboard/going-out.tsx (GoingOutDrawer) in
//                         slide-drawer.tsx, settings/panel-kit.tsx (PanelField),
//                         settings/shared.tsx (LINE_INPUT, LINE_TEXTAREA); the email
//                         is packages/types/touchpoints.ts's client check-in
//                         (maintenance_survey) as lib/journey/touch-queue.ts fills it
//   ReleaseRequestModal   components/dashboard/reminders-bell.tsx (AccessRequestModal)
//                         + packages/ui/components/willow-popup-header.tsx
// The product's Tailwind 4 golden tokens (text-title, space-y-phi-5, …) are
// written out as the pixel values packages/ui/golden.css gives them, and its
// `sm:`/`md:` classes as their desktop values (a scaled canvas must not follow
// the visitor's own screen width). ----

const FIGTREE = "Figtree, Inter, sans-serif";
const MERRIWEATHER = "Merriweather, Georgia, serif";
/* Tailwind 4's shadow-sm (the product's), which Tailwind 3 calls `shadow` */
const SHADOW_SM = "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)";

/* More of the product's icons, verbatim from packages/ui/icons/willow-solid */
const ICON_PATHS = {
  building: "M16.64 9.25 16.3 9.39 16.01 9.61 15.89 9.75 15.71 10.06 15.61 10.42 15.6 20.1 15.65 20.46 15.79 20.8 16.01 21.09 16.3 21.31 16.64 21.45 17 21.5 19.4 21.5 19.76 21.45 20.1 21.31 20.39 21.09 20.61 20.8 20.69 20.64 20.79 20.28 20.8 10.6 20.75 10.24 20.61 9.9 20.39 9.61 20.1 9.39 19.76 9.25 19.4 9.2 17 9.2ZM18.93 15.82 19.05 15.87 19.15 15.95 19.23 16.05 19.3 16.23 19.3 17.5 19.26 17.69 19.2 17.8 19.05 17.93 18.93 17.98 18.8 18 17.53 18 17.41 17.96 17.3 17.9 17.17 17.75 17.12 17.63 17.1 17.5 17.1 16.23 17.14 16.11 17.2 16 17.35 15.87 17.53 15.8 18.8 15.8ZM18.99 12.04 19.1 12.1 19.2 12.2 19.26 12.31 19.3 12.43 19.3 13.7 19.26 13.89 19.2 14 19.1 14.1 18.99 14.16 18.8 14.2 17.53 14.2 17.41 14.16 17.3 14.1 17.17 13.95 17.12 13.83 17.1 13.7 17.1 12.43 17.14 12.31 17.2 12.2 17.35 12.07 17.53 12 18.8 12ZM3.77 3.3 3.64 3.5 3.54 3.71 3.46 3.93 3.42 4.17 3.4 4.4 3.4 19.7 3.42 19.93 3.46 20.17 3.54 20.39 3.64 20.6 3.77 20.8 3.93 20.97 4.1 21.13 4.3 21.26 4.51 21.36 4.73 21.44 4.97 21.48 5.2 21.5 7.81 21.5 7.8 17.6 7.82 17.44 7.88 17.3 7.98 17.18 8.1 17.08 8.32 17.01 10.08 17.01 10.3 17.08 10.42 17.18 10.52 17.3 10.59 17.52 10.59 21.5 12.83 21.48 13.07 21.44 13.29 21.36 13.5 21.26 13.7 21.13 13.87 20.97 14.03 20.8 14.16 20.6 14.26 20.39 14.34 20.17 14.38 19.93 14.4 19.7 14.4 4.4 14.38 4.17 14.34 3.93 14.26 3.71 14.16 3.5 14.03 3.3 13.87 3.13 13.7 2.97 13.5 2.84 13.29 2.74 13.07 2.66 12.83 2.62 12.6 2.6 4.97 2.62 4.73 2.66 4.51 2.74 4.3 2.84 4.1 2.97 3.93 3.13ZM11.59 13.24 11.7 13.3 11.8 13.4 11.86 13.51 11.9 13.63 11.9 14.9 11.88 15.03 11.8 15.2 11.7 15.3 11.59 15.36 11.4 15.4 10.13 15.4 10.01 15.36 9.9 15.3 9.8 15.2 9.74 15.09 9.7 14.9 9.7 13.63 9.74 13.51 9.8 13.4 9.95 13.27 10.13 13.2 11.4 13.2ZM11.7 9.5 11.8 9.6 11.86 9.71 11.9 9.9 11.9 11.17 11.86 11.29 11.75 11.45 11.59 11.56 11.4 11.6 10.13 11.6 10.01 11.56 9.85 11.45 9.74 11.29 9.7 11.1 9.7 9.83 9.74 9.71 9.85 9.55 10.01 9.44 10.2 9.4 11.47 9.4 11.59 9.44ZM11.8 5.8 11.86 5.91 11.9 6.03 11.9 7.3 11.86 7.49 11.75 7.65 11.59 7.76 11.4 7.8 10.13 7.8 9.95 7.73 9.85 7.65 9.74 7.49 9.7 7.3 9.7 6.03 9.74 5.91 9.85 5.75 9.95 5.67 10.13 5.6 11.4 5.6 11.53 5.62 11.65 5.67ZM7.85 13.27 7.95 13.35 8.03 13.45 8.08 13.57 8.1 13.7 8.1 14.97 8.06 15.09 7.95 15.25 7.79 15.36 7.6 15.4 6.33 15.4 6.21 15.36 6.05 15.25 5.94 15.09 5.9 14.9 5.9 13.63 5.97 13.45 6.05 13.35 6.21 13.24 6.4 13.2 7.6 13.2 7.73 13.22ZM7.95 9.55 8.06 9.71 8.1 9.9 8.1 11.17 8.06 11.29 7.95 11.45 7.79 11.56 7.6 11.6 6.33 11.6 6.21 11.56 6.05 11.45 5.94 11.29 5.9 11.1 5.9 9.83 5.97 9.65 6.05 9.55 6.21 9.44 6.4 9.4 7.67 9.4 7.79 9.44ZM8.03 5.85 8.08 5.97 8.1 6.1 8.1 7.3 8.06 7.49 7.95 7.65 7.79 7.76 7.6 7.8 6.33 7.8 6.15 7.73 6.05 7.65 5.94 7.49 5.9 7.3 5.9 6.03 5.97 5.85 6.05 5.75 6.15 5.67 6.33 5.6 7.6 5.6 7.73 5.62 7.85 5.67 7.95 5.75Z",
  close: "M17.07 18.75 17.2 18.84 17.49 18.96 17.8 19 18.11 18.96 18.4 18.84 18.53 18.75 18.75 18.53 18.84 18.4 18.96 18.11 19 17.8 18.99 17.64 18.96 17.49 18.84 17.2 18.65 16.95 13.7 12 18.75 6.93 18.84 6.8 18.96 6.51 19 6.2 18.96 5.89 18.84 5.6 18.75 5.47 18.65 5.35 18.4 5.16 18.11 5.04 17.96 5.01 17.8 5 17.49 5.04 17.2 5.16 17.07 5.25 12 10.3 6.93 5.25 6.66 5.09 6.51 5.04 6.2 5 6.04 5.01 5.74 5.09 5.47 5.25 5.35 5.35 5.16 5.6 5.04 5.89 5.01 6.04 5 6.2 5.04 6.51 5.16 6.8 5.25 6.93 10.3 12 5.25 17.07 5.16 17.2 5.04 17.49 5 17.8 5.04 18.11 5.09 18.26 5.25 18.53 5.47 18.75 5.6 18.84 5.89 18.96 6.04 18.99 6.2 19 6.51 18.96 6.8 18.84 6.93 18.75 12 13.7Z",
  check: "M8.78 18.77 8.9 18.87 9.18 19.02 9.33 19.07 9.64 19.1 9.8 19.08 10.1 18.99 10.24 18.92 10.48 18.72 20.48 7.95 20.62 7.67 20.69 7.36 20.7 7.21 20.65 6.9 20.59 6.75 20.52 6.61 20.32 6.37 20.06 6.19 19.77 6.08 19.61 6.06 19.3 6.07 19.15 6.1 19 6.16 18.74 6.33 9.54 16.2 5.2 12.13 4.93 11.98 4.78 11.93 4.62 11.91 4.31 11.92 4.01 12.01 3.74 12.17 3.63 12.28 3.53 12.4 3.38 12.67 3.31 12.98 3.3 13.14 3.35 13.45 3.41 13.59 3.57 13.86Z",
  edit: "M13.85 5.64 13.65 5.98 13.55 6.36 13.55 6.75 13.59 6.95 13.74 7.31 13.98 7.62 16.38 10.02 16.69 10.26 16.87 10.35 17.25 10.45 17.64 10.45 18.02 10.35 18.19 10.26 18.5 10.02 19.63 8.89 19.76 8.74 19.96 8.4 20.06 8.03 20.06 7.63 19.96 7.26 19.76 6.92 17.23 4.37 16.92 4.13 16.74 4.04 16.37 3.94 15.97 3.94 15.6 4.04 15.42 4.13 15.11 4.37ZM3.93 19.81 3.94 19.91 3.99 19.99 4.06 20.05 4.19 20.07 8.91 19.23 9 19.19 9.07 19.12 9.24 19.29 16.59 11.93 12.07 7.41 4.71 14.76 4.88 14.93 4.81 15 4.77 15.09Z",
  undo: "M8.79 6.35 8.71 6.1 8.6 5.96 8.46 5.85 8.3 5.77 8.12 5.74 7.94 5.76 7.78 5.82 4.55 8.08 4.39 8.3 4.32 8.56 4.36 8.82 4.43 8.98 4.62 9.17 7.7 11.33 7.86 11.41 8.03 11.45 8.3 11.43 8.46 11.35 8.6 11.24 8.75 11.02 8.8 10.76 8.8 9.8 14.57 9.8 15 9.82 15.39 9.88 15.77 9.99 16.14 10.13 16.5 10.31 16.83 10.53 17.14 10.78 17.42 11.06 17.67 11.37 17.89 11.7 18.07 12.06 18.21 12.43 18.32 12.81 18.38 13.2 18.4 13.6 18.38 14 18.32 14.39 18.21 14.77 18.07 15.14 17.89 15.5 17.67 15.83 17.42 16.14 17.14 16.42 16.83 16.67 16.5 16.89 16.14 17.07 15.77 17.21 15.39 17.32 15 17.38 14.57 17.4 8.6 17.4 8.29 17.44 8 17.56 7.75 17.75 7.56 18 7.44 18.29 7.4 18.6 7.41 18.76 7.49 19.06 7.65 19.33 7.87 19.55 8 19.64 8.29 19.76 8.6 19.8 14.6 19.8 15.19 19.77 15.95 19.65 16.46 19.51 17.06 19.29 17.64 19 18.29 18.58 18.79 18.16 19.25 17.7 19.65 17.19 19.94 16.75 20.24 16.18 20.48 15.58 20.65 14.95 20.76 14.31 20.8 13.54 20.76 12.89 20.65 12.25 20.48 11.62 20.24 11.02 19.94 10.45 19.58 9.91 19.16 9.41 18.7 8.95 18.29 8.62 17.64 8.2 17.06 7.91 16.58 7.72 15.83 7.52 15.31 7.44 14.66 7.4 8.8 7.4Z",
  redo: "M15.21 6.35 15.2 7.4 9.34 7.4 8.69 7.44 8.17 7.52 7.42 7.72 6.82 7.96 6.25 8.26 5.81 8.55 5.21 9.04 4.75 9.5 4.42 9.91 4.06 10.45 3.76 11.02 3.52 11.62 3.35 12.25 3.24 12.89 3.2 13.54 3.24 14.31 3.35 14.95 3.52 15.58 3.76 16.18 4.06 16.75 4.35 17.19 4.75 17.7 5.21 18.16 5.71 18.58 6.25 18.94 6.94 19.29 7.54 19.51 8.05 19.65 8.81 19.77 9.4 19.8 15.4 19.8 15.71 19.76 16 19.64 16.13 19.55 16.35 19.33 16.51 19.06 16.59 18.76 16.59 18.44 16.51 18.14 16.35 17.87 16.13 17.65 16 17.56 15.71 17.44 15.4 17.4 9.43 17.4 9 17.38 8.61 17.32 8.23 17.21 7.86 17.07 7.5 16.89 7.17 16.67 6.86 16.42 6.58 16.14 6.33 15.83 6.11 15.5 5.93 15.14 5.79 14.77 5.68 14.39 5.62 14 5.6 13.6 5.62 13.2 5.68 12.81 5.79 12.43 5.93 12.06 6.11 11.7 6.33 11.37 6.58 11.06 6.86 10.78 7.17 10.53 7.5 10.31 7.86 10.13 8.23 9.99 8.61 9.88 9 9.82 9.43 9.8 15.2 9.8 15.2 10.76 15.25 11.02 15.4 11.24 15.54 11.35 15.7 11.43 15.97 11.45 16.14 11.41 16.3 11.33 19.38 9.17 19.57 8.98 19.64 8.82 19.68 8.56 19.61 8.3 19.45 8.08 16.22 5.82 16.06 5.76 15.88 5.74 15.7 5.77 15.54 5.85 15.4 5.96 15.29 6.1Z",
  chevronLeft: "M8.15 11.15 7.96 11.4 7.89 11.54 7.84 11.69 7.8 12 7.84 12.31 7.89 12.46 7.96 12.6 8.15 12.85 14.27 18.95 14.4 19.04 14.69 19.16 15 19.2 15.31 19.16 15.46 19.11 15.6 19.04 15.85 18.85 16.04 18.6 16.11 18.46 16.19 18.16 16.19 17.84 16.16 17.69 16.04 17.4 15.95 17.27 10.7 12 15.95 6.73 16.11 6.46 16.16 6.31 16.19 6.16 16.19 5.84 16.11 5.54 15.95 5.27 15.85 5.15 15.6 4.96 15.31 4.84 15.16 4.81 14.84 4.81 14.69 4.84 14.54 4.89 14.27 5.05Z",
  done: "M21.91 10.69 21.66 9.41 21.24 8.17 20.66 7 19.93 5.91 19.07 4.93 18.09 4.07 17 3.34 15.83 2.76 14.59 2.34 13.31 2.09 12 2 10.69 2.09 9.41 2.34 8.17 2.76 7 3.34 5.91 4.07 4.93 4.93 4.07 5.91 3.34 7 2.76 8.17 2.34 9.41 2.09 10.69 2 12 2.09 13.31 2.34 14.59 2.76 15.83 3.34 17 4.07 18.09 4.93 19.07 5.91 19.93 7 20.66 8.17 21.24 9.41 21.66 10.69 21.91 12 22 13.31 21.91 14.59 21.66 15.83 21.24 17 20.66 18.09 19.93 19.07 19.07 19.93 18.09 20.66 17 21.24 15.83 21.66 14.59 21.91 13.31 22 12ZM6.21 13.74 6.02 13.5 5.95 13.37 5.86 13.08 5.86 12.78 5.92 12.49 5.99 12.36 6.16 12.11 6.4 11.92 6.53 11.85 6.82 11.76 6.97 11.75 7.26 11.78 7.54 11.89 7.79 12.06 10.35 14.47 16.27 8.11 16.39 8.03 16.66 7.9 16.96 7.85 17.26 7.88 17.54 7.98 17.78 8.16 17.97 8.39 18.05 8.52 18.13 8.81 18.14 9.11 18.12 9.26 18.02 9.54 17.84 9.78 11.24 16.88 11.13 16.99 10.88 17.15 10.59 17.23 10.29 17.24 9.99 17.18 9.73 17.03Z",
  mail: "M4.4 4.6 4.09 4.62 3.78 4.68 3.48 4.78 3.2 4.92 2.94 5.1 2.7 5.3 2.5 5.54 2.32 5.8 2.18 6.08 2.08 6.38 2.02 6.69 2 7 2 17 2.02 17.31 2.08 17.62 2.18 17.92 2.32 18.2 2.5 18.46 2.7 18.7 2.94 18.9 3.2 19.08 3.48 19.22 3.78 19.32 4.09 19.38 4.4 19.4 19.6 19.4 19.91 19.38 20.22 19.32 20.52 19.22 20.8 19.08 21.06 18.9 21.3 18.7 21.5 18.46 21.68 18.2 21.82 17.92 21.92 17.62 21.98 17.31 22 17 22 7 21.98 6.69 21.92 6.38 21.82 6.08 21.68 5.8 21.5 5.54 21.3 5.3 21.06 5.1 20.8 4.92 20.52 4.78 20.22 4.68 19.91 4.62 19.6 4.6ZM4.76 8.8 4.56 8.59 4.46 8.31 4.45 8.12 4.54 7.84 4.73 7.61 4.99 7.48 5.28 7.45 5.56 7.54 12 12.27 18.44 7.54 18.62 7.47 18.82 7.45 19.01 7.48 19.19 7.56 19.34 7.68 19.46 7.84 19.53 8.02 19.55 8.22 19.52 8.41 19.44 8.59 19.24 8.8 12.44 13.8 12.28 13.9 12 13.95 11.72 13.9 11.56 13.8Z",
} as const;

const Icon = ({ name, className }: { name: keyof typeof ICON_PATHS; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d={ICON_PATHS[name]} />
  </svg>
);

/* sidebar.tsx: on /dashboard/estate-plans/… neither Dashboard nor Clients is lit */
const ReviewSidebar = () => (
  <div className="relative z-30 flex w-[68px] flex-shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
    <div className="flex h-16 items-center px-[14px]">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#309E96] text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 20, lineHeight: 1, paddingTop: 2 }}>
        W
      </span>
    </div>
    <div className="mx-3 border-t border-[#E5E7EB]" />
    <div className="flex flex-col gap-0.5 px-2 pt-6">
      <span className="flex items-center justify-center rounded-lg px-3 py-2">
        <MaskIcon src="/mock/dashboard-icon.svg" color="#9CA3AF" />
      </span>
      <span className="flex items-center justify-center rounded-lg px-3 py-2">
        <MaskIcon src="/mock/clients-icon.svg" color="#9CA3AF" />
      </span>
    </div>
  </div>
);

/* top-bar.tsx with the page's way back in it: useHeaderBack("Back to Daniel")
   puts mobile-back.tsx's BackLink (a bare chevron) at the left */
const ReviewTopBar = () => (
  <div className="relative z-30 flex h-16 flex-shrink-0 items-center gap-1 border-b border-[#E5E7EB] bg-white px-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
    <span aria-label="Back to Daniel" className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#6B7280]">
      <Icon name="chevronLeft" className="h-6 w-6" />
    </span>
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

// ============================================================================
// SummaryReviewScreen — "Review Daniel's estate plan summary"
// ============================================================================

/* scenario-summary-approval.tsx: the quiet page head. It is sticky (top-16)
   in the product, so it stays under the top bar however far the attorney
   scrolls. Nothing edited yet: undo and redo are greyed and there is no
   "Reset edits"; one AI note waits in Suggested reviews (a note, not a gate,
   so Approve Summary is live). */
/** Optional live state, for the marketing film's walk through one edit */
export type SummaryLive = {
  edited?: boolean;
  approveLabel?: React.ReactNode;
  approveStyle?: React.CSSProperties;
  remainingNote?: React.ReactNode;
  remainingAction?: React.ReactNode;
  /** You & Your Family starts open; the film closes it to reach the next card */
  familyOpen?: boolean;
  /** What You'll Leave Behind and How Your Plan Protects You start open; the film can close them */
  leaveOpen?: boolean;
  protectsOpen?: boolean;
  stepInOpen?: boolean;
  stepInBody?: React.ReactNode;
  stepInStyle?: React.CSSProperties;
};

const SummaryHead = ({ edited = false, approveLabel = "Approve Summary", approveStyle }: SummaryLive) => (
  <div className="relative z-20 bg-[#F0F2F5] pb-3 pt-5">
    <div className="mx-auto max-w-[900px] px-4">
      <div className="flex flex-row items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-[#1F2933]" style={{ fontFamily: FIGTREE, fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>
            Review Daniel&apos;s estate plan summary
          </h1>
          <p className="mt-1 text-[#6B7280]" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
            Once you approve, the summary will appear on Daniel&apos;s account.
          </p>
        </div>
        <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2">
          <div className="flex items-center gap-1 rounded-full bg-white px-1.5 py-1" style={{ boxShadow: SHADOW_SM }}>
            <span aria-label="Undo" className={`flex h-8 w-8 items-center justify-center rounded-full ${edited ? "text-[#374151]" : "text-[#C4C9D0]"}`} style={{ transition: "color 200ms ease" }}>
              <Icon name="undo" className="h-4 w-4" />
            </span>
            <span aria-label="Redo" className="flex h-8 w-8 items-center justify-center rounded-full text-[#C4C9D0]">
              <Icon name="redo" className="h-4 w-4" />
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[#1F2933] transition-colors hover:bg-[#F3F4F6]" style={{ fontSize: 14, fontWeight: 500, boxShadow: SHADOW_SM }}>
            Suggested reviews
            <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[#B45309]" style={{ fontSize: 12, fontWeight: 600 }} aria-label="1 to look at">
              1
            </span>
          </span>
          <span className="flex items-center gap-2 rounded-full bg-[#128F8B] px-5 py-2.5 text-white transition-colors hover:bg-[#0F7673]" style={{ fontSize: 14, fontWeight: 500, ...approveStyle }}>
            <Icon name="done" className="h-4 w-4" />
            {approveLabel}
          </span>
        </div>
      </div>
    </div>
  </div>
);

/* scenario-will-summary.tsx CardShell: a 56px picture, the title and its grey
   line, the chevron (turned up when open). An open card with an `action` (the
   family card's Edit) moves the chevron out beside it. */
const SummaryCard = ({
  icon,
  title,
  subtitle,
  open = false,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  open?: boolean;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className="bg-white">
    <div className="flex items-center transition-colors hover:bg-[#F4F5F6]">
      <div className="flex flex-1 items-center gap-4 p-8 text-left">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[#1F2933]" style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
          <div className="text-[#9CA3AF]" style={{ fontSize: 14 }}>{subtitle}</div>
        </div>
        {!(open && action) && <WIcon name="chevronDown" className={`h-5 w-5 flex-shrink-0 text-[#6B7280] ${open ? "rotate-180" : ""}`} />}
      </div>
      {open && action && (
        <div className="flex flex-shrink-0 items-center gap-4 pr-8">
          {action}
          <WIcon name="chevronDown" className="h-5 w-5 flex-shrink-0 rotate-180 text-[#6B7280]" />
        </div>
      )}
    </div>
    {open && <div className="px-8 pb-8">{children}</div>}
  </div>
);

const CardPicture = ({ src }: { src: string }) => <img src={src} alt="" width={56} height={56} className="object-contain" />;

/* scenario-will-summary.tsx editToggle: each editable block's own Edit */
const EditToggle = () => (
  <span className="inline-flex items-center gap-1 text-[#6B7280] transition-colors hover:text-[#128F8B]" style={{ fontSize: 12, fontWeight: 600 }}>
    <Icon name="edit" className="h-3.5 w-3.5" /> Edit
  </span>
);

export const SummaryEditToggle = EditToggle;

/* scenario-blocks.tsx house primitives */
const SubBlock = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-[#1F2933]" style={{ fontFamily: FIGTREE, fontSize: 14, fontWeight: 600 }}>{title}</h3>
      {action}
    </div>
    {children}
  </div>
);
const Hr = () => <div className="my-7 border-t border-[#E5E7EB]" />;
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[#4B5563]" style={{ fontSize: 14, lineHeight: 1.6 }}>{children}</p>
);
const UpperLabel = ({ children, className = "mb-2" }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-[#9CA3AF] ${className}`} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
    {children}
  </div>
);
const MemberCell = ({ name, meta }: { name: string; meta: string }) => (
  <div>
    <div className="text-[#1F2933]" style={{ fontSize: 16, fontWeight: 500 }}>{name}</div>
    {meta.split("\n").map((line, i) => (
      <div key={i} className="mt-0.5 text-[#6B7280]" style={{ fontSize: 14 }}>{line}</div>
    ))}
  </div>
);
const PersonChip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="text-[#1F2933]" style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</span>
    <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#128F8B]">
      <Icon name="check" className="h-2 w-2 text-white" />
    </span>
  </span>
);
const ShareRow = ({ name, percent }: { name: string; percent: number }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <span className="text-[#1F2933]" style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
      <span className="flex-shrink-0 text-right">
        <span className="text-[#128F8B]" style={{ fontSize: 14, fontWeight: 600 }}>{percent}%</span>
      </span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
      <div className="h-full rounded-full bg-[#128F8B]" style={{ width: `${percent}%` }} />
    </div>
  </div>
);
/* RoleChainView: the numbered line of succession for one office. The caption
   names the person above by first name (stepCaption in scenario-blocks.tsx) */
export const RoleChain = ({ role, steps }: { role: string; steps: string[] }) => (
  <div className="flex flex-wrap gap-x-14 gap-y-7">
    <div style={{ minWidth: 230, flex: "1 1 230px", maxWidth: "100%" }}>
      <UpperLabel>{role}</UpperLabel>
      <div className="mt-2">
        {steps.map((name, i) => {
          const last = i === steps.length - 1;
          return (
            <div key={name} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-[#128F8B] text-white" : "border border-[#CBD2D9] bg-white text-[#6B7280]"}`}
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {i + 1}
                </span>
                {!last && <span className="my-1 w-px flex-1 bg-[#E1E5EA]" />}
              </div>
              <div className={last ? "" : "pb-4"} style={{ paddingTop: 1 }}>
                <div className="text-[#1F2933]" style={{ fontSize: 15, fontWeight: 500 }}>{name}</div>
                <div className="mt-0.5 text-[#9CA3AF]" style={{ fontSize: 12.5 }}>
                  {i === 0 ? "First choice" : `Second in line, steps in if ${steps[i - 1].split(" ")[0]} can’t serve`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

/* The adapter's own protection copy (extracted-will-adapter.ts, "Built-in
   protections"): no-bond, digital-assets and simultaneous-death */
const PROTECTIONS = [
  { title: "No Bond Required", blurb: "Your fiduciaries serve without posting a bond, for less cost and delay." },
  { title: "Digital Assets", blurb: "Your executors can access your accounts, photos, and files." },
  { title: "Simultaneous-Death Rule", blurb: "If the order of deaths is ever unclear, your will settles it." },
];

/* The summary's cards, as ScenarioWillSummary stacks them for a will-only
   plan, at rest: From your firm, You & Your Family (open), If You Need
   Someone to Step In, What You'll Leave Behind (open), How Your Plan
   Protects You (open), Your Documents. */
export const SummaryCards = ({
  flush = false,
  remainingNote,
  remainingAction,
  familyOpen = true,
  leaveOpen = true,
  protectsOpen = true,
  stepInOpen = false,
  stepInBody,
  stepInStyle,
}: { flush?: boolean } & Pick<SummaryLive, "remainingNote" | "remainingAction" | "familyOpen" | "leaveOpen" | "protectsOpen" | "stepInOpen" | "stepInBody" | "stepInStyle">) => (
  <div className={flush ? "" : "mx-auto max-w-[900px] px-4 pb-16 pt-6"}>
    <div className="space-y-1.5 rounded-2xl bg-[#F3F4F6]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      {/* client-firm-cell.tsx → FromYourFirmCard: the firm's building (no logo
          uploaded), and the client's to-do count from firm-panel.tsx */}
      <div className="overflow-hidden rounded-t-2xl">
        <SummaryCard icon={<Icon name="building" className="h-11 w-11 text-[#3AB2AB]" />} title="From your firm" subtitle="Your attorney · 2 things to do" />
      </div>

      <SummaryCard icon={<CardPicture src="/mock/family-icon.png" />} title="You & Your Family" subtitle="The people at the center of your plan" open={familyOpen} action={<EditToggle />}>
        <UpperLabel>A Bit About You</UpperLabel>
        <MemberCell name="Daniel Rosen" meta="New York, NY" />
        <Hr />
        <UpperLabel>Your Spouse &amp; Children</UpperLabel>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          <MemberCell name="Maria Rosen" meta="Your spouse" />
          <MemberCell name="Emma Rosen" meta="Your child" />
          <MemberCell name="Leo Rosen" meta="Your child" />
        </div>
      </SummaryCard>

      <div data-step-in style={stepInStyle}>
        <SummaryCard icon={<CardPicture src="/mock/shield-icon.png" />} title="If You Need Someone to Step In" subtitle="What happens if you can't make decisions for yourself" open={stepInOpen}>
          {stepInBody}
        </SummaryCard>
      </div>

      <SummaryCard icon={<CardPicture src="/mock/tree-icon.png" />} title="What You'll Leave Behind" subtitle="How your estate is managed and distributed" open={leaveOpen}>
        {/* The will's two scenarios, who is still around, and the search */}
        <div className="mb-7">
          <div className="mb-4 inline-flex flex-wrap items-center gap-5 border-b border-[#E5E7EB] pb-2.5">
            <span className="text-[#128F8B]" style={{ fontSize: 14, fontWeight: 500 }}>If Maria survives you</span>
            <span className="text-[#6B7280] transition-colors hover:text-[#1F2933]" style={{ fontSize: 14, fontWeight: 500 }}>If Maria doesn&apos;t survive you</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <PersonChip label="Maria" />
              <PersonChip label="Emma" />
              <PersonChip label="Leo" />
            </div>
            <span className="relative min-w-[160px] flex-1">
              <span className="block w-full border-b border-[#E5E7EB] pb-1 text-right text-[#9CA3AF]" style={{ fontSize: 13, lineHeight: 1.5 }}>
                Search by name or asset…
              </span>
            </span>
          </div>
        </div>

        <SubBlock title="1. Debts & Taxes">
          <P>Debts, expenses, and any estate taxes are settled from the estate itself before anything is given out, so no one who receives a gift below owes tax on it.</P>
        </SubBlock>

        {/* A will with no specific gifts: the attorney's quiet way in */}
        <Hr />
        <span className="inline-flex items-center gap-1 text-[#6B7280] transition-colors hover:text-[#128F8B]" style={{ fontSize: 12, fontWeight: 600 }}>
          Add a gift
        </span>

        <Hr />
        <SubBlock title="2. The Remaining Estate" action={remainingAction ?? <EditToggle />}>
          <p className="mb-4 text-[#6B7280]" style={{ fontSize: 13, lineHeight: 1.5 }}>
            {remainingNote ?? "Once debts and taxes are settled, here’s what happens to your estate."}
          </p>
          <div className="space-y-4">
            <ShareRow name="Maria Rosen" percent={100} />
          </div>
        </SubBlock>

        <Hr />
        <SubBlock title="Who Manages Your Estate">
          <RoleChain role="Executor" steps={["Maria Rosen", "Emma Rosen"]} />
        </SubBlock>
      </SummaryCard>

      <SummaryCard icon={<CardPicture src="/mock/shield-icon.png" />} title="How Your Plan Protects You" subtitle="Safeguards built into your documents" open={protectsOpen}>
        <div className="divide-y divide-[#EEF0F2]">
          {PROTECTIONS.map((p) => (
            <div key={p.title} className="group flex w-full items-start justify-between gap-3 py-3 text-left">
              <span>
                <span className="block text-[#1F2933] transition-colors group-hover:text-[#128F8B]" style={{ fontSize: 15, fontWeight: 500 }}>{p.title}</span>
                <span className="mt-0.5 block text-[#6B7280]" style={{ fontSize: 13, lineHeight: 1.5 }}>{p.blurb}</span>
              </span>
              <WIcon name="chevronDown" className="mt-1 h-4 w-4 flex-shrink-0 -rotate-90 text-[#9CA3AF]" />
            </div>
          ))}
        </div>
      </SummaryCard>

      <div className="overflow-hidden rounded-b-2xl">
        <SummaryCard icon={<CardPicture src="/mock/docs-icon.png" />} title="Your Documents" subtitle="Signed documents, recordings, and compliance files" />
      </div>
    </div>
  </div>
);

/** The full page, top to bottom: 1440 × SUMMARY_REVIEW_HEIGHT. */
export const SUMMARY_REVIEW_HEIGHT = 2228;
/** The cropped shot: 1440 × 982, scrolled to What You'll Leave Behind (the
    whole card, under the 166px of top bar and sticky head). */
export const SUMMARY_REVIEW_CROP_HEIGHT = 982;
/* How far the cards are scrolled under the sticky head in the cropped shot:
   the top of What You'll Leave Behind meets the bottom of the head. */
const CROP_SCROLL = 697;

/**
 * The attorney's full-screen review of Daniel Rosen's summary, the AI draft
 * ready to approve: the exact page the client will see (every card the
 * product stacks for a will-only plan, at rest), with the attorney's bar on
 * top — undo / redo, Suggested reviews, Approve Summary — and an Edit on
 * each editable block. Canvas 1440 × 2228: pass h={SUMMARY_REVIEW_HEIGHT}
 * to ScaledScreen.
 */
export const SummaryReviewScreen = () => (
  <div className="flex w-full bg-[#F0F2F5] text-left text-[#1F2933]" style={{ fontFamily: FIGTREE, height: SUMMARY_REVIEW_HEIGHT }}>
    <ReviewSidebar />
    <div className="flex min-w-0 flex-1 flex-col">
      <ReviewTopBar />
      <SummaryHead />
      <SummaryCards />
    </div>
  </div>
);

/**
 * The same page scrolled to its most telling part, 1440 × 982: the top bar
 * and the sticky head (with Approve Summary) stay put, as they do in the
 * product, and What You'll Leave Behind — the scenarios, the plain-English
 * sections, the share bar, the executors — fills the screen under them,
 * down to the card's bottom edge. (In a 1440 × 855 frame the same view cuts
 * through the executor chain.) Pass h={SUMMARY_REVIEW_CROP_HEIGHT}.
 */
export const SummaryReviewScreenCropped = ({ edited, approveLabel, approveStyle, remainingNote, remainingAction }: SummaryLive = {}) => (
  <div className="flex w-full overflow-hidden bg-[#F0F2F5] text-left text-[#1F2933]" style={{ fontFamily: FIGTREE, height: SUMMARY_REVIEW_CROP_HEIGHT }}>
    <ReviewSidebar />
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <ReviewTopBar />
      <SummaryHead edited={edited} approveLabel={approveLabel} approveStyle={approveStyle} />
      <div style={{ marginTop: -CROP_SCROLL }}>
        <SummaryCards remainingNote={remainingNote} remainingAction={remainingAction} />
      </div>
    </div>
  </div>
);

// ============================================================================
// SendOrSkipDrawer — "Going out", opened from "Send or skip" in Required actions
// ============================================================================

/* The client check-in (packages/types/touchpoints.ts maintenance_survey) as
   touch-queue.ts queues it for a couple: it goes to the household (queueTo:
   "Daniel and Maria"), with the words filled for its first member. */
const CHECKIN_SUBJECT = "Checking in: has anything changed?";
const CHECKIN_MESSAGE =
  "Hi Daniel,\n\nIt's been a while since we finished your estate plan, and I wanted to check in. A plan works best when it keeps up with life — a move, a new grandchild, a change in what you own.\n\nOnce a year I ask every client the same short questions; it's how we make sure your plan still says what you want it to.\n\nRachel\nAlvarez Family Law";

/** Drawer size: 560 × 791 (slide-drawer.tsx is 560 wide at desktop and runs
    from under the 64px top bar to the bottom of an 855-tall window). */
export const SEND_OR_SKIP_SIZE = { w: 560, h: 791 };

/**
 * The yearly check-in to Daniel (and Maria) waiting for the attorney's
 * go-ahead: subject and message to edit, then Send or Skip. Fixed size
 * 560 × 791: the drawer on its own, without the dashboard under its scrim.
 */
export const SendOrSkipDrawer = () => (
  <div
    className="overflow-hidden bg-[#F0F2F5] text-left text-[#1F2933]"
    style={{ fontFamily: FIGTREE, width: SEND_OR_SKIP_SIZE.w, height: SEND_OR_SKIP_SIZE.h, boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }}
  >
    <div className="px-10 py-8">
      <div className="mb-[13px] flex justify-end">
        <span aria-label="Close" className="flex h-[34px] w-[34px] items-center justify-center text-[#9CA3AF] transition-colors hover:text-[#1F2933]">
          <Icon name="close" className="h-5 w-5" />
        </span>
      </div>
      <div className="rounded-2xl bg-white p-[34px]" style={{ boxShadow: "0 2px 4px rgba(16,24,40,0.05), 0 18px 36px -12px rgba(16,24,40,0.20)" }}>
        <div className="space-y-[21px]">
          <div>
            <h2 className="font-semibold text-[#1F2933]" style={{ fontFamily: FIGTREE, fontSize: 17, lineHeight: "21px" }}>Going out</h2>
            <p className="mt-px text-[#9CA3AF]" style={{ fontSize: 13.5, lineHeight: "21px" }}>To Daniel and Maria · due today</p>
          </div>
          {/* PanelField + LINE_INPUT */}
          <div>
            <p className="mb-[5px] font-medium text-[#6B7280]" style={{ fontSize: 12, lineHeight: "18px" }}>Subject</p>
            <div className="w-full border-b border-[#E5E7EB] bg-transparent px-0 py-2.5 text-[15px] text-[#1F2933]" style={{ lineHeight: 1.5 }}>
              {CHECKIN_SUBJECT}
            </div>
          </div>
          {/* PanelField + LINE_TEXTAREA, rows={10}: ten 24px lines, the rest
              of the email below the fold of the box */}
          <div>
            <p className="mb-[5px] font-medium text-[#6B7280]" style={{ fontSize: 12, lineHeight: "18px" }}>Message</p>
            <div className="w-full border-b border-[#E5E7EB] bg-transparent px-0 py-2" style={{ fontSize: 15, lineHeight: "24px" }}>
              <div className="overflow-hidden whitespace-pre-wrap break-words text-[#1F2933]" style={{ height: 240 }}>
                {CHECKIN_MESSAGE}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 pt-[5px]">
            <span className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#309E96] text-[15px] font-semibold text-white transition-colors hover:bg-[#0F7673]">
              Send
            </span>
            <span className="inline-flex h-10 w-full items-center justify-center rounded-[10px] text-[14px] font-medium text-[#6B7280] transition-colors hover:text-[#1F2933]">
              Skip
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// ReleaseRequestModal — the access request review popup
// ============================================================================

/** Popup size: AccessRequestModal's max-w-[460px] sheet, 460 × 469 for a
    death request, 460 × 422 for an incapacity one. */
export const RELEASE_REQUEST_WIDTH = 460;
export const RELEASE_REQUEST_HEIGHTS = { death: 469, incapacity: 422 } as const;

/**
 * Someone named in Daniel's plan asks for what he held back, and the attorney
 * grants or denies it. The modal's own copy for the kind of request:
 *   "death" (default) — Maria, his executor, reports he has passed away and
 *     asks for what he held back until then. Death is the only release event
 *     the product offers today (packages/types/access-requests.ts
 *     ACCESS_MOMENTS = ['death'], MT 4.2).
 *   "incapacity" — Maria, his power of attorney, says a doctor has certified
 *     he can't decide for himself. The modal still draws it, but clients can
 *     no longer hold anything back for it (sharing-constants.ts
 *     incapacityRelevant() is false), so only requests from before that rule
 *     reach it.
 * Proof was sent (the firm's default route), so no "hasn't sent proof" line.
 * Fixed size 460 wide × RELEASE_REQUEST_HEIGHTS[kind]: the popup on its own,
 * without the dimmed page behind it.
 */
export const ReleaseRequestModal = ({ kind = "death" }: { kind?: "death" | "incapacity" }) => {
  const title = kind === "death" ? "Access to Daniel's plan" : "Daniel's agent is asking for access";
  const subtitle =
    kind === "death"
      ? "Maria Rosen, Daniel's executor, let us know Daniel has passed away, and is asking for what Daniel held back until then."
      : "Maria Rosen, Daniel's power of attorney, says a doctor has certified Daniel can no longer make their own decisions.";
  const label = (text: string) => <p className="text-[12.5px] font-medium text-[#6B7280]">{text}</p>;
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white p-7 text-left text-[#1F2933]"
      style={{
        fontFamily: FIGTREE,
        width: RELEASE_REQUEST_WIDTH,
        height: RELEASE_REQUEST_HEIGHTS[kind],
        boxShadow: "0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      {/* WillowPopupHeader portrait={false}: the corner ×, the serif title, one grey line */}
      <div className="relative w-full">
        <span aria-label="Close" className="absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center text-[#C4C9D0] transition-colors hover:text-[#6B7280]" style={{ fontSize: 18 }}>
          &times;
        </span>
        <div className="text-center">
          <h2 className="mx-auto max-w-[420px] font-semibold text-[#1F2933]" style={{ fontFamily: MERRIWEATHER, fontSize: 24, lineHeight: 1.3, textWrap: "balance" } as React.CSSProperties}>
            {title}
          </h2>
          <p className="mx-auto max-w-[560px] text-[#6B7280]" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8, textWrap: "balance" } as React.CSSProperties}>
            {subtitle}
          </p>
        </div>
      </div>
      {kind === "death" && (
        <p className="mt-2 text-center text-[13px] text-[#B45309]">
          Granting opens what Daniel held back for everyone Daniel shared it with: Maria Rosen, Emma Rosen, Leo Rosen. Each of them is emailed.
        </p>
      )}

      <div className="mt-6 space-y-5 text-left">
        <div>
          {label("Documents")}
          <div className="mt-1 divide-y divide-[#EEF0F2] border-b border-[#EEF0F2]">
            <span className="flex items-center gap-2.5 py-2.5 text-[14px] text-[#1F2933] hover:text-[#128F8B]">
              <WIcon name="document" className="h-4 w-4 flex-shrink-0 text-[#128F8B]" />
              {kind === "death" ? "View death certificate" : "View doctor's letter"}
            </span>
          </div>
        </div>
        <div className="border-b border-[#EEF0F2] pb-3">
          {label("Reach Maria")}
          <div className="mt-1 flex flex-col gap-1 text-[14px] text-[#1F2933]">
            <span className="inline-flex items-center gap-2.5 hover:text-[#128F8B]">
              <Icon name="mail" className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
              maria.rosen@gmail.com
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-1">
        <span className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#128F8B] text-[15px] font-semibold text-white transition-colors hover:bg-[#0F7673]">
          Grant access
        </span>
        <span className="flex h-10 w-full items-center justify-center text-[14px] font-medium text-[#6B7280] transition-colors hover:text-[#1F2933]">
          Deny
        </span>
      </div>
    </div>
  );
};
