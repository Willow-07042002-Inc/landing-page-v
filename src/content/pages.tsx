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
  "/platform/signing": { label: "Signing ceremony", desc: "Built, and launching state by state as the law allows.", image: "/golden-gate.jpg", eyebrow: "Coming" },
  "/platform/vault": { label: "Vault", desc: "Every document, every version, and who opened it.", image: "/hudson-bridge.jpg", eyebrow: "Platform" },
  "/platform/plan-summaries": { label: "Plan summaries", desc: "Every gift and condition in plain English, approved by you.", image: "/florida-coast.jpg", eyebrow: "Client experience" },
  "/platform/sharing": { label: "Sharing & release", desc: "Share now, or seal until a passing is verified.", image: "/willow-street.jpg", eyebrow: "Client experience" },
  "/platform/check-ins": { label: "Check-ins & updates", desc: "A yearly rhythm that brings clients back to you.", image: "/santa-monica.jpg", eyebrow: "Client experience" },
  "/platform/booking": { label: "Booking page", desc: "New clients book video, phone or in-person time.", image: "/williamsburg.jpg", eyebrow: "Client experience" },
  "/platform/integrations": { label: "Integrations", desc: "Google Workspace, Microsoft 365 and Zoom.", image: "/nyc-street.jpg", eyebrow: "Connect" },
  "/security": { label: "Security", desc: "How client information is protected, and who can see it.", image: "/workshop.jpg", eyebrow: "Trust" },
  "/solutions/solo": { label: "Solo practitioners", desc: "Run every matter from one dashboard.", image: "/williamsburg.jpg", eyebrow: "For attorneys" },
  "/solutions/boutique-firms": { label: "Boutique firms", desc: "Every client, under your firm's name.", image: "/nyc-street.jpg", eyebrow: "For attorneys" },
  "/solutions/practice-growth": { label: "Practice growth", desc: "Relationships that last past the signing.", image: "/central-park.jpg", eyebrow: "For attorneys" },
  "/solutions/their-team": { label: "Their team", desc: "Executors, trustees, guardians and agents, each with their own portal.", image: "/hudson-bridge.jpg", eyebrow: "For clients & their team" },
  "/for-clients": { label: "Clients & families", desc: "A plan everyone understands.", image: "/west-side-hwy.jpg", eyebrow: "For clients" },
  "/solutions/wills": { label: "Wills", desc: "Signed, stored and explained.", image: "/willow-street.jpg", eyebrow: "By plan" },
  "/solutions/trusts": { label: "Revocable trusts", desc: "Payout schedules anyone can follow.", image: "/florida-coast.jpg", eyebrow: "By plan" },
  "/solutions/powers-of-attorney": { label: "Powers of attorney", desc: "Every power, explained in plain English.", image: "/nyc-skyline.jpg", eyebrow: "By plan" },
  "/solutions/guardianship": { label: "Guardianship for minors", desc: "Per-child guidance, in the parents' words.", image: "/west-side-hwy.jpg", eyebrow: "By plan" },
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
    title: "One platform for the plan and the relationship.",
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
        eyebrow: "Client dashboard",
        title: "See everything waiting on you, the moment you sign in.",
        body: "New leads from your booking page, every active client, and one list of the actions that need you: summaries to approve, release requests, emails ready to send.",
        visual: <RequiredActionsVignette />,
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
    related: ["/platform/client-dashboard", "/platform/plan-summaries", "/platform/vault", "/platform/sharing", "/platform/check-ins", "/platform/booking", "/platform/integrations", "/platform/signing", "/security"],
    security: true,
  },
  {
    path: "/platform/client-dashboard",
    metaTitle: "Client Dashboard | Willow for Estate Planning Attorneys",
    metaDesc: "Leads from your booking page, every active client, and every action waiting on you, in one dashboard built for estate planning attorneys.",
    eyebrow: "Platform · Client dashboard",
    title: "Every client, and every action waiting on you.",
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
    path: "/platform/signing",
    metaTitle: "Digital Signing Ceremony | Willow",
    metaDesc: "Willow's attorney-led signing ceremony is built and switches on state by state as electronic wills law allows. Until then, sign as you do today and upload the executed documents.",
    eyebrow: "Platform · Signing ceremony · Coming",
    title: "A signing ceremony, ready for the day your state allows it.",
    subtitle: "Willow's signing ceremony is built. It switches on state by state as electronic wills and remote notarization become law. Until then, sign the way you do today and upload the executed documents.",
    secondary: { label: "See where the law stands", to: "/legislation-by-state" },
    hero: { visual: <SigningShot />, print: "/golden-gate.jpg", aspect: "2056 / 1258", width: "88%" },
    pointsTitle: "What the ceremony does.",
    points: [
      { title: "Run by you", body: "The attorney leads every phase and decides when to move on: verification, introduction, the notary's questions, signing and notarization." },
      { title: "Witnesses and a notary", body: "The testator and both witnesses sign in turn, and the notary seals only once every signature is in." },
      { title: "On the record", body: "The ceremony is held on video and recorded, with identity checks before anyone signs." },
    ],
    steps: {
      eyebrow: "The ceremony",
      title: "Five phases, each one in the attorney's hands.",
      steps: [
        { title: "Verification", body: "Camera, microphone and identity checks before anyone joins." },
        { title: "Introduction", body: "You open the ceremony and confirm who is present." },
        { title: "Notary questions", body: "The notary asks the questions your state requires." },
        { title: "Signing", body: "The testator signs, then each witness, in turn." },
        { title: "Notarization", body: "The notary completes the seal once every signature is in." },
      ],
    },
    faq: [
      { q: "Can I use Willow before signing reaches my state?", a: "Yes. Everything else in Willow works today in every state we serve: the dashboard, plan summaries, the vault, sharing and staying in touch. Upload the documents you sign on paper." },
      { q: "Which states come first?", a: "We switch signing on only where state law allows it, and list each state on Where we're live as it opens. New York's electronic wills law takes effect in December 2027. Florida has allowed electronic wills since 2020." },
      FAQ_PAPER,
    ],
    related: ["/legislation-by-state", "/availability", "/platform/vault"],
    closing: { title: "Be ready when your state is.", body: "Start with Willow today, and add digital signing the day it opens in your state." },
  },
  {
    path: "/platform/vault",
    metaTitle: "The Willow Vault | Secure Storage for Estate Plans",
    metaDesc: "Every signed estate planning document, every past version, and a record of everyone who opened them, stored for your clients and the people they name.",
    eyebrow: "Platform · Vault",
    title: "Every document, every version, and who opened it.",
    subtitle: "The signed plan and everything that supports it, stored in one place your client and the people they name can reach, with a record of every view, download and release.",
    hero: { visual: <VaultVignette />, print: "/hudson-bridge.jpg" },
    points: [
      { title: "The whole plan", body: "Wills and codicils, revocable and irrevocable trusts and their amendments, powers of attorney, health care proxies, deeds, beneficiary designations and guardianship designations." },
      { title: "Every version", body: "When a plan is updated, the past version stays on file with the dates it was in force, so no one wonders which will is current." },
      { title: "A record of access", body: "Every view, download, share and release is logged and kept for seven years." },
    ],
    rowsTitle: "More than the legal documents.",
    rows: [
      {
        eyebrow: "What the family will need",
        title: "Everything someone stepping in will look for.",
        body: "Beyond the plan itself, Willow guides your client through what to gather: accounts and insurance, passwords and digital accounts, health details, and everything about the children.",
        bullets: ["Finance: accounts, real estate, insurance, debts and taxes", "Digital life: accounts, password manager and recovery", "Children and health: providers, schools, guidance and wishes"],
        visual: <CategoriesVignette />,
        print: "self",
      },
      {
        eyebrow: "What your client sees",
        title: "Their documents, current and past, a tap away.",
        body: "Clients open their signed documents from their own portal, with past versions kept beside them.",
        visual: <DocumentsVaultVignette />,
        print: "self",
      },
    ],
    faq: [
      { q: "Does Willow hold the original will?", a: "No. Willow stores copies of the signed documents. Keep originals the way you do today; Willow makes sure the family can find and understand them." },
      { q: "Who can see what's in the vault?", a: "Your client, you, and only the people your client chooses, each through their own account. Every view and download is recorded." },
      FAQ_TRAINING,
    ],
    related: ["/platform/sharing", "/security", "/platform/plan-summaries"],
    security: true,
  },
  {
    path: "/platform/plan-summaries",
    metaTitle: "Plain-English Plan Summaries | Willow",
    metaDesc: "Willow drafts a plain-English summary of every will, trust, power of attorney and health care proxy. The attorney reviews and approves every word before the client sees it.",
    eyebrow: "Platform · Plan summaries",
    title: "Every plan, explained in plain English.",
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
    related: ["/platform/sharing", "/solutions/trusts", "/solutions/wills"],
  },
  {
    path: "/platform/sharing",
    metaTitle: "Sharing & Release | Willow",
    metaDesc: "Clients share their estate plan with executors, guardians and agents by role. Documents can be shared now, or sealed until a passing is verified by the attorney.",
    eyebrow: "Platform · Sharing & release",
    title: "Everyone prepared. Nothing shared early.",
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
    related: ["/solutions/their-team", "/platform/vault", "/platform/plan-summaries"],
    security: true,
  },
  {
    path: "/platform/check-ins",
    metaTitle: "Check-ins & Updates | Willow",
    metaDesc: "A yearly rhythm of check-ins, short surveys and updates from your firm keeps estate plans current and brings clients back to their attorney when life changes.",
    eyebrow: "Platform · Check-ins & updates",
    title: "Plans stay current. Clients come back to you.",
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
    ],
    faq: [
      { q: "Can I post my own updates?", a: "Yes. Share an article or a note from your firm and it appears on your clients' dashboards." },
      { q: "Can I skip a check-in?", a: "Yes. Every email waits for you to approve or skip it." },
    ],
    related: ["/solutions/practice-growth", "/platform/booking", "/platform/client-dashboard"],
  },
  {
    path: "/platform/booking",
    metaTitle: "Booking Page | Willow for Estate Planning Attorneys",
    metaDesc: "A booking page for estate planning attorneys: video, phone or in-person meetings, availability from your own calendar, and every booking becomes a lead.",
    eyebrow: "Platform · Booking page",
    title: "New clients book time with you directly.",
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
    related: ["/platform/integrations", "/platform/client-dashboard", "/solutions/practice-growth"],
  },
  {
    path: "/platform/integrations",
    metaTitle: "Integrations | Willow",
    metaDesc: "Connect Google Workspace, Microsoft 365 and Zoom to Willow for calendar availability, meeting links and client contact suggestions. Every connection is optional.",
    eyebrow: "Platform · Integrations",
    title: "Works with the tools your practice already runs on.",
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
  {
    path: "/solutions/solo",
    metaTitle: "Willow for Solo Estate Planning Attorneys",
    metaDesc: "Run a modern estate planning practice on your own: one dashboard for every client, plain-English summaries you approve, and a yearly rhythm of staying in touch.",
    eyebrow: "Solutions · Solo practitioners",
    title: "A modern practice, without hiring for it.",
    subtitle: "You're the attorney, the intake team and the follow-up. Willow gives you one dashboard for every client and takes on the explaining, the sharing and the staying in touch.",
    hero: { visual: <RequiredActionsVignette />, print: "/williamsburg.jpg" },
    points: [
      { title: "One place to start the day", body: "Leads, clients and the handful of actions that need you, on one screen." },
      { title: "Less time explaining", body: "Clients read a plain-English summary you approved, so the questions that come back are the ones that matter." },
      { title: "Follow-up that runs itself", body: "Yearly check-ins and updates are drafted for you to approve or skip, client by client." },
    ],
    rows: [
      {
        eyebrow: "Summaries",
        title: "Hours of explanation, approved in minutes.",
        body: "Willow drafts the summary from the signed document and flags anything worth a second look. You review it and approve it.",
        visual: <SummaryReviewVignette />,
        print: "/florida-coast.jpg",
      },
      {
        eyebrow: "Booking",
        title: "New clients find a time on their own.",
        body: "Your booking page offers video, phone and in-person meetings from your real calendar.",
        visual: <BookingVignette />,
        print: "/nyc-street.jpg",
      },
    ],
    faq: [FAQ_PAPER, FAQ_STATES, FAQ_NO_ADVICE],
    related: ["/platform/client-dashboard", "/platform/plan-summaries", "/solutions/practice-growth"],
  },
  {
    path: "/solutions/boutique-firms",
    metaTitle: "Willow for Boutique Estate Planning Firms",
    metaDesc: "Every client experience under your firm's name and branding, a dashboard for each attorney, and a plan that stays with the family for life.",
    eyebrow: "Solutions · Boutique firms",
    title: "Your firm's name on every client's plan.",
    subtitle: "Clients see your logo and your colours on every page and email Willow sends. Each attorney runs their own clients from their own dashboard.",
    hero: { visual: <SharingRecommendationVignette />, print: "/nyc-street.jpg", aspect: "760 / 660" },
    points: [
      { title: "Your brand, throughout", body: "Your logo and colour on the client portal and on every email your clients receive." },
      { title: "A dashboard for each attorney", body: "Each attorney sees their own leads, clients and required actions." },
      { title: "Set up with you", body: "We set up your firm's accounts with you, walk through the platform together, and load your first clients alongside you." },
    ],
    rows: [
      {
        eyebrow: "The client experience",
        title: "A plan the family understands, from your firm.",
        body: "Clients open a plain-English playbook of their plan, share it with the people they've named, and come back to you as life changes.",
        visual: <WhoGetsWhatVignette />,
        print: "self",
      },
    ],
    faq: [
      { q: "Can associates, paralegals and staff sign in?", a: "Inviting associates, paralegals and staff to your firm is coming soon. Today each attorney has their own account under the firm." },
      { q: "How does billing work for a firm?", a: "Firm accounts are set up with a member of our team, who will walk you through the options for your practice." },
      FAQ_PAPER,
    ],
    related: ["/solutions/practice-growth", "/platform", "/security"],
  },
  {
    path: "/solutions/practice-growth",
    metaTitle: "Grow Your Estate Planning Practice | Willow",
    metaDesc: "Willow keeps estate planning attorneys connected to clients, executors and families as life moves forward, so relationships turn into updates, returning clients and a practice worth more.",
    eyebrow: "Solutions · Practice growth",
    title: "Your relationship with a client shouldn't end at the signing.",
    subtitle: "Today the plan goes into a binder and the relationship goes quiet. Willow keeps you connected to the client, their executors and their family as life moves forward.",
    hero: { visual: <CheckInDemoVignette h={560} />, print: "/central-park.jpg" },
    points: [
      { title: "Updates as life moves forward", body: "Yearly check-ins surface the marriages, births, moves and sales that mean a plan needs updating, and route them to you." },
      { title: "The family's attorney", body: "Executors, guardians and agents meet you through the plan. When they need help, you're the attorney they already know." },
      { title: "A practice worth more", body: "Relationships you keep up are relationships that last, and a practice with lasting relationships is worth more when it's time to step back." },
    ],
    statement: { text: "Estate plans shouldn't live in a binder.", by: "Aaron Burlacoff, Founder & CEO" },
    rows: [
      {
        eyebrow: "Staying in touch",
        title: "A yearly rhythm, in your name.",
        body: "Check-ins, surveys and updates from your firm, each one approved by you before it's sent.",
        visual: <StayingInTouchVignette />,
        print: "/santa-monica.jpg",
      },
      {
        eyebrow: "The people in the plan",
        title: "Meet the next generation of clients.",
        body: "Everyone your client names gets their own portal, and can book time with you when they need access.",
        visual: <TeamRosterVignette />,
        print: "self",
      },
    ],
    related: ["/platform/check-ins", "/platform/booking", "/solutions/their-team"],
  },

  /* ─────────────────────── SOLUTIONS: CLIENTS & THEIR TEAM ─────────────────────── */

  /* ───────────────────────────── SOLUTIONS: BY PLAN ───────────────────────────── */
  {
    path: "/solutions/wills",
    metaTitle: "Wills on Willow | Estate Planning Software",
    metaDesc: "Store, explain and share every will: plain-English summaries of each gift approved by the attorney, past versions kept, and release only once a passing is verified.",
    eyebrow: "Solutions · Wills",
    title: "Every will, stored, explained and ready.",
    subtitle: "Upload the signed will and Willow keeps it with every past version, explains each gift in plain English once you approve it, and releases it to the executor when it's time.",
    hero: { visual: <WhoGetsWhatVignette />, print: "self" },
    points: [
      { title: "Each gift, explained", body: "Who receives what, the conditions on it, and how the rest of the estate is divided." },
      { title: "The current version, always", body: "Past wills stay on file with the dates they were in force." },
      { title: "Sealed until it's time", body: "The will opens for the executor once the attorney verifies the passing." },
    ],
    rows: [
      {
        eyebrow: "Release",
        title: "The executor knows it's there. Not what it says.",
        body: "Until the passing is verified, the executor sees that a document is waiting for them, and nothing more.",
        visual: <ReleaseTimingVignette />,
        print: "self",
      },
    ],
    faq: [FAQ_PAPER, { q: "Does Willow hold the original will?", a: "No. Willow stores copies. Keep originals as you do today." }],
    related: ["/solutions/trusts", "/platform/plan-summaries", "/solutions/their-team"],
  },
  {
    path: "/solutions/trusts",
    metaTitle: "Revocable Trusts on Willow | Estate Planning Software",
    metaDesc: "Willow explains revocable and irrevocable trusts in plain English: who manages the trust, what it holds, and when each beneficiary receives their share.",
    eyebrow: "Solutions · Revocable trusts",
    title: "A trust anyone in the family can follow.",
    subtitle: "Who manages the trust, what it holds, and when each beneficiary receives their share, laid out as a schedule your client and their trustee can read.",
    hero: { visual: <TrustVignette />, print: "self" },
    points: [
      { title: "The people", body: "The trustee, who steps in next, and each beneficiary." },
      { title: "The payout", body: "What can be spent along the way, and what's paid out at each age or milestone." },
      { title: "The changes", body: "Amendments and restatements kept on file, with the summary updated once you approve it." },
    ],
    rows: [
      {
        eyebrow: "What goes in",
        title: "What the trust holds, in one view.",
        body: "Real estate, accounts and other assets, alongside how the estate is divided.",
        visual: <AssetBreakdownVignette />,
        print: "/nyc-skyline.jpg",
        aspect: "900 / 650",
      },
    ],
    faq: [{ q: "Which kinds of trusts does Willow summarize?", a: "Revocable and irrevocable trusts, along with their amendments and restatements." }, FAQ_NO_ADVICE],
    related: ["/solutions/wills", "/platform/plan-summaries", "/solutions/their-team"],
  },
  {
    path: "/solutions/powers-of-attorney",
    metaTitle: "Powers of Attorney & Health Care Proxies on Willow",
    metaDesc: "Willow explains each power in a power of attorney or health care proxy in plain English and shares it with the agents named, so they can act when they're needed.",
    eyebrow: "Solutions · Powers of attorney",
    title: "Every power, explained in plain English.",
    subtitle: "Financial powers of attorney and health care proxies, summarized power by power and shared with the agents named, so they know what they can do before they need to.",
    hero: { visual: <StepInVignette />, print: "self" },
    points: [
      { title: "Financial powers", body: "Banking, real property, taxes and more, each explained in a line." },
      { title: "Health care decisions", body: "Who decides, and who's next if they can't." },
      { title: "Ready to use", body: "Shared with the agents now, so they can act when they're needed." },
    ],
    related: ["/solutions/their-team", "/platform/plan-summaries", "/solutions/wills"],
  },
  {
    path: "/solutions/guardianship",
    metaTitle: "Guardianship for Minors on Willow",
    metaDesc: "When a plan names guardians for minor children, Willow helps parents gather per-child guidance, funds and care details and share them with the guardian.",
    eyebrow: "Solutions · Guardianship for minors",
    title: "A guardian who knows the children, not just their names.",
    subtitle: "When a plan names a guardian, Willow helps the parents gather what that person would need, child by child, and share it now or when it's needed.",
    hero: { visual: <CategoriesVignette />, print: "self" },
    points: [
      { title: "Per-child information", body: "Schools, doctors, routines and the people in each child's life." },
      { title: "Guidance and values", body: "What the parents want for the children, in their own words." },
      { title: "Funds and care", body: "What's set aside for each child, and who looks after the pets." },
    ],
    related: ["/solutions/their-team", "/platform/sharing", "/solutions/wills"],
  },
];

export const pageByPath = (path: string) => PAGES.find((p) => p.path === path);
