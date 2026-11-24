import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FloatStack, ScaledScreen, WIcon } from "@/components/product/kit";
import { AttorneyClientsScreen, CLIENT_PANEL_TABS, ProDocRow, ProDocSectionLabel } from "@/components/product/attorney-clients";
import { SummaryCards } from "@/components/product/attorney-review";
import { OutlookLogo } from "@/components/product/attorney-booking";
import { CheckIcon, CloseIcon, ViewIcon } from "@/components/product/willow-icons";

/* Keeping things easy, as a film on the product's real screens:
   1. the signed plan dropped into the upload box (add-client/setup-wizard.tsx,
      without its title and steps: Aaron, Nov 24), read and filed under each
      person; Continue, and the accounts fill themselves in: names from the
      documents, emails and phones from Outlook (api/clients/find-contact),
      their address from the documents; Add clients opens Daniel's record.
      The film creates the account by itself; in the product the attorney
      confirms it
   2. the summary being written (Aaron, Nov 24): the will on its own, a page
      of paper with its gifts marked as Willow reads them, fading to Daniel's
      summary writing itself, then Approve. In the product the summary is
      written before the attorney opens it, behind the same working mark
      (summary-generating.tsx); the film shows the reading that goes into it
   3. the reaching out: Daniel's Staying in touch tab (client-detail/
      staying-in-touch.tsx on main), each kind of check-in with its next date,
      and Emma, the executor, booking a meeting from one, with no click from
      the attorney. The film leaves out the "Sends based on" dates and the
      pause the product puts on Emma's check-ins once she books
   Each chapter is its own sequence, with its own start and end. The film plays
   them in order once from where it's opened and stops on the last frame.
   People who prefer reduced motion see each chapter at rest.
   On the site (Nov 24, 2026) each chapter is a tile of its own in a row of
   three (`tile`): the narrow layout, held on its last frame until its turn
   (`hold`), telling the section when it's done (`onEnd`).
   Copied from ClientFilm.tsx at 8de2d8c, where these were chapters 1 and 2
   (Nov 24, 2026: they moved to their own section). */

const ROOT_WIDE = { w: 1140, h: 855 }; // a laptop-width window, so the panel reads beside the chapter list
const ROOT_COMPACT = { w: 440, h: 500 };
const PANEL_WIDE = { w: 800, h: 791 }; // under the 64px top bar

/* A dark print with the product on it. The product runs off the bottom edge:
   on wide screens off the right too, in the narrow layout with room either side */
const FilmFrame = ({ compact, size, children, over }: { compact: boolean; size: { w: number; h: number }; children: React.ReactNode; over?: (frame: { w: number; h: number }) => React.ReactNode }) => {
  const mat = compact ? { l: 0.05, t: 0.05, r: 0.05, b: 0 } : { l: 0.05, t: 0.065, r: 0, b: 0 };
  const w = size.w / (1 - mat.l - mat.r);
  const h = size.h / (1 - mat.t - mat.b);
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#062D2C] shadow-xl" style={{ aspectRatio: `${w} / ${h}` }}>
      <img src="/central-park.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.74)" }} />
      <div
        className={`absolute overflow-hidden bg-white ${compact ? "rounded-t-lg" : "rounded-tl-xl"}`}
        style={{ left: `${mat.l * 100}%`, top: `${mat.t * 100}%`, right: `${mat.r * 100}%`, bottom: `${mat.b * 100}%`, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
      >
        {children}
      </div>
      {/* Above the product, in the frame's own units: chapter 2's page of paper */}
      {over?.({ w, h })}
    </div>
  );
};

export const EASY_CHAPTERS = 3;
/** Optional: lets a dev review page pause and slow the film */
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

const FAN = [-8, -5, -2, 2, 5, 8];

/** How long each chapter runs at normal speed */
export const EASY_MS = [12910, 9090, 6390];

/* A button pressing itself: nothing crosses the screen to click it */
const tapStyle = (on: boolean): React.CSSProperties => ({
  transform: on ? "scale(0.96)" : "scale(1)",
  boxShadow: on ? "0 0 0 6px rgba(48,158,150,0.22)" : "0 0 0 0 rgba(48,158,150,0)",
  transition: "transform 180ms var(--ease-out), box-shadow 340ms ease",
});

