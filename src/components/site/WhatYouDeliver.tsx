import React from "react";
import { WRAP } from "@/components/site/blocks";
import { LightHead } from "@/components/site/StayingAhead";
import { FloatStack, ProBellIcon } from "@/components/product/kit";
import { ProClientRowView, ProCoupleView } from "@/components/product/attorney-clients";
import { ProColumn, ProReminder } from "@/components/product/attorney-dashboard";
import {
  GoogleCalendarLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";

/* Will it fit my practice? The film above shows what Willow does; these tiles
   answer the attorney's next question, with the quiet tiles and small pieces of
   product of harvey.ai's product grid: every client in one space (the real
   Clients list), the apps it connects to, what needs them (the real Required
   actions column), and a check-in in the firm's own words and style. */

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
const Bleed = ({ height, children }: { height: number; children: React.ReactNode }) => (
  <div aria-hidden className="overflow-hidden px-1 pt-1" style={{ height, WebkitMaskImage: FADE_OUT, maskImage: FADE_OUT, fontFamily: PRODUCT_FONT }}>
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

const RequiredActions = () => (
  <div className="w-full text-left">
    <ProColumn icon={<ProBellIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />} title="Required actions" count={3} rounding="rounded-t-2xl">
      <ProReminder title="Daniel's summary is ready" cta="Review summary" />
      <ProReminder title="Elena says something changed" cta="See what changed" />
    </ProColumn>
  </div>
);

/* A check-in as the client gets it, in the firm's name and the attorney's words */
const InYourWords = () => (
  <div className="w-full overflow-hidden rounded-t-2xl bg-white text-left" style={{ boxShadow: UI_SHADOW }}>
    <div className="h-1 bg-[#309E96]" />
    <div className="px-6 py-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-heading text-[15px] font-bold text-[#1F2933]">Alvarez Family Law</p>
        <p className="flex-shrink-0 text-[12.5px] font-medium text-[#309E96]">Every July 14</p>
      </div>
      <p className="mt-4 text-[15px] font-semibold leading-snug text-[#1F2933]">Checking in: has anything changed?</p>
      <div className="mt-3 space-y-2.5 text-[14px] leading-[1.6] text-[#4B5563]">
        <p>Hi Daniel,</p>
        <p>It&rsquo;s been a while since we finished your estate plan, and I wanted to check in.</p>
        <p>Once a year I ask every client the same short questions. It&rsquo;s how we make sure your plan still says what you want it to.</p>
      </div>
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
      <LightHead title="Built with attorneys," accent="for attorneys." />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-12">
        <article className={`${TILE} px-7 pt-7 sm:col-span-2 lg:col-span-6 lg:row-span-2`}>
          <TileTitle>Manage your clients from one space</TileTitle>
          <TileBody>Every client, their documents, their team and your notes, all in one place.</TileBody>
          <div className="mt-auto pt-8">
            <Bleed height={520}>
              <ClientList />
            </Bleed>
          </div>
        </article>

        <article id="integrations" className={`${TILE} scroll-mt-24 p-7 lg:col-span-3 lg:min-h-[340px]`}>
          <TileTitle>Connect</TileTitle>
          <ul className="mt-auto grid grid-cols-3 gap-1.5 pt-6">
            {CONNECTORS.map(({ name, Logo }) => (
              <li key={name} title={name} className="flex h-11 items-center justify-center rounded-md bg-white">
                <Logo className="h-5 w-5 object-contain" />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${TILE} px-7 pt-7 lg:col-span-3 lg:min-h-[340px]`}>
          <TileTitle>Prioritize what matters</TileTitle>
          <TileBody>We&rsquo;ll let you know what matters, so you stay on top of everything.</TileBody>
          <div className="mt-auto pt-5">
            <Bleed height={150}>
              <RequiredActions />
            </Bleed>
          </div>
        </article>

        <article className={`${TILE} gap-6 px-7 pt-7 sm:col-span-2 sm:flex-row lg:col-span-6 lg:min-h-[340px]`}>
          <div className="sm:w-[38%] sm:flex-shrink-0 sm:pb-7">
            <TileTitle>Works in your style</TileTitle>
            <TileBody>Your words, your logo and your timing. Set them once, and Willow follows them for every client.</TileBody>
          </div>
          <div className="min-w-0 flex-1 self-end">
            <Bleed height={300}>
              <InYourWords />
            </Bleed>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default WhatYouDeliver;
