import React from "react";
import {
  CheckInDemoVignette,
  SharingRecommendationVignette,
  AssetBreakdownVignette,
  LeadIntakeVignette,
} from "@/components/ProductVignettes";
import {
  TeamRosterVignette,
  StepInVignette,
  WhoGetsWhatVignette,
  TrustVignette,
  DocumentsVaultVignette,
  CategoriesVignette,
  ReleaseTimingVignette,
  RoleChangeVignette,
  SectionShareVignette,
  LifeUpdateVignette,
} from "@/components/ClientVignettes";
import {
  RequiredActionsVignette,
  SummaryReviewVignette,
  BookingVignette,
  StayingInTouchVignette,
  VaultVignette,
  ConnectionsVignette,
  SigningShot,
} from "@/components/site/vignettes";
import type { FeatureRowData } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";
import { AttorneyClientsScreen } from "@/components/product/attorney-clients";
import {
  TeamPanel,
  StayingInTouchPanel,
  EmailsPanel,
  EstatePlanSummaryPanel,
  ProSummaryAwaitingPill,
} from "@/components/product/attorney-client-panel";
import { SummaryReviewScreenCropped, SUMMARY_REVIEW_CROP_HEIGHT } from "@/components/product/attorney-review";
import {
  BookingPageScreen,
  MeetingTypesSettingsScreen,
  IntegrationsSettingsScreen,
  DashboardWithLeadPanelScreen,
} from "@/components/product/attorney-booking";
import { DashboardWithSendOrSkip, DashboardWithReleaseRequest } from "@/components/product/composites";

/* A recreated product screen at its real size, scaled to fit the frame */
const screen = (el: React.ReactNode, w = 1440, h = 855) => (
  <ScaledScreen w={w} h={h}>
    {el}
  </ScaledScreen>
);

/* Every platform and solutions page, as data. The copy says only what the
   product does today (checked against the apps on Nov 16, 2026); anything
   still being built is labelled as coming. Each page uses a different set of
   photographs. */

export type PageDef = {
  path: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  accent?: string; // the italic teal second line of the headline
  subtitle: string;
  secondary?: { label: string; to: string };
  hero: { visual: React.ReactNode; print: string; aspect?: string; width?: string; frameAspect?: string };
  pointsTitle?: string;
  points: { title: string; body: string }[];
  rowsEyebrow?: string;
  rowsTitle?: string;
  rowsLead?: string;
  rows?: FeatureRowData[];
  steps?: { eyebrow?: string; title: string; steps: { title: string; body: string }[] };
  statement?: { text: string; by?: string };
  faq?: { q: string; a: string }[];
  related: string[];
  security?: boolean;
  closing?: { title: string; body: string };
};

/* Cards used wherever a page links to another */
export const CARDS: Record<string, { label: string; desc: string; image: string; eyebrow: string }> = {
  "/platform": { label: "Overview", desc: "Your practice in one place, connected to the apps you already use.", image: "/nyc-skyline.jpg", eyebrow: "For attorneys" },
  "/platform/client-dashboard": { label: "Dashboard & clients", desc: "Leads, clients and every action waiting on you.", image: "/central-park.jpg", eyebrow: "For attorneys" },
  "/platform/plan-summaries": { label: "Plan summaries", desc: "Every plan in plain English, approved by you.", image: "/florida-coast.jpg", eyebrow: "For attorneys" },
  "/platform/check-ins": { label: "Check-ins & updates", desc: "A yearly rhythm that brings clients back to you.", image: "/santa-monica.jpg", eyebrow: "For attorneys" },
  "/platform/booking": { label: "Booking page", desc: "New clients book straight onto your calendar.", image: "/williamsburg.jpg", eyebrow: "For attorneys" },
  "/platform/integrations": { label: "Integrations", desc: "Connect your calendar, video and email.", image: "/nyc-street.jpg", eyebrow: "For attorneys" },
  "/for-clients": { label: "Overview", desc: "A plan the whole family understands.", image: "/west-side-hwy.jpg", eyebrow: "For clients & their team" },
  "/platform/sharing": { label: "Sharing & release", desc: "Share now, or hold back until a passing is verified.", image: "/willow-street.jpg", eyebrow: "For clients & their team" },
  "/solutions/their-team": { label: "Their team", desc: "Executors, trustees, guardians and agents, each with their own view.", image: "/hudson-bridge.jpg", eyebrow: "For clients & their team" },
  "/security": { label: "Security", desc: "How client information is protected, and who can see it.", image: "/williamsburg.jpg", eyebrow: "Trust" },
  "/legislation-by-state": { label: "Legislation by state", desc: "Where electronic wills and remote signing stand, state by state.", image: "/nyc-skyline.jpg", eyebrow: "Resource" },
  "/availability": { label: "Where we're live", desc: "Every state Willow serves today, and where signing is coming.", image: "/florida-coast.jpg", eyebrow: "Resource" },
};

