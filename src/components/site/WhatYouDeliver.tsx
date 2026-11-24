import React from "react";
import { WRAP } from "@/components/site/blocks";
import { LightHead } from "@/components/site/StayingAhead";
import { FloatStack, WIcon } from "@/components/product/kit";
import { ProClientRowView, ProCoupleView, ProDocSectionLabel } from "@/components/product/attorney-clients";
import {
  GoogleCalendarLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";

/* Will it fit my practice? The film above shows what Willow does; these tiles
   answer the attorney's next question, each with a small piece of the real
   product: bring the clients you already have (the Clients list; importing
   contacts is being built, Nov 24, and Aaron cleared claiming it), keep
   drafting and signing your way (the signed PDFs on a client's plan), the
   apps it connects to, and you at the center (a check-in in the firm's name
   and the attorney's words, with the email's real Book a meeting button). */

const UI_SHADOW = "0 1px 2px rgba(16,24,40,0.05), 0 10px 24px -8px rgba(16,24,40,0.14)";
const PRODUCT_FONT = "Figtree, Inter, sans-serif";
const fadeOut = (from = 74) => `linear-gradient(to bottom, #000 ${from}%, transparent 100%)`;
const TILE = "flex flex-col overflow-hidden rounded-xl bg-[#EEF2F1]";

const TileTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[20px] font-medium leading-snug text-[#222222]" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
    {children}
  </h3>
);

const TileBody = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-gray-600">{children}</p>
);

/* A piece of the product running off the bottom of its tile. `fadeFrom`: where
   the fade starts, in percent of the height */
const Bleed = ({ height, fadeFrom, children }: { height: number; fadeFrom?: number; children: React.ReactNode }) => (
  <div aria-hidden className="overflow-hidden px-1 pt-1" style={{ height, WebkitMaskImage: fadeOut(fadeFrom), maskImage: fadeOut(fadeFrom), fontFamily: PRODUCT_FONT }}>
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
    <ProClientRowView c={{ name: "Grace Liu", email: "grace.liu@yahoo.com" }} />
  </FloatStack>
);

const ClientList = () => (
  <div className="mx-auto w-full max-w-[500px] text-left">
    <div className="hidden sm:block"><ClientRows pills /></div>
    <div className="sm:hidden"><ClientRows pills={false} /></div>
  </div>
);

/* A client's signed plan as the Estate Plan tab lists it (estate-plans-tab.tsx
   DocumentRow), with rows tightened for a small tile */
const DocLine = ({ label, detail }: { label: string; detail?: string }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <WIcon name="document" className="h-5 w-5 flex-shrink-0 text-[#309E96]" />
    <div className="min-w-0 flex-1">
      <p className="truncate text-[14px] font-semibold text-[#1F2933]">{label}</p>
      {detail && <p className="mt-0.5 truncate text-[12px] text-[#9CA3AF]">{detail}</p>}
    </div>
    <WIcon name="more" className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
  </div>
);

const SignedPlan = () => (
  <div className="w-full text-left">
    <ProDocSectionLabel label="Daniel's documents" action="Choose PDFs" />
    <FloatStack>
      <DocLine label="Last Will & Testament" />
      <DocLine label="Revocable Living Trust" detail="Joint trust (married couple)" />
      <DocLine label="Power of Attorney" />
    </FloatStack>
  </div>
);

/* A check-in as the client gets it, in the firm's name and the attorney's words */
const InYourWords = () => (
  <div className="w-full overflow-hidden rounded-t-2xl bg-white text-left" style={{ boxShadow: UI_SHADOW }}>
    <div className="h-1 bg-[#309E96]" />
    <div className="px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-heading text-[14px] font-bold text-[#1F2933]">Alvarez Family Law</p>
        <p className="flex-shrink-0 text-[12px] font-medium text-[#309E96]">Every July 14</p>
      </div>
      <p className="mt-3 text-[14px] font-semibold leading-snug text-[#1F2933]">Checking in: has anything changed?</p>
      <div className="mt-2 space-y-2 text-[13px] leading-[1.55] text-[#4B5563]">
        <p>Hi Daniel,</p>
        <p>It&rsquo;s been a while since we finished your estate plan. If anything has changed, let&rsquo;s talk.</p>
      </div>
      <span className="mt-3 inline-flex rounded-lg bg-[#309E96] px-4 py-2 text-[13px] font-semibold text-white">Book a meeting</span>
      <p className="mt-3 text-[14px] font-medium text-[#1F2933]">Rachel</p>
    </div>
  </div>
);

const GmailLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="52 42 88 66" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
    <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
    <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
    <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
    <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
  </svg>
);

type Logo = (p: { className?: string }) => React.ReactElement;
const CONNECTORS: { name: string; Logo: Logo }[] = [
  { name: "Google Calendar", Logo: GoogleCalendarLogo },
  { name: "Outlook", Logo: OutlookLogo },
  { name: "Gmail", Logo: GmailLogo },
  { name: "Google Meet", Logo: GoogleMeetLogo },
  { name: "Zoom", Logo: ZoomLogo },
  { name: "Microsoft Teams", Logo: MicrosoftTeamsLogo },
];

const WhatYouDeliver = () => (
  <section className="bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <LightHead title="Built to work with" accent="the practice you already run." />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-12 lg:grid-rows-[252px_252px]">
        <article className={`${TILE} px-6 pt-6 sm:col-span-2 lg:col-span-6 lg:row-span-2`}>
          <TileTitle>Bring the clients you already have</TileTitle>
          <TileBody>Import your contacts, add the plans you&rsquo;ve already signed, and see every client in one list.</TileBody>
          <div className="mt-auto pt-5">
            <Bleed height={385}>
              <ClientList />
            </Bleed>
          </div>
        </article>

        <article className={`${TILE} px-6 pt-6 lg:col-span-3`}>
          <TileTitle>Draft and sign your way</TileTitle>
          <TileBody>Keep your process. Willow starts from the signed PDF.</TileBody>
          <div className="mt-auto pt-4">
            <Bleed height={124}>
              <SignedPlan />
            </Bleed>
          </div>
        </article>

        <article id="integrations" className={`${TILE} scroll-mt-24 p-6 lg:col-span-3`}>
          <TileTitle>Connect</TileTitle>
          <TileBody>Your calendar, video and contacts, connected once.</TileBody>
          <ul className="mt-auto grid grid-cols-3 gap-1.5 pt-4">
            {CONNECTORS.map(({ name, Logo }) => (
              <li key={name} title={name} className="flex h-10 items-center justify-center rounded-md bg-white">
                <Logo className="h-5 w-5 object-contain" />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${TILE} gap-6 px-6 pt-6 sm:col-span-2 sm:flex-row lg:col-span-6`}>
          <div className="sm:w-[38%] sm:flex-shrink-0 sm:pb-6">
            <TileTitle>You stay at the center</TileTitle>
            <TileBody>Every check-in goes out in your words, under your firm&rsquo;s name, and clients book time with you.</TileBody>
          </div>
          <div className="min-w-0 flex-1 self-end">
            <Bleed height={228} fadeFrom={88}>
              <InYourWords />
            </Bleed>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default WhatYouDeliver;
