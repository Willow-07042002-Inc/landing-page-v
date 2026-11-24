import React, { useEffect, useRef, useState } from "react";
import { PrintFrame } from "@/components/site/blocks";
import { FloatStack, ScaledScreen, WIcon } from "@/components/product/kit";
import { AttorneyClientsScreen, CLIENT_PANEL_TABS, ProDocRow, ProDocSectionLabel } from "@/components/product/attorney-clients";
import { ProSummaryAwaitingPill } from "@/components/product/attorney-client-panel";
import { SummaryCards } from "@/components/product/attorney-review";
import { OutlookLogo } from "@/components/product/attorney-booking";
import { CheckIcon, CheckInIcon, CloseIcon, NotificationIcon, SpinnerIcon, ViewIcon } from "@/components/product/willow-icons";

/* One client's life on Willow as one film, on the product's real screens:
   1. the signed plan is dropped in, read and filed; names come from the
      documents, emails and phones from Outlook (add-client/setup-wizard.tsx,
      api/clients/find-contact). The film creates the account by itself; in the
      product the attorney confirms it
   2. Willow writes the summary, shown in the Estate Plan tab, and the attorney
      approves it (estate-plans-tab.tsx; the product opens it on its own page)
   3. the check-ins ahead, year after year (client-detail/staying-in-touch.tsx)
   4. the check-ins reach the people in the plan, and one books a call.
   Every chapter uses the same move: paper fans out, is read, and files itself
   into the product. The film plays once from where it's opened and stops on
   the last frame. People who prefer reduced motion see each chapter at rest.
   The list of coming check-ins in chapter 3 is staged: the product shows the
   next date for each kind of check-in. */

const ROOT_WIDE = { w: 1440, h: 855 };
const ROOT_COMPACT = { w: 420, h: 720 };
const PANEL_WIDE = { w: 800, h: 791 }; // under the 64px top bar

export const FILM_CHAPTERS = 4;
/** How long each chapter runs at normal speed */
export const FILM_MS = [8910, 7500, 4160, 4380];
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

const CHECK_KINDS = [
  { title: "Professional check-in", to: "To Howard and Lisa", date: "March 9" },
  { title: "Client check-in", to: "To Daniel and Maria", date: "July 14" },
  { title: "Agent check-in", to: "To Maria, Emma and Leo", date: "August 12" },
];
const YEARS = [2027, 2028];
const CHECKS = YEARS.flatMap((year) => CHECK_KINDS.map((k) => ({ ...k, year })));

const PEOPLE = [
  { name: "Maria Rosen", initials: "MR", role: "Executor" },
  { name: "Emma Rosen", initials: "ER", role: "Backup executor" },
  { name: "Leo Rosen", initials: "LR", role: "Backup trustee" },
  { name: "Howard Kim", initials: "HK", role: "Financial advisor" },
  { name: "Lisa Moreno", initials: "LM", role: "Accountant" },
];

const SHEETS: Record<"docs" | "checks" | "team", SheetData[]> = {
  docs: DOCS,
  checks: CHECKS.map((c) => ({ head: "Checking in", of: c.to, tag: `${c.date}, ${c.year}` })),
  team: PEOPLE.map((p) => ({ head: "Checking in", of: `To ${p.name}`, tag: "Check-in" })),
};
const FAN = [-8, -5, -2, 2, 5, 8];

type Beat = "empty" | "carry" | "reading" | "filed" | "accounts" | "docs" | "drafting" | "summary" | "ahead" | "team";
type Place = "off" | "carry" | "gather" | "fan" | "file" | "hidden";
type Point = { x: number; y: number };
type Cursor = Point & { shown: boolean; down: boolean };

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

