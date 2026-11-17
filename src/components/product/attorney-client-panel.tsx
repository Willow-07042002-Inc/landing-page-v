import React from "react";
import { FloatStack, FLOAT_SEAM_SHADOW, FLOAT_STACK_SHADOW, WIcon, initialsOf } from "./kit";

// ---- The bodies of Daniel Rosen's client panel tabs, to pass as `panel` into
// AttorneyClientsScreen (attorney-clients.tsx). Each renders what sits under
// the panel's tab bar, in the 672px column (800px panel, px-16). Recreated
// from apps/professionals on origin/main (d99a54b6, Nov 16 2026):
//   client-detail-view.tsx (which tab renders what)
//   client-detail/overview-tab.tsx                      Contact
//   client-detail/team-tab.tsx, estate-plan-team.tsx,
//     packages/ui/components/estate-plan-team.tsx,
//     client-detail/access-control.tsx,
//     client-detail/client-professionals.tsx            Team
//   client-detail/staying-in-touch.tsx,
//     settings/shared.tsx (StackGroup, StackSection, Toggle),
//     settings/panel-kit.tsx (SwitchLine)               Staying in touch
//   client-detail/notes-tab.tsx, notes-activity-tab.tsx,
//     notepad.tsx, note-editor.tsx                      Notes
//   client-detail/emails-tab.tsx, outlook-emails.tsx,
//     settings/email-log-tab.tsx (EmailLogTab),
//     settings/panel-kit.tsx (LineMenu)                 Emails
//   client-detail/estate-plans-tab.tsx (SubTabBar,
//     EstatePlanSummaryTab, SummaryStatus),
//     working-mark.tsx (WillowMark)                     Estate Plan > Summary
// Breakpoint classes (sm:, lg:) are resolved to what the product shows at
// desktop width, since this canvas is scaled and the real viewport may be
// narrow. Golden-ratio tokens (text-lead, py-phi-3 …, packages/ui/golden.css)
// are written out as their pixel values. ----

/* The product's own icons this file needs beyond the kit's, verbatim from
   packages/ui/icons/willow-solid (CheckIcon, BoldIcon, ItalicIcon,
   UnderlineIcon, ListIcon, ListNumberedIcon) */
