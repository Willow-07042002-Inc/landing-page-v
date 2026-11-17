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

export type NavColumn = { title: string; to?: string; links: NavLink[] }; // `to`: the heading links to its overview

export type NavFeature = {
  eyebrow: string;
  title: string;
  body?: string;
  to?: string; // internal route
  href?: string; // external article, opens in a new tab
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

/* One Platform menu, two sides, named like the homepage's two cards: each
   heading goes to the same overview page its card does. */
export const PLATFORM_COLUMNS: NavColumn[] = [
  {
    title: "For attorneys",
    to: "/platform",
    links: [
      { label: "Overview", desc: "Your practice in one place", to: "/platform" },
      { label: "Dashboard & clients", desc: "Leads, clients and every action waiting on you", to: "/platform/client-dashboard" },
      { label: "Plan summaries", desc: "Every plan in plain English, approved by you", to: "/platform/plan-summaries" },
      { label: "Check-ins & updates", desc: "A yearly rhythm that brings clients back to you", to: "/platform/check-ins" },
      { label: "Booking page", desc: "New clients book video, phone or in-person time", to: "/platform/booking" },
      { label: "Integrations", desc: "Connect Google Workspace, Microsoft 365 and Zoom", to: "/platform/integrations" },
    ],
  },
  {
    title: "For clients & their team",
    to: "/for-clients",
    links: [
      { label: "Overview", desc: "A plan the whole family understands", to: "/for-clients" },
      { label: "Sharing & release", desc: "Share now, or seal until a passing is verified", to: "/platform/sharing" },
      { label: "Their team", desc: "Executors, trustees, guardians and agents, each with their own portal", to: "/solutions/their-team" },
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
    /* The USA Today piece, with its own headline and illustration (as on /news) */
    feature: {
      eyebrow: "USA Today",
      title: "Digital Estate Planning Arrived Six Years Ago. The Technology Is Finally Catching Up.",
      href: "https://www.usatoday.com/press-release/story/42659/digital-estate-planning-arrived-six-years-ago-the-technology-is-finally-catching-up/",
      image: "/news/usatoday-digital-estate-planning.jpg",
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
    title: "For attorneys",
    links: [
      { label: "Overview", to: "/platform" },
      { label: "Dashboard & clients", to: "/platform/client-dashboard" },
      { label: "Plan summaries", to: "/platform/plan-summaries" },
      { label: "Check-ins & updates", to: "/platform/check-ins" },
      { label: "Booking page", to: "/platform/booking" },
      { label: "Integrations", to: "/platform/integrations" },
    ],
  },
  {
    title: "For clients & their team",
    links: [
      { label: "Overview", to: "/for-clients" },
      { label: "Sharing & release", to: "/platform/sharing" },
      { label: "Their team", to: "/solutions/their-team" },
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
