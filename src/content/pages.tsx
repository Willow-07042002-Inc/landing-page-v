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
  "/platform": { label: "Platform overview", desc: "One place from the first meeting to a plan the family understands.", image: "/nyc-skyline.jpg", eyebrow: "Platform" },
  "/platform/client-dashboard": { label: "Client dashboard", desc: "Leads, clients and every action waiting on you.", image: "/central-park.jpg", eyebrow: "Platform" },
  "/platform/plan-summaries": { label: "Plan summaries", desc: "Every gift and condition in plain English, approved by you.", image: "/florida-coast.jpg", eyebrow: "For your clients" },
  "/platform/sharing": { label: "Sharing & release", desc: "Share now, or seal until a passing is verified.", image: "/willow-street.jpg", eyebrow: "For your clients" },
  "/platform/check-ins": { label: "Check-ins & updates", desc: "A yearly rhythm that brings clients back to you.", image: "/santa-monica.jpg", eyebrow: "For your clients" },
  "/platform/booking": { label: "Booking page", desc: "New clients book video, phone or in-person time.", image: "/williamsburg.jpg", eyebrow: "For your clients" },
  "/platform/integrations": { label: "Integrations", desc: "Google Workspace, Microsoft 365 and Zoom.", image: "/nyc-street.jpg", eyebrow: "Connect" },
  "/security": { label: "Security", desc: "How client information is protected, and who can see it.", image: "/williamsburg.jpg", eyebrow: "Trust" },
  "/solutions/their-team": { label: "Their team", desc: "Executors, trustees, guardians and agents, each with their own portal.", image: "/hudson-bridge.jpg", eyebrow: "For clients & their team" },
  "/for-clients": { label: "Clients & families", desc: "A plan everyone understands.", image: "/west-side-hwy.jpg", eyebrow: "For clients" },
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
    metaTitle: "The Willow Platform | Estate Planning Software for Attorneys",
    metaDesc: "One platform for estate planning attorneys and their clients: a client dashboard, plain-English plan summaries, secure sharing and a yearly rhythm of staying in touch.",
    eyebrow: "Platform",
    title: "One platform for",
    accent: "the plan and the relationship.",
    subtitle: "Willow holds every client's plan, explains it to the family in plain English, shares it with the people they name, and keeps you in touch for years after the signing.",
    secondary: { label: "See the client experience", to: "/for-clients" },
    hero: { visual: <RequiredActionsVignette />, print: "/nyc-skyline.jpg" },
    pointsTitle: "Built around the attorney, not around the software.",
    points: [
      { title: "Your work stays yours", body: "You advise, draft and sign as you do today. Willow takes over what happens after: storage, explanation, sharing and staying in touch." },
      { title: "A plan the family can follow", body: "Every gift, trustee and power written out in plain English, reviewed and approved by you before a client sees a word." },
      { title: "A relationship that lasts", body: "Instead of ending the day the plan is signed, the relationship carries on as life moves forward, with you at the center of it." },
    ],
    steps: {
      eyebrow: "How it works",
      title: "From signed plan to a family that's prepared.",
      steps: [
        { title: "Add the client", body: "Add them yourself, or let a new client book through your page and become a lead." },
        { title: "Upload the plan", body: "Upload the signed documents. Willow files them and can create the client record for you." },
        { title: "Approve the summary", body: "Willow drafts a plain-English summary. You edit it and approve it." },
        { title: "The client shares it", body: "Your client chooses who sees what: now, or once a passing is verified." },
        { title: "Stay in touch", body: "Yearly check-ins and updates you approve bring the client back when life changes." },
      ],
    },
    rowsEyebrow: "Inside the platform",
    rowsTitle: "Everything after the signature, in one place.",
    rows: [
      {
        eyebrow: "Client records",
        title: "Every client's plan, people and history, on one record.",
        body: "Each record holds the client's estate plan, the team they've named, your notes, and your yearly plan for staying in touch, with every email waiting for your approval.",
        visual: <StayingInTouchVignette />,
        print: "/central-park.jpg",
      },
      {
        eyebrow: "Plan summaries",
        title: "Willow drafts the explanation. You approve every word.",
        body: "Upload a will, trust or power of attorney and Willow drafts a summary with each point tied to the clause it came from. Anything worth a second look is flagged for you.",
        visual: <SummaryReviewVignette />,
        print: "/florida-coast.jpg",
      },
      {
        eyebrow: "Sharing & release",
        title: "The right documents reach the right people, at the right time.",
        body: "Willow recommends what each executor, guardian and agent should see. Your client decides, and anything sealed until a passing stays sealed until you verify it.",
        visual: <SharingRecommendationVignette />,
        print: "/willow-street.jpg",
        aspect: "760 / 660",
      },
    ],
    related: ["/platform/client-dashboard", "/platform/plan-summaries", "/platform/sharing", "/platform/check-ins", "/platform/booking", "/platform/integrations", "/security"],
    security: true,
  },
  {
    path: "/platform/client-dashboard",
    metaTitle: "Client Dashboard | Willow for Estate Planning Attorneys",
    metaDesc: "Leads from your booking page, every active client, and every action waiting on you, in one dashboard built for estate planning attorneys.",
    eyebrow: "Platform · Client dashboard",
    title: "Every client,",
    accent: "and every action waiting on you.",
    subtitle: "Sign in to three lists: the new leads who booked time with you, the clients whose plans are in progress, and the actions only you can take.",
    hero: { visual: <RequiredActionsVignette />, print: "/central-park.jpg" },
    points: [
      { title: "New leads", body: "People who book through your page land here with what they want to discuss, ready to become clients in one step." },
      { title: "Active clients", body: "Every client and their plan, with couples shown together so a household reads as one matter." },
      { title: "Required actions", body: "Summaries to approve, release requests, emails ready to send, and clients who've told you something changed." },
    ],
    rowsTitle: "The whole client, on one record.",
    rowsEyebrow: "Client records",
    rows: [
      {
        eyebrow: "The client record",
        title: "Plan, people and history together.",
        body: "Each record holds the client's contact details, their estate plan, the team they've named, your notes, and your yearly plan for staying in touch.",
        bullets: ["Couples linked, each spouse in their own account", "Your Outlook emails with the client shown on the record, if you connect Microsoft 365", "Notes only you and your firm can see"],
        visual: <StayingInTouchVignette />,
        print: "/hudson-bridge.jpg",
      },
      {
        eyebrow: "Adding a client",
        title: "Start from the plan you already have.",
        body: "Upload a signed plan and Willow can build the client record from it. Connect your calendar or contacts and Willow suggests the client's email and phone number as you type their name.",
        visual: <LeadIntakeVignette />,
        print: "/nyc-street.jpg",
      },
    ],
    faq: [
      { q: "Will my clients see my firm's name?", a: "Yes. Your firm's logo and colour appear on the pages and emails your clients receive from Willow." },
      { q: "Can my paralegals and associates sign in?", a: "Inviting associates, paralegals and staff is coming soon. Today each attorney has their own account, and your firm's details and branding sit above them." },
      FAQ_NO_ADVICE,
    ],
    related: ["/platform/plan-summaries", "/platform/booking", "/platform/check-ins"],
  },
  {
    path: "/platform/plan-summaries",
    metaTitle: "Plain-English Plan Summaries | Willow",
    metaDesc: "Willow drafts a plain-English summary of every will, trust, power of attorney and health care proxy. The attorney reviews and approves every word before the client sees it.",
    eyebrow: "Platform · Plan summaries",
    title: "Every plan,",
    accent: "explained in plain English.",
    subtitle: "Willow drafts a summary of each will, trust and power of attorney, tied clause by clause to the document. You edit it and approve it. Only then does your client see it.",
    hero: { visual: <SummaryReviewVignette />, print: "/florida-coast.jpg" },
    points: [
      { title: "Drafted from the document", body: "Each point in the summary is tied to the clause it came from, and anything worth a second look is flagged for your review." },
      { title: "Approved by you", body: "Nothing reaches the client until you've read it, changed what you want, and approved it." },
      { title: "Understood by the family", body: "Who gets what, who steps in, and what each person can do, written for the people who'll rely on it." },
    ],
    rowsEyebrow: "What the client sees",
    rowsTitle: "Countless pages, one summary they can follow.",
    rows: [
      {
        title: "Where everything goes.",
        body: "Every gift, the conditions on it, and how the rest of the estate is divided, in the order it happens.",
        visual: <WhoGetsWhatVignette />,
        print: "self",
      },
      {
        title: "How a trust pays out.",
        body: "Who manages it, what it holds, and when each beneficiary receives their share, laid out as a schedule.",
        visual: <TrustVignette />,
        print: "self",
      },
      {
        title: "Who steps in, and what they can do.",
        body: "Each agent under a power of attorney or health care proxy, who's next in line, and what each power means in practice.",
        visual: <StepInVignette />,
        print: "self",
      },
    ],
    faq: [
      { q: "Which documents does Willow summarize?", a: "Wills, revocable and irrevocable trusts, powers of attorney and health care proxies. Other documents, like deeds and beneficiary designations, are stored and shared alongside them." },
      { q: "Can I change the wording?", a: "Yes. Edit anything before you approve it. The client only ever sees the version you approved." },
      FAQ_TRAINING,
      FAQ_NO_ADVICE,
    ],
    related: ["/platform/sharing"],
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
    metaTitle: "Check-ins & Updates | Willow",
    metaDesc: "A yearly rhythm of check-ins, short surveys and updates from your firm keeps estate plans current and brings clients back to their attorney when life changes.",
    eyebrow: "Platform · Check-ins & updates",
    title: "Plans stay current.",
    accent: "Clients come back to you.",
    subtitle: "Once a plan is approved, Willow keeps you in touch with a yearly rhythm of check-ins, short surveys and updates from your firm. Every email waits for your approval.",
    hero: { visual: <CheckInDemoVignette h={560} />, print: "/santa-monica.jpg" },
    points: [
      { title: "A yearly rhythm", body: "Check-ins, short yes-or-no surveys and notes from your firm, spaced through the year and sent on your behalf." },
      { title: "Nothing goes without you", body: "Each email is ready for you to approve or skip. Nothing is sent in your name that you haven't seen." },
      { title: "Changes come to you", body: "When a client says something has changed, it lands in your required actions with an easy way to book a call." },
    ],
    rows: [
      {
        eyebrow: "Staying in touch",
        title: "Set it once for every client.",
        body: "Choose how you want to stay in touch each year. Willow enrolls each client when their plan is approved and keeps the rhythm going.",
        visual: <StayingInTouchVignette />,
        print: "/williamsburg.jpg",
      },
      {
        eyebrow: "The client's side",
        title: "Has anything changed?",
        body: "A new grandchild, a move, a sale of the house. Your client answers in a few taps, and you hear about it the same day.",
        visual: <LifeUpdateVignette />,
        print: "self",
      },
      {
        eyebrow: "The people in the plan",
        title: "Meet the next generation of clients.",
        body: "Everyone your client names gets their own portal, and can book time with you when they need access.",
        visual: <TeamRosterVignette />,
        print: "self",
      },
    ],
    faq: [
      { q: "Can I post my own updates?", a: "Yes. Share an article or a note from your firm and it appears on your clients' dashboards." },
      { q: "Can I skip a check-in?", a: "Yes. Every email waits for you to approve or skip it." },
    ],
    related: ["/platform/booking", "/platform/client-dashboard", "/solutions/their-team"],
  },
  {
    path: "/platform/booking",
    metaTitle: "Booking Page | Willow for Estate Planning Attorneys",
    metaDesc: "A booking page for estate planning attorneys: video, phone or in-person meetings, availability from your own calendar, and every booking becomes a lead.",
    eyebrow: "Platform · Booking page",
    title: "New clients book time",
    accent: "with you directly.",
    subtitle: "Share your booking page and people choose a video, phone or in-person meeting from your real availability. Every booking arrives on your dashboard as a lead.",
    hero: { visual: <BookingVignette />, print: "/williamsburg.jpg" },
    points: [
      { title: "Your meeting types", body: "Video, phone or in person, each with its own length." },
      { title: "Your real availability", body: "Times come from the calendars you connect, so you're never double-booked." },
      { title: "Bookings become leads", body: "Each booking shows what the person wants to discuss and becomes a client in one step." },
    ],
    rows: [
      {
        eyebrow: "Before the meeting",
        title: "A few questions first, so the meeting is shorter.",
        body: "People tell you what brings them in and a little about their family before they pick a time. Reminders go out automatically.",
        visual: <LeadIntakeVignette />,
        print: "/nyc-street.jpg",
      },
      {
        eyebrow: "Calendars",
        title: "Works with the calendar you already use.",
        body: "Connect Google Workspace or Microsoft 365 for availability, and Zoom or Google Meet for a video link on every booking.",
        visual: <ConnectionsVignette />,
        print: "/central-park.jpg",
      },
    ],
    faq: [
      { q: "Can executors book time with me?", a: "Yes. When someone your client named needs access, they can book a meeting with you from their own portal." },
      { q: "Are reminders sent?", a: "Yes. Meeting reminders go out automatically." },
    ],
    related: ["/platform/integrations", "/platform/client-dashboard", "/platform/check-ins"],
  },
  {
    path: "/platform/integrations",
    metaTitle: "Integrations | Willow",
    metaDesc: "Connect Google Workspace, Microsoft 365 and Zoom to Willow for calendar availability, meeting links and client contact suggestions. Every connection is optional.",
    eyebrow: "Platform · Integrations",
    title: "Works with the tools",
    accent: "your practice already runs on.",
    subtitle: "Connect Google Workspace, Microsoft 365 or Zoom for your availability, meeting links and client contact details. Every connection is optional, and you can disconnect any time.",
    secondary: { label: "See exactly what each one accesses", to: "/connections" },
    hero: { visual: <ConnectionsVignette />, print: "/nyc-street.jpg" },
    points: [
      { title: "Google Workspace", body: "Calendar availability, events for booked consultations with a Google Meet link, and contact suggestions when you add a client. Willow never asks for Gmail." },
      { title: "Microsoft 365", body: "Outlook calendar and Teams links, plus the sender, subject and date of your emails with a client on their record. Never the body or attachments." },
      { title: "Zoom", body: "A Zoom link for every video consultation booked through Willow. Willow never reads your meetings or recordings." },
    ],
    faq: [
      { q: "Is anything from my email or calendar sent to AI?", a: "Never. Data from a connected account is not used for advertising, never sent to an AI provider and never used to train AI." },
      { q: "Do my clients need to connect anything?", a: "No. Only attorneys and their staff connect accounts, and only if they choose to." },
    ],
    related: ["/platform/booking", "/security", "/platform/client-dashboard"],
  },

  /* ────────────────────────── SOLUTIONS: ATTORNEYS ────────────────────────── */

  /* ─────────────────────── SOLUTIONS: CLIENTS & THEIR TEAM ─────────────────────── */

  /* ───────────────────────────── SOLUTIONS: BY PLAN ───────────────────────────── */
];

export const pageByPath = (path: string) => PAGES.find((p) => p.path === path);