const Title = ({ startOver }: { startOver: boolean }) => (
  <div className="flex items-baseline justify-between gap-4">
    <h3 className="text-[28px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: FIGTREE }}>
      Upload your client&apos;s estate plan
    </h3>
    <span className="flex-shrink-0 text-[13px] font-medium text-[#6B7280]" style={{ opacity: startOver ? 1 : 0, transition: "opacity 200ms ease" }}>
      Start over
    </span>
  </div>
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

/* Step 2 of the real form, filling itself in: the names and address from the
   documents, then each email and phone from the attorney's Outlook, together */
const TheirAccounts = ({ found, pulse, compact }: { found: boolean; pulse: boolean; compact: boolean }) => {
  const field = `min-w-0 truncate border-b border-[#E5E7EB] leading-[22px] text-[#1F2933] ${compact ? "py-2 text-[14px]" : "py-2.5 text-[15px]"}`;
  const section = compact ? "bg-white p-4" : "bg-white p-6";
  const fade = "opacity 520ms ease";
  const filled = (empty: string, value: string) => (
    <div className={`relative ${field}`}>
      <span className="block truncate text-[#9CA3AF]" style={{ opacity: found ? 0 : 1, transition: fade }}>{empty}</span>
      <span className="absolute inset-x-0 truncate" style={{ top: compact ? 8 : 10, opacity: found ? 1 : 0, transition: fade }}>{value}</span>
    </div>
  );
  const note = (
    <span className="flex flex-shrink-0 items-center gap-1 text-[12px] text-[#9CA3AF]" style={{ opacity: found ? 1 : 0, transition: fade }}>
      <OutlookLogo className="h-3.5 w-3.5" />
      Found in Outlook
    </span>
  );
  return (
    <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
      <div className="flex flex-col gap-1.5">
        {ACCOUNTS.map((p) => {
          const email = filled(`Looking for ${p.first}'s email…`, p.email);
          const phone = filled("Phone", p.phone);
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
                  <div className="relative">
                    {email}
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-white pl-2">{note}</span>
                  </div>
                  {phone}
                </div>
              ) : (
                <div className="grid grid-cols-2 items-start gap-x-6 gap-y-2">
                  <div className={field}>{p.first}</div>
                  <div className={field}>Rosen</div>
                  <div>
                    {email}
                    <div className="mt-1">{note}</div>
                  </div>
                  {phone}
                </div>
              )}
            </div>
          );
        })}
        <div className={section}>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
            Their home address <span className="font-normal normal-case tracking-normal">(from their documents)</span>
          </p>
          {compact ? (
            <div className={field}>85 Grove Street, New York, 10014</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6">
              <div className={field}>85 Grove Street</div>
              <div className="grid grid-cols-[1fr_96px] gap-x-6">
                <div className={field}>New York</div>
                <div className={field}>10014</div>
              </div>
            </div>
          )}
        </div>
        <div className={compact ? "bg-white p-3" : "bg-white px-6 py-4"}>
          <div
            className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#309E96] text-[15px] font-semibold text-white"
            style={{
              opacity: found ? 1 : 0.5,
              transform: pulse ? "scale(0.97)" : "scale(1)",
              boxShadow: pulse ? "0 0 0 6px rgba(48,158,150,0.24)" : "0 0 0 0 rgba(48,158,150,0)",
              transition: "opacity 420ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease",
            }}
          >
            Add the couple
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

