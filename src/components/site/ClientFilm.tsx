import React, { useEffect, useRef, useState } from "react";
import { FloatStack, ProSidebar, ProTopBar, ScaledScreen, WIcon } from "@/components/product/kit";
import { AttorneyClientsScreen, CLIENT_PANEL_TABS, ProDocRow, ProDocSectionLabel } from "@/components/product/attorney-clients";
import { RoleChain, SummaryCards, SummaryEditToggle } from "@/components/product/attorney-review";
import { OutlookLogo } from "@/components/product/attorney-booking";
import { CalendarCheckIcon, CheckIcon, CloseIcon, ViewIcon } from "@/components/product/willow-icons";
import { ClientFirmNewsScreen, type CaArticle } from "@/components/product/client-app";

/* One client's life on Willow as one film, on the product's real screens:
   1. the signed plan is dropped in, read and filed; names come from the
      documents, emails and phones from Outlook (add-client/setup-wizard.tsx,
      api/clients/find-contact). The film creates the account by itself; in the
      product the attorney confirms it
   2. the summary in the Estate Plan tab: the attorney opens the step-in card,
      puts one of the power of attorney's powers in plain words, closes it and
      approves the summary (in the product that editing happens on the approval
      page, scenario-summary-approval.tsx)
   3. the attorney's Settings > Staying in touch: the client check-in's email,
      one word changed and saved (maintenance-tab.tsx, touchpoint-panel.tsx);
      then Daniel's record on its Staying in touch tab, each check-in with its
      next date (client-detail/staying-in-touch.tsx), and the client check-in
      floating out with the date it sends on its own (touch-email.ts)
   4. Settings > Dashboard content: a link to the firm's article becomes a post
      on every client's dashboard (dashboard-content.tsx, posts.ts), and it
      appears in Daniel's "From your firm", under Resources (firm-panel.tsx).
   Each chapter is its own sequence, with its own start and end. The film plays
   them in order once from where it's opened and stops on the last frame.
   People who prefer reduced motion see each chapter at rest. */

const ROOT_WIDE = { w: 1140, h: 855 }; // a laptop-width window, so the panel reads beside the chapter list
const ROOT_COMPACT = { w: 420, h: 720 };
const PANEL_WIDE = { w: 800, h: 791 }; // under the 64px top bar

/* A dark print with the product on it. On wide screens the product runs off
   the right and bottom edges; on phones it keeps an even mat */
const FilmFrame = ({ compact, size, children }: { compact: boolean; size: { w: number; h: number }; children: React.ReactNode }) => {
  const mat = compact ? { l: 0.04, t: 0.04, r: 0.04, b: 0.04 } : { l: 0.05, t: 0.065, r: 0, b: 0 };
  const w = size.w / (1 - mat.l - mat.r);
  const h = size.h / (1 - mat.t - mat.b);
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#062D2C] shadow-xl" style={{ aspectRatio: `${w} / ${h}` }}>
      <img src="/central-park.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.74)" }} />
      <div
        className={`absolute overflow-hidden bg-white ${compact ? "rounded-lg" : "rounded-tl-xl"}`}
        style={{ left: `${mat.l * 100}%`, top: `${mat.t * 100}%`, right: `${mat.r * 100}%`, bottom: `${mat.b * 100}%`, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
      >
        {children}
      </div>
    </div>
  );
};

export const FILM_CHAPTERS = 4;
/** Optional: lets the dev review page (/dev/film) pause and slow the film */
export type FilmClock = { rate: number; paused: boolean };

type SheetData = { head: string; of: string; tag: string };

const DOCS = [
  { file: "Last Will of Daniel Rosen.pdf", kind: "Last Will & Testament", tag: "Last Will", head: "Last Will and Testament", of: "of Daniel Rosen" },
  { file: "Power of Attorney, Daniel.pdf", kind: "Power of Attorney", tag: "Power of Attorney", head: "Power of Attorney", of: "of Daniel Rosen" },
  { file: "Last Will of Maria Rosen.pdf", kind: "Last Will & Testament", tag: "Last Will", head: "Last Will and Testament", of: "of Maria Rosen" },
  { file: "Power of Attorney, Maria.pdf", kind: "Power of Attorney", tag: "Power of Attorney", head: "Power of Attorney", of: "of Maria Rosen" },
  { file: "Rosen Revocable Trust.pdf", kind: "Revocable Living Trust", tag: "Living Trust", head: "Revocable Trust Agreement", of: "The Rosen Family Trust" },
  { file: "Deed to the Rosen Trust.pdf", kind: "Deed", tag: "Deed", head: "Trust Transfer Deed", of: "to The Rosen Family Trust" },
];
const GROUPS: { label: string; rows: { doc: number; under?: number }[] }[] = [
  { label: "Daniel Rosen", rows: [{ doc: 0 }, { doc: 1 }] },
  { label: "Maria Rosen", rows: [{ doc: 2 }, { doc: 3 }] },
  { label: "Daniel Rosen and Maria Rosen", rows: [{ doc: 4, under: 5 }] },
];

/* Example people: example.com and 555-01xx numbers are reserved and reach nobody */
const ACCOUNTS = [
  { n: 1, first: "Daniel", email: "daniel.rosen@example.com", phone: "+1 212-555-0148" },
  { n: 2, first: "Maria", email: "maria.rosen@example.com", phone: "+1 212-555-0172" },
];

const SHEETS: Record<"docs", SheetData[]> = { docs: DOCS };
const FAN = [-8, -5, -2, 2, 5, 8];

/* The power of attorney's powers, as the step-in card lists them
   (AgentPowersView): the New York statutory short form's subjects with the
   product's own plain descriptions (FINANCIAL_POWERS_NY in
   estate-plan-summary-preview.tsx). In chapter 2 the attorney changes the end
   of the first one */
const POWER_KEEP = "Buy, sell, lease, mortgage, or manage ";
const POWER_BEFORE = "real estate including co-ops, condos, and land";
const POWER_AFTER = "your home and any other real estate";
const POWERS = [
  { power: "Real property transactions", desc: null },
  { power: "Chattel and goods transactions", desc: "Buy, sell, or manage personal property, tangible goods, and safe deposit box contents" },
  { power: "Bond, share and commodity transactions", desc: "Buy, sell, or manage stocks, bonds, mutual funds, and other securities on your behalf" },
  { power: "Banking transactions", desc: "Open and manage accounts, make deposits and withdrawals, and draw checks on your behalf" },
  { power: "Business operating transactions", desc: "Operate, buy, sell, or wind up any business interest you hold" },
  { power: "Insurance transactions", desc: "Purchase, modify, cancel, or file claims on life, health, and property insurance policies" },
  { power: "Estate and trust transactions", desc: "Act on your behalf in estates, trusts, and beneficiary designations you have an interest in" },
  { power: "Claims and litigation", desc: "Initiate, defend, or settle lawsuits and legal claims on your behalf" },
  { power: "Personal and family maintenance", desc: "Provide for your support, housing, education, and the needs of your dependents" },
  { power: "Government and military benefits", desc: "Apply for, receive, and manage Social Security, Medicare, VA, and other public benefits" },
  { power: "Retirement benefits", desc: "Manage retirement accounts and pensions, and make elections regarding plan distributions" },
  { power: "Tax matters", desc: "Prepare, file, and pay taxes; represent you in audits and negotiations with tax authorities" },
];

/* Chapter 3: the attorney's own check-in settings (Settings > Staying in
   touch). Nav, sections, rows and defaults as settings-home.tsx,
   maintenance-tab.tsx and packages/types/touchpoints.ts have them */
