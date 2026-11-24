import React from "react";

/* =============================================================================
   The CLIENT app (apps/clients), recreated screen by screen: what a client and
   the people they name see. Copied from willow-platform origin/main (Nov 17
   2026). Each screen names the product files it was copied from.

   The client app differs from the attorney app:
   - Inter, not Figtree, is the body font (app/layout.tsx + globals.css:
     --font-sans: var(--font-inter)); Merriweather only where the product
     sets it (the "Your Plan's Playbook" hero).
   - Page background #FAFBFC (dashboard/page.tsx), text #1F2933 (tokens.css).
   - It is on Tailwind v4, so its gray-* classes are v4's greys (gray-200
     #E5E7EB, gray-500 #6A7282, gray-700 #364153, gray-900 #101828) and its
     shadow-sm is v3's "shadow"; they are written out as hex/inline below so
     the marketing site's Tailwind v3 doesn't swap them for v3's values.
   ============================================================================= */

/* Tailwind v4 greys, as the client app's gray-* classes render */
export const CA_GRAY = {
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DC",
  400: "#99A1AF",
  500: "#6A7282",
  600: "#4A5565",
  700: "#364153",
  800: "#1E2939",
  900: "#101828",
} as const;
/* Tailwind v4 shadow-sm / shadow-md / shadow-lg */
export const CA_SHADOW_SM = "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)";
export const CA_SHADOW_MD = "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
export const CA_SHADOW_LG = "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";

/* packages/ui/icons/willow-solid: each icon a 24x24 svg, fill=currentColor */
export const mkIcon = (art: React.ReactNode) => {
  const Icon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} style={style}>
      {art}
    </svg>
  );
  return Icon;
};
const CaChevronDownIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M11.15 15.85 11.4 16.04 11.54 16.11 11.69 16.16 12 16.2 12.31 16.16 12.46 16.11 12.6 16.04 12.85 15.85 18.95 9.73 19.04 9.6 19.16 9.31 19.2 9 19.16 8.69 19.11 8.54 19.04 8.4 18.85 8.15 18.6 7.96 18.31 7.84 18.16 7.81 17.84 7.81 17.69 7.84 17.4 7.96 17.27 8.05 12 13.3 6.73 8.05 6.46 7.89 6.31 7.84 6.16 7.81 5.84 7.81 5.54 7.89 5.27 8.05 5.15 8.15 4.96 8.4 4.84 8.69 4.81 8.84 4.81 9.16 4.84 9.31 4.89 9.46 5.05 9.73Z"/>);
const CaChevronLeftIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M8.15 11.15 7.96 11.4 7.89 11.54 7.84 11.69 7.8 12 7.84 12.31 7.89 12.46 7.96 12.6 8.15 12.85 14.27 18.95 14.4 19.04 14.69 19.16 15 19.2 15.31 19.16 15.46 19.11 15.6 19.04 15.85 18.85 16.04 18.6 16.11 18.46 16.19 18.16 16.19 17.84 16.16 17.69 16.04 17.4 15.95 17.27 10.7 12 15.95 6.73 16.11 6.46 16.16 6.31 16.19 6.16 16.19 5.84 16.11 5.54 15.95 5.27 15.85 5.15 15.6 4.96 15.31 4.84 15.16 4.81 14.84 4.81 14.69 4.84 14.54 4.89 14.27 5.05Z"/>);

/* The demo people */
export const DANIEL = { name: "Daniel Rosen", email: "daniel.rosen@gmail.com", first: "Daniel" };
export const MARIA = { name: "Maria Rosen", email: "maria.rosen@gmail.com", first: "Maria" };

/* components/dashboard/Header.tsx + Navigation.tsx (desktop, lg+): the tabs on
   the left ("My Estate Plan", then "Shared" with its Your Plan / Shared with You
   dropdown chevron), the Willow logo centred, the client's name and email on
   the right. Fixed to the top in the product; here it sits at the canvas top. */
const caTabClass = (active: boolean) =>
  `px-4 py-2 text-base transition-colors ${active ? "text-[#128F8B] font-medium underline decoration-2 underline-offset-4" : "text-[#364153] hover:text-[#101828] hover:bg-[#F9FAFB] font-medium"}`;

