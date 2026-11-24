import React from "react";
import {
  PageShell,
  PageHero,
  FeatureRow,
  SectionHead,
  ValuePoints,
  SecurityBand,
  ClosingCta,
  WRAP,
  usePageMeta,
  type FeatureRowData,
} from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";
import { AttorneyClientsScreen } from "@/components/product/attorney-clients";
import { TeamPanel } from "@/components/product/attorney-client-panel";
import CheckInStory from "@/components/site/CheckInStory";
import PlanDropStory from "@/components/site/PlanDropStory";
import { SummaryReviewScreenCropped, SUMMARY_REVIEW_CROP_HEIGHT } from "@/components/product/attorney-review";
import {
  BookingPageScreen,
  GoogleCalendarLogo,
  GoogleContactsLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";
import { DashboardWithReleaseRequest, DashboardWithSendOrSkip } from "@/components/product/composites";

/* For attorneys: the one page for the attorney side, set out the way
   harvey.ai sets out its platform overview (a hero, the product one screen and
   one sentence at a time, the tools it works with, security, the demo). The
   story follows one example family, Daniel and Maria Rosen, who are the family
   in every product screen. Each step has an anchor, so the deeper pages parked
   in src/content/pages.tsx land on their part of this page. */

const screen = (el: React.ReactNode, w = 1440, h = 855) => (
  <ScaledScreen w={w} h={h}>
    {el}
  </ScaledScreen>
);

const STORY: (FeatureRowData & { id: string })[] = [
  {
    id: "booking",
    eyebrow: "1 · Booking page",
    title: "Daniel and Maria book a consultation.",
    body: "They answer a few questions on your booking page and pick a time. It lands on your calendar with the meeting link, and they arrive on your dashboard as a new lead.",
    visual: screen(<BookingPageScreen email="daniel.rosen@gmail.com" />, 1440, 900),
    print: "/williamsburg.jpg",
    aspect: "1440 / 900",
  },
  {
    id: "dashboard",
    eyebrow: "2 · Dashboard & clients",
    title: "Everything about them, in one record.",
    body: "Turn the lead into a client. Spouses are linked as a joint account, with their documents, the people they named, your notes and your emails together.",
    visual: screen(<AttorneyClientsScreen open />),
    print: "/central-park.jpg",
    aspect: "1440 / 855",
  },
  {
    id: "plan-summaries",
    eyebrow: "3 · Plan summaries",
    title: "Willow drafts it. You approve every word.",
    body: "Upload the signed PDFs and Willow drafts a plain-English summary. Review it, edit anything and approve it. Daniel and Maria see nothing until you do.",
    visual: screen(<SummaryReviewScreenCropped />, 1440, SUMMARY_REVIEW_CROP_HEIGHT),
    print: "/florida-coast.jpg",
    aspect: `1440 / ${SUMMARY_REVIEW_CROP_HEIGHT}`,
  },
  {
    id: "check-ins",
    eyebrow: "4 · Check-ins & updates",
    title: "A year later, you're still in touch.",
    body: "Willow prepares a yearly check-in asking what's changed: a move, a new grandchild, a sale of the house. Each email waits for you to send or skip, and any change lands in your required actions.",
    visual: screen(<DashboardWithSendOrSkip />),
    print: "/santa-monica.jpg",
    aspect: "1440 / 855",
  },
  {
    id: "when-it-matters",
    eyebrow: "5 · When it matters",
    title: "When the day comes, the family comes to you.",
    body: "Maria lets you know Daniel has passed away and attaches the death certificate. You grant access or deny it, and nothing Daniel held back opens until you do.",
    visual: screen(<DashboardWithReleaseRequest />),
    print: "/hudson-bridge.jpg",
    aspect: "1440 / 855",
  },
  {
    id: "their-people",
    eyebrow: "6 · Their people",
    title: "The people they named already know you.",
    body: "Everyone Daniel named is on his record. The agents and professionals in the plan get their own check-ins and can book time with you, so you're the attorney they turn to next.",
    visual: screen(<AttorneyClientsScreen open tab="Team" panel={<TeamPanel />} />),
    print: "/willow-street.jpg",
    aspect: "1440 / 855",
  },
];

/* The list the product's Integrations tab offers (integration-brands.tsx) */
const TOOLS: { kind: string; note: string; apps: { name: string; Logo: (p: { className?: string }) => React.ReactElement }[] }[] = [
  {
    kind: "Calendar",
    note: "Choose which calendar each meeting books into and which ones count as busy.",
    apps: [
      { name: "Google Calendar", Logo: GoogleCalendarLogo },
      { name: "Outlook Calendar", Logo: OutlookLogo },
    ],
  },
  {
    kind: "Video",
    note: "Each booking gets its meeting link.",
    apps: [
      { name: "Google Meet", Logo: GoogleMeetLogo },
      { name: "Zoom", Logo: ZoomLogo },
      { name: "Microsoft Teams", Logo: MicrosoftTeamsLogo },
    ],
  },
  {
    kind: "Contacts & email",
    note: "Connected read-only. Nothing is ever sent from your account.",
    apps: [
      { name: "Google contacts", Logo: GoogleContactsLogo },
      { name: "Outlook", Logo: OutlookLogo },
    ],
  },
];

/* The honest hinge in the story: Willow doesn't draft or sign */
const YourPart = () => (
  <div className="mx-auto max-w-3xl border-y border-gray-200 py-10 text-center md:py-12">
    <p className="font-heading text-[1.5rem] font-light italic leading-snug text-[#138F8B] md:text-[2rem]" style={{ textWrap: "balance" }}>
      You advise, draft and sign the way you always have.
    </p>
    <p className="mt-3 text-[15px] leading-relaxed text-gray-600 md:text-base">Willow picks up from the signed plan.</p>
  </div>
);

/* Where the attorney's journey starts: the plan they've already signed */
const SignedPlan = () => (
  <section id="signed-plan" className="scroll-mt-24 bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} grid max-w-6xl items-center gap-10 lg:grid-cols-[38.2%_1fr] lg:gap-12 lg:px-10`}>
      <SectionHead
        center={false}
        eyebrow="Start with the signed plan"
        title="Drop in their documents."
        accent="Their account is ready."
        lead="Willow reads every document, files it under the right person and fills in their details. You review it, and you're done."
      />
      <PlanDropStory />
    </div>
  </section>
);

const Integrations = () => (
  <section id="integrations" className="scroll-mt-24 bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} grid max-w-6xl gap-10 lg:grid-cols-[38.2%_1fr] lg:gap-16 lg:px-10`}>
      <SectionHead
        center={false}
        eyebrow="Integrations"
        title="Works with the tools you already use."
        lead="Connect your calendar, video and contacts once in Settings, and Willow works around them."
      />
      <div className="flex flex-col gap-8">
        {TOOLS.map((t) => (
          <div key={t.kind} className="border-t-2 border-[#222222] pt-5">
            <h3 className="font-heading text-xl font-bold text-[#222222]">{t.kind}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">{t.note}</p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {t.apps.map(({ name, Logo }) => (
                <li key={name} className="flex items-center gap-2.5 text-[15px] font-medium text-[#222222]">
                  <Logo className="h-6 w-6 flex-shrink-0" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AttorneysPage = () => {
  usePageMeta(
    "Willow for Estate Planning Attorneys",
    "Follow a client through Willow: a booking page, one record, plain-English summaries you approve, yearly check-ins, and your calendar, video and contacts connected."
  );
  return (
    <PageShell quotes>
      <PageHero
        eyebrow="For attorneys"
        title="Signing shouldn't be the last time"
        accent="you hear from a client."
        subtitle="Willow keeps clients coming back for updates and makes you the obvious choice for their family and executors."
        visualAspect="1128 / 670"
        visual={<CheckInStory />}
      />

      <SignedPlan />

      {/* One family, step by step */}
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className={`${WRAP} max-w-6xl lg:px-10`}>
          <div className="mb-12 md:mb-16">
            <SectionHead
              eyebrow="How it works"
              title="One family,"
              accent="from first call to the next generation."
              lead="Follow an example family, Daniel and Maria, through Willow."
            />
          </div>
          <div className="flex flex-col gap-16 md:gap-24">
            {STORY.map((s, i) => (
              <React.Fragment key={s.id}>
                <div id={s.id} className="scroll-mt-24">
                  <FeatureRow r={s} flip={i % 2 === 1} />
                </div>
                {s.id === "dashboard" && <YourPart />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <ValuePoints
        title="Built around your practice,"
        accent="not the other way around."
        points={[
          { title: "You approve everything", body: "Nothing reaches a client until you've approved their summary, and every check-in waits for you to send or skip." },
          { title: "Keep your own signing", body: "Keep signing exactly as you do today, pen and paper in your conference room, then upload the executed documents." },
          { title: "Start with one client", body: "You don't have to move your whole practice. Start by uploading one client's signed plan." },
        ]}
      />

      <Integrations />
      <SecurityBand />
      <ClosingCta shot={<ScaledScreen><AttorneyDashboardScreen /></ScaledScreen>} />
    </PageShell>
  );
};

export default AttorneysPage;