const SETTINGS_NAV = [
  { group: "Personal settings", items: ["Profile", "Connections"] },
  { group: "Firm settings", items: ["Firm details", "Branding", "Team", "Billing", "Firm history"] },
  { group: "Client experience", items: ["Meeting types", "Availability", "Calendars", "Staying in touch", "Surveys", "Dashboard content", "Access requests"] },
];
const CHECKINS = [
  { section: "Agent check-ins", title: "Everyone on the team", line: "Email · “Checking in on [client]'s estate plan”", first: "After 1 month" },
  { section: "Professional check-ins", title: "Financial advisor and accountant", line: "Email · “Checking in from [firm] on behalf of [client]”", first: "After 1 year" },
  { section: "Client check-ins", title: "The client", line: "Survey · 6 questions", first: "After 1 year" },
];
/* The client check-in's opening line (DEFAULTS in touchpoints.ts); the
   attorney makes "a while" into "a year", and the sent email says so */
const MAIL_KEEP = "It’s been ";
const MAIL_BEFORE = "a while";
const MAIL_AFTER = "a year";
const MAIL_REST = " since we finished your estate plan, and I wanted to check in.";

/* Daniel's check-ins on his record: the plan was approved Nov 24, 2026, so
   the agent check-in goes after a month and the others after a year */
const CLIENT_NEXT = "November 24, 2027";
const WAYS = [
  { label: "Agent check-ins", next: "December 24" },
  { label: "Professional check-ins", next: CLIENT_NEXT },
  { label: "Client check-ins", next: CLIENT_NEXT },
];

/* Chapter 4: a post from Settings > Dashboard content (the headline is the
   page's own placeholder; yourfirm.com is its placeholder link) */
const NEWS_URL = "https://yourfirm.com/blog/the-new-estate-tax-threshold";
const NEWS: CaArticle = {
  date: "November 24, 2026",
  title: "What the new estate tax threshold means",
  body: "How it affects your plan, and whether you need to do anything.",
};
const NEWS_OLDER: CaArticle = {
  date: "October 20, 2026",
  title: "How often you should update your estate plan",
  body: "Life changes, and your plan should too. Here’s when it’s worth a second look.",
};
const DANIEL_EXAMPLE = { name: "Daniel Rosen", email: "daniel.rosen@example.com" };

/** How long each chapter runs at normal speed */
export const FILM_MS = [12460, 8290 + POWER_AFTER.length * 22, 8390, 8370];

/* A button pressing itself: nothing crosses the screen to click it */
const tapStyle = (on: boolean): React.CSSProperties => ({
  transform: on ? "scale(0.96)" : "scale(1)",
  boxShadow: on ? "0 0 0 6px rgba(48,158,150,0.22)" : "0 0 0 0 rgba(48,158,150,0)",
  transition: "transform 180ms var(--ease-out), box-shadow 340ms ease",
});

type Beat = "empty" | "carry" | "reading" | "filed" | "accounts" | "docs" | "summary" | "ahead" | "mail" | "posts" | "dash";
/* The full-screen views after chapter 2, bottom to top ("mail" is the
   client's record itself, with the email floating over it) */
const LAYERS: Beat[] = ["ahead", "posts", "dash"];
type Place = "off" | "carry" | "gather" | "fan" | "file" | "hidden";
type Point = { x: number; y: number };
type Tap = "continue" | "stepin" | "edit" | "done" | "approve" | "message" | "save" | "row" | "read" | "post" | "firm" | null;
type EditStage = "idle" | "select" | "typing" | "done";

const MOVE = "cubic-bezier(0.45, 0.05, 0.35, 1)";
const FIGTREE = "Figtree, Inter, sans-serif";

const useCompact = () => {
  const [compact, setCompact] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setCompact(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return compact;
};

const Fade = ({ on, delay = 0, children }: { on: boolean; delay?: number; children: React.ReactNode }) => (
  <div style={{ opacity: on ? 1 : 0, transition: on ? `opacity 240ms ease ${delay}ms` : "none" }}>{children}</div>
);

const Appear = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <div className={className} style={{ opacity: on ? 1 : 0, transition: "opacity 240ms ease" }}>{children}</div>;
};

const Title = () => (
  <h3 className="text-[28px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: FIGTREE }}>
    Upload your client&apos;s estate plan
  </h3>
);

const Progress = ({ step = 1 }: { step?: 1 | 2 }) => (
  <div className="mb-6 mt-3">
    <p className="mb-2 text-[15px] font-semibold text-[#309E96]">
      {step} of 2<span className="font-medium text-[#9CA3AF]"> · {step === 1 ? "Their documents" : "Create their accounts"}</span>
    </p>
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF0F2]">
      <div className="h-full rounded-full bg-[#309E96]" style={{ width: step === 1 ? "50%" : "100%" }} />
    </div>
  </div>
);

/* Where Willow is looking: the source's own icon, one soft pulse per search */
const SEARCH_PULSE = "@keyframes film-search-pulse { 0%, 100% { transform: scale(0.9); opacity: 0.55; } 50% { transform: scale(1.12); opacity: 1; } }";
const SearchMark = ({ children }: { children: React.ReactNode }) => (
  <span data-search-mark className="ml-px flex h-4 w-4 flex-shrink-0 items-center justify-center" style={{ animation: "film-search-pulse 720ms ease-in-out infinite" }}>
    {children}
  </span>
);

/* Step 2 of the real form, filling itself in: names from the documents, then
   Outlook finds Daniel, then Maria, then their address fills its blank fields */
const TheirAccounts = ({ found, looking, address, pulse, compact }: { found: number; looking: number; address: boolean; pulse: boolean; compact: boolean }) => {
  const field = `min-w-0 truncate border-b border-[#E5E7EB] leading-[22px] text-[#1F2933] ${compact ? "py-2 text-[14px]" : "py-2.5 text-[15px]"}`;
  const section = compact ? "bg-white p-4" : "bg-white p-6";
  const clear = "opacity 170ms ease";
  const fade = "opacity 460ms ease 170ms";
  const filled = (on: boolean, empty: React.ReactNode, value: string) => (
    <div className={`relative ${field}`}>
      <span className="flex items-center gap-1.5 truncate text-[#9CA3AF]" style={{ opacity: on ? 0 : 1, transition: clear }}>{empty}</span>
      <span className="absolute inset-x-0 truncate" style={{ top: compact ? 8 : 10, opacity: on ? 1 : 0, transition: fade }}>{value}</span>
    </div>
  );
  const street =
    looking === 3 ? (
      <>
        <SearchMark><WIcon name="document" className="h-4 w-4 text-[#309E96]" /></SearchMark>
        Searching documents&hellip;
      </>
    ) : (
      "Street address"
    );
  return (
    <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
      <style>{SEARCH_PULSE}</style>
      <div className="flex flex-col gap-1.5">
        {ACCOUNTS.map((p) => {
          const on = found >= p.n;
          const email = filled(
            on,
            looking === p.n ? (
              <>
                <SearchMark><OutlookLogo className="h-4 w-4" /></SearchMark>
                Searching Outlook&hellip;
              </>
            ) : (
              "Email *"
            ),
            p.email
          );
          const phone = filled(on, "Phone", p.phone);
          return (
            <div key={p.n} className={section}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Client {p.n}</p>
                {p.n === 1 && <p className="text-[11.5px] text-[#9CA3AF]">* Required</p>}
              </div>
              {compact ? (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={field}>{p.first}</div>
                    <div className={field}>Rosen</div>
                  </div>
                  {email}
                  {phone}
                </div>
              ) : (
                <div className="grid grid-cols-2 items-start gap-x-6 gap-y-2">
                  <div className={field}>{p.first}</div>
                  <div className={field}>Rosen</div>
                  {email}
                  {phone}
                </div>
              )}
            </div>
          );
        })}
        <div className={section}>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
            Their home address{" "}
            <span className="font-normal normal-case tracking-normal" style={{ opacity: address ? 1 : 0, transition: address ? fade : clear }}>
              (from their documents)
            </span>
          </p>
          {compact ? (
            filled(address, street, "85 Grove Street, New York, 10014")
          ) : (
            <div className="grid grid-cols-2 gap-x-6">
              {filled(address, street, "85 Grove Street")}
              <div className="grid grid-cols-[1fr_96px] gap-x-6">
                {filled(address, "City", "New York")}
                {filled(address, "ZIP code", "10014")}
              </div>
            </div>
          )}
        </div>
        <div className={compact ? "bg-white p-3" : "bg-white px-6 py-4"}>
          <div
            className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#309E96] text-[15px] font-semibold text-white"
            style={{
              opacity: address ? 1 : 0.5,
              transform: pulse ? "scale(0.97)" : "scale(1)",
              boxShadow: pulse ? "0 0 0 6px rgba(48,158,150,0.24)" : "0 0 0 0 rgba(48,158,150,0)",
              transition: "opacity 420ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease",
            }}
          >
            Add clients
          </div>
        </div>
      </div>
    </div>
  );
};