/* Shared answers */
const FAQ_NO_ADVICE = {
  q: "Does Willow give legal advice or draft documents?",
  a: "No. You advise your clients and draft their documents, as you do today. Willow handles what happens around them: storing the signed plan, explaining it in plain English once you've approved the wording, sharing it with the right people, and keeping you in touch.",
};
const FAQ_STATES = {
  q: "Where can I use Willow?",
  a: "Willow is available to firms and clients in every state and Washington, D.C., except Washington State. Digital signing is separate: it switches on state by state as the law allows. Where we're live lists both.",
};
const FAQ_TRAINING = {
  q: "Is client information used to train AI?",
  a: "Never. Documents are read only to draft summaries for your review, AI processing stays in the United States, and nothing from a connected email or calendar account is ever sent to an AI provider.",
};
const FAQ_PAPER = {
  q: "Do my clients have to sign through Willow?",
  a: "No. Keep your signing exactly as it is today, pen and paper in your conference room, then upload the executed documents. Your clients still get everything else: plain-English summaries, secure storage, sharing on their terms, and a yearly rhythm of staying in touch.",
};

export const PAGES: PageDef[] = [
  /* ───────────────────────────── PLATFORM ───────────────────────────── */
  {
    path: "/platform",
    metaTitle: "Willow for Estate Planning Attorneys",
    metaDesc: "Every estate planning client in one place: leads and clients, their documents, plain-English summaries you approve, yearly check-ins, a booking page, and your calendar, video and email connected.",
    eyebrow: "Overview",
    title: "Your practice,",
    accent: "in one place.",
    subtitle: "Every lead and client, their signed documents, a plain-English summary you approve, and a yearly rhythm that brings them back to you. Willow connects to the calendar, video and email apps you already use.",
    secondary: { label: "See the client side", to: "/for-clients" },
    hero: { visual: screen(<AttorneyDashboardScreen />), print: "/nyc-skyline.jpg", aspect: "1440 / 855" },
    pointsTitle: "Built around the way you already work.",
    points: [
      { title: "Every client on one screen", body: "New leads, active clients and every action waiting on you, from the moment someone books a consultation." },
      { title: "Plans in plain English", body: "Willow drafts a summary of each signed plan. You review it, edit it and approve it before your client sees a word." },
      { title: "Connected to your apps", body: "Google Calendar or Outlook, Google Meet, Zoom or Microsoft Teams, and Gmail or Outlook. Bookings land on your calendar with the meeting link." },
    ],
    steps: {
      eyebrow: "How it works",
      title: "From first meeting to a family that's prepared.",
      steps: [
        { title: "A client books", body: "New clients book a consultation on your booking page and arrive on your dashboard as a lead." },
        { title: "Add the client", body: "Turn the lead into a client, or add one yourself. Spouses are linked as a joint account." },
        { title: "Upload the plan", body: "Drop in the signed PDFs. Willow reads them and drafts a plain-English summary." },
        { title: "Approve the summary", body: "Review it, edit anything, and approve. Only then does your client see it." },
        { title: "Stay in touch", body: "Yearly check-ins go to your client and the people they name, each email waiting for you to send or skip." },
      ],
    },
    rowsEyebrow: "The attorney side",
    rowsTitle: "Everything you need, page by page.",
    rows: [
      {
        eyebrow: "Dashboard & clients",
        title: "Open any client and everything is there.",
        body: "Their signed documents, including what they hold jointly with a spouse, the people they named, your notes and your emails.",
        visual: screen(<AttorneyClientsScreen open />),
        print: "/central-park.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "Plan summaries",
        title: "Willow drafts it. You approve every word.",
        body: "Review the summary section by section, check anything Willow flags, edit what you like, then approve it for your client.",
        visual: screen(<SummaryReviewScreenCropped />, 1440, SUMMARY_REVIEW_CROP_HEIGHT),
        print: "/florida-coast.jpg",
        aspect: `1440 / ${SUMMARY_REVIEW_CROP_HEIGHT}`,
      },
      {
        eyebrow: "Integrations",
        title: "Connect the apps you already use.",
        body: "Your calendar, your video meetings and your email, connected once in Settings.",
        visual: screen(<IntegrationsSettingsScreen />),
        print: "/nyc-street.jpg",
        aspect: "1440 / 855",
      },
    ],
    related: ["/platform/client-dashboard", "/platform/plan-summaries", "/platform/check-ins", "/platform/booking", "/platform/integrations", "/security"],
    security: true,
  },
  {
    path: "/platform/client-dashboard",
    metaTitle: "Dashboard & Clients | Willow for Attorneys",
    metaDesc: "One dashboard for new leads, active clients and every action waiting on you, and one record per client with their documents, team, notes and emails.",
    eyebrow: "Dashboard & clients",
    title: "Every client,",
    accent: "and everything waiting on you.",
    subtitle: "Your dashboard shows new leads, active clients and the actions that need you. Open any client to see their documents, the people in their plan, your notes and your emails.",
    hero: { visual: screen(<AttorneyDashboardScreen />), print: "/central-park.jpg", aspect: "1440 / 855" },
    points: [
      { title: "New leads", body: "Everyone who books through your page, with their meeting time and what they're looking for." },
      { title: "Couples together", body: "Spouses each have their own plan, linked as a joint account so the couple reads as one family." },
      { title: "Required actions", body: "Summaries to approve, clients who say something changed, and requests from the people in their plans." },
    ],
    rows: [
      {
        eyebrow: "The client's documents",
        title: "Every signed document in one place.",
        body: "Your client's own documents, and what they hold jointly with their spouse, like a trust and the deed that funds it.",
        visual: screen(<AttorneyClientsScreen open />),
        print: "/hudson-bridge.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "Their team",
        title: "Everyone your client named, and what each can see.",
        body: "The executors, trustees and agents in the plan, the roles they hold, and anything your client is holding back until it's needed.",
        visual: screen(<AttorneyClientsScreen open tab="Team" panel={<TeamPanel />} />),
        print: "/willow-street.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "Notes & emails",
        title: "Your notes and your emails, beside the plan.",
        body: "Keep notes on each client. With Outlook connected, your emails with them appear on their record by subject and date, next to everything Willow has sent.",
        visual: screen(<AttorneyClientsScreen open tab="Emails" panel={<EmailsPanel />} />),
        print: "/williamsburg.jpg",
        aspect: "1440 / 855",
      },
    ],
    faq: [FAQ_NO_ADVICE],
    related: ["/platform", "/platform/plan-summaries", "/platform/check-ins"],
  },
  {
    path: "/platform/plan-summaries",
    metaTitle: "Plan Summaries | Willow for Attorneys",
    metaDesc: "Upload the signed estate plan and Willow drafts a plain-English summary. You review it, edit it and approve it before your client sees a word.",
    eyebrow: "Plan summaries",
    title: "Every plan in plain English,",
    accent: "approved by you.",
    subtitle: "Upload the signed documents and Willow drafts a summary your client can follow. You review it, edit anything, and approve it before they see a word.",
    hero: { visual: screen(<SummaryReviewScreenCropped />, 1440, SUMMARY_REVIEW_CROP_HEIGHT), print: "/florida-coast.jpg", aspect: `1440 / ${SUMMARY_REVIEW_CROP_HEIGHT}` },
    points: [
      { title: "Drafted from the documents", body: "Willow reads the signed plan and writes who's in it, who steps in if needed, and what your client leaves behind." },
      { title: "Flagged for a second look", body: "Suggested reviews point you to anything worth checking before you approve." },
      { title: "Your approval comes first", body: "Nothing reaches your client until you approve. Then the summary appears on their account." },
    ],
    rows: [
      {
        eyebrow: "Waiting on you",
        title: "Ready when you are.",
        body: "When a summary is drafted, it waits on the client's record and in your required actions until you review and approve it.",
        visual: screen(<AttorneyClientsScreen open tab="Estate Plan" dots={["Estate Plan"]} headerPill={<ProSummaryAwaitingPill />} panel={<EstatePlanSummaryPanel />} />),
        print: "/central-park.jpg",
        aspect: "1440 / 855",
      },
    ],
    faq: [FAQ_NO_ADVICE, FAQ_TRAINING],
    related: ["/platform", "/platform/client-dashboard", "/platform/sharing"],
  },
  {
    path: "/platform/sharing",
    metaTitle: "Sharing & Release | Willow",
    metaDesc: "Clients share their estate plan with executors, guardians and agents by role. Documents can be shared now, or sealed until a passing is verified by the attorney.",
    eyebrow: "Platform · Sharing & release",
    title: "Everyone prepared.",
    accent: "Nothing shared early.",
    subtitle: "Your client names their executors, guardians and agents. Willow recommends what each should see, and holds anything sealed until you've verified a passing.",
    hero: { visual: <SharingRecommendationVignette />, print: "/willow-street.jpg", aspect: "760 / 660" },
    points: [
      { title: "Shared by role", body: "An executor needs different things than a guardian. Willow knows each role and recommends what to share with whom." },
      { title: "Now, or sealed", body: "Share a document today, or seal it until a passing is verified. Until then, the person sees that something is waiting, but not what it says." },
      { title: "You verify", body: "When someone reports a passing, you confirm it, usually from the death certificate, before anything sealed is released." },
    ],
    rows: [
      {
        eyebrow: "Timing",
        title: "Your client controls when each document opens.",
        body: "Share now, share when they've passed, or describe a condition and leave the decision to you.",
        visual: <ReleaseTimingVignette />,
        print: "self",
      },
      {
        eyebrow: "Supporting information",
        title: "The documents, and the information to act on them.",
        body: "Finances, digital accounts, the children's details and health information can each be shared with the person who'll need them.",
        visual: <SectionShareVignette />,
        print: "self",
      },
      {
        eyebrow: "Staying current",
        title: "When the plan changes, sharing follows.",
        body: "If an updated plan gives someone a new role, Willow proposes exactly what to change in what's already been shared. Your client reviews it once and approves.",
        visual: <RoleChangeVignette />,
        print: "self",
      },
    ],
    faq: [
      { q: "Who verifies a death?", a: "The client's attorney. When a named person reports a passing, the request comes to you, and you release what was sealed once you've confirmed it." },
      { q: "What about powers of attorney and health care proxies?", a: "They're shared now, so the people named can act when they're needed." },
      { q: "Can a client change their mind?", a: "Any time. Sharing can be added, changed or removed, and each change is recorded." },
    ],
    related: ["/solutions/their-team", "/platform/plan-summaries"],
    security: true,
  },
  {
    path: "/platform/check-ins",
    metaTitle: "Check-ins & Updates | Willow for Attorneys",
    metaDesc: "Once a plan is approved, Willow keeps you in touch with your client and the people they name. Every email waits for you to send or skip.",
    eyebrow: "Check-ins & updates",
    title: "Plans stay current.",
    accent: "Clients come back to you.",
    subtitle: "Once a plan is approved, Willow keeps you in touch with your client and the people in their plan. Every email waits for you to send or skip.",
    hero: { visual: screen(<AttorneyClientsScreen open tab="Staying in touch" panel={<StayingInTouchPanel />} />), print: "/santa-monica.jpg", aspect: "1440 / 855" },
    points: [
      { title: "A yearly check-in", body: "Your client is asked whether anything has changed: a move, a new grandchild, a sale of the house." },
      { title: "Their people too", body: "The agents and professionals in the plan get their own check-ins, and can book time with you." },
      { title: "Nothing goes without you", body: "Each email is ready for you to read, change, then send or skip." },
    ],
    rows: [
      {
        eyebrow: "Going out",
        title: "Every email waits for you.",
        body: "Check-ins queue up on your dashboard. Open one, change anything you like, then send it or skip it.",
        visual: screen(<DashboardWithSendOrSkip />),
        print: "/williamsburg.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "When something changes",
        title: "It lands in your required actions.",
        body: "When a client says something has changed, you see it on your dashboard with what they said, and they can book time with you.",
        visual: screen(<AttorneyDashboardScreen />),
        print: "/central-park.jpg",
        aspect: "1440 / 855",
      },
    ],
    related: ["/platform", "/platform/booking", "/platform/client-dashboard"],
  },
  {
    path: "/platform/booking",
    metaTitle: "Booking Page | Willow for Attorneys",
    metaDesc: "A booking page for new estate planning clients: a few questions, a time on your calendar, and a lead on your dashboard with their answers.",
    eyebrow: "Booking page",
    title: "New clients book",
    accent: "straight onto your calendar.",
    subtitle: "Share your booking page and new clients answer a few questions and pick a time. Each booking lands on your calendar and arrives on your dashboard as a lead.",
    hero: { visual: screen(<BookingPageScreen />, 1440, 900), print: "/williamsburg.jpg", aspect: "1440 / 900" },
    points: [
      { title: "A few quick questions", body: "What they're looking for and a little about their family, then a time that suits them." },
      { title: "Your meeting types", body: "Consultations, check-in calls, and meetings for the people in your clients' plans, each on its own schedule." },
      { title: "Leads on your dashboard", body: "Every booking appears under New leads, with their answers, ready to become a client." },
    ],
    rows: [
      {
        eyebrow: "Meeting types",
        title: "Set up each kind of meeting once.",
        body: "How long it is, how it happens (video, phone or in person) and when you're available for it.",
        visual: screen(<MeetingTypesSettingsScreen />),
        print: "/nyc-street.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "The lead",
        title: "See who's coming, and why.",
        body: "Open a lead to see their booking and their answers, join the call, and convert them to a client when you're ready.",
        visual: screen(<DashboardWithLeadPanelScreen />),
        print: "/central-park.jpg",
        aspect: "1440 / 855",
      },
    ],
    related: ["/platform/integrations", "/platform/client-dashboard", "/platform"],
  },
  {
    path: "/platform/integrations",
    metaTitle: "Integrations | Willow for Attorneys",
    metaDesc: "Connect Google Calendar or Outlook, Google Meet, Zoom or Microsoft Teams, and Gmail or Outlook. Bookings land on your calendar with the meeting link.",
    eyebrow: "Integrations",
    title: "Connect the apps",
    accent: "you already use.",
    subtitle: "Connect your calendar, video and email once, and Willow works around them. Bookings land on your calendar with the meeting link, and your emails with a client show up on their record.",
    hero: { visual: screen(<IntegrationsSettingsScreen />), print: "/nyc-street.jpg", aspect: "1440 / 855" },
    points: [
      { title: "Calendar", body: "Google Calendar or Outlook Calendar. Choose which calendar each meeting books into and which ones count as busy." },
      { title: "Video", body: "Google Meet, Zoom or Microsoft Teams. Each booking gets its meeting link." },
      { title: "Email", body: "Gmail or Outlook, connected read-only so Willow can look people up. Nothing is ever sent from it." },
    ],
    rows: [
      {
        eyebrow: "Calendars",
        title: "Pick where each meeting goes.",
        body: "See every calendar on your account, and choose the one your consultations book into.",
        visual: screen(<IntegrationsSettingsScreen page="calendars" />),
        print: "/hudson-bridge.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "Email",
        title: "Your emails with a client, on their record.",
        body: "With Outlook connected, your emails with each client appear in their Emails tab: the subject and the date, never the message itself.",
        visual: screen(<AttorneyClientsScreen open tab="Emails" panel={<EmailsPanel />} />),
        print: "/williamsburg.jpg",
        aspect: "1440 / 855",
      },
    ],
    faq: [FAQ_TRAINING],
    related: ["/platform/booking", "/platform/client-dashboard", "/platform"],
  },

  /* ────────────────────────── SOLUTIONS: ATTORNEYS ────────────────────────── */

  /* ─────────────────────── SOLUTIONS: CLIENTS & THEIR TEAM ─────────────────────── */

  /* ───────────────────────────── SOLUTIONS: BY PLAN ───────────────────────────── */
];

export const pageByPath = (path: string) => PAGES.find((p) => p.path === path);
