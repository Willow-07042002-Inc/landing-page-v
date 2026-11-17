/* The site's information architecture: one source for the header menus, the
   mobile menu and the footer. Every link here is a real page on this site (or
   a real portal), and every description says only what the product does. */

export type NavLink = {
  label: string;
  desc?: string;
  to?: string; // internal route
  href?: string; // external URL
  badge?: string; // e.g. "Coming"
};

export type NavColumn = { title: string; links: NavLink[] };

export type NavFeature = {
  eyebrow: string;
  title: string;
  body: string;
  to: string;
  image: string;
};

export type NavMenu = {
  label: string;
  to?: string; // a plain link instead of a dropdown
  columns?: NavColumn[];
  feature?: NavFeature;
};

export const ATTORNEY_LOGIN = "https://professionals.willow-inc.com/auth/login";
export const CLIENT_LOGIN = "https://clients.willow-inc.com/auth/login";
export const DEMO_PATH = "/request-access";
export const SUPPORT_EMAIL = "support@willow-inc.com";

export const PLATFORM_COLUMNS: NavColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Overview", desc: "One place from first meeting to signed plan", to: "/platform" },
      { label: "Client dashboard", desc: "Leads, clients and every action waiting on you", to: "/platform/client-dashboard" },
      { label: "Signing ceremony", desc: "Launching state by state, as the law allows", to: "/platform/signing", badge: "Coming" },
      { label: "Vault", desc: "Every document, every version, and who opened it", to: "/platform/vault" },
    ],
  },
  {
    title: "Client experience",
    links: [
      { label: "Plan summaries", desc: "Every gift and condition in plain English, approved by you", to: "/platform/plan-summaries" },
      { label: "Sharing & release", desc: "Share now, or seal until a passing is verified", to: "/platform/sharing" },
      { label: "Check-ins & updates", desc: "A yearly rhythm that brings clients back to you", to: "/platform/check-ins" },
      { label: "Booking page", desc: "New clients book video, phone or in-person time", to: "/platform/booking" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Integrations", desc: "Google Workspace, Microsoft 365 and Zoom", to: "/platform/integrations" },
      { label: "Security", desc: "How client information is protected", to: "/security" },
    ],
  },
];

export const SOLUTION_COLUMNS: NavColumn[] = [
  {
    title: "For attorneys",
    links: [
      { label: "Solo practitioners", desc: "Run every matter from one dashboard", to: "/solutions/solo" },
      { label: "Boutique firms", desc: "Every client, under your firm's name and branding", to: "/solutions/boutique-firms" },
      { label: "Practice growth", desc: "Relationships that last past the signing", to: "/solutions/practice-growth" },
    ],
  },
  {
    title: "For clients & their team",
    links: [
      { label: "Clients & families", desc: "A plan everyone understands", to: "/for-clients" },
      { label: "Their team", desc: "Executors, trustees, guardians and agents, each with their own portal", to: "/solutions/their-team" },
    ],
  },
  {
    title: "By plan",
    links: [
      { label: "Wills", desc: "Signed, stored and explained", to: "/solutions/wills" },
      { label: "Revocable trusts", desc: "Payout schedules anyone can follow", to: "/solutions/trusts" },
      { label: "Powers of attorney", desc: "Every power, explained in plain English", to: "/solutions/powers-of-attorney" },
      { label: "Guardianship for minors", desc: "Per-child guidance and funds", to: "/solutions/guardianship" },
    ],
  },
];

export const RESOURCE_COLUMNS: NavColumn[] = [
  {
    title: "Learn",
    links: [
      { label: "Legislation by state", desc: "Electronic wills and remote signing law, state by state", to: "/legislation-by-state" },
      { label: "Where we're live", desc: "The states Willow serves today", to: "/availability" },
      { label: "Willow in the news", desc: "Coverage and announcements", to: "/news" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Zoom guide", desc: "Meeting links for consultations", to: "/zoom" },
      { label: "Requesting documents", desc: "After a passing, or to check a will is on file", to: "/request-documents" },
      { label: "New York State Bar", desc: "For NYSBA members", to: "/nysba" },
    ],
  },
];

export const COMPANY_COLUMNS: NavColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Willow", desc: "Why Willow exists, and the team behind our mission", to: "/about" },
      { label: "Careers", desc: "Join our team as a founding member", to: "/careers" },
      { label: "Contact", desc: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
      { label: "Legal center", desc: "Terms, privacy and every policy in one place", to: "/legal" },
    ],
  },
];

export const NAV: NavMenu[] = [
  {
    label: "Platform",
    columns: PLATFORM_COLUMNS,
    feature: {
      eyebrow: "Plan summaries",
      title: "Every plan, explained in plain English.",
      body: "Willow drafts the summary. You review and approve every word.",
      to: "/platform/plan-summaries",
      image: "/florida-coast.jpg",
    },
  },
  {
    label: "Solutions",
    columns: SOLUTION_COLUMNS,
    feature: {
      eyebrow: "For the people in the plan",
      title: "Everyone prepared. Nothing shared early.",
      body: "Executors, guardians and agents each get their own portal.",
      to: "/solutions/their-team",
      image: "/hudson-bridge.jpg",
    },
  },
  { label: "Security", to: "/security" },
  {
    label: "Resources",
    columns: RESOURCE_COLUMNS,
    feature: {
      eyebrow: "Legislation by state",
      title: "Where electronic wills stand, in every state.",
      body: "Updated as the law changes.",
      to: "/legislation-by-state",
      image: "/nyc-skyline.jpg",
    },
  },
  {
    label: "Company",
    columns: COMPANY_COLUMNS,
    feature: {
      eyebrow: "A note from our founder",
      title: "A plan shouldn't disappear into a drawer the day it's signed.",
      body: "Why we're building Willow alongside estate attorneys.",
      to: "/about",
      image: "/willow-street.jpg",
    },
  },
];

export const FOOTER_COLUMNS: NavColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Overview", to: "/platform" },
      { label: "Client dashboard", to: "/platform/client-dashboard" },
      { label: "Signing ceremony", to: "/platform/signing" },
      { label: "Vault", to: "/platform/vault" },
      { label: "Plan summaries", to: "/platform/plan-summaries" },
      { label: "Sharing & release", to: "/platform/sharing" },
      { label: "Check-ins & updates", to: "/platform/check-ins" },
      { label: "Booking page", to: "/platform/booking" },
      { label: "Integrations", to: "/platform/integrations" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Solo practitioners", to: "/solutions/solo" },
      { label: "Boutique firms", to: "/solutions/boutique-firms" },
      { label: "Practice growth", to: "/solutions/practice-growth" },
      { label: "Clients & families", to: "/for-clients" },
      { label: "Their team", to: "/solutions/their-team" },
      { label: "Wills", to: "/solutions/wills" },
      { label: "Revocable trusts", to: "/solutions/trusts" },
      { label: "Powers of attorney", to: "/solutions/powers-of-attorney" },
      { label: "Guardianship", to: "/solutions/guardianship" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Legislation by state", to: "/legislation-by-state" },
      { label: "Where we're live", to: "/availability" },
      { label: "Willow in the news", to: "/news" },
      { label: "Zoom guide", to: "/zoom" },
      { label: "Requesting documents", to: "/request-documents" },
      { label: "New York State Bar", to: "/nysba" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Security", to: "/security" },
      { label: "Contact", href: `mailto:${SUPPORT_EMAIL}` },
      { label: "Legal center", to: "/legal" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
  },
];
