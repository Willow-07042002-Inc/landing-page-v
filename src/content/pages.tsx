import React from "react";
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
import {
  ClientPlanSectionScreen,
  ClientSharedScreen,
  ClientShareTimingScreen,
  SharedWithYouScreen,
  CheckInScreen,
} from "@/components/product/client-app";

/* A recreated product screen at its real size, scaled to fit the frame */
const screen = (el: React.ReactNode, w = 1440, h = 855) => (
  <ScaledScreen w={w} h={h}>
    {el}
  </ScaledScreen>
);

/* Every page in the Platform menu, as data: For attorneys (/platform/*) and
   For clients & their team (/platform/sharing, /solutions/their-team; the
   overview is ForClientsPage). The copy says only what the product does today,
   and every picture is a screen recreated from the product code
   (src/components/product, checked against origin/main on Nov 17, 2026). */

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
      {
        eyebrow: "What your client sees",
        title: "Their plan, section by section.",
        body: "Once you approve, your client reads their plan in plain English: their family, who steps in if needed, and the powers each person holds.",
        visual: screen(<ClientPlanSectionScreen />),
        print: "/west-side-hwy.jpg",
        aspect: "1440 / 855",
      },
    ],
    faq: [FAQ_NO_ADVICE, FAQ_TRAINING],
    related: ["/platform", "/platform/client-dashboard", "/platform/sharing"],
  },
  {
    path: "/platform/sharing",
    metaTitle: "Sharing & Release | Willow",
    metaDesc: "Clients choose who gets each document of their estate plan, and when: now, or once a passing is verified by their attorney.",
    eyebrow: "Sharing & release",
    title: "Everyone prepared.",
    accent: "Nothing shared early.",
    subtitle: "Your client chooses who gets each document, and when: now, or once a passing is verified. Each person they name sees only what's theirs.",
    hero: { visual: screen(<ClientSharedScreen />), print: "/willow-street.jpg", aspect: "1440 / 855" },
    points: [
      { title: "Document by document", body: "For each document, your client picks the people on their team who should have it." },
      { title: "Now, or after a passing", body: "Powers of attorney and medical proxies are shared right away, so the people named can act. A will can wait." },
      { title: "The attorney verifies", body: "Anything held back opens only after you've confirmed the passing, and everyone it was shared with is emailed." },
    ],
    rows: [
      {
        eyebrow: "Who gets it, and when",
        title: "One choice per person.",
        body: "Your client ticks each person who should have a document, then picks whether they get it now or when they pass away.",
        visual: screen(<ClientShareTimingScreen />),
        print: "/hudson-bridge.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "What you see",
        title: "What's held back, and for whom.",
        body: "The client's Team tab shows everyone they named, their roles, and what's being held back until it's needed.",
        visual: screen(<AttorneyClientsScreen open tab="Team" panel={<TeamPanel />} />),
        print: "/central-park.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "When the time comes",
        title: "You confirm it before anything opens.",
        body: "A person in the plan lets you know about the passing and attaches the death certificate. You grant access, or deny it.",
        visual: screen(<DashboardWithReleaseRequest />),
        print: "/williamsburg.jpg",
        aspect: "1440 / 855",
      },
    ],
    faq: [
      { q: "Who verifies a passing?", a: "The client's attorney. The request comes to you, and what was held back opens only when you grant it." },
      { q: "Are powers of attorney held back?", a: "No. They're shared right away, so the people named can act when they're needed." },
      { q: "Can a client change their mind?", a: "Yes. Your client can change who has each document, and when, from their Shared tab at any time." },
    ],
    related: ["/for-clients", "/solutions/their-team", "/platform/plan-summaries"],
  },
  {
    path: "/solutions/their-team",
    metaTitle: "Executors, Trustees, Guardians & Agents | Willow",
    metaDesc: "The people a client names in their estate plan get their own view of it: their roles in plain English, what's been shared with them, and how to reach the attorney.",
    eyebrow: "Their team",
    title: "Everyone in the plan,",
    accent: "ready when it matters.",
    subtitle: "The people your client names, their executors, trustees, guardians and agents, each get their own view of the plan: their roles, what's been shared with them, and how to reach the attorney when it's time.",
    hero: { visual: screen(<SharedWithYouScreen />), print: "/hudson-bridge.jpg", aspect: "1440 / 855" },
    points: [
      { title: "Their roles, explained", body: "Each person sees what they've been named in plain English: what an executor does, when an agent steps in." },
      { title: "What's theirs to open", body: "Documents shared now open today. Anything held back shows as available after a passing." },
      { title: "A way to reach the attorney", body: "When the time comes, they let the client's attorney know from the plan itself." },
    ],
    rows: [
      {
        eyebrow: "Who steps in",
        title: "In order, with the powers they hold.",
        body: "The plan spells out who steps in if your client can't decide for themselves, who's next in line, and what each power means.",
        visual: screen(<ClientPlanSectionScreen />),
        print: "/willow-street.jpg",
        aspect: "1440 / 855",
      },
      {
        eyebrow: "The attorney knows them too",
        title: "Your client's people, on your client's record.",
        body: "Everyone your client names appears on their Team tab, and agents get their own yearly check-in from you.",
        visual: screen(<AttorneyClientsScreen open tab="Team" panel={<TeamPanel />} />),
        print: "/central-park.jpg",
        aspect: "1440 / 855",
      },
    ],
    related: ["/for-clients", "/platform/sharing", "/platform/plan-summaries"],
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
        eyebrow: "The client's side",
        title: "Has anything changed?",
        body: "A short check-in from your firm asks your client what's changed since they signed. They tap what applies.",
        visual: screen(<CheckInScreen />, 1440, 900),
        print: "/willow-street.jpg",
        aspect: "1440 / 900",
      },
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

/* Two pages for now: For attorneys (/platform, AttorneysPage) and For clients
   & their team (/for-clients). The deeper pages above stay written and ready.
   Each one redirects to its part of those pages; delete its line here to
   publish it again. */
export const PARKED_PAGES: Record<string, string> = {
  "/platform/booking": "/platform#booking",
  "/platform/client-dashboard": "/platform#dashboard",
  "/platform/plan-summaries": "/platform#plan-summaries",
  "/platform/check-ins": "/platform#check-ins",
  "/platform/integrations": "/platform#integrations",
  "/platform/sharing": "/for-clients",
  "/solutions/their-team": "/for-clients",
};

export const pageByPath = (path: string) => PAGES.find((p) => p.path === path);