export const ClientHeader = ({
  active,
  person = DANIEL,
  back = false,
}: {
  active: "estate-plan" | "shared" | "account";
  person?: { name: string; email: string };
  /** A page with somewhere to go back to (lib/header-back.tsx: an opened
      plan in "Shared with You") puts a back chevron left of the tabs. */
  back?: boolean;
}) => (
  <header id="dashboard-navbar" className="absolute left-0 right-0 top-0 z-40 w-full border-b border-[#E5E7EB] bg-white" style={{ boxShadow: CA_SHADOW_SM }}>
    <div className="relative mx-auto flex w-full max-w-[1300px] items-center justify-between px-6 py-3">
      {/* Left: nav tabs */}
      <div className="z-10 flex items-center gap-3">
        {back && (
          <span aria-label="Back" className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[#364153] transition-colors hover:bg-[#F9FAFB] hover:text-[#101828]">
            <CaChevronLeftIcon className="h-6 w-6" />
          </span>
        )}
        <div className="bg-white">
          <div className="flex items-center space-x-1">
            <span className={caTabClass(active === "estate-plan")}>My Estate Plan</span>
            <div className="relative">
              <span className={`flex items-center gap-1 ${caTabClass(active === "shared")}`}>
                Shared
                <CaChevronDownIcon className="h-4 w-4 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Centre: logo (next/image 100x50; preflight's height:auto keeps the png's 16:9) */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <img src="/logo.png" alt="Willow" width={100} height={50} style={{ height: "auto", maxWidth: "100%" }} />
      </div>
      {/* Right: the user button (opens Profile Settings / Log Out) */}
      <div className="relative z-10">
        <span className="flex flex-col items-end rounded-lg px-3 py-2 transition-colors hover:bg-[#F9FAFB]">
          <span className="text-sm font-semibold text-[#101828]">{person.name}</span>
          <span className="text-xs text-[#6A7282]">{person.email}</span>
        </span>
      </div>
    </div>
  </header>
);

/* app/dashboard/page.tsx: min-h-screen bg-[#FAFBFC], the fixed header, then
   <main style={{ paddingTop: '75px' }}>. `height` is the canvas height. */
export const ClientFrame = ({
  active,
  person,
  back,
  height,
  children,
  overlay,
}: {
  active: "estate-plan" | "shared" | "account";
  person?: { name: string; email: string };
  back?: boolean;
  height: number;
  children: React.ReactNode;
  /** Anything the page floats over the content (fixed cards, modals) */
  overlay?: React.ReactNode;
}) => (
  <div className="relative w-full overflow-hidden bg-[#FAFBFC] text-left text-[#1F2933]" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", height }}>
    <ClientHeader active={active} person={person} back={back} />
    <main style={{ paddingTop: 75 }}>{children}</main>
    {overlay}
  </div>
);

/* =============================================================================
   MY ESTATE PLAN tab
   ============================================================================= */

const CaBuildingIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M16.64 9.25 16.3 9.39 16.01 9.61 15.89 9.75 15.71 10.06 15.61 10.42 15.6 20.1 15.65 20.46 15.79 20.8 16.01 21.09 16.3 21.31 16.64 21.45 17 21.5 19.4 21.5 19.76 21.45 20.1 21.31 20.39 21.09 20.61 20.8 20.69 20.64 20.79 20.28 20.8 10.6 20.75 10.24 20.61 9.9 20.39 9.61 20.1 9.39 19.76 9.25 19.4 9.2 17 9.2ZM18.93 15.82 19.05 15.87 19.15 15.95 19.23 16.05 19.3 16.23 19.3 17.5 19.26 17.69 19.2 17.8 19.05 17.93 18.93 17.98 18.8 18 17.53 18 17.41 17.96 17.3 17.9 17.17 17.75 17.12 17.63 17.1 17.5 17.1 16.23 17.14 16.11 17.2 16 17.35 15.87 17.53 15.8 18.8 15.8ZM18.99 12.04 19.1 12.1 19.2 12.2 19.26 12.31 19.3 12.43 19.3 13.7 19.26 13.89 19.2 14 19.1 14.1 18.99 14.16 18.8 14.2 17.53 14.2 17.41 14.16 17.3 14.1 17.17 13.95 17.12 13.83 17.1 13.7 17.1 12.43 17.14 12.31 17.2 12.2 17.35 12.07 17.53 12 18.8 12ZM3.77 3.3 3.64 3.5 3.54 3.71 3.46 3.93 3.42 4.17 3.4 4.4 3.4 19.7 3.42 19.93 3.46 20.17 3.54 20.39 3.64 20.6 3.77 20.8 3.93 20.97 4.1 21.13 4.3 21.26 4.51 21.36 4.73 21.44 4.97 21.48 5.2 21.5 7.81 21.5 7.8 17.6 7.82 17.44 7.88 17.3 7.98 17.18 8.1 17.08 8.32 17.01 10.08 17.01 10.3 17.08 10.42 17.18 10.52 17.3 10.59 17.52 10.59 21.5 12.83 21.48 13.07 21.44 13.29 21.36 13.5 21.26 13.7 21.13 13.87 20.97 14.03 20.8 14.16 20.6 14.26 20.39 14.34 20.17 14.38 19.93 14.4 19.7 14.4 4.4 14.38 4.17 14.34 3.93 14.26 3.71 14.16 3.5 14.03 3.3 13.87 3.13 13.7 2.97 13.5 2.84 13.29 2.74 13.07 2.66 12.83 2.62 12.6 2.6 4.97 2.62 4.73 2.66 4.51 2.74 4.3 2.84 4.1 2.97 3.93 3.13ZM11.59 13.24 11.7 13.3 11.8 13.4 11.86 13.51 11.9 13.63 11.9 14.9 11.88 15.03 11.8 15.2 11.7 15.3 11.59 15.36 11.4 15.4 10.13 15.4 10.01 15.36 9.9 15.3 9.8 15.2 9.74 15.09 9.7 14.9 9.7 13.63 9.74 13.51 9.8 13.4 9.95 13.27 10.13 13.2 11.4 13.2ZM11.7 9.5 11.8 9.6 11.86 9.71 11.9 9.9 11.9 11.17 11.86 11.29 11.75 11.45 11.59 11.56 11.4 11.6 10.13 11.6 10.01 11.56 9.85 11.45 9.74 11.29 9.7 11.1 9.7 9.83 9.74 9.71 9.85 9.55 10.01 9.44 10.2 9.4 11.47 9.4 11.59 9.44ZM11.8 5.8 11.86 5.91 11.9 6.03 11.9 7.3 11.86 7.49 11.75 7.65 11.59 7.76 11.4 7.8 10.13 7.8 9.95 7.73 9.85 7.65 9.74 7.49 9.7 7.3 9.7 6.03 9.74 5.91 9.85 5.75 9.95 5.67 10.13 5.6 11.4 5.6 11.53 5.62 11.65 5.67ZM7.85 13.27 7.95 13.35 8.03 13.45 8.08 13.57 8.1 13.7 8.1 14.97 8.06 15.09 7.95 15.25 7.79 15.36 7.6 15.4 6.33 15.4 6.21 15.36 6.05 15.25 5.94 15.09 5.9 14.9 5.9 13.63 5.97 13.45 6.05 13.35 6.21 13.24 6.4 13.2 7.6 13.2 7.73 13.22ZM7.95 9.55 8.06 9.71 8.1 9.9 8.1 11.17 8.06 11.29 7.95 11.45 7.79 11.56 7.6 11.6 6.33 11.6 6.21 11.56 6.05 11.45 5.94 11.29 5.9 11.1 5.9 9.83 5.97 9.65 6.05 9.55 6.21 9.44 6.4 9.4 7.67 9.4 7.79 9.44ZM8.03 5.85 8.08 5.97 8.1 6.1 8.1 7.3 8.06 7.49 7.95 7.65 7.79 7.76 7.6 7.8 6.33 7.8 6.15 7.73 6.05 7.65 5.94 7.49 5.9 7.3 5.9 6.03 5.97 5.85 6.05 5.75 6.15 5.67 6.33 5.6 7.6 5.6 7.73 5.62 7.85 5.67 7.95 5.75Z"/>);

/* scenario-blocks.tsx UpperLabel / P / Hr / SubBlock-free pieces the cards use */
const CaUpperLabel = ({ children, className = "mb-2" }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-[#9CA3AF] ${className}`} style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
    {children}
  </div>
);
const CaP = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[#4B5563]" style={{ fontSize: "14px", lineHeight: 1.6 }}>
    {children}
  </p>
);
const CaHr = () => <div className="my-7 border-t border-[#E5E7EB]" />;

/* scenario-will-summary.tsx CardShell: a 56px icon, the title and subtitle,
   the chevron (turned up while open), and the body under px-8 pb-8 */
const CaCardShell = ({
  iconSrc,
  iconNode,
  title,
  subtitle,
  open = false,
  compact = false,
  children,
}: {
  iconSrc?: string;
  iconNode?: React.ReactNode;
  title: string;
  subtitle: string;
  open?: boolean;
  /** Below sm the cards pad 24px (p-6 sm:p-8) */
  compact?: boolean;
  children?: React.ReactNode;
}) => (
  <div className="bg-white">
    <div className="flex items-center transition-colors hover:bg-[#F4F5F6]">
      <span className={`flex flex-1 items-center gap-4 text-left ${compact ? "p-6" : "p-8"}`}>
        {iconSrc ? (
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
            <img src={iconSrc} alt="" width={56} height={56} className="object-contain" style={{ height: "auto", maxWidth: "100%" }} />
          </span>
        ) : iconNode ? (
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center">{iconNode}</span>
        ) : null}
        <span className="block min-w-0 flex-1">
          <span className="mb-0.5 block text-[#1F2933]" style={{ fontSize: "16px", fontWeight: 600 }}>{title}</span>
          <span className="block text-[#9CA3AF]" style={{ fontSize: "14px" }}>{subtitle}</span>
        </span>
        <CaChevronDownIcon className={`h-5 w-5 flex-shrink-0 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`} />
      </span>
    </div>
    {open && children && <div className={compact ? "px-6 pb-6" : "px-8 pb-8"}>{children}</div>}
  </div>
);

/* scenario-blocks.tsx MemberCell (read view): the name, then each meta line */
const CaMemberCell = ({ name, meta }: { name: string; meta: string }) => (
  <div>
    <div className="text-[#1F2933]" style={{ fontSize: "16px", fontWeight: 500 }}>{name}</div>
    {meta.split("\n").map((line, i) => (
      <div key={i} className="mt-0.5 text-[#6B7280]" style={{ fontSize: "14px" }}>{line}</div>
    ))}
  </div>
);

/* "From your firm" (FromYourFirm.tsx -> FromYourFirmCard): no firm logo on
   file, so the teal building; the subtitle is firm-panel.tsx
   firmPanelSubtitle() with the yearly check-in waiting in To-do. Closed at rest. */
const CaFirmCard = ({ open = false }: { open?: boolean }) => (
  <CaCardShell
    iconNode={<CaBuildingIcon className="h-11 w-11 text-[#3AB2AB]" />}
    title="From your firm"
    subtitle="Your attorney · 1 thing to do"
    open={open}
  >
    {open && (
      /* firm-panel.tsx FirmPanelView: three tabs (trust-design.tsx TrustTabs),
         opening on Recommended actions while the check-in waits there. With
         the check-in conversation open, its inline card (LifeChangesCard)
         renders nothing and there is no other action, so the tab is empty. */
      <div data-testid="firm-panel">
        <div role="tablist" className="mb-5 inline-flex flex-wrap items-center gap-5 border-b border-[#E5E7EB] pb-2.5">
          <span className="text-[#6B7280] transition-colors hover:text-[#1F2933]" style={{ fontSize: "13.5px", fontWeight: 500 }}>Your team</span>
          <span className="text-[#128F8B] transition-colors" style={{ fontSize: "13.5px", fontWeight: 600 }}>Recommended actions</span>
          <span className="text-[#6B7280] transition-colors hover:text-[#1F2933]" style={{ fontSize: "13.5px", fontWeight: 500 }}>Resources</span>
        </div>
        <div role="tabpanel" aria-label="Recommended actions">
          <div className="-mx-5 -mt-2 mb-2" />
        </div>
      </div>
    )}
  </CaCardShell>
);

/* The summary's card stack (scenario-will-summary.tsx): grey-100 behind the
   cards so the 6px gaps read as seams, the outer corners rounded */
const CA_STACK_SHADOW = "0 2px 8px rgba(0,0,0,0.04)";

/* "You & Your Family" body as Daniel's will reads (extracted-will-adapter.ts
   familyMembers): his state, "Your spouse", "Your child". No extended or past
   family, so no segment tabs. */
const CaFamilyBody = () => (
  <>
    <CaUpperLabel>A Bit About You</CaUpperLabel>
    <CaMemberCell name="Daniel Rosen" meta="New York" />
    <CaHr />
    <CaUpperLabel>Your Spouse &amp; Children</CaUpperLabel>
    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
      <CaMemberCell name="Maria Rosen" meta="Your spouse" />
      <CaMemberCell name="Emma Rosen" meta="Your child" />
      <CaMemberCell name="Leo Rosen" meta="Your child" />
    </div>
  </>
);

/* The page under the header: the hero, then the card stack. `firmOpen`: the
   check-in conversation was opened from "From your firm", so that card is
   open behind it (CheckInScreen). */
const CaEstatePlanPage = ({ firmOpen = false }: { firmOpen?: boolean }) => (
  <>
    {/* Hero */}
    <div className="border-b border-[#F3F4F6] bg-white px-6 pb-10 pt-12 text-center">
      <div className="mx-auto max-w-[700px]">
        <div className="mb-3 text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: 42, fontWeight: 600, lineHeight: 1.5 }}>
          Your Plan&apos;s Playbook
        </div>
        <p className="mx-auto max-w-[540px] text-[#6B7280]" style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 17, lineHeight: "1.6" }}>
          We&apos;ve made it simple for you<br /> to understand everything.
        </p>
      </div>
    </div>

    {/* The plan: one column of cards */}
    <div className="mx-auto max-w-[900px] px-4 pb-16 pt-6">
      <div className="space-y-1.5 rounded-2xl bg-[#F3F4F6]" style={{ boxShadow: CA_STACK_SHADOW }}>
        <div className="overflow-hidden rounded-t-2xl">
          <CaFirmCard open={firmOpen} />
        </div>
        <CaCardShell iconSrc="/mock/family-icon.png" title="You & Your Family" subtitle="The people at the center of your plan" open>
          <CaFamilyBody />
        </CaCardShell>
        {/* open at rest too; its body (the trust) is below every canvas here */}
        <CaCardShell iconSrc="/mock/map-icon.png" title="Your Plan Right Now" subtitle="What's already in place while you're alive" open />
      </div>
    </div>
  </>
);

/* ---- ClientEstatePlanTodayScreen ----------------------------------------
   Daniel's My Estate Plan tab as it renders today, at rest (1440 x 855).
   Copied from apps/clients/app/dashboard/page.tsx (an approved plan with a
   Plan and an attorney renders ScenarioWillSummary with firmCard =
   FromYourFirm), packages/ui/components/scenario-will-summary.tsx (hero,
   card stack, CardShell, FromYourFirmCard, the family body),
   scenario-blocks.tsx (UpperLabel, Hr, MemberCell), firm-panel.tsx
   (firmPanelSubtitle) and apps/clients/components/dashboard/Header.tsx +
   Navigation.tsx.
   What changed since the website's older shot (client-estate-plan.tsx):
   "From your firm" now heads the stack; "You & Your Family" opens by default
   (so do "Your Plan Right Now" and "What You'll Leave Behind", below the
   fold here); the hero's line breaks after "for you"; the font is Inter; the
   stack's cards pad 32px; and there is no floating "Ask Eva" pill (the
   check-in sits in "From your firm" instead). */
export const ClientEstatePlanTodayScreen = () => (
  <ClientFrame active="estate-plan" height={855}>
    <CaEstatePlanPage />
  </ClientFrame>
);

