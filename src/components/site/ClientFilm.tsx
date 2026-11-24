import React, { useEffect, useRef, useState } from "react";
import { FloatStack, ScaledScreen, WIcon } from "@/components/product/kit";
import { AttorneyClientsScreen, CLIENT_PANEL_TABS, ProDocRow, ProDocSectionLabel } from "@/components/product/attorney-clients";
import { SummaryCards, SummaryEditToggle, SummaryReviewScreenCropped } from "@/components/product/attorney-review";
import { OutlookLogo } from "@/components/product/attorney-booking";
import { CheckIcon, CheckInIcon, CloseIcon, NotificationIcon, ViewIcon } from "@/components/product/willow-icons";

/* One client's life on Willow as one film, on the product's real screens:
   1. the signed plan is dropped in, read and filed; names come from the
      documents, emails and phones from Outlook (add-client/setup-wizard.tsx,
      api/clients/find-contact). The film creates the account by itself; in the
      product the attorney confirms it
   2. the summary in the Estate Plan tab, then the real approval page, where the
      attorney rewords one line and approves it (scenario-summary-approval.tsx)
   3. the check-ins ahead, year after year (client-detail/staying-in-touch.tsx)
   4. the check-ins reach the people in the plan, and one books a call.
   Every chapter uses the same move: paper fans out, is read, and files itself
   into the product. The film plays once from where it's opened and stops on
   the last frame. People who prefer reduced motion see each chapter at rest.
   The list of coming check-ins in chapter 3 is staged: the product shows the
   next date for each kind of check-in. */

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
/** How long each chapter runs at normal speed */
export const FILM_MS = [12460, 8800, 4160, 4380];
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

/* The one line the attorney rewords on the approval page */
const NOTE_BEFORE = "Once debts and taxes are settled, here’s what happens to your estate.";
const NOTE_AFTER = "Once your debts and taxes are paid, everything you leave goes to Maria.";

/* A button pressing itself: nothing crosses the screen to click it */
const tapStyle = (on: boolean): React.CSSProperties => ({
  transform: on ? "scale(0.96)" : "scale(1)",
  boxShadow: on ? "0 0 0 6px rgba(48,158,150,0.22)" : "0 0 0 0 rgba(48,158,150,0)",
  transition: "transform 180ms var(--ease-out), box-shadow 340ms ease",
});

type Beat = "empty" | "carry" | "reading" | "filed" | "accounts" | "docs" | "summary" | "review" | "ahead" | "team";
type Place = "off" | "carry" | "gather" | "fan" | "file" | "hidden";
type Point = { x: number; y: number };
type Tap = "continue" | "summary" | "approve" | "edit" | "final" | null;
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

const SubTabs = ({ active, pulse = false, right }: { active: "Documents" | "Summary"; pulse?: boolean; right?: React.ReactNode }) => (
  <div className="mb-6 flex flex-shrink-0 items-center justify-between gap-3 border-b border-[#E5E7EB] pb-px">
    <div className="flex">
      {(["Documents", "Summary"] as const).map((t) => (
        <span
          key={t}
          data-sub={t}
          className={`whitespace-nowrap rounded-t-md border-b-2 px-4 py-3 text-[13px] font-medium ${t === active ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"}`}
          style={t === "Summary" ? { ...tapStyle(pulse), background: pulse ? "rgba(48,158,150,0.10)" : "transparent" } : undefined}
        >
          {t}
        </span>
      ))}
    </div>
    {right}
  </div>
);