const DropLine = ({ active }: { active?: boolean }) => (
  <div className="border-b py-3" style={{ borderColor: active ? "#309E96" : "#E5E7EB", transition: "border-color 160ms ease" }}>
    <div className="flex items-baseline justify-between gap-4">
      <p className="text-[14px] text-[#6B7280]">Drop all their documents here.</p>
      <span className="text-[14px] font-medium text-[#309E96]">Choose PDFs</span>
    </div>
  </div>
);

const DocRowView = ({ d, nested, iconRef }: { d: (typeof DOCS)[number]; nested?: boolean; iconRef?: (el: HTMLSpanElement | null) => void }) => (
  <div className={nested ? "py-2.5" : "py-3"}>
    <div className="flex items-start justify-between gap-3">
      <span ref={iconRef} className="mt-0.5 flex-shrink-0">
        <WIcon name="document" className={`block text-[#309E96] ${nested ? "h-4 w-4" : "h-5 w-5"}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium text-[#1F2933] ${nested ? "text-[13.5px]" : "text-[14px]"}`}>{d.file}</p>
        <div className="mt-1">
          <span className="inline-block border-b border-dashed border-[#D1D5DB] py-0.5 text-[13px] text-[#374151]">{d.kind}</span>
        </div>
      </div>
      <div className="mt-0.5 flex shrink-0 items-center gap-1 text-[#9CA3AF]">
        <span className="rounded p-1"><ViewIcon className="block h-4 w-4" /></span>
        <span className="rounded p-1"><CloseIcon className="block h-4 w-4" /></span>
      </div>
    </div>
  </div>
);