/* ---- A firm's post on the client's dashboard ------------------------------
   Settings > Dashboard content posts a link to every active client's "From
   your firm" card (posts.ts postToDashboards). Open, the card shows its three
   tabs on Resources (firm-panel.tsx 362-366), where posts list newest first
   (FirmNewsList, firm-panel.tsx 59-97): the newspaper eyebrow and date, the
   headline, the blurb, "Read the article". With nothing to do, the card's
   line reads "Your attorney, actions and firm news" (firmPanelSubtitle).
   `fresh` comes in at the top when `freshOn`. `compact`: a phone-width page,
   where the cards pad 24px and the header keeps only the logo. */
export type CaArticle = { date: string; title: string; body: string };

const CaNewspaperIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6Z" />
  </svg>
);
const CaArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

const CaArticleItem = ({ a }: { a: CaArticle }) => (
  <>
    <div className="mb-1.5 flex items-center gap-1.5 text-[#9CA3AF]" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      <CaNewspaperIcon className="h-3.5 w-3.5 text-[#3AB2AB]" />
      Article · {a.date}
    </div>
    <h3 className="text-[#1F2933]" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{a.title}</h3>
    <p className="mt-1 text-[#4B5563]" style={{ fontSize: 14, lineHeight: 1.6 }}>{a.body}</p>
    <span className="mt-3 inline-flex items-center gap-1 text-[#128F8B]" style={{ fontSize: 14, fontWeight: 600 }}>
      Read the article
      <CaArrowUpRightIcon className="h-4 w-4" />
    </span>
  </>
);

export const ClientFirmNewsScreen = ({
  person = DANIEL,
  open,
  articles,
  fresh,
  freshOn,
  height,
  compact = false,
  firmStyle,
}: {
  person?: { name: string; email: string };
  open: boolean;
  articles: CaArticle[];
  fresh?: CaArticle;
  freshOn?: boolean;
  height: number;
  compact?: boolean;
  /** On the "From your firm" card, e.g. a press */
  firmStyle?: React.CSSProperties;
}) => {
  const page = (
    <>
      <div className={`border-b border-[#F3F4F6] bg-white text-center ${compact ? "px-5 pb-7 pt-8" : "px-6 pb-10 pt-12"}`}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: compact ? 28 : 42, fontWeight: 600, lineHeight: 1.5 }}>
            Your Plan&apos;s Playbook
          </div>
          <p className="mx-auto max-w-[540px] text-[#6B7280]" style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: compact ? 15 : 17, lineHeight: "1.6" }}>
            We&apos;ve made it simple for you<br /> to understand everything.
          </p>
        </div>
      </div>
      <div className={`mx-auto max-w-[900px] pb-16 ${compact ? "px-3 pt-4" : "px-4 pt-6"}`}>
        <div className="space-y-1.5 rounded-2xl bg-[#F3F4F6]" style={{ boxShadow: CA_STACK_SHADOW }}>
          <div className="overflow-hidden rounded-t-2xl" style={firmStyle}>
            <CaCardShell
              iconNode={<CaBuildingIcon className="h-11 w-11 text-[#3AB2AB]" />}
              title="From your firm"
              subtitle="Your attorney, actions and firm news"
              open={open}
              compact={compact}
            >
              <div data-testid="firm-panel">
                <div role="tablist" className="mb-5 inline-flex flex-wrap items-center gap-5 border-b border-[#E5E7EB] pb-2.5">
                  <span className="text-[#6B7280]" style={{ fontSize: "13.5px", fontWeight: 500 }}>Your team</span>
                  <span className="text-[#6B7280]" style={{ fontSize: "13.5px", fontWeight: 500 }}>Recommended actions</span>
                  <span className="text-[#128F8B]" style={{ fontSize: "13.5px", fontWeight: 600 }}>Resources</span>
                </div>
                {fresh && (
                  <div style={{ display: "grid", gridTemplateRows: freshOn ? "1fr" : "0fr", opacity: freshOn ? 1 : 0, transition: "grid-template-rows 520ms cubic-bezier(0.77, 0, 0.175, 1), opacity 360ms ease 160ms" }}>
                    <div className="min-h-0 overflow-hidden">
                      <div data-fresh className="mb-5 border-b border-[#F0F1F3] pb-5">
                        <CaArticleItem a={fresh} />
                      </div>
                    </div>
                  </div>
                )}
                <ul>
                  {articles.map((a) => (
                    <li key={a.title} className="border-b border-[#F0F1F3] py-5 first:pt-0 last:border-0 last:pb-0">
                      <CaArticleItem a={a} />
                    </li>
                  ))}
                </ul>
              </div>
            </CaCardShell>
          </div>
          <CaCardShell iconSrc="/mock/family-icon.png" title="You & Your Family" subtitle="The people at the center of your plan" compact={compact} />
          <CaCardShell iconSrc="/mock/map-icon.png" title="Your Plan Right Now" subtitle="What's already in place while you're alive" compact={compact} />
        </div>
      </div>
    </>
  );
  if (!compact) {
    return (
      <ClientFrame active="estate-plan" person={person} height={height}>
        {page}
      </ClientFrame>
    );
  }
  return (
    <div className="relative w-full overflow-hidden bg-[#FAFBFC] text-left text-[#1F2933]" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", height }}>
      <header className="flex h-14 items-center justify-center border-b border-[#E5E7EB] bg-white" style={{ boxShadow: CA_SHADOW_SM }}>
        <img src="/logo.png" alt="Willow" width={84} height={42} style={{ height: "auto", maxWidth: "100%" }} />
      </header>
      {page}
    </div>
  );
};

/* ---- If You Need Someone to Step In (open) -------------------------------
   The card is rebuilt live from the plan's POA documents
   (plan-summary.ts planIncapacity -> scenario-incapacity.ts
   buildIncapacityFromPlan, which the portal calls with no trust inputs, so
   no trust rows): the note, then one succession chain per office
   (scenario-blocks.tsx RoleChainView), then the powers each agent holds and
   the stated terms (AgentPowersView), tabbed per document.
   Data: Daniel's durable general POA and Medical Proxy name Maria, with Emma
   as the backup. The powers, their meanings and the terms are a real New York
   statutory short form read by the product's extraction
   (scripts/will-extraction-lab/poa/out/reads-r1/poa-001.financial.r1.json),
   names swapped; the sentences are the builder's own templates. */
const CA_POA_POWERS: { power: string; desc: string }[] = [
  { power: "Real estate transactions", desc: "Buy, sell, mortgage, lease and manage real property." },
  { power: "Chattel and goods transactions", desc: "Buy, sell and manage personal property and goods." },
  { power: "Bond, share and commodity transactions", desc: "Buy, sell and manage stocks, bonds and commodities." },
  { power: "Banking transactions", desc: "Open, use and close bank accounts and conduct banking business." },
  { power: "Business operating transactions", desc: "Operate, manage or sell the principal's business interests." },
  { power: "Insurance transactions", desc: "Buy, manage, borrow against and cancel insurance policies and annuities." },
  { power: "Estate transactions", desc: "Act for the principal in estates and trusts in which the principal has an interest." },
  { power: "Claims and litigation", desc: "Bring, defend, settle and manage lawsuits and claims." },
  { power: "Personal and family maintenance", desc: "Pay for the support of the principal and family, including customary gifts." },
  { power: "Benefits from governmental programs or civil or military service", desc: "Apply for and manage government, civil and military service benefits." },
  { power: "Health care billing and payment matters; records, reports and statements", desc: "Handle health care bills, payments and related records." },
  { power: "Retirement benefit transactions", desc: "Manage retirement plans, accounts and benefits." },
  { power: "Tax matters", desc: "Prepare, file and handle tax returns and dealings with tax authorities." },
  { power: "All other matters", desc: "Act on any other matter the principal could handle personally." },
];
/* termsFor(): only the stated rows show to the client (When it starts, Gifts,
   Earlier powers of attorney); Agent pay, Your trust and Limits are not stated */
const CA_POA_TERMS: { label: string; text: string }[] = [
  { label: "When it starts", text: "As soon as it was signed. Maria doesn't have to wait for a doctor's certification." },
  { label: "Gifts", text: "Maria may make gifts of up to $5,000 a year in total, the New York default on this form." },
  { label: "Earlier powers of attorney", text: "Powers of attorney you signed earlier stay in force alongside this one." },
];