type Beat = "empty" | "carry" | "reading" | "filed" | "accounts" | "docs" | "explain" | "summary" | "touch";
type Place = "off" | "carry" | "fan" | "file" | "hidden";
type Point = { x: number; y: number };
type Tap = "continue" | "approve" | "tab" | null;

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

/* How far down a container an element ends, from layout alone (transforms
   and their transitions don't count) */
const bottomWithin = (el: HTMLElement | null | undefined, container: HTMLElement | null) => {
  if (!el || !container) return 0;
  let y = el.offsetHeight;
  let n: HTMLElement | null = el;
  while (n && n !== container) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
};

const Appear = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <div className={className} style={{ opacity: on ? 1 : 0, transition: "opacity 240ms ease" }}>{children}</div>;
};

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
            <div key={p.n} data-client={p.n} className={section}>
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
            data-add-clients
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

/* A sheet of paper: one document of the signed plan */
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

/* The Estate Plan tab's documents. The film leaves out the tab's own
   Documents / Summary row (Aaron, Nov 24: less clunky) */
const TheirDocuments = () => (
  <>
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

/* Chapter 2: Willow writing the summary (Aaron, Nov 24). First the will on
   its own, a page of paper on the print: its two gifts marked as Willow
   reads them. The page fades, and Daniel's summary writes itself in the
   Estate Plan tab: What You'll Leave Behind, Maria if she survives him,
   otherwise Emma and Leo in equal shares (the card, scenario tabs and share
   bars as scenario-will-summary.tsx draws them), the product's working mark
   breathing beneath (working-mark.tsx: the W and its legal puns, one every
   2.8s) until it's done. Then Approve */
const PUNS = ["Reading the fine print…", "Hereinafter referred to as “loading”…", "Taking it under advisement…"];
const SERIF = "Georgia, 'Times New Roman', serif";
const WILL_A = "I give all the rest, residue and remainder of my estate to my wife, MARIA ROSEN, if she survives me.";
const WILL_B = "If my wife does not survive me, I give my residuary estate in equal shares to my children, EMMA ROSEN and LEO ROSEN.";
const SCENARIOS = ["If Maria survives you", "If Maria doesn’t survive you"];
const SHARES = [
  [{ name: "Maria Rosen", percent: 100 }],
  [
    { name: "Emma Rosen", percent: 50 },
    { name: "Leo Rosen", percent: 50 },
  ],
];

/* A marker run over the words, line after line, as Willow reads them; it
   fades back once Willow has moved on */
const Marked = ({ on, faint, ms, still, children }: { on: boolean; faint?: boolean; ms: number; still: boolean; children: React.ReactNode }) => {
  const c = faint ? "#DDF0EE" : "#BFE5E1";
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${c}, ${c})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: on ? "100% 100%" : "0% 100%",
        transition: on && !still ? `background-size ${ms}ms linear` : "none",
        color: on ? "#111827" : undefined,
      }}
    >
      {children}
    </span>
  );
};

/* The will's page, set on the print with room either side and its foot off
   the frame, as a piece of paper rather than part of the product */