const TheirDocuments = ({ pulse }: { pulse: boolean }) => (
  <>
    <SubTabs active="Documents" pulse={pulse} />
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
  const panelCx = compact ? root.w / 2 : root.w - PANEL_WIDE.w / 2;
  const pad = compact ? 24 : 32;
  const cardEmpty = pad * 2 + 46;
  const sheet = compact ? { w: 112, h: 146 } : { w: 94, h: 124 }; // six fit inside the card's padding

  const frameRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);
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
  const [tap, setTap] = useState<Tap>(null);
  const [edit, setEdit] = useState<EditStage>("idle");
  const [typed, setTyped] = useState(0);
  const [sent, setSent] = useState(false);
  const [reviewScroll, setReviewScroll] = useState(0);
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
      setEdit(chapter === 1 ? "done" : "idle");
      setTyped(NOTE_AFTER.length);
      setSent(chapter === 1);
      setSummaryScroll(0);
      setBeat((["docs", "review", "ahead", "team"] as Beat[])[chapter]);
      callbacks.current.onStart(0);
      return;
    }
    if (!inView) return;

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
      setFiled(false);
      setBooked(false);
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
    const fanOut = async (set: keyof typeof SHEETS, y: number) => {
      setSheetSet(set);
      setFanY(y);
      setPlace("gather");
      await wait(60);
      setPlace("fan");
      await wait(620);
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
      /* 2. The summary, then one line reworded on the approval page */
      async () => {
        reset();
        setEdit("idle");
        setTyped(0);
        setSent(false);
        setSummaryScroll(0);
        setReviewScroll(0);
        setPlace("hidden");
        setBeat("docs");
        await wait(620);
        await tapOn("summary", () => setBeat("summary"));
        await wait(360);
        const win = box(cardsRef.current);
        const heading = [...(cardsRef.current?.querySelectorAll("div") ?? [])].find((e) => e.textContent?.trim() === "What You'll Leave Behind");
        setSummaryScroll(Math.max(0, box(heading).top - win.top - 34));
        await wait(1800);
        await tapOn("approve", () => setBeat("review"));
        if (compact) {
          const line = box(reviewRef.current?.querySelector("[data-note]"));
          const top = box(reviewRef.current?.querySelector("[data-review-cards]"));
          setReviewScroll(Math.max(0, line.top - top.top - 120));
        }
        await wait(1000);
        await tapOn("edit", () => setEdit("select"));
        await wait(420);
        setEdit("typing");
        for (let n = 1; n <= NOTE_AFTER.length; n++) {
          setTyped(n);
          await wait(22);
        }
        await wait(260);
        setEdit("done");
        await wait(620);
        await tapOn("final", () => setSent(true));
        await wait(1400);
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
  const sorted = !(beat === "empty" || beat === "carry" || beat === "reading"); // stays on through the fade out
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

  const approveLabel = sent ? "Sent to Daniel" : "Approve Summary";
  const editing = edit === "select" || edit === "typing";
  const remainingNote = (
    <span
      data-note
      className="block rounded-[3px]"
      style={{
        color: edit === "idle" ? undefined : "#1F2933",
        boxShadow: editing ? "0 0 0 1px #309E96, 0 0 0 4px rgba(48,158,150,0.14)" : "0 0 0 0 rgba(48,158,150,0)",
        transition: "box-shadow 180ms ease",
      }}
    >
      {edit === "idle" && NOTE_BEFORE}
      {edit === "select" && <span className="bg-[#CDEBE8]">{NOTE_BEFORE}</span>}
      {edit === "typing" && (
        <>
          {NOTE_AFTER.slice(0, typed)}
          <span className="ml-px inline-block h-[14px] w-px translate-y-[2px] bg-[#1F2933]" />
        </>
      )}
      {edit === "done" && NOTE_AFTER}
    </span>
  );
  const remainingAction =
    edit === "idle" ? (
      <span className="rounded" style={tapStyle(tap === "edit")}><SummaryEditToggle /></span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[#309E96]" style={{ fontSize: 12, fontWeight: 600 }}>
        {edit === "done" && <CheckIcon className="h-3.5 w-3.5" />}
        {edit === "done" ? "Edited" : "Editing"}
      </span>
    );

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
                    {(beat === "docs" || !inRecord) && <Appear key="docs"><TheirDocuments pulse={tap === "summary"} /></Appear>}
                    {(beat === "summary" || beat === "review") && (
                      <Appear key="summary" className="flex h-full flex-col">
                        <SubTabs
                          active="Summary"
                          right={
                            <span className="inline-flex h-9 flex-shrink-0 items-center rounded-full bg-[#309E96] px-5 text-[13px] font-medium text-white" style={tapStyle(tap === "approve")}>
                              Approve
                            </span>
                          }
                        />
                        <div ref={cardsRef} className="min-h-0 flex-1 overflow-hidden rounded-t-2xl">
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

            {/* The approval page */}
            <div ref={reviewRef} className="pointer-events-none absolute inset-0 z-30" style={{ opacity: beat === "review" ? 1 : 0, transition: "opacity 360ms ease" }}>
              {compact ? (
                <div className="flex h-full flex-col overflow-hidden bg-[#F0F2F5] px-4 pt-5 text-left" style={{ fontFamily: FIGTREE }}>
                  <h3 className="text-[20px] font-semibold leading-snug text-[#1F2933]" style={{ fontFamily: FIGTREE }}>Review Daniel&apos;s estate plan summary</h3>
                  <p className="mt-1 text-[13.5px] leading-normal text-[#6B7280]">Once you approve, the summary will appear on Daniel&apos;s account.</p>
                  <span className="mt-3 flex h-10 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-[#128F8B] text-[14px] font-medium text-white" style={tapStyle(tap === "final")}>
                    <CheckIcon className="h-4 w-4" />
                    {approveLabel}
                  </span>
                  <div data-review-cards className="mt-3 min-h-0 flex-1 overflow-hidden rounded-t-2xl">
                    <div style={{ transform: `translateY(${-reviewScroll}px)` }}>
                      <SummaryCards flush remainingNote={remainingNote} remainingAction={remainingAction} />
                    </div>
                  </div>
                </div>
              ) : (
                <SummaryReviewScreenCropped
                  edited={edit === "done"}
                  approveLabel={approveLabel}
                  approveStyle={tapStyle(tap === "final")}
                  remainingNote={remainingNote}
                  remainingAction={remainingAction}
                />
              )}
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
