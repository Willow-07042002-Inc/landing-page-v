import React from "react";
import { MaskIcon, PRO_CARD_SHADOW, ProBellIcon, ProSidebar, ProTopBar, ProInitials, WIcon } from "./kit";

// ---- Attorney dashboard, recreated from apps/professionals as it is today
// (origin/main = preview, Nov 17): components/dashboard/dashboard-content.tsx,
// dashboard-column.tsx, leads-column.tsx, active-clients-column.tsx,
// reminders-column.tsx, reminders-bell.tsx, top-bar.tsx and sidebar.tsx ----

/* dashboard-column.tsx DashboardColumn: icon, title, count, a plain text
   action (no icon), rows on hairlines, and an optional footer link */
export const ProColumn = ({
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

/* active-clients-column.tsx ClientLine: a single client says "Individual"; half
   of a couple says who they're with, indented beside the couple's tie */
export const ProActiveClient = ({ name, sub, indent = false }: { name: string; sub: string; indent?: boolean }) => (
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

export const ProActiveCouple = ({ a, b }: { a: string; b: string }) => (
  <div className="relative bg-white">
    <span aria-hidden className="pointer-events-none absolute bottom-7 left-5 top-7 w-1 rounded-full bg-[#D1D5DB]" />
    <ProActiveClient name={a} sub={`Couple · with ${b.split(" ")[0]}`} indent />
    <div className="ml-10 mr-5 h-px bg-[#F0F1F3]" />
    <ProActiveClient name={b} sub={`Couple · with ${a.split(" ")[0]}`} indent />
  </div>
);

/* reminders-column.tsx: a grey rail (teal on hover), the reminder, the action */
export const ProReminder = ({ title, sub, cta }: { title: string; sub?: string; cta: string }) => (
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

export const AttorneyDashboardScreen = () => (
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