const WillPaper = ({ size, show, hl, still }: { size: { w: number; h: number }; show: boolean; hl: number; still: boolean }) => {
  const head = "mt-5 text-center text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#1F2933]";
  const para = "mt-2.5 text-[13.5px] leading-[1.65] text-[#4B5563]";
  const side = Math.max(36, (size.w - 420) / 2);
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ opacity: show ? 1 : 0, visibility: show ? "visible" : "hidden", transition: still ? "none" : show ? "opacity 420ms ease" : "opacity 560ms ease, visibility 0s linear 560ms" }}
    >
      <img src="/central-park.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.74)" }} />
      <ScaledScreen w={size.w} h={size.h}>
        <div className="relative" style={{ width: size.w, height: size.h }}>
          <div
            className="absolute rounded-[6px] bg-white"
            style={{
              left: side,
              right: side,
              top: 34,
              bottom: -24,
              boxShadow: "0 24px 70px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.12)",
              transform: show ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.97)",
              transition: still ? "none" : "transform 600ms var(--ease-in-out)",
            }}
          >
            <div className="px-10 pt-9" style={{ fontFamily: SERIF }}>
              <p className="text-center text-[15px] font-bold uppercase tracking-[0.18em] text-[#1F2933]">Last Will and Testament</p>
              <p className="mt-1 text-center text-[12.5px] uppercase tracking-[0.14em] text-[#4B5563]">of Daniel Rosen</p>
              <p className={`${para} mt-5`} style={{ textIndent: 24 }}>
                I, DANIEL ROSEN, of the City, County and State of New York, declare this to be my Last Will and Testament.
              </p>
              <p className={head}>Article First</p>
              <p className={para} style={{ textIndent: 24 }}>
                I direct that my just debts, funeral expenses and the expenses of administering my estate be paid from my estate.
              </p>
              <p className={head}>Article Second</p>
              <p className={para} style={{ textIndent: 24 }}>
                <Marked on={hl >= 1} faint={hl >= 2} ms={900} still={still}>{WILL_A}</Marked>
              </p>
              <p className={para} style={{ textIndent: 24 }}>
                <Marked on={hl >= 2} ms={1000} still={still}>{WILL_B}</Marked>
              </p>
              <p className={head}>Article Third</p>
              <p className={para} style={{ textIndent: 24 }}>
                I appoint my wife, MARIA ROSEN, as Executor of this Will. If she fails to qualify or ceases to act, I appoint my daughter, EMMA ROSEN.
              </p>
            </div>
          </div>
        </div>
      </ScaledScreen>
    </div>
  );
};

