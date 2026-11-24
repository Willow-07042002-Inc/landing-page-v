import React from "react";
import { WRAP } from "@/components/site/blocks";
import { LightHead } from "@/components/site/StayingAhead";
import { WIcon } from "@/components/product/kit";
import {
  GoogleCalendarLogo,
  GoogleContactsLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";
import { CheckIcon, NotificationIcon, PoaIcon, TrustIcon, WillIcon } from "@/components/product/willow-icons";

/* What the practice ends up with: quiet tiles, each with a small piece of the
   product on it. Rows of 7 + 5, then three, then the connector library across
   the full width. Names, settings and buttons come from the product. */

const UI_SHADOW = "0 1px 2px rgba(16,24,40,0.05), 0 10px 24px -8px rgba(16,24,40,0.14)";

const Tile = ({
  id,
  title,
  body,
  className = "",
  children,
}: {
  id?: string;
  title: string;
  body: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <article id={id} className={`flex scroll-mt-24 flex-col overflow-hidden rounded-xl bg-[#EEF2F1] p-7 md:p-8 ${className}`}>
    <h3 className="font-heading text-[20px] font-normal leading-snug text-[#222222]">{title}</h3>
    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-gray-600">{body}</p>
    <div aria-hidden className="mt-8 flex flex-1 items-end justify-center">{children}</div>
  </article>
);

const Panel = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`w-full rounded-lg bg-white ${className}`} style={{ boxShadow: UI_SHADOW, fontFamily: "Figtree, Inter, sans-serif" }}>
    {children}
  </div>
);

const Initials = ({ children }: { children: string }) => (
  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F9F9] text-[11px] font-semibold text-[#309E96]">{children}</span>
);