const DocGroups = ({ on, iconRefs }: { on: boolean; iconRefs: React.MutableRefObject<(HTMLSpanElement | null)[]> }) => {
  const ref = (n: number) => (el: HTMLSpanElement | null) => { iconRefs.current[n] = el; };
  return (
    <div className="flex flex-col">
      {GROUPS.map((g, gi) => (
        <div key={g.label} className={gi > 0 ? "mt-5" : ""}>
          <Fade on={on} delay={g.rows[0].doc * 70 + 340}>
            <p className="pt-2 text-[12px] font-medium uppercase tracking-wide text-[#9CA3AF]">{g.label}</p>
          </Fade>
          {g.rows.map(({ doc, under }) => (
            <div key={doc} className="py-1">
              <Fade on={on} delay={doc * 70 + 440}>
                <DocRowView d={DOCS[doc]} iconRef={ref(doc)} />
              </Fade>
              {under !== undefined && (
                <div className="pl-8">
                  <Fade on={on} delay={under * 70 + 440}>
                    <DocRowView d={DOCS[under]} nested iconRef={ref(under)} />
                  </Fade>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/* A sheet of paper: the signed plan in chapter 1, a check-in after that */
const Sheet = ({ d, scanning, scanned }: { d: SheetData; scanning: boolean; scanned: boolean }) => (
  <div className="relative h-full w-full overflow-hidden rounded-[5px] bg-white px-2.5 pt-3" style={{ boxShadow: "0 1px 2px rgba(11,18,32,0.14), 0 10px 22px rgba(6,45,44,0.22)" }}>
    <p className="text-center font-heading text-[7px] font-bold uppercase leading-[1.35] tracking-[0.05em] text-[#1F2933]">{d.head}</p>
    <p className="mt-0.5 text-center font-heading text-[6.5px] leading-tight text-[#475569]">{d.of}</p>
    <div className="mx-auto my-2 w-5 border-t border-[#94A3B8]" />
    {[100, 94, 98, 88, 96, 70].map((w, i) => (
      <div key={i} className="mb-[5px] h-[2.5px] rounded-full bg-[#E2E8F0]" style={{ width: `${w}%` }} />
    ))}
    <div
      className="absolute inset-x-0 h-9"
      style={{
        top: scanning || scanned ? "100%" : "-36px",
        opacity: scanning ? 1 : 0,
        background: "linear-gradient(180deg, rgba(48,158,150,0), rgba(48,158,150,0.26))",
        borderBottom: "2px solid #309E96",
        transition: scanning ? "top 340ms linear" : "opacity 120ms ease",
      }}
    />
    <div
      className="absolute inset-x-1.5 bottom-1.5 whitespace-nowrap rounded bg-[#F0F9F9] py-1 text-center text-[9px] font-semibold text-[#0F7673]"
      style={{ opacity: scanned ? 1 : 0, transform: scanned ? "translateY(0)" : "translateY(3px)", transition: "opacity 180ms ease, transform 220ms var(--ease-out)" }}
    >
      {d.tag}
    </div>
  </div>
);

const SubTabs = ({ active, right }: { active: "Documents" | "Summary"; right?: React.ReactNode }) => (
  <div className="mb-6 flex flex-shrink-0 items-center justify-between gap-3 border-b border-[#E5E7EB] pb-px">
    <div className="flex">
      {(["Documents", "Summary"] as const).map((t) => (
        <span
          key={t}
          data-sub={t}
          className={`whitespace-nowrap rounded-t-md border-b-2 px-4 py-3 text-[13px] font-medium ${t === active ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"}`}
        >
          {t}
        </span>
      ))}
    </div>
    {right}
  </div>
);

const TheirDocuments = () => (
  <>
    <SubTabs active="Documents" />
    <div className="space-y-6">
      <div>
        <ProDocSectionLabel label="Daniel's documents" action="Choose PDFs" />
        <FloatStack>
          <ProDocRow roomy label="Last Will & Testament" />
          <ProDocRow roomy label="Power of Attorney" />
        </FloatStack>
      </div>
      <div>
        <ProDocSectionLabel label="Joint with Maria" />
        <FloatStack>
          <div>
            <ProDocRow roomy label="Revocable Living Trust" detail="Joint trust (married couple)" />
            <div className="px-8 pb-5">
              <div className="border-t border-[#E5E7EB]" />
              <div className="pl-10 pt-3">
                <ProDocRow roomy nested label="Deed" detail="Trust transfer deed" />
              </div>
            </div>
          </div>
        </FloatStack>
      </div>
    </div>
  </>
);

/* Text being rewritten: selected, then typed over, then settled. `keep` is
   the start of the line, left as it is */
const Rewrite = ({ stage, before, after, typed, keep = "", rest = "" }: { stage: EditStage; before: string; after: string; typed: number; keep?: string; rest?: string }) => (
  <>
    {keep}
    {stage === "idle" && before}
    {stage === "select" && <span className="bg-[#CDEBE8]">{before}</span>}
    {stage === "typing" && (
      <>
        {after.slice(0, typed)}
        <span className="ml-px inline-block h-[14px] w-px translate-y-[2px] bg-[#1F2933]" />
      </>
    )}
    {stage === "done" && after}
    {rest}
  </>
);

/* Chapter 2: the step-in card for Daniel's power of attorney: his agents in
   order (RoleChainView), then what they can do (AgentPowersView: one document,
   so its label instead of tabs; Power / What this means). The block's Edit
   sits on its label's line, as a SubBlock's action does, so it stays in view
   above the long table */
const StepInBody = ({ edit, typed, tap }: { edit: EditStage; typed: number; tap: Tap }) => {
  const editing = edit === "select" || edit === "typing";
  return (
    <Appear>
      <RoleChain role="Financial Agent" steps={["Maria Rosen", "Leo Rosen"]} />
      <div data-powers className="mt-8">
        <div data-powers-action className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">Financial Agent powers</p>
          {editing ? (
            <span className="inline-flex items-center gap-1 rounded text-[#309E96]" style={{ fontSize: 12, fontWeight: 600, ...tapStyle(tap === "done") }}>
              <CheckIcon className="h-3.5 w-3.5" />
              Done
            </span>
          ) : (
            <span className="rounded" style={tapStyle(tap === "edit")}><SummaryEditToggle /></span>
          )}
        </div>
        <div className="overflow-hidden rounded-xl" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div className="flex bg-[#128F8B] text-[13px] font-semibold text-white">
            <div className="w-[34%] flex-shrink-0 px-5 py-3">Power</div>
            <div className="min-w-0 flex-1 px-5 py-3">What this means</div>
          </div>
          {POWERS.map((w, i) => (
            <div key={w.power} className={`flex items-start border-b border-[#E5E7EB] last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}>
              <div className="w-[34%] flex-shrink-0 px-5 py-4 text-[14px] font-medium text-[#1F2933]">{w.power}</div>
              <div className="min-w-0 flex-1 px-5 py-4 text-[14px] leading-[1.5] text-[#6B7280]">
                {w.desc ?? (
                  <span
                    className="block rounded-[3px]"
                    style={{
                      color: edit === "idle" ? undefined : "#1F2933",
                      boxShadow: editing ? "0 0 0 1px #309E96, 0 0 0 4px rgba(48,158,150,0.14)" : "0 0 0 0 rgba(48,158,150,0)",
                      transition: "box-shadow 180ms ease",
                    }}
                  >
                    <Rewrite stage={edit} keep={POWER_KEEP} before={POWER_BEFORE} after={POWER_AFTER} typed={typed} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Appear>
  );
};

/* Chapters 3 and 4 open the attorney's Settings (settings/page.tsx): the
   sidebar and top bar, the settings nav (settings-home.tsx, lg and up, so not
   on phones), the page title and line, then the page */
const SettingsShell = ({ page, title, line, compact, children, over }: { page: string; title: string; line: string; compact: boolean; children: React.ReactNode; over?: React.ReactNode }) => {
  const head = (
    <>
      <h3 className="text-[24px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.25, fontFamily: FIGTREE }}>{title}</h3>
      <p className="mt-1.5 text-[14px] text-[#6B7280]">{line}</p>
    </>
  );
  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#F0F2F5] text-left" style={{ fontFamily: FIGTREE }}>
      {!compact && <ProSidebar active="settings" />}
      <div className="flex min-w-0 flex-1 flex-col">
        {!compact && <ProTopBar />}
        {compact ? (
          <div className="px-4 pt-6">
            {head}
            <div className="mt-6">{children}</div>
          </div>
        ) : (
          <div className="flex gap-10 px-16 py-10">
            <nav className="flex w-[200px] flex-shrink-0 flex-col gap-5">
              {SETTINGS_NAV.map((g) => (
                <div key={g.group}>
                  <p className="mb-1 truncate px-3 text-[12px] font-semibold text-[#1F2933]">{g.group}</p>
                  {g.items.map((t) => (
                    <p key={t} className={`px-3 py-1.5 text-[13px] ${t === page ? "font-semibold text-[#309E96]" : "text-[#6B7280]"}`}>{t}</p>
                  ))}
                </div>
              ))}
            </nav>
            <div className="min-w-0 max-w-[860px] flex-1">
              {head}
              <div className="mt-8">{children}</div>
            </div>
          </div>
        )}
      </div>
      {over}
    </div>
  );
};

/* panel-kit.tsx: a drawer section, its title, a grey summary while folded */
const PanelSection = ({ title, summary, open, children }: { title: string; summary?: string; open?: boolean; children?: React.ReactNode }) => (
  <div className="border-b border-[#EEF0F2]">
    <div className="flex items-center gap-3 px-[21px] py-[13px]">
      <span className="flex-shrink-0 text-[15px] font-semibold text-[#1F2933]">{title}</span>
      <span className="min-w-0 flex-1 truncate text-right text-[12px] text-[#9CA3AF]">{open ? "" : summary}</span>
      <WIcon name="chevronDown" className={`h-4 w-4 flex-shrink-0 text-[#9CA3AF] ${open ? "rotate-180" : ""}`} />
    </div>
    {open && <div className="px-[21px] pb-[21px]">{children}</div>}
  </div>
);

/* A fill-in as the composer shows it: a quiet pill in place of the name */
const FillIn = ({ children }: { children: React.ReactNode }) => (
  <span className="mx-px inline-flex items-center rounded-md bg-[#E6F5F4] px-1.5 text-[13px] font-medium leading-[22px] text-[#0F7673]">{children}</span>
);

/* Chapter 3, first half: Settings > Staying in touch. The three lists
   (maintenance-tab.tsx, journey-column.tsx, board-card.tsx), then the Client
   check-in's drawer (touchpoint-panel.tsx) open on The email: the subject,
   the message with its fill-ins, and the survey it asks */
const StayingInTouch = ({ hi, drawer, edit, typed, saved, tap, compact }: { hi: number; drawer: boolean; edit: EditStage; typed: number; saved: boolean; tap: Tap; compact: boolean }) => {
  const editing = edit === "select" || edit === "typing";
  const dirty = edit !== "idle" && !saved;
  const board = (
    <div className="flex w-full min-w-0 flex-col gap-1.5 overflow-hidden rounded-2xl bg-[#F3F4F6]">
      {CHECKINS.map((c, i) => (
        <div key={c.section} className={compact ? "bg-white px-5 pb-3 pt-4" : "bg-white px-8 pb-5 pt-6"}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">{c.section}</p>
            <WIcon name="more" className="h-4 w-4 text-[#9CA3AF]" />
          </div>
          <div className="pt-1">
            <div className="-mx-2 flex min-h-[56px] items-center gap-2 px-2 py-[13px]" style={{ background: hi === i ? "#F0F9F8" : "rgba(240,249,248,0)", transition: "background-color 220ms ease" }}>
              <span className="mt-[7px] h-2 w-2 flex-shrink-0 self-start rounded-full bg-[#8CCBC5]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-[#1F2933]">{c.title}</span>
                <span className="mt-0.5 block truncate text-[12.5px] text-[#9CA3AF]">{c.line}</span>
              </span>
              <span className="flex-shrink-0 text-right text-[12.5px]">
                <span className="block text-[#6B7280]">{c.first}</span>
                <span className="block text-[#9CA3AF]">then every year</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  const label = "mb-1 text-[12px] font-medium text-[#6B7280]";
  const drawerEl = (
    <>
      <div className={`absolute inset-x-0 bottom-0 bg-[#1F2933] ${compact ? "top-0" : "top-16"}`} style={{ opacity: drawer ? 0.2 : 0, transition: "opacity 240ms ease" }} />
      <div
        className={`absolute bottom-0 right-0 border-l border-[#E5E7EB] bg-white ${compact ? "top-0 w-full" : "top-16 w-[480px]"}`}
        style={{ boxShadow: drawer ? "0 0 48px rgba(16,24,40,0.16)" : "none", transform: drawer ? "translateX(0)" : "translateX(100%)", transition: "transform 320ms var(--ease-out), box-shadow 320ms ease" }}
      >
        <div className="flex items-center justify-between border-b border-[#EEF0F2] px-[21px] py-[13px]">
          <span className="text-[17px] font-semibold text-[#1F2933]">Client check-in</span>
          <span className="flex items-center gap-2">
            <span className="rounded p-1.5 text-[#9CA3AF]"><WIcon name="more" className="h-4 w-4" /></span>
            <span
              className="inline-flex h-[34px] items-center rounded-md px-[13px] text-[13.5px] font-semibold"
              style={{ background: dirty ? "#309E96" : "#F3F4F6", color: dirty ? "#FFFFFF" : "#9CA3AF", ...tapStyle(tap === "save"), transition: "background-color 200ms ease, color 200ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease" }}
            >
              Save
            </span>
          </span>
        </div>
        <PanelSection title="The email" open>
          <p className={label}>Subject</p>
          <p className="truncate border-b border-[#E5E7EB] pb-2 text-[15px] text-[#1F2933]">Checking in: has anything changed?</p>
          <p className={`${label} mt-5`}>Message</p>
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-1.5 text-[12.5px] text-[#6B7280]">
            <span className="font-bold">B</span>
            <span className="italic">I</span>
            <span className="h-3.5 w-px bg-[#E5E7EB]" />
            <span>Fill-ins</span>
            <span>Links</span>
            <span>Files</span>
            <span>Signature</span>
          </div>
          <div className="mt-3 space-y-3 text-[15px] leading-6 text-[#1F2933]">
            <p>Hi <FillIn>Client’s first name</FillIn>,</p>
            <p
              className="rounded-[3px]"
              style={{ boxShadow: editing || tap === "message" ? "0 0 0 1px #309E96, 0 0 0 4px rgba(48,158,150,0.14)" : "0 0 0 0 rgba(48,158,150,0)", transition: "box-shadow 180ms ease" }}
            >
              <Rewrite stage={edit} keep={MAIL_KEEP} before={MAIL_BEFORE} after={MAIL_AFTER} rest={MAIL_REST} typed={typed} />
            </p>
            <p>Once a year I ask every client the same short questions; it’s how we make sure your plan still says what you want it to.</p>
            <p>
              <FillIn>Your first name</FillIn>
              <br />
              <FillIn>Your firm</FillIn>
            </p>
          </div>
          <p className="mt-4 text-[12.5px] text-[#6B7280]">
            Asks your Check-in survey · 6 questions <span className="font-medium text-[#309E96]">Edit in Surveys</span>
          </p>
        </PanelSection>
        <PanelSection title="Call after the check-in" summary="They book" />
        <PanelSection title="Preferences" summary="After 1 year · Once a year" />
      </div>
    </>
  );
  return (
    <SettingsShell page="Staying in touch" title="Staying in touch" line="Yearly reviews, check-ins and surveys after a plan is signed." compact={compact} over={drawerEl}>
      {board}
    </SettingsShell>
  );
};

/* Chapter 3, second half: Daniel's record on its Staying in touch tab
   (client-detail/staying-in-touch.tsx): one switch per kind of check-in with
   its next date ("Next: …", the year only when it isn't this one). The
   product also shows the date each schedule counts from; the film leaves it
   out to keep the three check-ins plain. The client's is pressed and lights up */
const ClientStayingInTouch = ({ hi, tap, compact }: { hi: boolean; tap: Tap; compact: boolean }) => (
  <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
    <div className={compact ? "bg-white p-6" : "bg-white p-8"}>
      <p className="mb-4 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]" style={{ fontFamily: FIGTREE }}>Staying in touch</p>
      {WAYS.map((w, i) => {
        const lit = hi && i === WAYS.length - 1;
        return (
          <div
            key={w.label}
            data-way={w.label}
            className="-mx-3 rounded-lg px-3"
            style={{
              background: lit ? "#F0F9F8" : "rgba(240,249,248,0)",
              boxShadow: tap === "row" && i === WAYS.length - 1 ? "0 0 0 2px rgba(48,158,150,0.45)" : "0 0 0 0 rgba(48,158,150,0)",
              transition: "background-color 260ms ease, box-shadow 240ms ease",
            }}
          >
            <div className={`flex items-center gap-[13px] py-2.5 ${i < WAYS.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] text-[#1F2933]">{w.label}</span>
                <span className="mt-px block text-[12px]" style={{ color: lit ? "#309E96" : "#9CA3AF", fontWeight: lit ? 600 : 400, transition: "color 260ms ease" }}>
                  Next: {w.next}
                </span>
              </span>
              <span className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-[#309E96]">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow" style={{ transform: "translateX(18px)" }} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* The client check-in itself, floating over the record: the date it goes out
   on its own, the subject and who it's to, then the email as touch-email.ts
   renders it (the logo, Willow's while the firm has none; the words with the
   attorney's change; the button) */
const FloatingCheckIn = ({ compact }: { compact: boolean }) => {
  const para = { fontSize: compact ? 14 : 15, lineHeight: 1.6 };
  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 28px 64px rgba(16,24,40,0.26), 0 3px 10px rgba(16,24,40,0.10)" }}>
      <div className={`border-b border-[#EEF0F2] ${compact ? "px-5 py-3" : "px-7 py-3.5"}`} style={{ fontFamily: FIGTREE }}>
        <p className="flex items-center gap-2 text-[13px] font-semibold text-[#0F7673]">
          <CalendarCheckIcon className="h-4 w-4 flex-shrink-0 text-[#309E96]" />
          Sends automatically on {CLIENT_NEXT}
        </p>
        <p className="mt-1.5 truncate text-[14.5px] font-semibold text-[#1F2933]">Checking in: has anything changed?</p>
        {!compact && <p className="mt-0.5 text-[12.5px] text-[#6B7280]">To Daniel Rosen</p>}
      </div>
      <div className={compact ? "px-5 pb-4 pt-3.5" : "px-7 pb-6 pt-5"} style={{ fontFamily: "Arial, 'Segoe UI', sans-serif" }}>
        <img src="/logo.png" alt="" className={compact ? "mb-3" : "mb-4"} style={{ height: compact ? 19 : 26, width: "auto" }} />
        <p className="mb-3 text-[#374151]" style={para}>Hi Daniel,</p>
        <p className="mb-3 text-[#374151]" style={para}>{MAIL_KEEP}{MAIL_AFTER}{MAIL_REST}</p>
        <span className="mt-1 inline-block rounded-md bg-[#309E96] font-semibold text-white" style={{ padding: compact ? "10px 18px" : "11px 22px", fontSize: compact ? 14 : 15 }}>
          Let us know what’s changed
        </span>
      </div>
    </div>
  );
};

/* Chapter 4, first half: Settings > Dashboard content (dashboard-content.tsx).
   Paste a link, "Read link" reads its headline and blurb, the draft opens
   with the kind, "Post to dashboards" sends it to every active client's
   dashboard, and it tops the Posted list. step: 0 empty, 1 pasted,
   2 reading, 3 the draft, 4 posted */
const DashboardContent = ({ step, tap, compact }: { step: number; tap: Tap; compact: boolean }) => {
  const field = "text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]";
  const line = "border-b border-[#E5E7EB] py-2.5 text-[15px] text-[#1F2933]";
  const quiet = "text-[13px] font-medium text-[#128F8B]";
  const posted = step >= 4;
  return (
    <SettingsShell page="Dashboard content" title="Dashboard content" line="Articles and updates your clients see on their dashboard." compact={compact}>
      <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
        <div className={compact ? "bg-white p-6" : "bg-white p-8"}>
          <p className={field}>Posts</p>
          <p className="mt-1 text-[12px] text-[#9CA3AF]">Paste a link to something your firm published.</p>
          {step === 3 ? (
            <div className="mt-5 flex flex-col gap-5">
              <Appear>
                <p className="truncate text-[12.5px] text-[#9CA3AF]">{NEWS_URL}</p>
                <div className="mt-5">
                  <p className={field}>Headline</p>
                  <p className={line}>{NEWS.title}</p>
                </div>
                <div className="mt-5">
                  <p className={field}>Description</p>
                  <p className={`${line} leading-6`}>{NEWS.body}</p>
                </div>
                <div className="mt-5">
                  <p className={field}>Kind</p>
                  <p className={`${line} flex items-center justify-between`}>
                    Tax updates
                    <WIcon name="chevronDown" className="h-4 w-4 text-[#9CA3AF]" />
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <span className="rounded-lg bg-[#128F8B] px-4 py-2 text-[14px] font-medium text-white" style={tapStyle(tap === "post")}>Post to dashboards</span>
                  <span className={quiet}>Cancel</span>
                </div>
              </Appear>
            </div>
          ) : (
            <>
              <div className="mt-5 flex items-end gap-4">
                <p className={`min-w-0 flex-1 truncate border-b border-[#E5E7EB] py-2.5 text-[15px] ${step === 1 || step === 2 ? "text-[#1F2933]" : "text-[#9CA3AF]"}`}>
                  {step === 1 || step === 2 ? NEWS_URL : "https://yourfirm.com/blog/…"}
                </p>
                <span className={`${quiet} flex-shrink-0 rounded pb-2.5`} style={tapStyle(tap === "read")}>{step === 2 ? "Reading…" : "Read link"}</span>
              </div>
              {posted && <Appear><p className="mt-4 text-[13px] text-[#6B7280]">Posted to 48 clients’ dashboards.</p></Appear>}
            </>
          )}
          <div className="mt-6 border-t border-[#F0F1F3] pt-5">
            <p className={field}>Posted</p>
            <div className="mt-1">
              <div style={{ display: "grid", gridTemplateRows: posted ? "1fr" : "0fr", opacity: posted ? 1 : 0, transition: "grid-template-rows 460ms cubic-bezier(0.77, 0, 0.175, 1), opacity 300ms ease 140ms" }}>
                <div className="min-h-0 overflow-hidden">
                  <PostedRow a={NEWS} />
                </div>
              </div>
              <PostedRow a={NEWS_OLDER} last />
            </div>
          </div>
        </div>
      </div>
    </SettingsShell>
  );
};

const PostedRow = ({ a, last }: { a: CaArticle; last?: boolean }) => (
  <div className={`flex items-start gap-3 py-3 ${last ? "" : "border-b border-[#F0F1F3]"}`}>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-[14px] font-medium text-[#1F2933]">{a.title}</span>
      <span className="mt-0.5 block truncate text-[12.5px] text-[#9CA3AF]">{a.body}</span>
      <span className="mt-1.5 block text-[12.5px] text-[#9CA3AF]">{a.date}</span>
    </span>
    <WIcon name="more" className="mt-1 h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
  </div>
);

type Props = {
  chapter: number;
  /** Changes when someone reopens a chapter, so it plays again */
  replay: number;
  onChapter: (next: number) => void;
  /** A chapter has started and will take this many milliseconds (0: at rest) */
  onStart: (ms: number) => void;
  clock?: FilmClock;
  /** Play a chapter again when it's reopened (the dev review page). On the
      site a chapter already seen opens on its last frame */
  rewatch?: boolean;
};

const ClientFilm = ({ chapter, replay, onChapter, onStart, clock, rewatch = false }: Props) => {
  const compact = useCompact();
  const root = compact ? ROOT_COMPACT : ROOT_WIDE;
  const stage = compact ? ROOT_COMPACT : PANEL_WIDE;
  const panelCx = compact ? root.w / 2 : root.w - PANEL_WIDE.w / 2;
  const pad = compact ? 24 : 32;
  const cardEmpty = pad * 2 + 46;
  const sheet = compact ? { w: 112, h: 146 } : { w: 94, h: 124 }; // six fit inside the card's padding

  const frameRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const doneKey = useRef("");
  /* The chapters that have started playing, and the last click we've seen */
  const played = useRef(new Set<number>());
  const lastReplay = useRef(replay);
  const callbacks = useRef({ onChapter, onStart });
  callbacks.current = { onChapter, onStart };

  const [inView, setInView] = useState(false);
  const [beat, setBeat] = useState<Beat>("empty");
  const [sheetSet, setSheetSet] = useState<keyof typeof SHEETS>("docs");
  const [place, setPlace] = useState<Place>("off");
  const [scan, setScan] = useState(-1);
  const [fanY, setFanY] = useState(0);
  const [targets, setTargets] = useState<Point[]>([]);
  const [tap, setTap] = useState<Tap>(null);
  const [edit, setEdit] = useState<EditStage>("idle");
  const [typed, setTyped] = useState(0);
  const [sent, setSent] = useState(false);
  const [stepIn, setStepIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [rowHi, setRowHi] = useState(-1);
  const [mailEdit, setMailEdit] = useState<EditStage>("idle");
  const [mailTyped, setMailTyped] = useState(0);
  const [stayHi, setStayHi] = useState(false);
  const [mailOn, setMailOn] = useState(false);
  const [newsStep, setNewsStep] = useState(0);
  const [dashOpen, setDashOpen] = useState(false);
  const [freshOn, setFreshOn] = useState(false);
  const [found, setFound] = useState(0);
  const [looking, setLooking] = useState(0);
  const [address, setAddress] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [summaryScroll, setSummaryScroll] = useState(0);
  const [cardH, setCardH] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<Point>({ x: 0, y: 0 });
  const [scrollA, setScrollA] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView((was) => entry.intersectionRatio >= 0.5 || (was && entry.isIntersecting)),
      { threshold: [0, 0.5] }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  /* The tab row scrolls on phones: keep the open tab in sight */
  /* The record shows Estate Plan, and Staying in touch from chapter 3's
     second half on (under chapter 4's full-screen views too) */
  const openTab = beat === "mail" || beat === "posts" || beat === "dash" ? "Staying in touch" : "Estate Plan";
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>(`[data-tab="${openTab}"]`);
    if (row && tab) row.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: "smooth" });
  }, [openTab]);

  /* How far to scroll the summary to bring the powers, with their Edit, to the top */
  const powersScroll = () => {
    const win = cardsRef.current;
    const powers = win?.querySelector("[data-powers]");
    const r0 = rootRef.current;
    if (!win || !powers || !r0) return 0;
    const k = r0.getBoundingClientRect().width / (compact ? ROOT_COMPACT : ROOT_WIDE).w;
    return Math.max(0, (powers.getBoundingClientRect().top - win.getBoundingClientRect().top) / k - 12);
  };

  useEffect(() => {
    const key = `${chapter}:${replay}:${compact}`;
    /* A click on the chapter list (replay changes) */
    const clicked = replay !== lastReplay.current;
    lastReplay.current = replay;
    if (doneKey.current === key) return;

    /* A chapter already seen, opened again from the list, goes straight to its
       last frame and stays there. People who prefer reduced motion get every
       chapter that way */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || (clicked && !rewatch && played.current.has(chapter))) {
      doneKey.current = key;
      setPlace("hidden");
      setScan(-1);
      setTargets([]);
      setTap(null);
      setEdit(chapter >= 1 ? "done" : "idle");
      setTyped(0);
      setSent(chapter >= 1);
      setStepIn(false);
      setMailEdit(chapter >= 2 ? "done" : "idle");
      setMailTyped(0);
      setSaved(chapter >= 2);
      setDrawer(false);
      setRowHi(-1);
      setStayHi(chapter === 2);
      setMailOn(chapter === 2);
      setNewsStep(chapter === 3 ? 4 : 0);
      setDashOpen(chapter === 3);
      setFreshOn(chapter === 3);
      setSummaryScroll(0);
      setBeat((["docs", "summary", "mail", "dash"] as Beat[])[chapter]);
      callbacks.current.onStart(0);
      return;
    }
    if (!inView) return;
    played.current.add(chapter);

    const R = compact ? ROOT_COMPACT : ROOT_WIDE;
    const cx = compact ? R.w / 2 : R.w - PANEL_WIDE.w / 2;
    const space = compact ? 24 : 32;
    const sh = compact ? 146 : 124;
    let live = true;
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        if (!clock) {
          window.setTimeout(() => (live ? resolve() : reject(new Error("stopped"))), ms);
          return;
        }
        let left = ms;
        let last = performance.now();
        const id = window.setInterval(() => {
          if (!live) {
            window.clearInterval(id);
            reject(new Error("stopped"));
            return;
          }
          const now = performance.now();
          if (!clock.paused) left -= (now - last) * clock.rate;
          last = now;
          if (left <= 0) {
            window.clearInterval(id);
            resolve();
          }
        }, 16);
      });
    const box = (el: Element | null | undefined) => {
      const r0 = rootRef.current;
      if (!el || !r0) return { top: 0, bottom: 0, x: 0, y: 0 };
      const s = r0.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = s.width / R.w;
      return { top: (r.top - s.top) / k, bottom: (r.bottom - s.top) / k, x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    };
    const reset = () => {
      setScan(-1);
      setTargets([]);
      setFound(0);
      setLooking(0);
      setAddress(false);
      setPulse(false);
      setTap(null);
    };
    const readSheets = async (n: number, each: number) => {
      for (let i = 0; i < n; i++) {
        setScan(i);
        await wait(each);
      }
      setScan(n);
    };
    const tapOn = async (name: Exclude<Tap, null>, after: () => void) => {
      setTap(name);
      await wait(190);
      after();
      setTap(null);
    };

    const chapters: (() => Promise<void>)[] = [
      /* 1. The signed plan goes in */
      async () => {
        reset();
        setBeat("empty");
        setSheetSet("docs");
        setPlace("off");
        setCardH(space * 2 + 46);
        setScrollA(0);
        await wait(420);
        const card = box(cardRef.current);
        const drop = { x: cx, y: card.top + space + 23 };
        setDropAt(drop);
        /* While it reads, the card holds the documents */
        const sheetsH = compact ? sh * 2 + 8 : sh;
        setFanY(card.top + space + sh / 2);
        setBeat("carry");
        setPlace("carry");
        await wait(960);
        setCardH(space * 2 + sheetsH);
        setBeat("reading");
        setPlace("fan");
        await wait(680);
        await readSheets(DOCS.length, 210);
        await wait(320);
        /* In order, under each person. Then down to Continue */
        setTargets(iconRefs.current.map((el) => { const b = box(el); return { x: b.x, y: b.y }; }));
        setCardH(innerRef.current?.offsetHeight ?? null);
        setBeat("filed");
        setPlace("file");
        await wait(1450);
        setPlace("hidden");
        setScrollA(Math.max(0, box(continueRef.current).bottom + 32 - R.h));
        await wait(900);
        await tapOn("continue", () => setBeat("accounts"));

        /* Outlook finds Daniel, then Maria; their address comes in underneath */
        await wait(620);
        setLooking(1);
        await wait(720);
        setFound(1);
        setLooking(0);
        await wait(420);
        setLooking(2);
        await wait(720);
        setFound(2);
        setLooking(0);
        /* The address gets the same beat as each client: a pause, a search, then in */
        await wait(420);
        setLooking(3);
        await wait(720);
        setAddress(true);
        setLooking(0);
        await wait(900);
        setPulse(true);
        await wait(190);
        setPulse(false);
        await wait(420);
        setBeat("docs");
        await wait(1150);
      },
      /* 2. Open the step-in card, put one power in plain words, close it, approve */
      async () => {
        reset();
        setEdit("idle");
        setTyped(0);
        setSent(false);
        setStepIn(false);
        setSummaryScroll(0);
        setPlace("hidden");
        setBeat("summary");
        await wait(800);
        await tapOn("stepin", () => setStepIn(true));
        await wait(420);
        setSummaryScroll(powersScroll());
        await wait(1100);
        await tapOn("edit", () => setEdit("select"));
        await wait(420);
        setEdit("typing");
        for (let n = 1; n <= POWER_AFTER.length; n++) {
          setTyped(n);
          await wait(22);
        }
        await wait(260);
        await tapOn("done", () => setEdit("done"));
        await wait(620);
        /* Back up, and the card closes: the summary with every card shut */
        setSummaryScroll(0);
        await wait(760);
        await tapOn("stepin", () => setStepIn(false));
        await wait(760);
        await tapOn("approve", () => setSent(true));
        await wait(2200);
      },
      /* 3. The client check-in's email in Settings, one word changed and saved;
         then Daniel's record shows when it next goes, and the email floats out */
      async () => {
        reset();
        setMailEdit("idle");
        setMailTyped(0);
        setSaved(false);
        setDrawer(false);
        setRowHi(-1);
        setStayHi(false);
        setMailOn(false);
        setPlace("hidden");
        setBeat("ahead");
        await wait(700);
        setRowHi(2);
        await wait(350);
        setDrawer(true);
        await wait(900);
        await tapOn("message", () => setMailEdit("select"));
        await wait(380);
        setMailEdit("typing");
        for (let n = 1; n <= MAIL_AFTER.length; n++) {
          setMailTyped(n);
          await wait(45);
        }
        await wait(220);
        setMailEdit("done");
        await wait(380);
        await tapOn("save", () => setSaved(true));
        await wait(520);
        setBeat("mail");
        await wait(1000);
        await tapOn("row", () => setStayHi(true));
        await wait(500);
        setMailOn(true);
        await wait(2600);
      },
      /* 4. A link to the firm's article, posted to every client's dashboard;
         it shows up in Daniel's "From your firm" */
      async () => {
        reset();
        setNewsStep(0);
        setDashOpen(false);
        setFreshOn(false);
        setPlace("hidden");
        setBeat("posts");
        await wait(800);
        setNewsStep(1);
        await wait(500);
        await tapOn("read", () => setNewsStep(2));
        await wait(650);
        setNewsStep(3);
        await wait(1300);
        await tapOn("post", () => setNewsStep(4));
        await wait(1300);
        setBeat("dash");
        await wait(800);
        await tapOn("firm", () => setDashOpen(true));
        await wait(450);
        setFreshOn(true);
        await wait(2000);
      },
    ];

    callbacks.current.onStart(FILM_MS[chapter]);
    chapters[chapter]()
      .then(() => {
        if (!live) return;
        doneKey.current = key;
        if (chapter < FILM_CHAPTERS - 1) callbacks.current.onChapter(chapter + 1);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [chapter, replay, inView, compact, clock, rewatch]);

  const uploading = beat === "empty" || beat === "carry" || beat === "reading" || beat === "filed";
  const inRecord = !uploading && beat !== "accounts";
  const sorted = !(beat === "empty" || beat === "carry" || beat === "reading"); // stays on through the fade out
  const panelPad = compact ? "px-4 py-6" : "px-16 py-10";
  const list = SHEETS[sheetSet];
  /* The full-screen view showing, if any; a later one fades in over an earlier
     one, which leaves once covered; going back, the later one fades away */
  const layer = LAYERS.indexOf(beat);
  const layerStyle = (i: number): React.CSSProperties => ({
    opacity: layer === i ? 1 : 0,
    transition: layer === i || i > layer ? "opacity 440ms ease" : "opacity 0ms linear 460ms",
  });

  const sheetAt = (i: number) => {
    const n = list.length;
    const off = (i - (n - 1) / 2) * 3;
    const fan = () => {
      if (compact && sheetSet === "docs" && (beat === "reading" || beat === "filed")) {
        return { x: panelCx + ((i % 3) - 1) * (sheet.w + 8), y: fanY + Math.floor(i / 3) * (sheet.h + 8) };
      }
      const gap = compact ? (root.w - sheet.w - 24) / Math.max(1, n - 1) : sheet.w + 8;
      return { x: panelCx + (i - (n - 1) / 2) * gap, y: fanY };
    };
    if (place === "off") return { x: root.w + 130 + off, y: root.h - 70 - off, r: FAN[i % 6], s: 0.92, o: 1, t: "none" };
    if (place === "carry") return { x: dropAt.x + off, y: dropAt.y - off, r: FAN[i % 6], s: 0.92, o: 1, t: `transform 900ms ${MOVE}` };
    if (place === "gather") return { x: panelCx + off, y: fanY - off, r: FAN[i % 6], s: 0.92, o: 0, t: "none" };
    if (place === "hidden") return { ...fan(), r: 0, s: 0.16, o: 0, t: "none" };
    if (place === "fan") return { ...fan(), r: 0, s: 1, o: 1, t: `transform 560ms var(--ease-in-out) ${i * 30}ms, opacity 200ms ease` };
    const to = targets[i] ?? fan();
    const d = i * 70;
    return { x: to.x, y: to.y, r: 0, s: 0.16, o: 0, t: `transform 620ms var(--ease-in-out) ${d}ms, opacity 140ms ease ${d + 500}ms` };
  };

  return (
    <div
      ref={frameRef}
      className="min-w-0"
      role="img"
      aria-label="An attorney drops a client's signed estate plan into Willow, which files it and sets up the account. Willow writes a summary the attorney approves, schedules check-ins year after year, and reaches the executors, trustees and advisors in the plan."
    >
      <FilmFrame compact={compact} size={root}>
        <ScaledScreen w={root.w} h={root.h}>
          <div ref={rootRef} aria-hidden className="relative overflow-hidden" style={{ width: root.w, height: root.h }}>
            {!compact && (
              <>
                <AttorneyClientsScreen open={false} />
                <div className="absolute bottom-0 left-[68px] right-0 top-16 z-10 bg-black/20" />
              </>
            )}

            {/* The attorney's panel */}
            <div
              className={`${compact ? "relative" : "absolute right-0 top-16 z-20"} overflow-hidden bg-[#F0F2F5] text-left`}
              style={{ width: stage.w, height: stage.h, fontFamily: FIGTREE, boxShadow: compact ? undefined : "-4px 0 24px rgba(0,0,0,0.08)" }}
            >
              {/* Upload their estate plan */}
              <div
                className="absolute inset-x-0 top-0"
                style={{ opacity: uploading ? 1 : 0, transform: `translateY(${-scrollA}px)`, transition: "opacity 440ms ease, transform 640ms var(--ease-in-out)" }}
              >
                <div className={panelPad}>
                  <Title />
                  <Progress />
                  <div ref={cardRef} className="relative overflow-hidden rounded-2xl bg-white" style={{ height: cardH ?? cardEmpty, transition: "height 460ms var(--ease-in-out)" }}>
                    <div ref={innerRef} className="flex flex-col gap-1.5 bg-[#F3F4F6]">
                      <div className={compact ? "bg-white p-6" : "bg-white p-8"}>
                        {(beat === "empty" || beat === "carry") && <DropLine active={beat === "carry"} />}
                        <div className={beat === "empty" || beat === "carry" ? "mt-2" : ""}>
                          <DocGroups on={sorted} iconRefs={iconRefs} />
                        </div>
                      </div>
                      <div className={compact ? "bg-white p-3" : "bg-white px-6 py-4"}>
                        <Fade on={sorted} delay={880}>
                          <div
                            ref={continueRef}
                            className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#309E96] text-[15px] font-semibold text-white"
                            style={tapStyle(tap === "continue")}
                          >
                            Continue
                          </div>
                        </Fade>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 of 2 · Create their accounts */}
              <div className="absolute inset-x-0 top-0" style={{ opacity: beat === "accounts" ? 1 : 0, transition: "opacity 440ms ease" }}>
                <div className={panelPad}>
                  <Title />
                  <Progress step={2} />
                  <TheirAccounts found={found} looking={looking} address={address} pulse={pulse} compact={compact} />
                </div>
              </div>

              {/* The client */}
              <div className="absolute inset-0" style={{ opacity: inRecord ? 1 : 0, transition: "opacity 440ms ease" }}>
                <div className={`flex h-full flex-col ${compact ? "px-4 pt-6" : "px-16 pt-10"}`}>
                  <div className="mb-6 flex flex-shrink-0 items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[26px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: FIGTREE }}>Daniel Rosen</h3>
                      <p className="mt-1 text-[15px] text-[#6B7280]">
                        Joint account: <span className="font-medium text-[#309E96]">Maria Rosen</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded p-1.5 text-[#9CA3AF]"><WIcon name="more" className="h-5 w-5" /></span>
                    </div>
                  </div>
                  <div ref={tabsRef} className="flex-shrink-0 overflow-hidden border-b border-[#E5E7EB]">
                    <div className="relative flex">
                      {CLIENT_PANEL_TABS.map((t) => (
                        <span
                          key={t}
                          data-tab={t}
                          className="whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-medium"
                          style={{ borderColor: t === openTab ? "#309E96" : "transparent", color: t === openTab ? "#309E96" : "#6B7280", transition: "color 200ms ease, border-color 200ms ease" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 min-h-0 flex-1">
                    {(beat === "docs" || !inRecord) && <Appear key="docs"><TheirDocuments /></Appear>}
                    {(beat === "summary" || beat === "ahead") && (
                      <Appear key="summary" className="flex h-full flex-col">
                        <SubTabs
                          active="Summary"
                          right={
                            <span className="inline-flex h-9 flex-shrink-0 items-center gap-1.5 rounded-full bg-[#309E96] px-5 text-[13px] font-medium text-white" style={tapStyle(tap === "approve")}>
                              {sent && <CheckIcon className="h-3.5 w-3.5" />}
                              {sent ? "Approved and sent" : "Approve"}
                            </span>
                          }
                        />
                        <div ref={cardsRef} className="min-h-0 flex-1 overflow-hidden rounded-t-2xl">
                          <div style={{ transform: `translateY(${-summaryScroll}px)`, transition: "transform 900ms var(--ease-in-out)" }}>
                            <SummaryCards
                              flush
                              familyOpen={false}
                              leaveOpen={false}
                              protectsOpen={false}
                              stepInOpen={stepIn}
                              stepInBody={<StepInBody edit={edit} typed={typed} tap={tap} />}
                              stepInStyle={{
                                boxShadow: tap === "stepin" ? "inset 0 0 0 2px rgba(48,158,150,0.55)" : "inset 0 0 0 0 rgba(48,158,150,0)",
                                transition: "box-shadow 240ms ease",
                              }}
                            />
                          </div>
                        </div>
                      </Appear>
                    )}
                    {(beat === "mail" || beat === "posts" || beat === "dash") && (
                      <Appear key="stay" className="h-full">
                        <ClientStayingInTouch hi={stayHi} tap={tap} compact={compact} />
                      </Appear>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Chapters 3 and 4: full-screen views over the client's record. The
                next one fades in on top, and the one under it goes once it's
                covered, so nothing shows through between them */}
            <div className="pointer-events-none absolute inset-0 z-30" style={layerStyle(0)}>
              <StayingInTouch hi={rowHi} drawer={drawer} edit={mailEdit} typed={mailTyped} saved={saved} tap={tap} compact={compact} />
            </div>
            <div className="pointer-events-none absolute inset-0 z-30" style={layerStyle(1)}>
              <DashboardContent step={newsStep} tap={tap} compact={compact} />
            </div>
            <div className="pointer-events-none absolute inset-0 z-30" style={layerStyle(2)}>
              <ClientFirmNewsScreen
                person={DANIEL_EXAMPLE}
                open={dashOpen}
                articles={[NEWS_OLDER]}
                fresh={NEWS}
                freshOn={freshOn}
                height={root.h}
                compact={compact}
                firmStyle={{ boxShadow: tap === "firm" ? "inset 0 0 0 2px rgba(48,158,150,0.55)" : "inset 0 0 0 0 rgba(48,158,150,0)", transition: "box-shadow 240ms ease" }}
              />
            </div>

            {/* The client check-in floats out over Daniel's record */}
            <div
              className="pointer-events-none absolute z-30"
              style={{
                ...(compact ? { left: 12, right: 12, bottom: 10 } : { left: 420, width: 640, bottom: 28 }),
                opacity: mailOn && beat === "mail" ? 1 : 0,
                transform: mailOn && beat === "mail" ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
                transition: "opacity 320ms ease, transform 560ms var(--ease-out)",
              }}
            >
              <FloatingCheckIn compact={compact} />
            </div>

            {/* Paper */}
            {list.map((d, i) => {
              const p = sheetAt(i);
              return (
                <div
                  key={`${sheetSet}-${i}`}
                  className="pointer-events-none absolute left-0 top-0 z-40"
                  style={{
                    width: sheet.w,
                    height: sheet.h,
                    opacity: p.o,
                    transform: `translate(${p.x - sheet.w / 2}px, ${p.y - sheet.h / 2}px) rotate(${p.r}deg) scale(${p.s})`,
                    transition: p.t,
                  }}
                >
                  <Sheet d={d} scanning={scan === i} scanned={scan > i} />
                </div>
              );
            })}

          </div>
        </ScaledScreen>
      </FilmFrame>
    </div>
  );
};

export default ClientFilm;