/* ShareRow, its bar filling as it's written */
const ShareBar = ({ name, percent, still }: { name: string; percent: number; still: boolean }) => {
  const [on, setOn] = useState(still);
  useEffect(() => {
    if (still) return setOn(true);
    const t = window.setTimeout(() => setOn(true), 80);
    return () => window.clearTimeout(t);
  }, [still]);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[14px] font-medium text-[#1F2933]">{name}</span>
        <span className="text-[14px] font-semibold text-[#128F8B]">{percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
        <div className="h-full rounded-full bg-[#128F8B]" style={{ width: on ? `${percent}%` : "0%", transition: still ? "none" : "width 800ms var(--ease-out)" }} />
      </div>
    </div>
  );
};

/* working-mark.tsx, small: the W breathing beside the line of the moment */
const WorkingRow = ({ pun }: { pun: number }) => (
  <div className="mt-4 flex items-center gap-3">
    <span className="flex h-7 w-7 flex-shrink-0 animate-pulse items-center justify-center rounded-full bg-[#309E96] motion-reduce:animate-none">
      <span className="text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 14, lineHeight: 1, marginTop: 2 }}>W</span>
    </span>
    <Appear key={pun}>
      <span className="text-[13px] text-[#6B7280]">{PUNS[pun]}</span>
    </Appear>
  </div>
);

/* What You'll Leave Behind, open, writing itself */
const LeaveBehindLive = ({ share, pun, ready, sent, tap, still }: { share: number; pun: number; ready: boolean; sent: boolean; tap: Tap; still: boolean }) => (
  <div className="h-full overflow-hidden rounded-t-2xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
    <div className="flex items-center gap-3 p-4">
      <img src="/mock/tree-icon.png" alt="" width={36} height={36} className="h-9 w-9 flex-shrink-0 object-contain" />
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold text-[#1F2933]">What You’ll Leave Behind</div>
        <div className="truncate text-[12.5px] text-[#9CA3AF]">How your estate is managed and distributed</div>
      </div>
      <WIcon name="chevronDown" className="h-4 w-4 flex-shrink-0 rotate-180 text-[#6B7280]" />
    </div>
    <div className="px-4 pb-4">
      {share >= 1 && (
        <Appear>
          <div className="mb-3 inline-flex items-center gap-4 border-b border-[#E5E7EB] pb-2">
            {SCENARIOS.map((s, i) => (
              <span key={s} className="whitespace-nowrap text-[13px] font-medium" style={{ color: share - 1 === i ? "#128F8B" : "#6B7280", transition: "color 300ms ease" }}>
                {s}
              </span>
            ))}
          </div>
          <p className="mb-3 text-[14px] font-semibold text-[#1F2933]">The Remaining Estate</p>
          <Appear key={share}>
            <div className="space-y-3">
              {SHARES[share - 1].map((r) => (
                <ShareBar key={r.name} name={r.name} percent={r.percent} still={still} />
              ))}
            </div>
          </Appear>
        </Appear>
      )}
      {!ready && <WorkingRow pun={pun} />}
      {/* Written: Approve Summary (the review page's button), here at its foot */}
      {ready && (
        <div className="mt-5" style={{ opacity: 1, animation: still ? undefined : "film-approve-in 320ms ease" }}>
          <style>{"@keyframes film-approve-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }"}</style>
          <div className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#309E96] text-[15px] font-semibold text-white" style={tapStyle(tap === "approve")}>
            {sent && <CheckIcon className="h-4 w-4" />}
            {sent ? "Approved and sent" : "Approve Summary"}
          </div>
        </div>
      )}
    </div>
  </div>
);

/* Chapter 3: Daniel's check-ins as his record lists them, a few weeks on
   (early January 2027): the agent check-in went out on December 24, so its
   next one is a year away, and the others are a year after the plan. Dates
   carry the year only when it isn't this one, as the product writes them */
const TOUCH_WAYS = [
  { label: "Agent check-ins", next: "December 24" },
  { label: "Professional check-ins", next: "November 24" },
  { label: "Client check-ins", next: "November 24" },
];

/* client-detail/staying-in-touch.tsx: one switch per kind of check-in with
   its next date, then "Daniel's people", where Emma's booking arrives
   (StackGroup, StackSection and SwitchLine, as the product draws them).
   step: 0 nothing yet, 1 the check-ins, 2 Emma has booked */
const RecordTouch = ({ step, compact }: { step: number; compact: boolean }) => {
  const box = compact ? "bg-white p-5" : "bg-white p-8";
  const label = `${compact ? "mb-3" : "mb-4"} text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]`;
  return (
    <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
      <div className="flex flex-col gap-1.5">
        <div className={box}>
          <p className={label}>Staying in touch</p>
          {TOUCH_WAYS.map((w, i) => (
            <div
              key={w.label}
              className={`flex items-center gap-[13px] ${compact ? "py-[10px]" : "py-[13px]"} ${i < TOUCH_WAYS.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
              style={{
                opacity: step >= 1 ? 1 : 0,
                transform: step >= 1 ? "translateY(0)" : "translateY(6px)",
                transition: `opacity 300ms ease ${i * 110}ms, transform 420ms var(--ease-out) ${i * 110}ms`,
              }}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] text-[#1F2933]">{w.label}</span>
                <span className="mt-px block text-[12.5px] text-[#9CA3AF]">Next: {w.next}</span>
              </span>
              <span className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-[#309E96]">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow" style={{ transform: "translateX(18px)" }} />
              </span>
            </div>
          ))}
        </div>
        <div
          className={box}
          data-touch-people
          data-booked={step >= 2 ? "" : undefined}
          style={{
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 320ms ease, transform 520ms var(--ease-out)",
          }}
        >
          <p className={label}>Daniel’s people</p>
          <div className="-mx-3 rounded-lg px-3 py-2.5" style={{ background: step >= 2 ? "#F0F9F8" : "rgba(240,249,248,0)", transition: "background-color 600ms ease 300ms" }}>
            <p className="text-[14px] text-[#1F2933]">Emma booked Tuesday, Jan 12</p>
            <p className="text-[13px] text-[#9CA3AF]">Executor · emma.rosen@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FILM_LABEL =
  "An attorney drops a client's signed estate plan into Willow, which reads it and files each document under the right person. Willow then reads the will and writes a plain-English summary of who gets what, which the attorney approves, and schedules every check-in, so the executor books a meeting without the attorney reaching out.";
const TILE_LABELS = [
  "An attorney drops a client's signed estate plan into Willow, which reads it, files each document under the right person, and fills in the clients' names, emails, phones and address before opening the client's record.",
  "A page of Daniel's will, its gifts marked as Willow reads them, fades to the summary Willow writes from it: Maria if she survives him, otherwise Emma and Leo in equal shares. The attorney approves it.",
  "The client's Staying in touch tab: each kind of check-in with its next date, and the executor booking a meeting from one.",
];

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
  /** One chapter in a narrow tile, at every screen width */
  tile?: boolean;
  /** Not this chapter's turn: rest on its last frame */
  hold?: boolean;
  /** The chapter has played to its end */
  onEnd?: () => void;
};

const EasyFilm = ({ chapter, replay, onChapter, onStart, clock, rewatch = false, tile = false, hold = false, onEnd }: Props) => {
  const narrow = useCompact();
  const compact = tile || narrow;
  const root = compact ? ROOT_COMPACT : ROOT_WIDE;
  const stage = compact ? ROOT_COMPACT : PANEL_WIDE;
  const panelCx = compact ? root.w / 2 : root.w - PANEL_WIDE.w / 2;
  const pad = compact ? 24 : 32;
  const sheet = compact ? { w: 112, h: 146 } : { w: 94, h: 124 }; // six fit inside the card's padding
  const sheetsH = compact ? sheet.h * 2 + 8 : sheet.h;
  const lineH = 46 + 12; // the drop line and the room under it
  /* The empty box is already big enough for the documents it's about to hold */
  const zoneH = pad * 2 + lineH + sheetsH;

  const frameRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const doneKey = useRef("");
  /* The chapters that have started playing, and the last click we've seen */
  const played = useRef(new Set<number>());
  const lastReplay = useRef(replay);
  const callbacks = useRef({ onChapter, onStart, onEnd });
  callbacks.current = { onChapter, onStart, onEnd };

  const [inView, setInView] = useState(false);
  const [beat, setBeat] = useState<Beat>("empty");
  const [place, setPlace] = useState<Place>("off");
  const [scan, setScan] = useState(-1);
  const [fanY, setFanY] = useState(0);
  const [targets, setTargets] = useState<Point[]>([]);
  const [tap, setTap] = useState<Tap>(null);
  const [sent, setSent] = useState(false);
  /* Chapter 2: what's marked in the will, what's written in the summary */
  const [hl, setHl] = useState(0);
  const [share, setShare] = useState(0);
  const [pun, setPun] = useState(0);
  const [ready, setReady] = useState(false);
  /* Chapter 2 opens on the will as a page of paper, before the product */
  const [paper, setPaper] = useState(false);
  /* Chapter 1's second step: who Outlook has found, who it's looking for */
  const [found, setFound] = useState(0);
  const [looking, setLooking] = useState(0);
  const [address, setAddress] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [scrollB, setScrollB] = useState(0);
  const accountsRef = useRef<HTMLDivElement>(null);
  /* At rest on a last frame: nothing animates into place */
  const [still, setStill] = useState(false);
  const [touchStep, setTouchStep] = useState(0);
  const [cardH, setCardH] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<Point>({ x: 0, y: 0 });
  const [scrollA, setScrollA] = useState(0);
  /* In the short narrow frame the record scrolls down to Emma's booking */
  const recordRef = useRef<HTMLDivElement>(null);
  const [touchLift, setTouchLift] = useState(0);

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

  /* The tab row scrolls in the narrow layout: keep the open tab in sight,
     moving only as far as it takes, so no tab is left cut in half */
  const openTab = beat === "touch" ? "Staying in touch" : "Estate Plan";
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>(`[data-tab="${openTab}"]`);
    if (!row || !tab) return;
    const over = tab.offsetLeft + tab.offsetWidth - row.clientWidth;
    row.scrollTo({ left: over > 0 ? over + 16 : 0, behavior: "smooth" });
  }, [openTab]);

  useLayoutEffect(() => {
    if (beat !== "touch") return;
    const people = recordRef.current?.querySelector<HTMLElement>("[data-touch-people]");
    const need = bottomWithin(people, recordRef.current) + 20 - root.h;
    /* When it has to move, it moves up to the tab row, so no line is left cut in half */
    const tabsTop = tabsRef.current?.offsetTop ?? 0;
    setTouchLift(need > 0 ? Math.max(need, tabsTop - 12) : 0);
  }, [beat, root.h]);
  const lift = beat === "touch" && touchStep >= 2 ? touchLift : 0;

  useEffect(() => {
    const key = `${chapter}:${replay}:${compact}:${hold}`;
    /* A click on the chapter list (replay changes) */
    const clicked = replay !== lastReplay.current;
    lastReplay.current = replay;
    if (doneKey.current === key) return;

    /* A chapter already seen, opened again from the list, goes straight to its
       last frame and stays there. People who prefer reduced motion get every
       chapter that way */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || hold || (clicked && !rewatch && played.current.has(chapter))) {
      doneKey.current = key;
      setStill(true);
      setPlace("hidden");
      setScan(-1);
      setTargets([]);
      setTap(null);
      setHl(2);
      setShare(2);
      setPun(0);
      setReady(true);
      setPaper(false);
      setScrollB(0);
      setSent(chapter >= 1);
      setTouchStep(chapter === 2 ? 2 : 0);
      setBeat((["docs", "explain", "touch"] as Beat[])[chapter]);
      callbacks.current.onStart(0);
      return;
    }
    if (!inView) return;
    played.current.add(chapter);

    const R = compact ? ROOT_COMPACT : ROOT_WIDE;
    const cx = compact ? R.w / 2 : R.w - PANEL_WIDE.w / 2;
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
      setStill(false);
      setScan(-1);
      setTargets([]);
      setTap(null);
      setFound(0);
      setLooking(0);
      setAddress(false);
      setPulse(false);
      setScrollB(0);
      setPaper(false);
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

    /* Each chapter's waits add up to its EASY_MS */
    const chapters: (() => Promise<void>)[] = [
      /* 1. The signed plan goes into the box, is read and filed; Continue,
         the accounts fill themselves in; Add clients opens Daniel's record */
      async () => {
        reset();
        setBeat("empty");
        setPlace("off");
        setCardH(zoneH);
        setScrollA(0);
        await wait(420);
        const card = box(cardRef.current);
        /* The documents land inside the box, under its drop line... */
        setDropAt({ x: cx, y: card.top + pad + lineH + sheetsH / 2 });
        /* ...and, the line gone, spread out in the middle of it to be read */
        setFanY(card.top + (zoneH - sheetsH) / 2 + sheet.h / 2);
        setBeat("carry");
        setPlace("carry");
        await wait(960);
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
        /* Down to Maria, when she's below the frame */
        const accounts = accountsRef.current;
        setScrollB(Math.max(0, bottomWithin(accounts?.querySelector<HTMLElement>("[data-client='2']"), accounts) + 16 - R.h));
        await wait(420);
        setLooking(2);
        await wait(720);
        setFound(2);
        setLooking(0);
        /* Down, so their address and Add clients are in sight */
        setScrollB(Math.max(0, bottomWithin(accounts?.querySelector<HTMLElement>("[data-add-clients]"), accounts) + 24 - R.h));
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
        await wait(1600);
      },
      /* 2. The will on its own, its gifts marked; it fades to the summary,
         which writes itself; Approve */
      async () => {
        reset();
        setHl(0);
        setShare(0);
        setPun(0);
        setReady(false);
        setSent(false);
        setPlace("hidden");
        setBeat("explain");
        setPaper(true);
        await wait(600);
        setHl(1);
        await wait(1100);
        setHl(2);
        await wait(1300);
        setPaper(false);
        await wait(900);
        setShare(1);
        await wait(1300);
        setPun(1);
        setShare(2);
        await wait(1100);
        setReady(true);
        await wait(800);
        await tapOn("approve", () => setSent(true));
        await wait(1800);
      },
      /* 3. The reaching out: from the approved summary to Daniel's Staying in
         touch tab, his check-ins each with a date, then Emma's booking */
      async () => {
        reset();
        setSent(true);
        setTouchStep(0);
        setPlace("hidden");
        setBeat("summary");
        await wait(700);
        await tapOn("tab", () => setBeat("touch"));
        await wait(300);
        setTouchStep(1);
        await wait(2000);
        setTouchStep(2);
        await wait(3200);
      },
    ];

    callbacks.current.onStart(EASY_MS[chapter]);
    chapters[chapter]()
      .then(() => {
        if (!live) return;
        doneKey.current = key;
        callbacks.current.onEnd?.();
        if (chapter < EASY_CHAPTERS - 1) callbacks.current.onChapter(chapter + 1);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [chapter, replay, inView, compact, clock, rewatch, hold, pad, lineH, sheetsH, zoneH, sheet.h]);

  const uploading = beat === "empty" || beat === "carry" || beat === "reading" || beat === "filed";
  const inRecord = beat === "docs" || beat === "explain" || beat === "summary" || beat === "touch";
  const sorted = !(beat === "empty" || beat === "carry" || beat === "reading"); // stays on through the fade out
  const panelPad = compact ? "px-4 py-6" : "px-16 py-10";
  const list = DOCS;
  const sheetAt = (i: number) => {
    const n = list.length;
    const off = (i - (n - 1) / 2) * 3;
    const fan = () => {
      if (compact && (beat === "reading" || beat === "filed")) {
        return { x: panelCx + ((i % 3) - 1) * (sheet.w + 8), y: fanY + Math.floor(i / 3) * (sheet.h + 8) };
      }
      const gap = compact ? (root.w - sheet.w - 24) / Math.max(1, n - 1) : sheet.w + 8;
      return { x: panelCx + (i - (n - 1) / 2) * gap, y: fanY };
    };
    if (place === "off") return { x: root.w + 130 + off, y: root.h - 70 - off, r: FAN[i % 6], s: 0.92, o: 1, t: "none" };
    if (place === "carry") return { x: dropAt.x + off, y: dropAt.y - off, r: FAN[i % 6], s: 0.92, o: 1, t: `transform 900ms ${MOVE}` };
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
      aria-label={tile ? TILE_LABELS[chapter] : FILM_LABEL}
    >
      <FilmFrame compact={compact} size={root} over={(frame) => <WillPaper size={frame} show={paper} hl={hl} still={still} />}>
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
              {/* The upload box, and Continue */}
              <div
                className="absolute inset-x-0 top-0"
                style={{ opacity: uploading ? 1 : 0, transform: `translateY(${-scrollA}px)`, transition: "opacity 440ms ease, transform 640ms var(--ease-in-out)" }}
              >
                <div className={panelPad}>
                  <div ref={cardRef} className="relative overflow-hidden rounded-2xl bg-white" style={{ height: cardH ?? zoneH, transition: "height 460ms var(--ease-in-out)" }}>
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

              {/* Their accounts, filling themselves in */}
              <div
                ref={accountsRef}
                className="absolute inset-x-0 top-0"
                style={{ opacity: beat === "accounts" ? 1 : 0, transform: `translateY(${-scrollB}px)`, transition: "opacity 440ms ease, transform 640ms var(--ease-in-out)" }}
              >
                <div className={panelPad}>
                  <TheirAccounts found={found} looking={looking} address={address} pulse={pulse} compact={compact} />
                </div>
              </div>

              {/* The client */}
              <div className="absolute inset-0" style={{ opacity: inRecord ? 1 : 0, transition: "opacity 440ms ease" }}>
                <div
                  ref={recordRef}
                  className={`relative flex h-full flex-col ${compact ? "px-4 pt-6" : "px-16 pt-10"}`}
                  style={{ transform: `translateY(${-lift}px)`, transition: lift ? "transform 700ms var(--ease-in-out)" : "none" }}
                >
                  <div className={`${compact ? "mb-4" : "mb-6"} flex flex-shrink-0 items-start justify-between gap-3`}>
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
                          className="whitespace-nowrap rounded-t-md border-b-2 px-4 py-3 text-[13px] font-medium"
                          style={{
                            borderColor: t === openTab ? "#309E96" : "transparent",
                            color: t === openTab ? "#309E96" : "#6B7280",
                            background: tap === "tab" && t === "Staying in touch" ? "rgba(48,158,150,0.12)" : "rgba(48,158,150,0)",
                            transition: "color 200ms ease, border-color 200ms ease, background-color 180ms ease",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`${compact ? "mt-4" : "mt-6"} min-h-0 flex-1`}>
                    {(beat === "docs" || !inRecord) && <Appear key="docs"><TheirDocuments /></Appear>}
                    {beat === "touch" && (
                      <Appear key="touch">
                        <RecordTouch step={touchStep} compact={compact} />
                      </Appear>
                    )}
                    {beat === "explain" && (
                      <Appear key="explain" className="h-full">
                        <LeaveBehindLive share={share} pun={pun} ready={ready} sent={sent} tap={tap} still={still} />
                      </Appear>
                    )}
                    {beat === "summary" && (
                      <Appear key="summary" className="h-full overflow-hidden rounded-t-2xl">
                        <SummaryCards flush familyOpen={false} leaveOpen={false} protectsOpen={false} />
                      </Appear>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Paper */}
            {list.map((d, i) => {
              const p = sheetAt(i);
              return (
                <div
                  key={i}
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

export default EasyFilm;