/* RoleChainView: numbered succession, teal first choice, grey backups */
const CaRoleChain = ({ role, steps }: { role: string; steps: string[] }) => (
  <div style={{ minWidth: "230px", flex: "1 1 230px", maxWidth: "100%" }}>
    <CaUpperLabel>{role}</CaUpperLabel>
    <div className="mt-2">
      {steps.map((name, i) => {
        const last = i === steps.length - 1;
        const caption = i === 0 ? "First choice" : `${["First", "Second", "Third"][i]} in line — steps in if ${steps[i - 1]} can’t serve`;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-[#128F8B] text-white" : "border border-[#CBD2D9] bg-white text-[#6B7280]"}`}
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                {i + 1}
              </span>
              {!last && <span className="my-1 w-px flex-1 bg-[#E1E5EA]" />}
            </div>
            <div className={last ? "" : "pb-4"} style={{ paddingTop: "1px" }}>
              <div className="text-[#1F2933]" style={{ fontSize: "15px", fontWeight: 500 }}>{name}</div>
              <div className="mt-0.5 text-[#9CA3AF]" style={{ fontSize: "12.5px" }}>{caption}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* AgentPowersView's two-column tables: a teal header row, zebra rows */
const CaTwoColTable = ({ head, rows }: { head: [string, string]; rows: { a: string; b: string }[] }) => (
  <div className="overflow-hidden rounded-xl" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
    <div className="flex bg-[#128F8B] text-white">
      <div className="w-[30%] flex-shrink-0 px-5 py-3" style={{ fontSize: "13px", fontWeight: 600 }}>{head[0]}</div>
      <div className="min-w-0 flex-1 px-5 py-3" style={{ fontSize: "13px", fontWeight: 600 }}>{head[1]}</div>
    </div>
    {rows.map((row, i) => (
      <div key={i} className={`flex items-start border-b border-[#E5E7EB] last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}>
        <div className="w-[30%] flex-shrink-0 break-words px-5 py-4">
          <span className="text-[#1F2933]" style={{ fontSize: "14px", fontWeight: 500 }}>{row.a}</span>
        </div>
        <div className="min-w-0 flex-1 break-words px-5 py-4">
          <span className="text-[#6B7280]" style={{ fontSize: "14px", lineHeight: 1.5, whiteSpace: "pre-line" }}>{row.b}</span>
        </div>
      </div>
    ))}
  </div>
);

const CaStepInBody = () => (
  <>
    <CaP>
      Maria can step in to handle your finances at any time, because your power of attorney is in force as soon as it's signed. If you're ever unable to make
      decisions for yourself, Maria also steps in to handle your healthcare. If Maria can't serve, Emma is your backup.
    </CaP>
    <div className="mt-6">
      <div className="flex flex-wrap gap-x-14 gap-y-7">
        <CaRoleChain role="Financial Agent" steps={["Maria Rosen", "Emma Rosen"]} />
        <CaRoleChain role="Healthcare Agent" steps={["Maria Rosen", "Emma Rosen"]} />
      </div>
    </div>
    <div className="mt-8">
      <div>
        {/* One tab per document; financial first */}
        <div role="tablist" aria-label="Agent powers" className="inline-flex flex-wrap items-center gap-5 border-b border-[#E5E7EB] pb-2">
          <span className="text-[#128F8B] transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Financial Agent powers</span>
          <span className="text-[#6B7280] transition-colors hover:text-[#1F2933]" style={{ fontSize: "13px", fontWeight: 500 }}>Healthcare Agent powers</span>
        </div>
        <div role="tabpanel" className="mt-5">
          <CaTwoColTable head={["Power", "What this means"]} rows={CA_POA_POWERS.map((p) => ({ a: p.power, b: p.desc }))} />
          <div className="mt-8">
            <CaUpperLabel>Terms of your power of attorney</CaUpperLabel>
            <div className="mt-2">
              <CaTwoColTable head={["Term", "What your document says"]} rows={CA_POA_TERMS.map((t) => ({ a: t.label, b: t.text }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

/* ---- ClientPlanSectionScreen ---------------------------------------------
   The same tab with "If You Need Someone to Step In" opened, scrolled so the
   card sits under the header (1440 wide; default 855 tall, which cuts the
   page inside the powers table; pass `height` up to 2058 (measured) to show
   the whole card, the terms table and the next card's header, "What You'll
   Leave Behind"; taller is clamped, since that card's body would follow).
   Above the card is the bottom edge of "Your Plan Right Now". The
   floating scenario pill stays hidden: it only shows once the leave-behind
   card's picker has scrolled above the header. Files as for
   ClientEstatePlanTodayScreen, plus scenario-incapacity.ts, plan-summary.ts
   (planIncapacity) and scenario-blocks.tsx (RoleChainView, AgentPowersView). */
export const ClientPlanSectionScreen = ({ height = 855 }: { height?: number }) => (
  <ClientFrame active="estate-plan" height={Math.min(height, 2058)}>
    <div className="mx-auto max-w-[900px] px-4">
      <div className="space-y-1.5 bg-[#F3F4F6]" style={{ boxShadow: CA_STACK_SHADOW }}>
        {/* the last 20px of "Your Plan Right Now" (its body's bottom padding) */}
        <div className="h-5 bg-white" />
        <CaCardShell iconSrc="/mock/shield-icon.png" title="If You Need Someone to Step In" subtitle="What happens if you can't make decisions for yourself" open>
          <CaStepInBody />
        </CaCardShell>
        <CaCardShell iconSrc="/mock/tree-icon.png" title="What You'll Leave Behind" subtitle="How your estate is managed and distributed" open />
      </div>
    </div>
  </ClientFrame>
);

/* =============================================================================
   SHARED tab
   ============================================================================= */
/* =============================================================================
   The client app's Shared tab (apps/clients), recreated from origin/main
   (Nov 17 2026):
   - components/dashboard/tabs/SharedTab.tsx: the tab itself (hero, the card
     stack), TeamSection, TeamMemberCell, CategoryTile, EstatePlanDocCard,
     ReceivedPlanView ("theirs", one owner's plan opened)
   - components/dashboard/sharing/primitives.tsx (Avatar, AvatarStack, Pill),
     categories.ts (BASE_CATEGORIES: titles, icons, icon sizes, descriptions),
     SharingPopover.tsx, ReleaseSelector.tsx (the timing chip), ModalHeader.tsx,
     components/dashboard/ScrollFade.tsx
   - components/dashboard/EstatePlanLocationBar.tsx
   - lib/sharing-constants.ts (lockedLabel, release titles: today only "Share
     now" and "Share when I die" are offered, MT 4.2), lib/header-back.tsx
     (the header's back chevron on an opened plan)
   - packages/types roles.ts (role titles) and document-catalog.ts (document
     names: a title-less upload reads its catalog label, as most do)
   The Shared-tab icons ("Icons for Shared (personal)/*.png") are the marketing
   site's public/mock/cat-*.png (the same art, downscaled): Compass = cat-estate,
   Piggy Bank = cat-finance, Cloud = cat-digital, stroller = cat-children,
   Doctor = cat-health; family-icon.png is byte-identical. The pop-up's portrait
   (/image.png) is byte-identical to /mock/eva.png.
   ============================================================================= */

const CaEditIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M13.85 5.64 13.65 5.98 13.55 6.36 13.55 6.75 13.59 6.95 13.74 7.31 13.98 7.62 16.38 10.02 16.69 10.26 16.87 10.35 17.25 10.45 17.64 10.45 18.02 10.35 18.19 10.26 18.5 10.02 19.63 8.89 19.76 8.74 19.96 8.4 20.06 8.03 20.06 7.63 19.96 7.26 19.76 6.92 17.23 4.37 16.92 4.13 16.74 4.04 16.37 3.94 15.97 3.94 15.6 4.04 15.42 4.13 15.11 4.37ZM3.93 19.81 3.94 19.91 3.99 19.99 4.06 20.05 4.19 20.07 8.91 19.23 9 19.19 9.07 19.12 9.24 19.29 16.59 11.93 12.07 7.41 4.71 14.76 4.88 14.93 4.81 15 4.77 15.09Z"/>);
const CaLockedIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M6.49 10.62 6.18 10.68 5.88 10.78 5.6 10.92 5.34 11.1 5.1 11.3 4.9 11.54 4.72 11.8 4.58 12.08 4.48 12.38 4.42 12.69 4.4 13 4.4 19.2 4.42 19.51 4.48 19.82 4.58 20.12 4.72 20.4 4.9 20.66 5.1 20.9 5.34 21.1 5.6 21.28 5.88 21.42 6.18 21.52 6.49 21.58 6.8 21.6 17.2 21.6 17.51 21.58 17.82 21.52 18.12 21.42 18.4 21.28 18.66 21.1 18.9 20.9 19.1 20.66 19.28 20.4 19.42 20.12 19.52 19.82 19.58 19.51 19.6 19.2 19.6 13 19.58 12.69 19.52 12.38 19.42 12.08 19.28 11.8 19.1 11.54 18.9 11.3 18.66 11.1 18.4 10.92 18.12 10.78 17.82 10.68 17.51 10.62 17.2 10.6 6.8 10.6ZM13.59 15.41 13.48 15.81 13.27 16.17 12.97 16.47 12.75 16.61 12.75 17.9 12.73 18.08 12.66 18.25 12.48 18.46 12.23 18.58 12.05 18.6 11.86 18.59 11.6 18.51 11.46 18.39 11.34 18.25 11.26 17.99 11.25 16.61 11.03 16.47 10.73 16.17 10.52 15.81 10.45 15.61 10.4 15.2 10.41 14.99 10.52 14.59 10.61 14.4 10.73 14.23 11.03 13.93 11.39 13.72 11.79 13.61 12 13.6 12.21 13.61 12.61 13.72 12.97 13.93 13.27 14.23 13.39 14.4 13.48 14.59 13.59 14.99ZM9.16 6.8 9.24 6.5 9.35 6.22 9.49 5.95 9.66 5.7 9.85 5.46 10.06 5.25 10.3 5.06 10.55 4.89 10.82 4.75 11.1 4.64 11.4 4.56 11.7 4.52 12 4.5 12.3 4.52 12.6 4.56 12.9 4.64 13.18 4.75 13.45 4.89 13.7 5.06 13.94 5.25 14.15 5.46 14.34 5.7 14.51 5.95 14.65 6.22 14.76 6.5 14.84 6.8 14.88 7.1 14.9 9.4 17.3 9.4 17.3 7.4 17.26 6.78 17.17 6.24 17.06 5.82 16.87 5.3 16.62 4.81 16.32 4.34 15.98 3.9 15.59 3.5 15.17 3.15 14.7 2.84 14.21 2.59 13.58 2.34 13.04 2.2 12.49 2.12 12.06 2.1 11.38 2.14 10.84 2.23 10.3 2.38 9.9 2.53 9.3 2.84 8.94 3.08 8.5 3.42 8.1 3.81 7.75 4.23 7.38 4.81 7.19 5.19 6.98 5.7 6.83 6.24 6.72 6.96 6.7 9.39 9.1 9.41 9.12 7.07Z"/>);
const CaDocumentIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M7 2.5h6.5L18.6 7.6V19.4A2.1 2.1 0 0 1 16.5 21.5H7A2.1 2.1 0 0 1 4.9 19.4V4.6A2.1 2.1 0 0 1 7 2.5Zm6.6 1.1V6.8A1.1 1.1 0 0 0 14.7 7.9H17.9zM8.3 11.2A0.7 0.7 0 0 0 8.3 12.6H15.2A0.7 0.7 0 0 0 15.2 11.2Zm0 3A0.7 0.7 0 0 0 8.3 15.6H15.2A0.7 0.7 0 0 0 15.2 14.2Zm0 3A0.7 0.7 0 0 0 8.3 18.6H12.6A0.7 0.7 0 0 0 12.6 17.2Z"/>);
const CaDownloadIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M2.71 19.77 2.8 20.1 2.97 20.39 3.08 20.52 3.35 20.73 3.5 20.8 3.66 20.86 4 20.9 20 20.9 20.34 20.86 20.65 20.73 20.92 20.52 21.13 20.25 21.26 19.94 21.29 19.77 21.3 14.4 21.26 14.06 21.13 13.75 20.92 13.48 20.79 13.37 20.5 13.2 20.17 13.11 19.83 13.11 19.5 13.2 19.21 13.37 19.08 13.48 18.87 13.75 18.74 14.06 18.7 14.4 18.7 18.3 5.3 18.3 5.3 14.4 5.26 14.06 5.13 13.75 5.03 13.61 4.79 13.37 4.65 13.27 4.5 13.2 4.17 13.11 4 13.1 3.66 13.14 3.5 13.2 3.21 13.37 2.97 13.61 2.8 13.9 2.71 14.23ZM13.19 2.64 13.11 2.34 12.95 2.07 12.73 1.85 12.46 1.69 12.31 1.64 12 1.6 11.84 1.61 11.54 1.69 11.4 1.76 11.15 1.95 10.96 2.2 10.84 2.49 10.8 2.8 10.8 11.4 8.99 11.4 8.81 11.42 8.56 11.55 8.43 11.68 8.34 11.85 8.3 12.03 8.32 12.3 8.46 12.55 11.46 16.15 11.68 16.33 11.95 16.4 12.14 16.39 12.32 16.33 12.54 16.15 15.54 12.55 15.68 12.3 15.71 12.12 15.69 11.93 15.57 11.68 15.44 11.55 15.19 11.42 15.01 11.4 13.2 11.4Z"/>);
const CaHeartIcon = mkIcon(<path d="M12 20.7c-.3 0-.6-.1-.9-.3-2.7-1.9-4.8-3.7-6.2-5.4C3.4 13.1 2.7 11.4 2.7 9.7 2.7 7 4.8 4.9 7.4 4.9c1.8 0 3.4.9 4.6 2.5 1.2-1.6 2.8-2.5 4.6-2.5 2.6 0 4.7 2.1 4.7 4.8 0 1.7-.7 3.4-2.2 5.3-1.4 1.7-3.5 3.5-6.2 5.4-.3.2-.6.3-.9.3Z"/>);
const CaCheckIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M8.78 18.77 8.9 18.87 9.18 19.02 9.33 19.07 9.64 19.1 9.8 19.08 10.1 18.99 10.24 18.92 10.48 18.72 20.48 7.95 20.62 7.67 20.69 7.36 20.7 7.21 20.65 6.9 20.59 6.75 20.52 6.61 20.32 6.37 20.06 6.19 19.77 6.08 19.61 6.06 19.3 6.07 19.15 6.1 19 6.16 18.74 6.33 9.54 16.2 5.2 12.13 4.93 11.98 4.78 11.93 4.62 11.91 4.31 11.92 4.01 12.01 3.74 12.17 3.63 12.28 3.53 12.4 3.38 12.67 3.31 12.98 3.3 13.14 3.35 13.45 3.41 13.59 3.57 13.86Z"/>);
const CaAddPersonIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M22.12 9.42 22.37 9.27 22.48 9.18 22.57 9.07 22.72 8.82 22.79 8.54 22.8 8.4 22.76 8.12 22.65 7.85 22.48 7.62 22.25 7.45 21.98 7.34 21.84 7.31 19.7 7.3 19.7 5.3 19.66 5.02 19.55 4.75 19.38 4.52 19.27 4.43 19.02 4.28 18.74 4.21 18.46 4.21 18.32 4.24 18.05 4.35 17.93 4.43 17.73 4.63 17.58 4.88 17.51 5.16 17.5 5.3 17.5 7.3 15.5 7.3 15.22 7.34 14.95 7.45 14.83 7.53 14.63 7.73 14.48 7.98 14.41 8.26 14.4 8.4 14.44 8.68 14.55 8.95 14.63 9.07 14.83 9.27 15.08 9.42 15.22 9.46 15.5 9.5 17.5 9.5 17.5 11.5 17.54 11.78 17.65 12.05 17.73 12.17 17.93 12.37 18.18 12.52 18.46 12.59 18.6 12.6 18.88 12.56 19.15 12.45 19.27 12.37 19.47 12.17 19.62 11.92 19.69 11.64 19.7 11.5 19.7 9.5 21.7 9.5 21.98 9.46ZM2.02 20.14 2.18 20.31 2.39 20.43 2.62 20.49 2.74 20.5 15.38 20.49 15.61 20.43 15.82 20.31 15.98 20.14 16.1 19.94 16.16 19.71 16.19 19.45 16.2 19.06 16.18 18.68 16.13 18.29 16.05 17.92 15.83 17.24 15.64 16.81 15.25 16.18 14.97 15.8 14.43 15.23 14.07 14.91 13.41 14.43 12.98 14.18 12.21 13.82 11.73 13.64 10.89 13.41 10.38 13.31 9.5 13.21 8.98 13.2 8.08 13.25 7.16 13.4 6.66 13.52 5.84 13.8 5.38 14 4.64 14.41 4.23 14.68 3.61 15.19 3.27 15.53 2.78 16.12 2.53 16.52 2.2 17.17 2.06 17.54 1.95 17.92 1.87 18.29 1.82 18.68 1.8 19.14 1.82 19.52 1.86 19.82 1.9 19.94ZM12.7 6.27 12.46 5.8 12.17 5.36 11.83 4.97 11.44 4.63 11 4.34 10.53 4.1 10.04 3.94 9.52 3.83 9 3.8 8.48 3.83 7.96 3.94 7.47 4.1 7 4.34 6.56 4.63 6.17 4.97 5.83 5.36 5.54 5.8 5.3 6.27 5.14 6.76 5.03 7.28 5 7.8 5.03 8.32 5.14 8.84 5.3 9.33 5.54 9.8 5.83 10.24 6.17 10.63 6.56 10.97 7 11.26 7.47 11.5 7.96 11.66 8.48 11.77 9 11.8 9.52 11.77 10.04 11.66 10.53 11.5 11 11.26 11.44 10.97 11.83 10.63 12.17 10.24 12.46 9.8 12.7 9.33 12.86 8.84 12.97 8.32 13 7.8 12.97 7.28 12.86 6.76Z"/>);
const CaLocationIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M6.7 14.57 6.8 14.76 11.55 21.28 11.75 21.42 11.98 21.48 12.18 21.45 12.39 21.34 12.49 21.23 17.2 14.76 17.3 14.56 17.88 13.89 18.42 13.08 18.83 12.25 19.14 11.33 19.33 10.39 19.4 9.42 19.34 8.45 19.15 7.5 18.84 6.59 18.42 5.72 17.88 4.91 17.25 4.18 16.49 3.52 15.72 3 14.85 2.57 13.9 2.25 12.95 2.06 12.02 2 11.01 2.07 10.07 2.26 9.19 2.56 8.28 3 7.51 3.52 6.78 4.15 6.12 4.91 5.58 5.72 5.17 6.55 4.85 7.5 4.67 8.41 4.6 9.38 4.67 10.39 4.86 11.33 5.16 12.21 5.6 13.12 6.12 13.89ZM14.78 9.77 14.7 10.12 14.59 10.47 14.42 10.8 14.22 11.1 13.98 11.38 13.7 11.62 13.4 11.82 13.07 11.99 12.72 12.1 12.37 12.18 12 12.2 11.63 12.18 11.28 12.1 10.93 11.99 10.6 11.82 10.3 11.62 10.02 11.38 9.78 11.1 9.58 10.8 9.41 10.47 9.3 10.12 9.22 9.77 9.2 9.4 9.22 9.03 9.3 8.68 9.41 8.33 9.58 8 9.78 7.7 10.02 7.42 10.3 7.18 10.6 6.98 10.93 6.81 11.28 6.7 11.63 6.62 12 6.6 12.37 6.62 12.72 6.7 13.07 6.81 13.4 6.98 13.7 7.18 13.98 7.42 14.22 7.7 14.42 8 14.59 8.33 14.7 8.68 14.78 9.03 14.8 9.4Z"/>);

/* ── Demo sharing set-up ───────────────────────────────────────────────────
   Daniel's team (planRoles, in ROLE_ORDER): Maria (Executor · Power of
   Attorney · Medical Proxy, official roles), Emma and Leo (Child, friends &
   family; Emma is also the backup agent the Step In card names), Rachel
   Alvarez (Lawyer, linked to the account, auto-shared every current
   document). */
const RACHEL = { name: "Rachel Alvarez" };
const EMMA = { name: "Emma Rosen" };
const LEO = { name: "Leo Rosen" };

/* categories.ts BASE_CATEGORIES (estate, finance, digital, children, health) */
type ShCat = { id: string; title: string; icon: string; iconSize: string; description: string; flat?: boolean };
const SH_CATS: Record<string, ShCat> = {
  estate: {
    id: "estate", flat: true, title: "Estate Plan", icon: "/mock/cat-estate.png", iconSize: "w-14 h-14",
    description: "Will, trust(s), Financial POAs, beneficiaries, vital records, final wishes, personal bequests, letters to loved ones.",
  },
  finance: {
    id: "finance", title: "Finance", icon: "/mock/cat-finance.png", iconSize: "w-12 h-12",
    description: "Accounts, real estate, vehicles, valuables, income, bills, debts, insurance, taxes, business interests.",
  },
  digital: {
    id: "digital", title: "Digital Life", icon: "/mock/cat-digital.png", iconSize: "w-12 h-12",
    description: "Account inventory, password manager, 2FA/recovery, crypto, domains, per-account wishes.",
  },
  children: {
    id: "children", title: "Children", icon: "/mock/cat-children.png", iconSize: "w-10 h-10",
    description: "Per-child info, parenting values, guardianship guidance, funds, pets.",
  },
  health: {
    id: "health", title: "Health", icon: "/mock/cat-health.png", iconSize: "w-14 h-14",
    description: "Providers, conditions, medications, allergies, insurance, advance directive, end-of-life preferences.",
  },
};

/* ── sharing/primitives.tsx ─────────────────────────────────────────────── */
const ShAvatar = ({ name, size = 32, border = true }: { name: string; size?: number; border?: boolean }) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (parts[0] || "?").slice(0, 2).toUpperCase();
  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-[#159E95] text-white ${border ? "border-2 border-white" : ""}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38), fontWeight: 600, lineHeight: 1 }}
      title={name}
    >
      {initials}
    </div>
  );
};

const ShAvatarStack = ({ people, max = 4, size = 30 }: { people: { name: string }[]; max?: number; size?: number }) => {
  if (people.length === 0) return <span className="text-[#9CA3AF]" style={{ fontSize: "12px" }}>No one yet</span>;
  const visible = people.slice(0, max);
  const overflow = people.length - visible.length;
  return (
    <div className="flex items-center">
      {visible.map((p, i) => (
        <div key={p.name + i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: visible.length - i }}>
          <ShAvatar name={p.name} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div className="flex flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#9CA3AF] text-white" style={{ width: size, height: size, fontSize: Math.round(size * 0.38), fontWeight: 600, marginLeft: -8 }}>
          +{overflow}
        </div>
      )}
    </div>
  );
};

const ShPill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-md border border-[#D5EDEC] bg-[#F0F9F9] px-2 py-0.5 text-[#128F8B]" style={{ fontSize: "11px", fontWeight: 500 }}>
    {children}
  </span>
);

/* ── The tab's own hero (SharedTab.tsx). The product sizes the title with
   clamp(28px, 6vw, 42px) and the line with clamp(15px, 3vw, 17px): at desktop
   width that is 42px and 17px. Merriweather via var(--font-merriweather). ── */
const ShSharedHero = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-[#F3F4F6] bg-white px-6 pb-10 pt-12 text-center">
    <div className="mx-auto max-w-[700px]">
      <h1 className="mb-3 text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: 42, fontWeight: 600 }}>{title}</h1>
      <p className="mx-auto max-w-[540px] text-[#6B7280]" style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 17, lineHeight: "1.6", minHeight: "calc(2 * 1.6em)" }}>
        {children}
      </p>
    </div>
  </div>
);

/* The card stack every Shared view sits in */
const ShStack = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
    <div className="grid grid-cols-1 gap-1.5">{children}</div>
  </div>
);

/* CategoryTile's header row: icon, title, description (+ who has access on the
   owner's side), chevron. `people` undefined = the read-only received view. */
const ShCategoryHeader = ({ cat, people, open = false }: { cat: ShCat; people?: { name: string }[]; open?: boolean }) => (
  <div className="flex w-full cursor-pointer items-center gap-4 p-8 text-left transition-colors hover:bg-[#F8FAFA]">
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-visible">
      <img src={cat.icon} alt="" className={`${cat.iconSize} object-contain`} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="mb-1 text-[#1F2933]" style={{ fontSize: "16px", fontWeight: 600 }}>{cat.title}</div>
      <div className="flex items-center justify-between gap-3">
        <div className="truncate text-[#9CA3AF]" style={{ fontSize: "13px", lineHeight: "1.4" }}>{cat.description}</div>
        {!cat.flat && people && (
          <div className="flex-shrink-0">
            <span className="block transition-opacity hover:opacity-80">
              <ShAvatarStack people={people} size={28} />
            </span>
          </div>
        )}
      </div>
    </div>
    <CaChevronDownIcon className={`h-5 w-5 flex-shrink-0 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`} />
  </div>
);

const ShCategoryTile = ({ cat, people, open = false, children }: { cat: ShCat; people?: { name: string }[]; open?: boolean; children?: React.ReactNode }) => (
  <div className="overflow-hidden bg-white">
    <ShCategoryHeader cat={cat} people={people} open={open} />
    {open && <div className="border-t border-[#F0F1F3]">{children}</div>}
  </div>
);

/* CategoryTile when shared but its condition hasn't been met (received view):
   grey icon, the condition (lockedLabel), the lock. */
const ShLockedCategoryTile = ({ cat, label }: { cat: ShCat; label: string }) => (
  <div className="flex w-full cursor-pointer items-center gap-4 overflow-hidden bg-white p-8 text-left transition-colors hover:bg-[#F8FAFA]">
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-visible">
      <img src={cat.icon} alt="" className={`${cat.iconSize} object-contain`} style={{ opacity: 0.35, filter: "grayscale(1)" }} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="mb-1 text-[#9CA3AF]" style={{ fontSize: "16px", fontWeight: 600 }}>{cat.title}</div>
      <div className="inline-flex items-start gap-1.5 text-[#9CA3AF]" style={{ fontSize: "12.5px", lineHeight: 1.45 }}>
        <CaLockedIcon className="mt-px h-3.5 w-3.5 flex-shrink-0" /> <span>{label}</span>
      </div>
    </div>
    <CaLockedIcon className="h-5 w-5 flex-shrink-0 text-[#C7CDD3]" />
  </div>
);

/* EstatePlanDocCard. Owner: who it's shared with (AvatarStack 22px) beside
   the download; recipients: just the download. "View summary" for the types
   the AI extraction covers (will, POAs, health care proxy, directives). A
   locked card (received view) names the condition holding it shut. */
const ShEstateDocCard = ({
  title,
  people,
  summary = false,
  lock,
  className = "",
}: {
  title: string;
  people?: { name: string }[];
  summary?: boolean;
  lock?: string;
  className?: string;
}) =>
  lock ? (
    <div className={`block w-full cursor-pointer overflow-hidden rounded-lg border border-[#F0F1F3] bg-white text-left transition-colors hover:bg-[#F8FAFA] ${className}`}>
      <div className="flex items-start gap-3 px-5 py-4">
        <CaDocumentIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C7CDD3]" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-start justify-between gap-3">
            <div className="min-w-0 truncate text-[#9CA3AF]" style={{ fontSize: "14px", fontWeight: 600 }}>{title}</div>
            <CaLockedIcon className="h-4 w-4 flex-shrink-0 text-[#C7CDD3]" />
          </div>
          <div className="inline-flex items-start gap-1.5 text-[#9CA3AF]" style={{ fontSize: "12.5px", lineHeight: 1.45 }}>
            <CaLockedIcon className="mt-px h-3.5 w-3.5 flex-shrink-0" /> <span>{lock}</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={`block w-full overflow-hidden rounded-lg border border-[#F0F1F3] bg-white text-left transition-colors hover:border-[#D5EDEC] ${className}`}>
      <div className="flex items-start gap-3 px-5 py-4">
        <CaDocumentIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#128F8B]" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-start justify-between gap-3">
            <div className="min-w-0 truncate text-[#1F2933]" style={{ fontSize: "14px", fontWeight: 600 }}>{title}</div>
            <div className="flex flex-shrink-0 items-center gap-3">
              {people && (
                <div>
                  <span className="block transition-opacity hover:opacity-80">
                    <ShAvatarStack people={people} size={22} max={4} />
                  </span>
                </div>
              )}
              <span aria-label="View document" className="cursor-pointer transition-opacity hover:opacity-70">
                <CaDownloadIcon className="h-4 w-4 text-[#128F8B]" />
              </span>
            </div>
          </div>
          {/* typeLabel = documentTypeLabel(type): the catalog name, so a
              title-less upload shows it twice, as the product does */}
          <div className="mb-1.5"><ShPill>{title}</ShPill></div>
          {summary && (
            <span className="cursor-pointer text-[#128F8B] hover:underline" style={{ fontSize: "12.5px", fontWeight: 600 }}>
              View summary
            </span>
          )}
        </div>
      </div>
    </div>
  );

/* EstatePlanLocationBar.tsx, empty (its placeholder showing) */
const ShLocationBar = () => (
  <div className="mb-3 rounded-lg border border-[#F0F1F3] bg-[#F8FAFA] px-4 py-3">
    <div className="mb-1.5 flex items-center gap-1.5 text-[#9CA3AF]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      <CaLocationIcon className="h-3.5 w-3.5" /> Where your estate plan is kept
    </div>
    <div className="flex items-center gap-2">
      <span className="flex-1 border-b border-[#E5E7EB] py-1.5 text-[#B8BEC4]" style={{ fontSize: 14, lineHeight: "20px" }}>
        e.g. 12 Oak St — top drawer of the office desk, or the safe in the hall closet
      </span>
    </div>
  </div>
);

/* ── Daniel's "Your Plan" (mine) view ─────────────────────────────────────── */

/* TeamSection, closed: "Your team" and how many are on it. "Prepare My Team"
   only shows while someone the plan names still has no contact (teamComplete). */
const ShTeamClosed = ({ count }: { count: number }) => (
  <div className="overflow-hidden bg-white">
    <div className="flex w-full cursor-pointer items-center gap-4 p-8 transition-colors hover:bg-[#F8FAFA]">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-visible">
        <img src="/mock/family-icon.png" alt="" className="h-12 w-12 object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[#1F2933]" style={{ fontSize: "16px", fontWeight: 600 }}>Your team</div>
        <div className="text-[#9CA3AF]" style={{ fontSize: "13px", lineHeight: "1.4" }}>{count} people on your team</div>
      </div>
      <CaChevronDownIcon className="h-5 w-5 flex-shrink-0 text-[#6B7280] transition-transform" />
    </div>
  </div>
);

/* Who Daniel shares each thing with. The lawyer linked to the account gets
   every current document automatically (SharedTab onSaved). */
const WILL_PEOPLE = [MARIA, EMMA, LEO, RACHEL];
const DOC_PEOPLE = [MARIA, RACHEL];

/* The "mine" page body: hero, then the stack with the Estate Plan tile open */
const ShMinePage = () => (
  <div className="bg-[#FAFBFC]">
    <ShSharedHero title="Share your documents">
      That way no one&rsquo;s searching around<br /> when they need to step in.
    </ShSharedHero>
    <div className="bg-[#FAFBFC] px-6 pb-12 pt-8">
      <div className="mx-auto max-w-[900px]">
        <ShStack>
          <ShTeamClosed count={4} />
          <ShCategoryTile cat={SH_CATS.estate} open>
            {/* flat tile: location bar, then one card per current document in
                catalog-category order (wills, trusts, POAs, health care, property).
                v4 space-y-2 puts its gap below each card; the bar keeps its mb-3. */}
            <div className="px-8 pb-8 pt-6">
              <ShLocationBar />
              <ShEstateDocCard className="mb-2" title="Last Will & Testament" people={WILL_PEOPLE} summary />
              <ShEstateDocCard className="mb-2" title="Revocable Living Trust" people={DOC_PEOPLE} />
              <ShEstateDocCard className="mb-2" title="Power of Attorney" people={DOC_PEOPLE} summary />
              <ShEstateDocCard className="mb-2" title="Medical Proxy" people={DOC_PEOPLE} summary />
              <ShEstateDocCard title="Deed" people={DOC_PEOPLE} />
            </div>
          </ShCategoryTile>
          <ShCategoryTile cat={SH_CATS.finance} people={[MARIA, RACHEL]} />
          <ShCategoryTile cat={SH_CATS.digital} people={[MARIA]} />
          <ShCategoryTile cat={SH_CATS.children} people={[MARIA]} />
          <ShCategoryTile cat={SH_CATS.health} people={[MARIA]} />
        </ShStack>
      </div>
    </div>
  </div>
);

/**
 * The Shared tab, "Your Plan" (mine) view, for Daniel: "Share your documents",
 * his team (4 people), and the Estate Plan tile opened to show who each
 * document is shared with; Finance, Digital Life, Children and Health show who
 * has access to each. Canvas 1440 × 1845 (the whole page, measured).
 */
export const ClientSharedScreen = () => (
  <ClientFrame active="shared" person={DANIEL} height={1845}>
    <ShMinePage />
  </ClientFrame>
);

/* ── SharingPopover over the will: who gets it and WHEN ───────────────────── */

/* ReleaseSelector's chip. A will offers "Share now" and "Share when I die";
   disabled (the linked lawyer) it greys, keeping its chevron. */
const ShReleaseChip = ({ label, disabled = false }: { label: string; disabled?: boolean }) => (
  <div className="relative inline-block">
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 transition-colors ${disabled ? "cursor-default bg-[#F3F4F6] text-[#9CA3AF]" : "bg-[#F5F7F7] text-[#6B7280] hover:bg-[#E6F4F3] hover:text-[#128F8B]"}`}
      style={{ fontSize: "11.5px", fontWeight: 500 }}
    >
      {label}
      <CaChevronDownIcon className="h-3 w-3 transition-transform" />
    </span>
  </div>
);

const ShPopoverRow = ({ name, recommended = false, disabled = false, release }: { name: string; recommended?: boolean; disabled?: boolean; release: string }) => (
  <div className={`flex w-full items-center gap-2.5 border-b border-[#F0F1F3] py-2.5 ${disabled ? "opacity-40" : ""}`}>
    <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#128F8B] transition-colors">
      <CaCheckIcon className="h-2.5 w-2.5 text-white" />
    </span>
    <span className={`flex min-w-0 flex-1 items-center gap-2.5 text-left ${disabled ? "cursor-not-allowed" : ""}`}>
      <span className="truncate text-[#1F2933]" style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
      {recommended && !disabled && <span className="flex-shrink-0 text-[#128F8B]" style={{ fontSize: 11, fontWeight: 500 }}>Recommended</span>}
    </span>
    <div className="flex flex-shrink-0 items-center">
      <ShReleaseChip label={release} disabled={disabled} />
    </div>
  </div>
);

/* SharingPopover.tsx for the Last Will & Testament: ModalHeader (Eva's
   portrait on the hairline, DOC_HEADLINES.will in serif), everyone on the team
   ticked with their timing chip, Add team member, then Done above Cancel.
   Card: max-width 560, centred on a 50% scrim. */
const ShWillPopover = () => (
  <div className="absolute inset-0 z-[60] flex items-center justify-center px-4 py-6" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="flex w-full flex-col rounded-2xl bg-white" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)", maxWidth: 560, maxHeight: 727 }}>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto" style={{ padding: "24px 34px 0 34px" }}>
          {/* ModalHeader.tsx */}
          <div className="relative w-full" style={{ marginBottom: 21 }}>
            <div className="absolute left-1/2 w-full -translate-x-1/2 border-t border-[#E5E7EB]" style={{ top: 28 }} />
            <div className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center overflow-hidden rounded-full" style={{ width: 56, height: 56, top: 0, backgroundColor: "rgba(84,167,154,0.1)" }}>
              <img src="/mock/eva.png" alt="" className="h-full w-full object-cover" />
            </div>
            <div style={{ paddingTop: 69 }} className="text-center">
              <h2 className="mx-auto max-w-[420px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: 21, lineHeight: 1.3, textWrap: "balance" } as React.CSSProperties}>
                Your final wishes
              </h2>
              <p className="mx-auto max-w-[380px] text-[#6B7280]" style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, lineHeight: 1.6, marginTop: 8, textWrap: "balance" } as React.CSSProperties}>
                Select who should have access to your Last Will &amp; Testament.
              </p>
            </div>
          </div>
          <div className="border-t border-[#F0F1F3]">
            {/* roleCards order (ROLE_ORDER): executor, child, lawyer. The will
                is recommended to the executor; the linked lawyer can't be
                unticked. */}
            <ShPopoverRow name="Maria Rosen" recommended release="Share when I die" />
            <ShPopoverRow name="Emma Rosen" release="Share when I die" />
            <ShPopoverRow name="Leo Rosen" release="Share when I die" />
            <ShPopoverRow name="Rachel Alvarez" disabled release="Share now" />
            <span className="flex w-full items-center gap-2 py-3 text-left text-[#128F8B] transition-colors hover:opacity-80">
              <CaAddPersonIcon className="h-4 w-4 flex-shrink-0" />
              <span style={{ fontSize: "13.5px", fontWeight: 600 }}>Add team member</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0" style={{ padding: "13px 34px 24px 34px" }}>
        <span className="block w-full rounded-xl bg-[#159a95] py-3 text-center font-medium text-white transition-colors hover:bg-[#128f8b]" style={{ fontSize: 15 }}>
          Done
        </span>
        <span className="block w-full pb-0.5 pt-3 text-center text-[#9CA3AF] transition-colors hover:text-[#6B7280]" style={{ fontSize: 13.5 }}>
          Cancel
        </span>
      </div>
    </div>
  </div>
);

/**
 * Daniel's "Your Plan" view with the will's sharing pop-up open (clicking the
 * avatars on its card): who gets the will and when each person can open it
 * ("Share when I die" / "Share now"). Canvas 1440 × 855.
 */
export const ClientShareTimingScreen = () => (
  <ClientFrame active="shared" person={DANIEL} height={855} overlay={<ShWillPopover />}>
    <ShMinePage />
  </ClientFrame>
);

/* ── Maria: "Shared with You", Daniel's plan opened ───────────────────────── */

/* TeamSection in the received view: "Your roles", open by default, each role
   on a teal rail with what it asks of the reader (ROLE_RESPONSIBILITIES, filled
   with the owner's first name). */
const ShYourRoles = ({ roles }: { roles: { label: string; definition: string }[] }) => (
  <div className="overflow-hidden bg-white">
    <div className="flex w-full cursor-pointer items-center gap-4 p-8 transition-colors hover:bg-[#F8FAFA]">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-visible">
        <img src="/mock/family-icon.png" alt="" className="h-12 w-12 object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[#1F2933]" style={{ fontSize: "16px", fontWeight: 600 }}>Your roles</div>
      </div>
      <CaChevronDownIcon className="h-5 w-5 flex-shrink-0 rotate-180 text-[#6B7280] transition-transform" />
    </div>
    <div className="border-t border-[#F0F1F3]">
      <div className="px-8 py-2">
        <div className="divide-y divide-[#F0F1F3]">
          {roles.map((r) => (
            <div key={r.label} className="flex items-stretch gap-3.5 py-4">
              <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-[#7FC5BF]" />
              <div className="min-w-0 flex-1">
                <div className="text-[#1F2933]" style={{ fontSize: "15px", fontWeight: 600 }}>{r.label}</div>
                <p className="mt-1 text-[#6B7280]" style={{ fontSize: "13.5px", lineHeight: 1.55 }}>{r.definition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * The Shared tab, "Shared with You" (theirs) view, for Maria: Daniel's plan
 * opened from her list ("Daniel Rosen's Plan"). Her roles (Executor, Power of
 * Attorney, Medical Proxy) open; the Estate Plan tile open with the will sealed until he passes
 * away and the trust, POA, medical proxy and deed open to her; Finance,
 * Children and Health open; Digital Life sealed until he passes away; the
 * "Has Daniel passed away?" link under the plan. Canvas 1440 × SH_THEIRS_HEIGHT
 * (the whole page, measured).
 */
const SH_THEIRS_HEIGHT = 2021;
export const SharedWithYouScreen = () => (
  <ClientFrame active="shared" person={MARIA} back height={SH_THEIRS_HEIGHT}>
      {/* ReceivedPlanView */}
      <div className="bg-[#FAFBFC]">
        <div className="border-b border-[#F3F4F6] bg-white px-6 pb-10 pt-12">
          <div className="mx-auto max-w-[900px]">
            <div className="mx-auto max-w-[700px] text-center">
              <h1 className="mb-3 text-[#1F2933]" style={{ fontFamily: "Merriweather, ui-serif, Georgia, serif", fontSize: 42, fontWeight: 600 }}>
                Daniel Rosen&apos;s Plan
              </h1>
              <p className="mx-auto max-w-[540px] text-[#6B7280]" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", fontSize: 17, lineHeight: "1.6" }}>
                Here&rsquo;s what Daniel has shared with you,<br />and how you can help.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FAFBFC] px-6 pb-12 pt-8">
          <div className="mx-auto max-w-[900px]">
            <ShStack>
              <ShYourRoles
                roles={[
                  { label: "Executor", definition: "After Daniel dies, you'll carry out the instructions in Daniel's will and settle Daniel's estate." },
                  { label: "Power of Attorney", definition: "If Daniel can't handle Daniel's own money, you'll step in and handle it for them." },
                  { label: "Medical Proxy", definition: "If Daniel can't make Daniel's own medical decisions, you'll make them on Daniel's behalf." },
                ]}
              />
              <ShCategoryTile cat={SH_CATS.estate} open>
                <div className="px-8 pb-8 pt-6">
                  <ShEstateDocCard className="mb-2" title="Last Will & Testament" lock="Available after they pass away" />
                  <ShEstateDocCard className="mb-2" title="Revocable Living Trust" />
                  <ShEstateDocCard className="mb-2" title="Power of Attorney" summary />
                  <ShEstateDocCard className="mb-2" title="Medical Proxy" summary />
                  <ShEstateDocCard title="Deed" />
                </div>
              </ShCategoryTile>
              <ShCategoryTile cat={SH_CATS.finance} />
              <ShLockedCategoryTile cat={SH_CATS.digital} label="Available after they pass away" />
              <ShCategoryTile cat={SH_CATS.children} />
              <ShCategoryTile cat={SH_CATS.health} />
            </ShStack>

            {/* Something is held until his death, so the plan ends on the
                report link (no access meeting set by the firm). */}
            <div className="mt-6 text-center">
              <span className="inline-flex cursor-pointer items-center gap-1.5 text-[#6B7280] transition-colors hover:text-[#128F8B]" style={{ fontSize: "13.5px", fontWeight: 500 }}>
                <CaHeartIcon className="h-4 w-4" />
                Has Daniel passed away? Let their attorney know
              </span>
            </div>
          </div>
        </div>
      </div>
  </ClientFrame>
);

/* =============================================================================
   YEARLY CHECK-IN
   ============================================================================= */
const CaCloseIcon = mkIcon(<path fillRule="evenodd" clipRule="evenodd" d="M17.07 18.75 17.2 18.84 17.49 18.96 17.8 19 18.11 18.96 18.4 18.84 18.53 18.75 18.75 18.53 18.84 18.4 18.96 18.11 19 17.8 18.99 17.64 18.96 17.49 18.84 17.2 18.65 16.95 13.7 12 18.75 6.93 18.84 6.8 18.96 6.51 19 6.2 18.96 5.89 18.84 5.6 18.75 5.47 18.65 5.35 18.4 5.16 18.11 5.04 17.96 5.01 17.8 5 17.49 5.04 17.2 5.16 17.07 5.25 12 10.3 6.93 5.25 6.66 5.09 6.51 5.04 6.2 5 6.04 5.01 5.74 5.09 5.47 5.25 5.35 5.35 5.16 5.6 5.04 5.89 5.01 6.04 5 6.2 5.04 6.51 5.16 6.8 5.25 6.93 10.3 12 5.25 17.07 5.16 17.2 5.04 17.49 5 17.8 5.04 18.11 5.09 18.26 5.25 18.53 5.47 18.75 5.6 18.84 5.89 18.96 6.04 18.99 6.2 19 6.51 18.96 6.8 18.84 6.93 18.75 12 13.7Z"/>);

/* ---- The yearly check-in ("Has anything changed?") ----------------------
   Copied from apps/clients (origin/main, Nov 17 2026):
   - components/dashboard/touch/conversation.tsx: ChatSheet (the centred sheet
     over a bg-black/50 scrim), Eva, PastTurn, Tile, PrimaryButton, QuietButton
   - components/dashboard/touch/LifeChangesConversation.tsx: the greeting
     ("Hi <first>. <attorney> at <firm> asked me to check in on your plan."),
     the "pick" question turn (askText, "Tap anything that has.", the tiles in
     two columns, "That's right" / "None of these")
   - components/dashboard/touch/LifeChangesCard.tsx: opens the conversation
     with no logo ("the firm is already on the page"), so the sheet's header
     carries the firm's name
   - packages/types/touchpoints.ts: DEFAULT_SURVEY_QUESTIONS[0] (family) and
     DEFAULT_SURVEY_OPTIONS.family, the firm's default questions
   - packages/ui/components/firm-panel.tsx: CheckinPrompt + CHECKIN_INLINE_CLASS
     (the card that opens it, first in "From your firm"'s Recommended actions)
   Eva's portrait is apps/clients/public/image.png = public/mock/eva.png.
   The animations (Eva typing, chatIn slide-ins) are left out: this is the
   turn as it rests once she has finished typing. */

const CA_SERIF = { fontFamily: "Merriweather, Georgia, serif" } as const;

/* conversation.tsx PastTurn, with no answer (the greeting asks nothing) */
const CaPastTurn = ({ q }: { q: string }) => (
  <div className="mb-7">
    <div className="flex items-start gap-3">
      <img src="/mock/eva.png" alt="" className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-full bg-[#54A79A]/10 object-cover" />
      <p className="text-[#6B7280]" style={{ ...CA_SERIF, fontSize: 16, lineHeight: 1.5 }}>{q}</p>
    </div>
  </div>
);

/* conversation.tsx Eva: her portrait and her message, fully typed */
const CaEva = ({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <img src="/mock/eva.png" alt="" className="h-11 w-11 flex-shrink-0 rounded-full bg-[#54A79A]/10 object-cover" />
    <div className="min-w-0 pt-1">
      <h2 className="text-[#1F2933]" style={{ ...CA_SERIF, fontSize: 22, lineHeight: 1.4, fontWeight: 600, textWrap: "balance" } as React.CSSProperties}>
        {children}
      </h2>
      {note && <p className="mt-2 text-[#6B7280]" style={{ fontSize: 14, lineHeight: 1.6 }}>{note}</p>}
    </div>
  </div>
);

/* conversation.tsx Tile without an icon: the label and a dot that fills in */
const CaTile = ({ label, selected = false }: { label: string; selected?: boolean }) => (
  <span
    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${selected ? "border-[#128F8B] bg-[#128F8B]/[0.06]" : "border-[#E5E7EB] bg-white hover:border-[#B8DCDA]"}`}
    style={{ minHeight: 64 }}
  >
    <span className="min-w-0">
      <span className="block text-[#1F2933]" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{label}</span>
    </span>
    <span aria-hidden className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border transition-colors ${selected ? "border-[#128F8B]" : "border-[#D1D5DB] bg-white"}`}>
      <span className={`h-2.5 w-2.5 rounded-full transition-transform ${selected ? "scale-100 bg-[#128F8B]" : "scale-0"}`} />
    </span>
  </span>
);

/* The check-in sheet on its own: conversation.tsx ChatSheet (sm+: 640 wide,
   min(760px, 88vh) tall, rounded-2xl), open on the first question. 640x760. */
export const CheckInSheet = () => (
  <div role="dialog" aria-label="Has anything changed?" className="flex h-[760px] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
    {/* Header: the firm's name (no logo inside the portal), and the × ("Not now") */}
    <div className="flex flex-shrink-0 items-center justify-between px-8 py-5">
      <span className="truncate text-[#1F2933]" style={{ ...CA_SERIF, fontSize: 16, fontWeight: 600 }}>Alvarez Family Law</span>
      <span aria-label="Not now" className="p-1 text-[#9CA3AF] hover:text-[#4B5563]">
        <CaCloseIcon className="h-5 w-5" />
      </span>
    </div>
    <div className="min-h-0 flex-1 overflow-hidden px-8 pb-6 pt-2">
      {/* The greeting, folded up into the thread once she has typed it */}
      <CaPastTurn q="Hi Daniel. Rachel at Alvarez Family Law asked me to check in on your plan." />
      {/* The first of the firm's questions (the default "family" question): tap what applies */}
      <div className="scroll-mt-2">
        <CaEva note="Tap anything that has.">Has your family dynamic changed?</CaEva>
        <div className="mt-8 grid grid-cols-2 gap-3 pl-[60px]">
          {["Got married", "Divorced or separated", "A birth or adoption", "A death in the family", "A new partner"].map((o) => (
            <CaTile key={o} label={o} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 pl-[60px]">
          {/* PrimaryButton, disabled until something is tapped */}
          <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E5E7EB] px-10 py-3 text-[#9CA3AF]" style={{ fontSize: 15, fontWeight: 600 }}>
            That&rsquo;s right
          </span>
          <span className="px-4 py-3 text-[#6B7280] hover:text-[#1F2933]" style={{ fontSize: 15, fontWeight: 500 }}>
            None of these
          </span>
        </div>
      </div>
      <div className="h-8" />
    </div>
  </div>
);

/* Daniel's check-in, open over the client app: ChatSheet's scrim (fixed
   inset-0 z-[60], sm:bg-black/50) centring the sheet. 1440 x 900: at 900 the
   sheet reaches its full 760px (min(760px, 88vh)). `behind` is the page it
   opened over, by default Daniel's Estate Plan tab with "From your firm" open
   on Recommended actions (the conversation opens from the check-in card
   there; while it is open that card renders nothing, LifeChangesCard
   `!open`, so the tab is empty under the scrim). */
export const CheckInScreen = ({ behind = <CaEstatePlanPage firmOpen /> }: { behind?: React.ReactNode }) => (
  <ClientFrame
    active="estate-plan"
    person={DANIEL}
    height={900}
    overlay={
      <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6">
        <CheckInSheet />
      </div>
    }
  >
    {behind}
  </ClientFrame>
);

/* firm-panel.tsx CheckinPrompt in its CHECKIN_INLINE_CLASS frame: the card in
   "From your firm" > Recommended actions that opens the conversation ("Let's
   see"). Fills its container, as the product's inline cell does. */
export const CheckInPromptCard = () => (
  <div role="region" aria-label="Has anything changed?" className="relative h-full w-full rounded-2xl bg-white p-5">
    <p className="pr-6 text-[16px] font-semibold text-[#1F2933]">Alvarez Family Law is checking in</p>
    <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6B7280]">Has anything changed since your plan was signed?</p>
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="inline-flex h-10 items-center rounded-xl bg-[#128F8B] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#0F7673]">
        Let&rsquo;s see
      </span>
      <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#6B7280] underline-offset-4 transition-colors hover:text-[#128F8B] hover:underline">
        Nothing&rsquo;s changed
      </span>
    </div>
  </div>
);