const PANEL_ICON_PATHS = {
  check:
    "M8.78 18.77 8.9 18.87 9.18 19.02 9.33 19.07 9.64 19.1 9.8 19.08 10.1 18.99 10.24 18.92 10.48 18.72 20.48 7.95 20.62 7.67 20.69 7.36 20.7 7.21 20.65 6.9 20.59 6.75 20.52 6.61 20.32 6.37 20.06 6.19 19.77 6.08 19.61 6.06 19.3 6.07 19.15 6.1 19 6.16 18.74 6.33 9.54 16.2 5.2 12.13 4.93 11.98 4.78 11.93 4.62 11.91 4.31 11.92 4.01 12.01 3.74 12.17 3.63 12.28 3.53 12.4 3.38 12.67 3.31 12.98 3.3 13.14 3.35 13.45 3.41 13.59 3.57 13.86Z",
  bold:
    "M9.5 3.4 5.8 3.4 5.8 20.6 9.5 20.6 9.5 20.5 9.8 20.56 10.4 20.6 13 20.6 13.6 20.56 14.19 20.44 14.76 20.25 15.3 19.98 15.8 19.65 16.25 19.25 16.65 18.8 16.98 18.3 17.25 17.76 17.44 17.19 17.56 16.6 17.6 16 17.6 15.2 17.56 14.6 17.44 14.01 17.25 13.44 16.98 12.9 16.65 12.4 16.25 11.95 15.8 11.55 15.3 11.22 14.64 10.91 14.89 10.69 15.21 10.31 15.49 9.9 15.71 9.45 15.87 8.98 15.97 8.5 16 8 16 7.2 15.97 6.7 15.87 6.22 15.71 5.75 15.49 5.3 15.21 4.89 14.89 4.51 14.51 4.19 14.1 3.91 13.65 3.69 13.18 3.53 12.7 3.43 12.2 3.4ZM12.43 13.62 12.67 13.66 12.89 13.74 13.1 13.84 13.3 13.97 13.47 14.13 13.63 14.3 13.76 14.5 13.86 14.71 13.94 14.93 13.98 15.17 14 15.8 13.98 16.03 13.94 16.27 13.86 16.49 13.76 16.7 13.63 16.9 13.47 17.07 13.3 17.23 13.1 17.36 12.89 17.46 12.67 17.54 12.43 17.58 12.2 17.6 10.77 17.58 10.53 17.54 10.31 17.46 10.1 17.36 9.9 17.23 9.73 17.07 9.57 16.9 9.44 16.7 9.34 16.49 9.26 16.27 9.22 16.03 9.2 15.8 9.22 15.17 9.26 14.93 9.34 14.71 9.44 14.5 9.57 14.3 9.73 14.13 9.9 13.97 10.1 13.84 10.31 13.74 10.53 13.66 10.77 13.62 11 13.6ZM11.84 6.44 12.15 6.57 12.42 6.78 12.63 7.05 12.76 7.36 12.8 7.7 12.76 8.04 12.63 8.35 12.42 8.62 12.29 8.73 12 8.9 11.67 8.99 11.5 9 10.33 8.99 10 8.9 9.71 8.73 9.58 8.62 9.47 8.49 9.3 8.2 9.21 7.87 9.2 7.7 9.21 7.53 9.3 7.2 9.47 6.91 9.58 6.78 9.71 6.67 10 6.5 10.33 6.41 11.5 6.4Z",
  italic:
    "M18.56 5.39 18.71 5.36 19 5.24 19.25 5.05 19.35 4.93 19.44 4.8 19.56 4.51 19.6 4.2 19.56 3.89 19.44 3.6 19.35 3.47 19.25 3.35 19 3.16 18.71 3.04 18.4 3 10.2 3 9.89 3.04 9.74 3.09 9.6 3.16 9.35 3.35 9.25 3.47 9.09 3.74 9.01 4.04 9.01 4.36 9.09 4.66 9.25 4.93 9.35 5.05 9.6 5.24 9.89 5.36 10.2 5.4 12.94 5.4 8.54 18.6 5.6 18.6 5.29 18.64 5 18.76 4.75 18.95 4.56 19.2 4.44 19.49 4.41 19.64 4.41 19.96 4.49 20.26 4.56 20.4 4.75 20.65 5 20.84 5.14 20.91 5.29 20.96 5.6 21 13.8 21 14.11 20.96 14.26 20.91 14.4 20.84 14.65 20.65 14.84 20.4 14.96 20.11 14.99 19.96 14.99 19.64 14.91 19.34 14.84 19.2 14.65 18.95 14.4 18.76 14.11 18.64 13.8 18.6 11.06 18.6 15.46 5.4Z",
  underline:
    "M19.16 21.59 19.31 21.56 19.6 21.44 19.73 21.35 19.95 21.13 20.04 21 20.16 20.71 20.2 20.4 20.16 20.09 20.04 19.8 19.95 19.67 19.73 19.45 19.6 19.36 19.31 19.24 19.16 19.21 4.84 19.21 4.69 19.24 4.4 19.36 4.15 19.55 3.96 19.8 3.84 20.09 3.81 20.24 3.8 20.4 3.84 20.71 3.96 21 4.05 21.13 4.27 21.35 4.4 21.44 4.69 21.56 4.84 21.59ZM5.8 10.26 5.84 10.91 5.95 11.55 6.09 12.06 6.36 12.78 6.66 13.35 7.02 13.89 7.35 14.3 7.81 14.76 8.41 15.25 8.96 15.6 9.54 15.89 10.02 16.08 10.65 16.25 11.41 16.37 12.06 16.4 12.59 16.37 13.23 16.28 13.86 16.11 14.46 15.89 15.15 15.54 15.69 15.18 16.19 14.76 16.65 14.3 17.05 13.79 17.34 13.35 17.64 12.78 17.88 12.18 18.05 11.55 18.16 10.91 18.2 10.2 18.2 3.6 18.16 3.29 18.04 3 17.85 2.75 17.6 2.56 17.31 2.44 17 2.4 16.69 2.44 16.4 2.56 16.15 2.75 16.05 2.87 15.89 3.14 15.81 3.44 15.8 3.6 15.8 10.17 15.78 10.6 15.72 10.99 15.61 11.37 15.47 11.74 15.29 12.1 15.07 12.43 14.82 12.74 14.54 13.02 14.23 13.27 13.9 13.49 13.54 13.67 13.17 13.81 12.79 13.92 12.4 13.98 12 14 11.6 13.98 11.21 13.92 10.83 13.81 10.46 13.67 10.1 13.49 9.77 13.27 9.46 13.02 9.18 12.74 8.93 12.43 8.71 12.1 8.53 11.74 8.39 11.37 8.28 10.99 8.22 10.6 8.2 10.17 8.19 3.44 8.11 3.14 7.95 2.87 7.85 2.75 7.6 2.56 7.46 2.49 7.16 2.41 6.84 2.41 6.69 2.44 6.4 2.56 6.27 2.65 6.15 2.75 5.96 3 5.89 3.14 5.81 3.44Z",
  list:
    "M9.37 4.85 9.09 5.01 8.86 5.24 8.77 5.37 8.64 5.68 8.61 5.84 8.61 6.16 8.64 6.32 8.77 6.63 8.97 6.88 9.09 6.99 9.37 7.15 9.69 7.24 20.31 7.24 20.47 7.21 20.78 7.08 21.03 6.88 21.23 6.63 21.3 6.48 21.39 6.16 21.4 6 21.36 5.68 21.23 5.37 21.14 5.24 20.91 5.01 20.78 4.92 20.47 4.79 20.31 4.76 9.85 4.75 9.53 4.79ZM9.37 16.85 9.22 16.92 8.97 17.12 8.77 17.37 8.64 17.68 8.61 17.84 8.61 18.16 8.64 18.32 8.77 18.63 8.97 18.88 9.22 19.08 9.37 19.15 9.69 19.24 20.31 19.24 20.63 19.15 20.78 19.08 21.03 18.88 21.23 18.63 21.3 18.48 21.39 18.16 21.4 18 21.36 17.68 21.23 17.37 21.14 17.24 21.03 17.12 20.78 16.92 20.63 16.85 20.31 16.76 9.85 16.75 9.69 16.76ZM9.53 10.79 9.22 10.92 9.09 11.01 8.86 11.24 8.77 11.37 8.64 11.68 8.6 12 8.64 12.32 8.77 12.63 8.86 12.76 9.09 12.99 9.22 13.08 9.53 13.21 9.69 13.24 20.31 13.24 20.47 13.21 20.78 13.08 21.03 12.88 21.23 12.63 21.3 12.48 21.39 12.16 21.4 12 21.36 11.68 21.23 11.37 21.14 11.24 20.91 11.01 20.78 10.92 20.47 10.79 20.31 10.76 9.85 10.75ZM6.16 11.1 6.03 10.9 5.87 10.73 5.7 10.57 5.5 10.44 5.29 10.34 5.07 10.26 4.83 10.22 4.6 10.2 4.37 10.22 4.13 10.26 3.91 10.34 3.7 10.44 3.5 10.57 3.33 10.73 3.17 10.9 3.04 11.1 2.94 11.31 2.86 11.53 2.82 11.77 2.8 12 2.82 12.23 2.86 12.47 2.94 12.69 3.04 12.9 3.17 13.1 3.33 13.27 3.5 13.43 3.7 13.56 3.91 13.66 4.13 13.74 4.37 13.78 4.6 13.8 4.83 13.78 5.07 13.74 5.29 13.66 5.5 13.56 5.7 13.43 5.87 13.27 6.03 13.1 6.16 12.9 6.26 12.69 6.34 12.47 6.38 12.23 6.4 12 6.38 11.77 6.34 11.53 6.26 11.31ZM6.16 17.1 6.03 16.9 5.87 16.73 5.7 16.57 5.5 16.44 5.29 16.34 5.07 16.26 4.83 16.22 4.6 16.2 4.37 16.22 4.13 16.26 3.91 16.34 3.7 16.44 3.5 16.57 3.33 16.73 3.17 16.9 3.04 17.1 2.94 17.31 2.86 17.53 2.82 17.77 2.8 18 2.82 18.23 2.86 18.47 2.94 18.69 3.04 18.9 3.17 19.1 3.33 19.27 3.5 19.43 3.7 19.56 3.91 19.66 4.13 19.74 4.37 19.78 4.6 19.8 4.83 19.78 5.07 19.74 5.29 19.66 5.5 19.56 5.7 19.43 5.87 19.27 6.03 19.1 6.16 18.9 6.26 18.69 6.34 18.47 6.38 18.23 6.4 18 6.38 17.77 6.34 17.53 6.26 17.31ZM6.26 5.31 6.16 5.1 6.03 4.9 5.87 4.73 5.7 4.57 5.5 4.44 5.29 4.34 5.07 4.26 4.83 4.22 4.6 4.2 4.37 4.22 4.13 4.26 3.91 4.34 3.7 4.44 3.5 4.57 3.33 4.73 3.17 4.9 3.04 5.1 2.94 5.31 2.86 5.53 2.82 5.77 2.8 6 2.82 6.23 2.86 6.47 2.94 6.69 3.04 6.9 3.17 7.1 3.33 7.27 3.5 7.43 3.7 7.56 3.91 7.66 4.13 7.74 4.37 7.78 4.6 7.8 4.83 7.78 5.07 7.74 5.29 7.66 5.5 7.56 5.7 7.43 5.87 7.27 6.03 7.1 6.16 6.9 6.26 6.69 6.34 6.47 6.38 6.23 6.4 6 6.38 5.77 6.34 5.53Z",
  listNumbered:
    "M10.02 10.92 9.89 11.01 9.66 11.24 9.5 11.52 9.41 11.84 9.41 12.16 9.44 12.32 9.57 12.63 9.77 12.88 10.02 13.08 10.33 13.21 10.49 13.24 20.31 13.24 20.47 13.21 20.78 13.08 21.03 12.88 21.23 12.63 21.3 12.48 21.39 12.16 21.4 12 21.36 11.68 21.23 11.37 21.14 11.24 20.91 11.01 20.78 10.92 20.47 10.79 20.31 10.76 10.65 10.75 10.33 10.79ZM10.02 16.92 9.77 17.12 9.66 17.24 9.5 17.52 9.41 17.84 9.41 18.16 9.44 18.32 9.57 18.63 9.77 18.88 10.02 19.08 10.17 19.15 10.49 19.24 20.31 19.24 20.63 19.15 20.78 19.08 21.03 18.88 21.23 18.63 21.3 18.48 21.39 18.16 21.4 18 21.36 17.68 21.23 17.37 21.14 17.24 21.03 17.12 20.78 16.92 20.63 16.85 20.31 16.76 10.65 16.75 10.33 16.79ZM10.33 4.79 10.02 4.92 9.89 5.01 9.66 5.24 9.57 5.37 9.44 5.68 9.4 6 9.44 6.32 9.57 6.63 9.66 6.76 9.89 6.99 10.02 7.08 10.17 7.15 10.49 7.24 20.31 7.24 20.47 7.21 20.78 7.08 21.03 6.88 21.23 6.63 21.3 6.48 21.39 6.16 21.4 6 21.36 5.68 21.23 5.37 21.14 5.24 20.91 5.01 20.78 4.92 20.47 4.79 20.31 4.76 10.65 4.75ZM5.1 10.72 2.88 13.87 2.82 14.04 2.8 14.22 2.86 14.48 3.01 14.7 3.24 14.85 3.5 14.9 6.29 14.89 6.47 14.85 6.63 14.76 6.76 14.63 6.85 14.47 6.9 14.2 6.85 13.93 6.69 13.71 6.47 13.55 6.2 13.5 4.85 13.5 6.47 11.2 6.58 10.96 6.59 10.69 6.54 10.52 6.14 9.62 5.98 9.39 5.83 9.28 5.56 9.2 4.46 9.1 4.18 9.14 3.93 9.28 2.97 10.14 2.84 10.38 2.8 10.56 2.84 10.83 2.98 11.07 3.19 11.23 3.46 11.3 3.64 11.29 3.89 11.18 4.64 10.52 5.03 10.56ZM3.95 17.43 3.91 17.6 3.91 17.78 3.95 17.96 4.09 18.18 4.31 18.34 5.08 18.57 5.21 18.91 4.95 19.28 3.54 19.2 3.36 19.21 3.18 19.28 2.97 19.44 2.83 19.68 2.8 19.95 2.88 20.22 2.98 20.37 3.12 20.49 3.37 20.59 5.26 20.7 5.44 20.69 5.61 20.63 5.75 20.53 5.87 20.4 6.57 19.4 6.65 19.25 6.7 19.08 6.69 18.91 6.65 18.74 6.21 17.66 6.04 17.45 5.89 17.36 5.77 17.32 6.46 16.43 6.55 16.27 6.59 16.09 6.59 15.91 6.55 15.73 6.46 15.57 6.25 15.39 6.08 15.32 5.9 15.3 3.5 15.3 3.23 15.35 3.07 15.44 2.89 15.65 2.82 15.82 2.8 16 2.85 16.27 3.01 16.49 3.15 16.61 3.41 16.69 4.48 16.7 4.04 17.27ZM4.22 8.48 4.34 8.73 4.55 8.91 4.81 8.99 4.99 8.99 5.17 8.95 5.39 8.79 5.51 8.65 5.59 8.39 5.59 3.81 5.55 3.64 5.4 3.41 5.26 3.3 5.01 3.21 4.83 3.2 4.65 3.25 3.27 3.98 3.12 4.09 3 4.23 2.91 4.49 2.9 4.67 2.98 4.93 3.16 5.14 3.31 5.24 3.58 5.3 3.76 5.28 4.2 5.07 4.2 8.3Z",
} as const;