const TheirPeople = () => (
  <div className="w-full max-w-[470px]">
    <Panel className="px-4 py-2">
      {[
        ["MR", "Maria Rosen", "Executor"],
        ["ER", "Emma Rosen", "Backup executor"],
        ["LR", "Leo Rosen", "Backup trustee"],
      ].map(([initials, name, role]) => (
        <div key={name} className="flex items-center gap-3 border-b border-[#F0F1F3] py-2.5 last:border-0">
          <Initials>{initials}</Initials>
          <span className="flex-1 text-[14px] font-medium text-[#1F2933]">{name}</span>
          <span className="text-[12.5px] text-[#6B7280]">{role}</span>
        </div>
      ))}
    </Panel>
    <Panel className="relative z-10 -mt-3 ml-auto flex w-[86%] items-center gap-3 px-4 py-3">
      <NotificationIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-[#1F2933]">Emma Rosen booked a call</span>
        <span className="block text-[12.5px] text-[#6B7280]">A plan of their own · Thursday, Feb 11</span>
      </span>
    </Panel>
  </div>
);

const ThePlan = () => (
  <Panel className="max-w-[340px] px-4 py-3.5">
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] font-semibold text-[#1F2933]">Your estate plan</span>
      <span className="flex items-center gap-1 text-[12px] font-medium text-[#309E96]">
        <CheckIcon className="h-3.5 w-3.5" />
        Approved by Rachel
      </span>
    </div>
    <div className="mt-2">
      {[
        { Icon: WillIcon, name: "Last Will & Testament" },
        { Icon: TrustIcon, name: "Revocable Living Trust" },
        { Icon: PoaIcon, name: "Power of Attorney" },
      ].map(({ Icon, name }) => (
        <div key={name} className="flex items-center gap-3 border-t border-[#F0F1F3] py-2.5">
          <Icon className="h-[18px] w-[18px] flex-shrink-0 text-[#309E96]" />
          <span className="text-[13.5px] font-medium text-[#1F2933]">{name}</span>
        </div>
      ))}
    </div>
  </Panel>
);

const Choice = ({ quiet, go }: { quiet: string; go: string }) => (
  <div className="mt-3 flex items-center justify-end gap-2">
    <span className="rounded-md px-3 py-1.5 text-[13px] font-medium text-[#6B7280]">{quiet}</span>
    <span className="rounded-md bg-[#309E96] px-3.5 py-1.5 text-[13px] font-semibold text-white">{go}</span>
  </div>
);

const TheCheckIn = () => (
  <Panel className="max-w-[300px] px-4 py-3.5">
    <p className="text-[12.5px] text-[#6B7280]">Yearly check-in · Daniel Rosen</p>
    <p className="mt-1 text-[14px] font-semibold leading-snug text-[#1F2933]">Has anything changed since your plan was last signed?</p>
    <Choice quiet="Skip" go="Send" />
  </Panel>
);

const TheRequest = () => (
  <Panel className="max-w-[300px] px-4 py-3.5">
    <p className="text-[14px] font-semibold leading-snug text-[#1F2933]">Maria Rosen asked for access</p>
    <p className="mt-1 text-[12.5px] text-[#6B7280]">Death certificate attached</p>
    <Choice quiet="Deny" go="Grant access" />
  </Panel>
);

const YourSettings = () => (
  <Panel className="max-w-[300px] px-4 py-1.5">
    {["Staying in touch", "Meeting types", "Availability", "Branding"].map((s) => (
      <div key={s} className="flex items-center justify-between border-b border-[#F0F1F3] py-2.5 last:border-0">
        <span className="text-[13.5px] font-medium text-[#1F2933]">{s}</span>
        <WIcon name="chevronRight" className="h-3.5 w-3.5 text-[#9CA3AF]" />
      </div>
    ))}
  </Panel>
);

const CONNECTORS: { name: string; Logo: (p: { className?: string }) => React.ReactElement }[] = [
  { name: "Google Calendar", Logo: GoogleCalendarLogo },
  { name: "Outlook", Logo: OutlookLogo },
  { name: "Google Meet", Logo: GoogleMeetLogo },
  { name: "Zoom", Logo: ZoomLogo },
  { name: "Microsoft Teams", Logo: MicrosoftTeamsLogo },
  { name: "Google contacts", Logo: GoogleContactsLogo },
];

const WhatYouDeliver = () => (
  <section className="bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <LightHead eyebrow="What you deliver" title="A practice families" accent="keep coming back to." />

      <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-12">
        <Tile
          className="md:col-span-7 md:min-h-[450px]"
          title="Turn executors and family into clients of their own"
          body="They already know you from the plan, and Willow makes it easy to come back. When they need a plan of their own or it's time to administer the estate, you're the obvious choice."
        >
          <TheirPeople />
        </Tile>
        <Tile
          className="md:col-span-5 md:min-h-[450px]"
          title="A plan clients understand"
          body="One private place for their plan, with every document explained in plain English."
        >
          <ThePlan />
        </Tile>

        <Tile className="md:col-span-4 md:min-h-[370px]" title="Check-ins on your terms" body="Yearly check-ins are ready to go. You decide what gets sent.">
          <TheCheckIn />
        </Tile>
        <Tile className="md:col-span-4 md:min-h-[370px]" title="Access only when you say" body="Nothing a client held back opens until you approve it.">
          <TheRequest />
        </Tile>
        <Tile className="md:col-span-4 md:min-h-[370px]" title="Built on your preferences" body="Set your emails, timing, meetings and branding once. Willow follows them for every client.">
          <YourSettings />
        </Tile>

        <article id="integrations" className="flex scroll-mt-24 flex-col gap-7 rounded-xl bg-[#EEF2F1] p-7 md:col-span-12 md:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-sm">
            <h3 className="font-heading text-[20px] font-normal leading-snug text-[#222222]">Connector library</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-600">Connect the calendar, video and contacts you already use, once.</p>
          </div>
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {CONNECTORS.map(({ name, Logo }) => (
              <li key={name} title={name} className="flex h-16 w-full items-center justify-center rounded-lg bg-white sm:w-[76px]" style={{ boxShadow: UI_SHADOW }}>
                <Logo className="h-7 w-7" />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  </section>
);

export default WhatYouDeliver;
