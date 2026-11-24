import React from "react";
import { WRAP } from "@/components/site/blocks";
import { LightHead } from "@/components/site/StayingAhead";
import { FloatStack, ProBellIcon, WIcon } from "@/components/product/kit";
import { ProClientRowView, ProCoupleView } from "@/components/product/attorney-clients";
import { ProColumn, ProReminder } from "@/components/product/attorney-dashboard";
import {
  GoogleCalendarLogo,
  GoogleContactsLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";

/* Will it fit my practice? The film above shows what Willow does; these tiles
   answer the attorney's next question, with the quiet tiles and small pieces of
   product of harvey.ai's product grid: your clients in one space (the real
   Clients list), your style, your apps, and you at the center (the real
   Required actions column). Summaries and access always wait for the attorney;
   a check-in waits only when its card has "Ask me before each one goes out"
   on, so the copy says "can". */

const UI_SHADOW = "0 1px 2px rgba(16,24,40,0.05), 0 10px 24px -8px rgba(16,24,40,0.14)";
const PRODUCT_FONT = "Figtree, Inter, sans-serif";
const FADE_OUT = "linear-gradient(to bottom, #000 74%, transparent 100%)";
const TILE = "flex flex-col overflow-hidden rounded-xl bg-[#EEF2F1]";

const TileTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[20px] font-medium leading-snug text-[#222222]" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
    {children}
  </h3>
);

const TileBody = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-gray-600">{children}</p>
);

/* A piece of the product running off the bottom of its tile */
const Bleed = ({ height, className = "", children }: { height: number; className?: string; children: React.ReactNode }) => (
  <div aria-hidden className={`overflow-hidden px-1 pt-1 ${className}`} style={{ height, WebkitMaskImage: FADE_OUT, maskImage: FADE_OUT, fontFamily: PRODUCT_FONT }}>
    {children}
  </div>
);

const ClientRows = ({ pills }: { pills: boolean }) => (
  <FloatStack>
    <ProCoupleView a={{ name: "Daniel Rosen", email: "daniel.rosen@gmail.com" }} b={{ name: "Maria Rosen", email: "maria.rosen@gmail.com" }} />
    <ProClientRowView c={{ name: "Elena Ruiz", email: "elena.ruiz@gmail.com", pill: pills ? "Summary awaiting approval" : undefined }} />
    <ProClientRowView c={{ name: "Marcus Webb", email: "marcus.webb@outlook.com" }} />
    <ProClientRowView c={{ name: "Jordan Lee", email: "jordan.lee@gmail.com", pill: pills ? "Pending invite" : undefined }} />
    <ProClientRowView c={{ name: "Priya Anand", email: "priya.anand@outlook.com" }} />
  </FloatStack>
);

/* clients-list: the search, Add client, and the list */
const ClientList = () => (
  <div className="mx-auto w-full max-w-[500px] text-left">
    <div className="mb-3 flex h-10 items-center gap-2.5">
      <div className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-[#E5E7EB] bg-white px-3.5 text-[14px] text-[#8E8E93]">
        <WIcon name="search" className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">Search clients</span>
      </div>
      <span className="inline-flex h-10 flex-shrink-0 items-center gap-1.5 rounded-[10px] bg-[#309E96] px-4 text-[14px] font-medium text-white">
        Add client
        <WIcon name="chevronDown" className="h-4 w-4" />
      </span>
    </div>
    <div className="hidden sm:block"><ClientRows pills /></div>
    <div className="sm:hidden"><ClientRows pills={false} /></div>
  </div>
);

const RequiredActions = () => (
  <div className="w-full text-left">
    <ProColumn icon={<ProBellIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />} title="Required actions" count={3} rounding="rounded-t-2xl">
      <ProReminder title="Daniel's summary is ready for review" cta="Review summary" />
      <ProReminder title="Checking in: has anything changed?" sub="To Daniel and Maria · due today" cta="Send or skip" />
      <ProReminder title="Elena says something changed" sub="Has your family dynamic changed?" cta="See what changed" />
    </ProColumn>
  </div>
);

const InYourWords = () => (
  <div aria-hidden className="w-full overflow-hidden rounded-lg bg-white text-left" style={{ boxShadow: UI_SHADOW, fontFamily: PRODUCT_FONT }}>
    <div className="h-1 bg-[#309E96]" />
    <div className="px-3.5 py-3">
      <p className="font-heading text-[12.5px] font-bold text-[#1F2933]">Alvarez Family Law</p>
      <p className="mt-2 text-[12.5px] font-semibold leading-snug text-[#1F2933]">Checking in: has anything changed?</p>
      <p className="mt-1 text-[12px] leading-snug text-[#6B7280]">Hi Daniel, I wanted to check in.</p>
      <p className="mt-2 border-t border-[#F0F1F3] pt-2 text-[11.5px] font-medium text-[#309E96]">Every July 14</p>
    </div>
  </div>
);

type Logo = (p: { className?: string }) => React.ReactElement;
const CONNECTORS: { name: string; Logo: Logo }[] = [
  { name: "Google Calendar", Logo: GoogleCalendarLogo },
  { name: "Outlook", Logo: OutlookLogo },
  { name: "Google contacts", Logo: GoogleContactsLogo },
  { name: "Google Meet", Logo: GoogleMeetLogo },
  { name: "Zoom", Logo: ZoomLogo },
  { name: "Microsoft Teams", Logo: MicrosoftTeamsLogo },
];

const WhatYouDeliver = () => (
  <section className="bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <LightHead title="Built with attorneys," accent="for attorneys." />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-12">
        <article className={`${TILE} px-7 pt-7 sm:col-span-2 lg:col-span-6 lg:row-span-2`}>
          <TileTitle>Manage your clients from one space</TileTitle>
          <TileBody>Every client, their documents, their team and your notes, all in one place.</TileBody>
          <div className="mt-auto pt-8">
            <Bleed height={470}>
              <ClientList />
            </Bleed>
          </div>
        </article>

        <article className={`${TILE} p-7 lg:col-span-3 lg:min-h-[330px]`}>
          <TileTitle>Works in your style</TileTitle>
          <TileBody>Your words, logo and timing. Set them once.</TileBody>
          <div className="mt-auto pt-6">
            <InYourWords />
          </div>
        </article>

        <article id="integrations" className={`${TILE} scroll-mt-24 p-7 lg:col-span-3 lg:min-h-[330px]`}>
          <TileTitle>Connector library</TileTitle>
          <TileBody>Your calendar, video and contacts, connected once.</TileBody>
          <ul className="mt-auto grid grid-cols-3 gap-2 pt-6">
            {CONNECTORS.map(({ name, Logo }) => (
              <li key={name} title={name} className="flex aspect-square items-center justify-center rounded-lg bg-white" style={{ boxShadow: UI_SHADOW }}>
                <Logo className="h-6 w-6" />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${TILE} gap-6 px-7 pt-7 sm:col-span-2 sm:flex-row lg:col-span-6 lg:min-h-[320px]`}>
          <div className="sm:w-[42%] sm:flex-shrink-0 sm:pb-8">
            <TileTitle>You stay at the center</TileTitle>
            <TileBody>You approve every summary and access request, and you can review any check-in before it goes out.</TileBody>
          </div>
          <div className="min-w-0 flex-1 self-end">
            <Bleed height={270}>
              <RequiredActions />
            </Bleed>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default WhatYouDeliver;