const PIcon = ({ name, className }: { name: keyof typeof PANEL_ICON_PATHS; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d={PANEL_ICON_PATHS[name]} />
  </svg>
);

/* Every panel starts from the line height the product's page gives its text
   (Tailwind's preflight, 1.5), whatever the marketing page around it sets. */
const PanelRoot = ({ children }: { children: React.ReactNode }) => <div className="text-left leading-normal">{children}</div>;

/* team-tab.tsx and estate-plans-tab.tsx SubTabBar: the second row of tabs,
   the same look as the panel's own */
const ProSubTabs = ({ tabs, active }: { tabs: string[]; active: string }) => (
  <div className="mb-6 border-b border-[#E5E7EB]">
    <nav className="flex min-w-max">
      {tabs.map((t) => (
        <span
          key={t}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-medium ${
            t === active ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"
          }`}
        >
          {t}
        </span>
      ))}
    </nav>
  </div>
);

/* settings/shared.tsx StackGroup: one rounded grey wrapper, white sections
   with thin grey gaps between them (no shadow) */
const StackGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
    <div className="flex flex-col gap-1.5">{children}</div>
  </div>
);

/* settings/shared.tsx StackSection: a white section under a small grey heading */
const StackSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="bg-white p-8">
    {title && (
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {/* globals.css sets the product's headings in its sans; the marketing
              site's base styles would set them in Merriweather */}
          <h2 className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]" style={{ fontFamily: "inherit" }}>
            {title}
          </h2>
        </div>
      </div>
    )}
    {children}
  </div>
);

/* The initials every Team row starts with (estate-plan-team.tsx MemberRow,
   access-control.tsx) */
const TeamInitials = ({ name }: { name: string }) => (
  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F9F9] text-[12px] font-semibold text-[#309E96] ring-1 ring-black/5">
    {initialsOf(name)}
  </span>
);

// ─── Contact ────────────────────────────────────────────────────────────────

const ContactField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">{label}</p>
    <p className="mt-1 text-[15px] text-[#1F2933]">{value}</p>
  </div>
);

/* overview-tab.tsx OverviewViewMode: email and phone on the left; the mailing
   address and, on its own line, the state of residence on the right. The
   address shows street, city and ZIP only (the state is the line below). */
export const ContactPanel = () => (
  <PanelRoot>
    <FloatStack>
      <div className="bg-white p-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <ContactField label="Email" value="daniel.rosen@gmail.com" />
            <ContactField label="Phone" value="+1 212-555-0148" />
          </div>
          <div className="flex flex-col gap-3">
            <ContactField label="Address" value="85 Grove Street, New York, 10014" />
            <ContactField label="State of residence" value="New York" />
          </div>
        </div>
      </div>
    </FloatStack>
  </PanelRoot>
);

// ─── Team ───────────────────────────────────────────────────────────────────

const TEAM_SUB_TABS = ["Estate team", "Professional", "Family & friends"];

/* packages/ui estate-plan-team.tsx MemberRow: each person once, with every
   role the plan gives them (the plan's order: executor, guardian, trustee,
   power of attorney, medical proxy; a backup says so) */
const MemberRow = ({ name, rel, roles, email }: { name: string; rel: string; roles: string[]; email: string }) => (
  <div className="flex items-center gap-3 py-3">
    <TeamInitials name={name} />
    <div className="min-w-0 flex-1">
      <p className="truncate text-[14px] font-semibold text-[#1F2933]">
        {name}
        <span className="font-normal text-[#9CA3AF]"> · {rel}</span>
      </p>
      <p className="truncate text-[12.5px] text-[#6B7280]">{roles.join(" · ")}</p>
      <span className="block truncate text-[12.5px] text-[#128F8B]">{email}</span>
    </div>
  </div>
);

/* access-control.tsx: a row per person Daniel shared something with but held
   it back from, what it is, and whether it is open */
const AccessRow = ({ name, roles, items }: { name: string; roles: string[]; items: string[] }) => (
  <div className="flex items-center gap-3 py-3">
    <TeamInitials name={name} />
    <div className="min-w-0 flex-1">
      <p className="truncate text-[14px] font-semibold text-[#1F2933]">
        {name}
        <span className="font-normal text-[#9CA3AF]"> · {roles.join(", ")}</span>
      </p>
      <p className="truncate text-[12.5px] text-[#6B7280]">{items.join(" · ")}</p>
    </div>
    <span className="flex-shrink-0 text-[12.5px] font-medium text-[#9CA3AF]">Locked</span>
    <span className="flex-shrink-0 text-[13px] font-semibold text-[#128F8B]">Control access</span>
  </div>
);

/* team-tab.tsx, Estate team open (the tab's default): the people Daniel's
   plan names, one plain card (EstatePlanTeamView with `only="estate"`), then
   Access, what he shared but held back and from whom. No access request is
   open, so the request notice above the sub-tabs is absent. */
export const TeamPanel = () => (
  <PanelRoot>
    <ProSubTabs tabs={TEAM_SUB_TABS} active="Estate team" />

    <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
      <div className="bg-white p-8">
        <div className="-my-3 divide-y divide-[#F0F1F3]">
          <MemberRow name="Maria Rosen" rel="Wife" roles={["Executor", "Power of Attorney", "Medical Proxy"]} email="maria.rosen@gmail.com" />
          <MemberRow name="Emma Rosen" rel="Daughter" roles={["Executor (backup)", "Trustee"]} email="emma.rosen@gmail.com" />
          <MemberRow name="Leo Rosen" rel="Son" roles={["Trustee (backup)", "Medical Proxy (backup)"]} email="leo.rosen@gmail.com" />
        </div>
      </div>
    </div>

    <div className="mt-4 overflow-hidden rounded-2xl bg-[#F3F4F6]">
      <div className="bg-white p-8">
        <p className="text-[15px] font-semibold text-[#1F2933]">Access</p>
        <p className="mb-1 mt-0.5 text-[12.5px] text-[#9CA3AF]">What Daniel shared but held back, and who for.</p>
        <div className="divide-y divide-[#F0F1F3]">
          <AccessRow name="Emma Rosen" roles={["Executor", "Trustee"]} items={["Last Will & Testament", "Revocable Living Trust"]} />
          <AccessRow name="Leo Rosen" roles={["Trustee", "Medical Proxy"]} items={["Revocable Living Trust", "Finance"]} />
        </div>
      </div>
    </div>
  </PanelRoot>
);

/* client-professionals.tsx ProfessionalRow: white initials on teal, name,
   company, email, phone, then the quiet Edit and Remove */
const ProfessionalRow = ({ name, company, email, phone }: { name: string; company: string; email: string; phone: string }) => (
  <div className="flex items-center gap-3 py-2.5">
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#128F8B] text-[12px] font-semibold text-white">{initialsOf(name)}</span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[14px] font-semibold text-[#1F2933]">{name}</p>
      <p className="truncate text-[12px] text-[#9CA3AF]">{company}</p>
      <p className="truncate text-[12px] text-[#128F8B]">{email}</p>
      <p className="truncate text-[12px] text-[#9CA3AF]">{phone}</p>
    </div>
    <div className="flex flex-shrink-0 items-center gap-3">
      <span className="text-[12px] font-medium text-[#9CA3AF]">Edit</span>
      <span className="text-[12px] font-medium text-[#9CA3AF]">Remove</span>
    </div>
  </div>
);

/* team-tab.tsx with the Professional sub-tab open (client-professionals.tsx):
   the advisors the firm keeps for Daniel's plan, a card per role in the
   roles' order. Professional check-ins go to these people. */
export const TeamProfessionalPanel = () => (
  <PanelRoot>
    <ProSubTabs tabs={TEAM_SUB_TABS} active="Professional" />
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-[#9CA3AF]">The advisors you work with on Daniel&rsquo;s plan. Professional check-ins go to them.</p>
        <span className="flex-shrink-0 rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-[13px] font-medium text-[#1F2933]">Add a professional</span>
      </div>
      <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
        <div className="flex flex-col gap-1.5">
          <div className="bg-white p-8">
            <p className="mb-1 text-[15px] font-semibold text-[#1F2933]">Financial advisor</p>
            <div className="divide-y divide-[#F0F1F3]">
              <ProfessionalRow name="Howard Kim" company="Kim Wealth Advisors" email="howard@kimwealth.com" phone="+1 212-555-0186" />
            </div>
          </div>
          <div className="bg-white p-8">
            <p className="mb-1 text-[15px] font-semibold text-[#1F2933]">Accountant</p>
            <div className="divide-y divide-[#F0F1F3]">
              <ProfessionalRow name="Lisa Moreno" company="Moreno & Associates CPA" email="lisa@morenocpa.com" phone="+1 212-555-0123" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PanelRoot>
);

// ─── Staying in touch ───────────────────────────────────────────────────────

/* settings/shared.tsx Toggle, switched on */
const ToggleOn = () => (
  <span className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-[#309E96]">
    <span className="inline-block h-3.5 w-3.5 translate-x-[18px] transform rounded-full bg-white shadow" />
  </span>
);

/* One way of staying in touch: settings/panel-kit.tsx SwitchLine (switched
   on, so no rule under it: the "Sends based on" line follows), then that
   line with its date field */
const TouchWay = ({ title, next, base }: { title: string; next: string; base: string }) => (
  <div>
    <div className="flex items-center gap-[13px] border-b border-[#E5E7EB] py-[8px]">
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-[21px] text-[#1F2933]">{title}</span>
        <span className="mt-px block text-[12px] leading-[18px] text-[#9CA3AF]">Next: {next}</span>
      </span>
      <ToggleOn />
    </div>
    <div className="flex items-center justify-between gap-4 py-2.5 text-[13px] text-[#6B7280]">
      <span>Sends based on</span>
      {/* The browser's own date field, as in the product: it draws the date
          in the viewer's locale ("08/12/2027" in US Chrome) */}
      <input
        type="date"
        tabIndex={-1}
        aria-label={`${title} base date`}
        defaultValue={base}
        className="pointer-events-none rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-[13px] text-[#1F2933] focus:outline-none"
      />
    </div>
  </div>
);

/* staying-in-touch.tsx, a client on the workflow with a plan approved: the
   three ways (agents, professionals, the client) each on with its next send;
   then Daniel's people (Emma booked a meeting from her check-in, so hers are
   paused until it); then what Daniel said on the changes form. Nobody has
   turned off the firm's newsletters and the household has accepted the
   terms, so neither notice shows above. Dates are this year's (no year). */
export const StayingInTouchPanel = () => (
  <PanelRoot>
    <StackGroup>
      <StackSection title="Staying in touch">
        <div>
          <TouchWay title="Agent check-ins" next="August 12" base="2027-08-12" />
          <TouchWay title="Professional check-ins" next="March 9" base="2027-03-09" />
          <TouchWay title="Client check-ins" next="July 14" base="2027-07-14" />
        </div>
      </StackSection>

      <StackSection title="Daniel's people">
        <div className="flex items-baseline gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] text-[#1F2933]">
              Emma booked Tuesday, Feb 23
              <span className="text-[#B45309]"> · check-ins paused</span>
            </p>
            <p className="text-[13px] text-[#9CA3AF]">Executor · emma.rosen@gmail.com</p>
          </div>
          <span className="flex-shrink-0 text-[13px] font-medium text-[#309E96]">Resume check-ins</span>
        </div>
      </StackSection>

      <StackSection title="What Daniel said">
        <div>
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[14px] text-[#1F2933]">
                <span className="font-medium">Something changed</span>
                <span className="text-[#9CA3AF]"> · January 20</span>
              </p>
              <span className="flex-shrink-0 text-[13px] font-medium text-[#309E96]">Mark reviewed</span>
            </div>
            <p className="mt-1.5 text-[13px] text-[#6B7280]">
              <span className="text-[#1F2933]">Have you moved, or bought or sold property?</span>
              {" — "}We bought a chalet in Stowe, Vermont.
            </p>
            <p className="mt-1.5 text-[13px] text-[#6B7280]">&ldquo;Should the chalet go into our trust too?&rdquo;</p>
          </div>
        </div>
      </StackSection>
    </StackGroup>
  </PanelRoot>
);

// ─── Emails ─────────────────────────────────────────────────────────────────

/* outlook-emails.tsx: one email with Daniel, read live from Rachel's Outlook
   (subject, who, date; never a body). Today shows the time, this year "Feb 9". */
const OutlookRow = ({ subject, date, outgoing }: { subject: string; date: string; outgoing: boolean }) => (
  <div className="block border-b border-[#F0F1F3] py-3 first:pt-0 last:border-0">
    <div className="flex items-baseline justify-between gap-4">
      <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#1F2933]">{subject}</p>
      <p className="flex-shrink-0 text-[12px] text-[#9CA3AF]">{date}</p>
    </div>
    <p className="mt-0.5 truncate text-[12px] text-[#9CA3AF]">{outgoing ? "You → Daniel" : "Daniel → You"}</p>
  </div>
);

/* settings/email-log-tab.tsx EmailRow at desktop width: when · to · subject ·
   kind · status, the subject taking what is left (so it truncates) */
const SentRow = ({ when, to, subject, kind }: { when: string; to: string; subject: string; kind: string }) => (
  <li className="border-b border-[#F0F1F3] last:border-0">
    <div className="flex w-full flex-row items-baseline gap-4 py-3.5 text-left">
      <span className="w-[112px] flex-shrink-0 whitespace-nowrap text-[12.5px] tabular-nums text-[#9CA3AF]">{when}</span>
      <span className="w-[160px] flex-shrink-0 truncate text-[13px] text-[#1F2933]">{to}</span>
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#1F2933]">{subject}</span>
      <span className="block w-[130px] flex-shrink-0 truncate text-[12.5px] text-[#9CA3AF]">{kind}</span>
      <span className="w-[44px] flex-shrink-0 text-right text-[12.5px] font-medium text-[#309E96]">Sent</span>
    </div>
  </li>
);

/* emails-tab.tsx: one stacked card. In your Outlook (Outlook connected),
   then the search and kind filter, then Sent by Willow: what Willow sent
   Daniel and his people, newest first. Nobody has turned off newsletters, so
   no notice above. */
export const EmailsPanel = () => (
  <PanelRoot>
    <StackGroup>
      <StackSection title="In your Outlook">
        <div className="flex flex-col">
          <OutlookRow subject="Re: The chalet in Stowe" date="10:24 AM" outgoing={false} />
          <OutlookRow subject="Recorded deed for the Lake George house" date="Feb 9" outgoing />
          <OutlookRow subject="Your signed estate plan" date="Jan 27" outgoing />
        </div>
        <p className="mt-4 text-[12px] text-[#9CA3AF]">Opens in Outlook. Willow shows the subject and date only.</p>
      </StackSection>

      <StackSection>
        <div className="flex flex-row items-end gap-8">
          <div className="min-w-0 flex-1">
            <span className="mb-2 block text-[13px] font-medium text-[#6B7280]">Search</span>
            <div className="w-full border-0 border-b border-[#E5E7EB] bg-transparent px-0 py-2.5 text-[15px] text-[#9CA3AF]">An address, a name or a subject</div>
          </div>
          <div className="w-[220px]">
            <span className="mb-2 block text-[13px] font-medium text-[#6B7280]">Kind</span>
            {/* settings/panel-kit.tsx LineMenu, size "field", closed */}
            <span className="relative inline-block w-full">
              <span className="group flex w-full items-center justify-between gap-[3px] border-b border-[#E5E7EB] py-[8px] text-left text-[15px] leading-[21px] text-[#1F2933]">
                <span className="flex min-w-0 items-center gap-[8px]">
                  <span className="truncate">All kinds</span>
                </span>
                <WIcon name="chevronDown" className="h-3.5 w-3.5 flex-shrink-0 translate-y-px text-[#9CA3AF]" />
              </span>
            </span>
          </div>
        </div>
      </StackSection>

      <StackSection title="Sent by Willow">
        <ul className="-my-3.5">
          <SentRow when="Feb 15, 4:12 PM" to="Emma Rosen" subject="Your Agent meeting with Rachel is confirmed, Tue Feb 23 at 2:00 PM EST" kind="Booking confirmation" />
          <SentRow when="Feb 12, 10:00 AM" to="Emma Rosen" subject="Checking in on Daniel and Maria Rosen's estate plan" kind="Staying in touch" />
          <SentRow when="Feb 12, 10:00 AM" to="Leo Rosen" subject="Checking in on Daniel and Maria Rosen's estate plan" kind="Staying in touch" />
          <SentRow when="Jan 14, 10:00 AM" to="Daniel Rosen" subject="Checking in: has anything changed?" kind="Staying in touch" />
          <SentRow when="Jan 14, 10:00 AM" to="Maria Rosen" subject="Checking in: has anything changed?" kind="Staying in touch" />
        </ul>
      </StackSection>
    </StackGroup>
  </PanelRoot>
);

// ─── Notes ──────────────────────────────────────────────────────────────────

/* note-editor.tsx editorStyles, verbatim (the placeholder rule left out: the
   note isn't empty), then the one rule of Tiptap's own injected CSS that
   touches how text sets, and the product's globals.css rule that keeps
   headings in the sans (the marketing site's base styles use Merriweather) */
const NOTE_EDITOR_STYLES = `
.tiptap-note-content { outline: none; min-height: 84px; }
.tiptap-note-content p { margin: 0 0 0.6em 0; }
.tiptap-note-content p:last-child { margin-bottom: 0; }
.tiptap-note-content h1 { font-size: 20px; font-weight: 600; margin: 0.5em 0 0.4em; color: #1F2933; }
.tiptap-note-content h2 { font-size: 17px; font-weight: 600; margin: 0.5em 0 0.4em; color: #1F2933; }
.tiptap-note-content h3 { font-size: 15px; font-weight: 600; margin: 0.45em 0 0.35em; color: #1F2933; }
.tiptap-note-content ul { list-style: disc; padding-left: 1.5em; margin: 0 0 0.6em 0; }
.tiptap-note-content ol { list-style: decimal; padding-left: 1.5em; margin: 0 0 0.6em 0; }
.tiptap-note-content ul li, .tiptap-note-content ol li { margin: 0.15em 0; }
.tiptap-note-content { word-wrap: break-word; white-space: pre-wrap; white-space: break-spaces; font-variant-ligatures: none; font-feature-settings: "liga" 0; }
.tiptap-note-content h1, .tiptap-note-content h2, .tiptap-note-content h3 { font-family: inherit; }
`;

/* note-editor.tsx ToolbarButton, not active */
const ToolbarButton = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-7 w-8 items-center justify-center rounded text-[#6B7280]">{children}</span>
);
const ToolbarDivider = () => <span className="mx-0.5 h-5 w-px bg-[#E5E7EB]" />;

/* notes-tab.tsx → notepad.tsx: ONE notepad per client, in a float-stack of
   two pieces (the editor, then its footer), with no gap between them. The
   editor is note-editor.tsx: the note, then the bottom toolbar. Saved, so
   "All changes saved" and the Save button is dimmed. The caret sits in the
   first paragraph, so the size menu reads Normal and no button is lit. */
export const NotesPanel = () => (
  <PanelRoot>
    <style>{NOTE_EDITOR_STYLES}</style>
    <div className="rounded-2xl" style={{ boxShadow: FLOAT_STACK_SHADOW }}>
      <div className="overflow-hidden rounded-t-2xl bg-white px-6 pb-4 pt-5" style={{ boxShadow: FLOAT_SEAM_SHADOW }}>
        <div className="flex flex-col overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
          <div className="min-h-[320px] flex-1 cursor-text overflow-hidden px-3 py-3 text-[14px] leading-relaxed text-[#1F2933]" style={{ maxHeight: 513 }}>
            <div className="tiptap-note-content">
              <p>
                <strong>Plan signed.</strong> Joint revocable living trust with Maria, funded with the Lake George house by a trust
                transfer deed. Daniel&apos;s own documents: a simple will, a durable general power of attorney and a medical proxy.
              </p>
              <p>Maria is executor and health care agent. Emma is backup executor and first successor trustee; Leo is second.</p>
              <h3>Next</h3>
              <ul>
                <li>
                  <p>New chalet at 8 Stowe Hollow Road, Stowe, VT. Not in the trust yet: draft a deed into the trust.</p>
                </li>
                <li>
                  <p>Emma is meeting us about her role as backup executor.</p>
                </li>
                <li>
                  <p>Call Daniel and Maria once the chalet deed is drafted.</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-0.5 border-t border-[#E5E7EB] bg-[#FAFBFC] px-2 py-1.5">
            <ToolbarButton><PIcon name="bold" className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton><PIcon name="italic" className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton><PIcon name="underline" className="h-4 w-4" /></ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton><PIcon name="list" className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton><PIcon name="listNumbered" className="h-4 w-4" /></ToolbarButton>
            <ToolbarDivider />
            <select
              defaultValue="Normal"
              tabIndex={-1}
              title="Text size"
              className="pointer-events-none h-7 rounded border border-[#E5E7EB] bg-white px-1.5 text-[12px] text-[#6B7280] outline-none"
            >
              <option value="Normal">Normal</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Heading">Heading</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between overflow-hidden rounded-b-2xl border-t border-[#F3F4F6] bg-white px-6 py-3" style={{ boxShadow: FLOAT_SEAM_SHADOW }}>
        <p className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
          <PIcon name="check" className="h-3 w-3" />
          All changes saved
        </p>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#309E96] px-4 text-[12.5px] font-medium text-white opacity-50">Save</span>
      </div>
    </div>
  </PanelRoot>
);

// ─── Estate Plan > Summary ──────────────────────────────────────────────────

/* working-mark.tsx WillowMark: the Willow mark, still (size 9) */
const WillowMark = () => (
  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#309E96]" aria-hidden>
    <span className="text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 18, lineHeight: 1, marginTop: 2 }}>
      W
    </span>
  </div>
);

/* estate-plans-tab.tsx, Summary sub-tab open, the summary written and waiting
   on Rachel (SummaryStatus, not generating, invite sent, never approved
   before): a status and a door to the approval page, never the summary itself.
   In the product the panel's header also wears the "Summary awaiting
   approval" pill and the Estate Plan tab a clay dot at this moment; those
   belong to AttorneyClientsScreen (see ProSummaryAwaitingPill, ProTabDot). */
export const EstatePlanSummaryPanel = () => (
  <PanelRoot>
    <ProSubTabs tabs={["Documents", "Summary"]} active="Summary" />
    <div>
      <div className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 transition-colors hover:border-[#D1D5DB]">
        <span className="flex min-w-0 items-center gap-4">
          <WillowMark />
          <span className="min-w-0">
            <span className="block text-[14px] font-semibold leading-tight text-[#1F2933]">Daniel&apos;s summary is ready for your approval</span>
            <span className="mt-0.5 block text-[12.5px] leading-snug text-[#6B7280]">Review and approve it before Daniel can see it.</span>
          </span>
        </span>
        <span className="inline-flex h-9 flex-shrink-0 items-center gap-1.5 rounded-full bg-[#309E96] px-4 text-[13px] font-medium text-white transition-colors group-hover:bg-[#0F7673]">
          Review and approve
          <WIcon name="chevronRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  </PanelRoot>
);

/* estate-plans-tab.tsx SummaryStatus once the plan is approved by this firm:
   the check, "Daniel can see this summary", and a way back in to edit */
export const EstatePlanSummaryApprovedPanel = () => (
  <PanelRoot>
    <ProSubTabs tabs={["Documents", "Summary"]} active="Summary" />
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4">
      <span className="flex min-w-0 items-center gap-3">
        <PIcon name="check" className="h-5 w-5 flex-shrink-0 text-[#128F8B]" />
        <span className="min-w-0">
          <span className="block text-[14px] font-semibold leading-tight text-[#1F2933]">Daniel can see this summary</span>
          <span className="block text-[12.5px] leading-tight text-[#6B7280]">Approved. Open it to read it as Daniel does, or to edit and re-approve.</span>
        </span>
      </span>
      <span className="inline-flex h-9 flex-shrink-0 items-center rounded-full border border-[#309E96] px-4 text-[13px] font-medium text-[#309E96] transition-colors hover:bg-[#309E96] hover:text-white">
        Open the summary
      </span>
    </div>
  </PanelRoot>
);

/* summary-status-pill.tsx SummaryStatusPill "awaiting": in the panel header,
   left of the ⋯, while a summary waits on the attorney (client-detail-view.tsx).
   AttorneyClientsScreen does not draw it today; exported for whoever wires it. */
export const ProSummaryAwaitingPill = () => (
  <span className="inline-flex h-7 flex-shrink-0 items-center whitespace-nowrap rounded-full bg-[#FBF1E8] px-3 text-[12.5px] font-medium text-[#A9602C]">
    Summary awaiting approval
  </span>
);

/* client-detail-view.tsx: the clay dot after "Estate Plan" (a summary to
   approve) or "Team" (an access request) in the panel's tab bar; the tab
   button is `flex items-center gap-2`. Not drawn by AttorneyClientsScreen. */
export const ProTabDot = () => <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C8782F]" />;
