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

/* Two pages for now, one for each side. The deeper pages stay written in
   src/content/pages.tsx (PARKED_PAGES) for when we build them out. */
export const PLATFORM_COLUMNS: NavColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "For attorneys", desc: "Your practice, from first consultation to the next generation", to: "/platform" },
      { label: "For clients & their team", desc: "A plan the whole family understands, with everyone prepared", to: "/for-clients" },
    ],
  },
];

export const RESOURCE_COLUMNS: NavColumn[] = [
  {
    title: "Learn",
    links: [
      { label: "Legislation by state", desc: "Where electronic wills are law, state by state", to: "/legislation-by-state" },
      { label: "Willow in the news", desc: "Coverage and announcements", to: "/news" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Requesting documents", desc: "After a passing, or to check a will is on file", to: "/request-documents" },
    ],
  },
];

export const COMPANY_COLUMNS: NavColumn[] = [
  {
    title: "Company",
    links: [
      { label: "Where we're live", desc: "The states Willow serves today", to: "/availability" },
      { label: "Careers", desc: "Join our team as a founding member", to: "/careers" },
      { label: "Contact", desc: "Talk to our team", href: `mailto:${SUPPORT_EMAIL}` },
      { label: "Legal center", desc: "Terms, privacy and every policy in one place", to: "/legal" },
      { label: "New York State Bar", desc: "For NYSBA members", to: "/nysba" },
    ],
  },
];

/* Every menu's featured card is the USA Today piece, with its own headline
   and illustration (as on /news) */
const USA_TODAY_FEATURE: NavFeature = {
  eyebrow: "USA Today",
  title: "Digital Estate Planning Arrived Six Years Ago. The Technology Is Finally Catching Up.",
  href: "https://www.usatoday.com/press-release/story/42659/digital-estate-planning-arrived-six-years-ago-the-technology-is-finally-catching-up/",
  image: "/news/usatoday-digital-estate-planning.jpg",
};

export const NAV: NavMenu[] = [
  {
    label: "Platform",
    columns: PLATFORM_COLUMNS,
    feature: USA_TODAY_FEATURE,
  },
  {
    label: "Resources",
    columns: RESOURCE_COLUMNS,
    feature: USA_TODAY_FEATURE,
  },
  {
    label: "Company",
    columns: COMPANY_COLUMNS,
    feature: USA_TODAY_FEATURE,
  },
];

export const FOOTER_COLUMNS: NavColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "For attorneys", to: "/platform" },
      { label: "For clients & their team", to: "/for-clients" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Legislation by state", to: "/legislation-by-state" },
      { label: "Willow in the news", to: "/news" },
      { label: "Requesting documents", to: "/request-documents" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Where we're live", to: "/availability" },
      { label: "Careers", to: "/careers" },
      { label: "New York State Bar", to: "/nysba" },
      { label: "Contact", href: `mailto:${SUPPORT_EMAIL}` },
      { label: "Legal center", to: "/legal" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
  },
];