/* working-mark.tsx: the W, breathing, and a line of legal wordplay */
const WorkingMark = ({ line = "Reading the fine print…", tight = false }: { line?: string; tight?: boolean }) => (
  <div className={`flex flex-col items-center text-center ${tight ? "" : "py-8"}`}>
    <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full bg-[#309E96] text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 18, lineHeight: 1, paddingTop: 2 }}>
      W
    </span>
    <p className="mt-3 text-[15px] font-semibold text-[#1F2933]">{line}</p>
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

const SubTabs = ({ active }: { active: "Documents" | "Summary" }) => (
  <div className="mb-6 border-b border-[#E5E7EB]">
    <div className="flex">
      {(["Documents", "Summary"] as const).map((t) => (
        <span key={t} data-sub={t} className={`whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-medium ${t === active ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"}`}>
          {t}
        </span>
      ))}
    </div>
  </div>
);

const TheirDocuments = () => (
  <>
    <SubTabs active="Documents" />
    <div className="space-y-6">
      <div>
        <ProDocSectionLabel label="Daniel's documents" action="Choose PDFs" />
        <FloatStack>
          <ProDocRow label="Last Will & Testament" />
          <ProDocRow label="Power of Attorney" />
        </FloatStack>
      </div>
      <div>
        <ProDocSectionLabel label="Joint with Maria" />
        <FloatStack>
          <div>
            <ProDocRow label="Revocable Living Trust" detail="Joint trust (married couple)" />
            <div className="px-8 pb-4">
              <div className="border-t border-[#E5E7EB]" />
              <div className="pl-8 pt-3">
                <ProDocRow nested label="Deed" detail="Trust transfer deed" />
              </div>
            </div>
          </div>
        </FloatStack>
      </div>
    </div>
  </>
);

/* Chapter 3: what's coming, year by year, in the look of the filed documents */
const ChecksAhead = ({ on, refs, compact }: { on: boolean; refs: React.MutableRefObject<(HTMLSpanElement | null)[]>; compact: boolean }) => (
  <div className={`rounded-2xl bg-white ${compact ? "p-5" : "px-8 py-6"}`}>
    {YEARS.map((year, y) => (
      <div key={year} className={y > 0 ? "mt-4" : ""}>
        <Fade on={on} delay={y * 210 + 340}>
          <p className="text-[12px] font-medium uppercase tracking-wide text-[#9CA3AF]">{year}</p>
        </Fade>
        <div className="mt-1">
          {CHECK_KINDS.map((k, i) => {
            const n = y * CHECK_KINDS.length + i;
            return (
              <Fade key={k.title} on={on} delay={n * 70 + 440}>
                <div className="flex items-start gap-3 py-2">
                  <span ref={(el) => { refs.current[n] = el; }} className="mt-0.5 flex-shrink-0">
                    <CheckInIcon className="block h-5 w-5 text-[#309E96]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-[#1F2933]">{k.title}</p>
                    <span className="inline-block border-b border-dashed border-[#D1D5DB] py-0.5 text-[13px] text-[#374151]">{k.to}</span>
                  </div>
                  <span className="mt-0.5 flex-shrink-0 text-[13px] text-[#6B7280]">{k.date}</span>
                </div>
              </Fade>
            );
          })}
        </div>
      </div>
    ))}
    <Fade on={on} delay={900}>
      <p className="mt-3 border-t border-[#F0F1F3] pt-3 text-[13px] font-medium text-[#309E96]">And every year after that</p>
    </Fade>
  </div>
);

/* Chapter 4: the check-ins reach the people in the plan */
const TheirTeam = ({ on, booked, refs, compact }: { on: boolean; booked: boolean; refs: React.MutableRefObject<(HTMLSpanElement | null)[]>; compact: boolean }) => (
  <div className={`rounded-2xl bg-white ${compact ? "p-5" : "px-8 py-6"}`}>
    {[
      { label: "Estate team", from: 0, to: 3 },
      { label: "Professional", from: 3, to: 5 },
    ].map((g, gi) => (
      <div key={g.label} className={gi > 0 ? "mt-4" : ""}>
        <p className="text-[12px] font-medium uppercase tracking-wide text-[#9CA3AF]">{g.label}</p>
        <div className="mt-1">
          {PEOPLE.slice(g.from, g.to).map((p, j) => {
            const n = g.from + j;
            const isBooked = booked && p.name === "Emma Rosen";
            return (
              <div key={p.name} className="flex items-center gap-3 border-b border-[#F0F1F3] py-2.5 last:border-0">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F9F9] text-[12px] font-semibold text-[#309E96] ring-1 ring-black/5">{p.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-[#1F2933]">{p.name}</span>
                  <span className="block truncate text-[12.5px] text-[#6B7280]">{p.role}</span>
                </span>
                <span ref={(el) => { refs.current[n] = el; }} className="flex-shrink-0">
                  <Fade on={on} delay={n * 70 + 480}>
                    {isBooked ? (
                      <span className="flex items-center gap-1 text-[12.5px] font-semibold text-[#309E96]">
                        <CheckIcon className="h-3.5 w-3.5" />
                        Booked Feb 23
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[12.5px] text-[#6B7280]">
                        <CheckIcon className="h-3.5 w-3.5 text-[#309E96]" />
                        Check-in sent
                      </span>
                    )}
                  </Fade>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const tabFor = (b: Beat) => (b === "ahead" ? "Staying in touch" : b === "team" ? "Team" : "Estate Plan");

type Props = {
  chapter: number;
  /** Changes when someone reopens a chapter, so it plays again */
  replay: number;
  onChapter: (next: number) => void;
  /** A chapter has started and will take this many milliseconds (0: at rest) */
  onStart: (ms: number) => void;
  clock?: FilmClock;
};

const ClientFilm = ({ chapter, replay, onChapter, onStart, clock }: Props) => {
  const compact = useCompact();
  const root = compact ? ROOT_COMPACT : ROOT_WIDE;
  const stage = compact ? ROOT_COMPACT : PANEL_WIDE;
  const panelCx = compact ? root.w / 2 : 1040;
  const pad = compact ? 24 : 32;
  const cardEmpty = pad * 2 + 46;
  const sheet = compact ? { w: 112, h: 146 } : { w: 94, h: 124 }; // six fit inside the card's padding

  const frameRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const approveRef = useRef<HTMLSpanElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const checkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const teamRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const doneKey = useRef("");
  const callbacks = useRef({ onChapter, onStart });
  callbacks.current = { onChapter, onStart };

  const [inView, setInView] = useState(false);
  const [beat, setBeat] = useState<Beat>("empty");
  const [sheetSet, setSheetSet] = useState<keyof typeof SHEETS>("docs");
  const [place, setPlace] = useState<Place>("off");
  const [scan, setScan] = useState(-1);
  const [fanY, setFanY] = useState(0);
  const [targets, setTargets] = useState<Point[]>([]);
  const [filed, setFiled] = useState(false);
  const [booked, setBooked] = useState(false);
  const [approved, setApproved] = useState(false);
  const [found, setFound] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [summaryScroll, setSummaryScroll] = useState(0);
  const [cardH, setCardH] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<Point>({ x: 0, y: 0 });
  const [scrollA, setScrollA] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0, shown: false, down: false });

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
  const openTab = tabFor(beat);
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>(`[data-tab="${openTab}"]`);
    if (row && tab) row.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: "smooth" });
  }, [openTab]);

  useEffect(() => {
    const key = `${chapter}:${replay}:${compact}`;
    if (doneKey.current === key) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doneKey.current = key;
      setPlace("hidden");
      setScan(-1);
      setFiled(true);
      setBooked(chapter === 3);
      setApproved(chapter === 1);
      setSummaryScroll(0);
      setCursor((c) => ({ ...c, shown: false }));
      setBeat((["docs", "summary", "ahead", "team"] as Beat[])[chapter]);
      callbacks.current.onStart(0);
      return;
    }
    if (!inView) return;

    const R = compact ? ROOT_COMPACT : ROOT_WIDE;
    const cx = compact ? R.w / 2 : 1040;
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
      setFiled(false);
      setBooked(false);
      setApproved(false);
      setFound(false);
      setPulse(false);
      setSummaryScroll(0);
      setPressed(false);
      setCursor((c) => ({ ...c, shown: false, down: false }));
    };
    const readSheets = async (n: number, each: number) => {
      for (let i = 0; i < n; i++) {
        setScan(i);
        await wait(each);
      }
      setScan(n);
    };
    const fanOut = async (set: keyof typeof SHEETS, y: number) => {
      setSheetSet(set);
      setFanY(y);
      setPlace("gather");
      await wait(60);
      setPlace("fan");
      await wait(620);
    };
    const clickOn = async (el: Element | null | undefined, after: () => void) => {
      const b = box(el);
      setCursor({ x: b.x + 90, y: b.y + 110, shown: false, down: false });
      await wait(60);
      setCursor({ x: b.x, y: b.y, shown: true, down: false });
      await wait(880);
      setCursor((c) => ({ ...c, down: true }));
      setPressed(true);
      await wait(140);
      after();
      setPressed(false);
      setCursor((c) => ({ ...c, down: false }));
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
        /* While it reads, the card holds the mark and, under it, the documents */
        const markH = 72;
        const gap = 20;
        const sheetsH = compact ? sh * 2 + 8 : sh;
        setFanY(card.top + space + markH + gap + sh / 2);
        setBeat("carry");
        setPlace("carry");
        await wait(960);
        setCardH(space * 2 + markH + gap + sheetsH);
        setBeat("reading");
        setPlace("fan");
        await wait(680);
        await readSheets(DOCS.length, 210);
        await wait(320);
        const rows = iconRefs.current.map((el) => box(el));
        const toScroll = Math.max(0, rows[5].bottom + 40 - R.h);
        setTargets(rows.map((b) => ({ x: b.x, y: b.y - toScroll })));
        setCardH(innerRef.current?.offsetHeight ?? null);
        setScrollA(toScroll);
        setBeat("filed");
        setPlace("file");
        await wait(1500);
        setPlace("hidden");

        /* The account fills itself in from the documents and Outlook */
        setBeat("accounts");
        await wait(760);
        setFound(true);
        await wait(1250);
        setPulse(true);
        await wait(190);
        setPulse(false);
        await wait(420);
        setBeat("docs");
        await wait(1150);
      },
      /* 2. Rachel opens Summary: Willow writes it, there in the Estate Plan tab */
      async () => {
        reset();
        setPlace("hidden");
        setBeat("docs");
        await wait(120);
        await clickOn(rootRef.current?.querySelector('[data-sub="Summary"]'), () => setBeat("drafting"));
        setCursor((c) => ({ ...c, shown: false }));
        await wait(1500);
        setBeat("summary");
        await wait(620);
        const win = box(cardsRef.current);
        const heading = [...(cardsRef.current?.querySelectorAll("div") ?? [])].find((e) => e.textContent?.trim() === "What You'll Leave Behind");
        setSummaryScroll(Math.max(0, box(heading).top - win.top - 34));
        await wait(2100);
        await clickOn(approveRef.current, () => setApproved(true));
        await wait(1000);
        setCursor((c) => ({ ...c, shown: false }));
      },
      /* 3. The check-ins ahead, year after year */
      async () => {
        reset();
        setPlace("hidden");
        setBeat("ahead");
        await wait(60);
        await fanOut("checks", compact ? R.h - sh / 2 - 24 : 500);
        await readSheets(CHECKS.length, 170);
        await wait(200);
        setTargets(checkRefs.current.map((el) => { const b = box(el); return { x: b.x, y: b.y }; }));
        setFiled(true);
        setPlace("file");
        await wait(1300);
        setPlace("hidden");
        await wait(900);
      },
      /* 4. They reach the people in the plan, and one books a call */
      async () => {
        reset();
        setPlace("hidden");
        setBeat("team");
        await wait(400);
        await fanOut("team", R.h - sh / 2 - 22);
        await readSheets(PEOPLE.length, 120);
        await wait(150);
        setTargets(teamRefs.current.map((el) => { const b = box(el); return { x: b.x, y: b.y }; }));
        setFiled(true);
        setPlace("file");
        await wait(1150);
        setPlace("hidden");
        setBooked(true);
        await wait(1400);
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
  }, [chapter, replay, inView, compact, clock]);

  const uploading = beat === "empty" || beat === "carry" || beat === "reading" || beat === "filed";
  const inRecord = !uploading && beat !== "accounts";
  const reading = beat === "reading";
  const panelPad = compact ? "px-4 py-6" : "px-16 py-10";
  const list = SHEETS[sheetSet];

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
      <PrintFrame print="/central-park.jpg" aspect={`${root.w} / ${root.h}`}>
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
                  <Title startOver={beat !== "empty"} />
                  <Progress />
                  <div ref={cardRef} className="relative overflow-hidden rounded-2xl bg-white" style={{ height: cardH ?? cardEmpty, transition: "height 460ms var(--ease-in-out)" }}>
                    <div ref={innerRef} className={compact ? "bg-white p-6" : "bg-white p-8"}>
                      <div style={{ opacity: reading ? 0 : 1, transition: "opacity 160ms ease" }}>
                        <DropLine active={beat === "carry"} />
                      </div>
                      <div className="mt-2">
                        <DocGroups on={beat === "filed"} iconRefs={iconRefs} />
                      </div>
                    </div>
                    <div className="absolute inset-x-0 top-0" style={{ paddingTop: pad, opacity: reading ? 1 : 0, transition: "opacity 200ms ease" }}>
                      <WorkingMark tight />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 of 2 · Create their accounts */}
              <div className="absolute inset-x-0 top-0" style={{ opacity: beat === "accounts" ? 1 : 0, transition: "opacity 440ms ease" }}>
                <div className={panelPad}>
                  <Title startOver />
                  <Progress step={2} />
                  <TheirAccounts found={found} pulse={pulse} compact={compact} />
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
                      {!compact && beat === "summary" && !approved && <ProSummaryAwaitingPill />}
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
                    {beat === "drafting" && (
                      <Appear key="drafting">
                        <SubTabs active="Summary" />
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white">
                          <WorkingMark line="Generating Daniel's summary…" />
                        </div>
                      </Appear>
                    )}
                    {beat === "summary" && (
                      <Appear key="summary" className="flex h-full flex-col">
                        <SubTabs active="Summary" />
                        <div className="flex flex-shrink-0 items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-3.5">
                          <span className="flex min-w-0 items-center gap-3">
                            {approved ? (
                              <CheckIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />
                            ) : (
                              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#309E96] text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 18, lineHeight: 1, paddingTop: 2 }}>W</span>
                            )}
                            <span className="min-w-0">
                              <span className="block text-[14px] font-semibold leading-tight text-[#1F2933]">
                                {approved ? "Daniel can see this summary" : "Daniel's summary is ready for your approval"}
                              </span>
                              <span className="mt-0.5 block text-[12.5px] leading-snug text-[#6B7280]">
                                {approved ? "Approved. You can edit and re-approve it anytime." : "Review and approve it before Daniel can see it."}
                              </span>
                            </span>
                          </span>
                          {!approved && (
                            <span
                              ref={approveRef}
                              className="inline-flex h-9 flex-shrink-0 items-center rounded-full bg-[#309E96] px-5 text-[13px] font-medium text-white"
                              style={{ transform: pressed ? "scale(0.97)" : "scale(1)", transition: "transform 140ms var(--ease-out)" }}
                            >
                              Approve
                            </span>
                          )}
                        </div>
                        <div ref={cardsRef} className="mt-3 min-h-0 flex-1 overflow-hidden rounded-t-2xl">
                          <div style={{ transform: `translateY(${-summaryScroll}px)`, transition: "transform 1700ms var(--ease-in-out)" }}>
                            <SummaryCards flush />
                          </div>
                        </div>
                      </Appear>
                    )}
                    {beat === "ahead" && <Appear key="ahead"><ChecksAhead on={filed} refs={checkRefs} compact={compact} /></Appear>}
                    {beat === "team" && <Appear key="team"><TheirTeam on={filed} booked={booked} refs={teamRefs} compact={compact} /></Appear>}
                  </div>
                </div>
              </div>

              {/* Someone from the plan books a call */}
              <div
                className="absolute z-10 flex items-center gap-3 rounded-xl bg-white px-4 py-3"
                style={{
                  ...(compact ? { left: 16, right: 16, bottom: 20 } : { right: 16, top: 16, width: 340 }),
                  boxShadow: "0 12px 32px rgba(16,24,40,0.18), 0 2px 6px rgba(16,24,40,0.08)",
                  opacity: booked && beat === "team" ? 1 : 0,
                  transform: booked && beat === "team" ? "translateY(0)" : "translateY(-10px)",
                  transition: "opacity 240ms ease, transform 360ms var(--ease-out)",
                }}
              >
                <NotificationIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-[#1F2933]">Emma Rosen booked a call</span>
                  <span className="block text-[12.5px] text-[#6B7280]">From a check-in · Tuesday, Feb 23</span>
                </span>
              </div>
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

            {/* Rachel */}
            <div
              className="pointer-events-none absolute left-0 top-0 z-50"
              style={{
                opacity: cursor.shown ? 1 : 0,
                transform: `translate(${cursor.x}px, ${cursor.y}px)`,
                transition: `transform 820ms ${MOVE}, opacity 200ms ease`,
              }}
            >
              <div style={{ transform: `scale(${cursor.down ? 0.84 : 1})`, transformOrigin: "2px 2px", transition: "transform 120ms var(--ease-out)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))" }}>
                  <path d="M5 3l14 8.5-6.3 1.4L9.5 19z" fill="#374151" stroke="#374151" strokeWidth="1" strokeLinejoin="round" />
                </svg>
                <span className="absolute left-[18px] top-[19px] whitespace-nowrap rounded-md bg-[#374151] px-2 py-[3px] text-[12px] font-medium text-white" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
                  Rachel · Attorney
                </span>
              </div>
            </div>
          </div>
        </ScaledScreen>
      </PrintFrame>
    </div>
  );
};

export default ClientFilm;
