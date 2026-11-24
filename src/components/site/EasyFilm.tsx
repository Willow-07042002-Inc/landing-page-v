import React, { useEffect, useRef, useState } from "react";
import { FloatStack, ScaledScreen, WIcon } from "@/components/product/kit";
import { AttorneyClientsScreen, CLIENT_PANEL_TABS, ProDocRow, ProDocSectionLabel } from "@/components/product/attorney-clients";
import { OutlookLogo } from "@/components/product/attorney-booking";
import { CalendarCheckIcon, CloseIcon, ViewIcon } from "@/components/product/willow-icons";

/* Keeping things easy, as a film on the product's real screens:
   1. the signed plan dropped into the upload box (add-client/setup-wizard.tsx,
      without its title and steps: Aaron, Nov 24), read and filed under each
      person; Continue, and the accounts fill themselves in: names from the
      documents, emails and phones from Outlook (api/clients/find-contact),
      their address from the documents; Add clients opens Daniel's record.
      The film creates the account by itself; in the product the attorney
      confirms it
   2. the summary being written (Aaron, Nov 24): the will on its own, a page
      of paper with its gifts marked as Willow reads them, fading to the
      summary alone writing itself: who gets the home, the cottage, the sloop
      and the rest. In the product the summary is
      written before the attorney opens it, behind the same working mark
      (summary-generating.tsx); the film shows the reading that goes into it
   3. the check-ins (Aaron, Nov 24: the same as "Automate client check-ins"
      above): the client check-in written once and saved, folding into the
      month, which fills with each client's day; it rests on the month
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

/* A button pressing itself: nothing crosses the screen to click it */
const tapStyle = (on: boolean): React.CSSProperties => ({
  transform: on ? "scale(0.96)" : "scale(1)",
  boxShadow: on ? "0 0 0 6px rgba(48,158,150,0.22)" : "0 0 0 0 rgba(48,158,150,0)",
  transition: "transform 180ms var(--ease-out), box-shadow 340ms ease",
});

type Beat = "empty" | "carry" | "reading" | "filed" | "accounts" | "docs" | "explain" | "checkin";
type Place = "off" | "carry" | "fan" | "file" | "hidden";
type Point = { x: number; y: number };
type Tap = "continue" | "save" | null;

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
        <ProDocSectionLabel label="Daniel's documents" />
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
   its own, a page of paper on the print, each gift marked as Willow reads
   it: the home to Maria, the cottage to Emma, the sloop to Daniel's
   brother Jacob, the rest to Emma and Leo in equal shares. The page fades
   to the summary alone (no record around it, nothing to approve), What
   You'll Leave Behind writing itself line by line: Gifts & Bequests as
   GiftTable draws it (Recipient, The Gift), then The Remaining Estate's
   share bars, with the product's working mark breathing beneath
   (working-mark.tsx: the W and its legal puns) until the last line is in */
const PUNS = ["Reading the fine print…", "Hereinafter referred to as “loading”…", "Taking it under advisement…"];
const SERIF = "Georgia, 'Times New Roman', serif";
/* The will's words for each gift, how long the marker takes over them, and
   what the summary makes of them */
const WILL_GIFTS = [
  { text: "I give my home at 85 Grove Street, New York, New York, to my wife, MARIA ROSEN.", ms: 380 },
  { text: "I give my cottage in Southampton, New York, to my daughter, EMMA ROSEN.", ms: 380 },
  { text: "I give my 1976 sloop to my brother, JACOB ROSEN.", ms: 300 },
];
const WILL_REST = { text: "I give all the rest, residue and remainder of my estate in equal shares to my children, EMMA ROSEN and LEO ROSEN.", ms: 480 };
const SUMMARY_GIFTS = [
  { to: "Maria Rosen", rel: "Your spouse", item: "Your home on Grove Street" },
  { to: "Emma Rosen", rel: "Your child", item: "Your cottage in Southampton" },
  { to: "Jacob Rosen", rel: "Your brother", item: "Your 1976 sloop" },
];
const SUMMARY_REST = [
  { name: "Emma Rosen", percent: 50 },
  { name: "Leo Rosen", percent: 50 },
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
  const marked = (n: number, g: { text: string; ms: number }) => (
    <p className={para} style={{ textIndent: 24 }}>
      <Marked on={hl >= n} faint={hl > n} ms={g.ms} still={still}>{g.text}</Marked>
    </p>
  );
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
                I, DANIEL ROSEN, of New York, New York, declare this to be my Last Will and Testament.
              </p>
              <p className={head}>Article First</p>
              {WILL_GIFTS.map((g, i) => <React.Fragment key={i}>{marked(i + 1, g)}</React.Fragment>)}
              <p className={head}>Article Second</p>
              {marked(4, WILL_REST)}
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

/* ShareRow, written: its bar grows out to the share while the number
   counts up beside it, both from one clock so they arrive together */
const SHARE_MS = 1100;
const ShareBar = ({ name, percent, still }: { name: string; percent: number; still: boolean }) => {
  const [value, setValue] = useState(still ? percent : 0);
  useEffect(() => {
    if (still) return setValue(percent);
    let raf = 0;
    const delay = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SHARE_MS);
        setValue(percent * (1 - Math.pow(1 - t, 3)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 180);
    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, [percent, still]);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[14px] font-medium text-[#1F2933]">{name}</span>
        <span className="text-[14px] font-semibold tabular-nums text-[#128F8B]">{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#E5E7EB]">
        <div className="h-full rounded-full bg-[#128F8B]" style={{ width: `${value}%` }} />
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

/* A line of the summary arriving (or, with show off, leaving): the space
   for it opens smoothly, so nothing below jumps, while the words rise a
   little, fade in and come into focus (Aaron, Nov 24: sleeker) */
const Reveal = ({ show = true, still, children }: { show?: boolean; still: boolean; children: React.ReactNode }) => {
  const [on, setOn] = useState(still && show);
  useEffect(() => {
    if (still) return setOn(show);
    const t = window.setTimeout(() => setOn(show), 30);
    return () => window.clearTimeout(t);
  }, [show, still]);
  const move = still ? "none" : on
    ? "grid-template-rows 560ms var(--ease-in-out)"
    : "grid-template-rows 420ms var(--ease-in-out) 120ms";
  const look = still ? "none" : on
    ? "opacity 520ms ease 140ms, transform 640ms var(--ease-out) 140ms, filter 520ms ease 140ms"
    : "opacity 220ms ease, transform 260ms ease, filter 220ms ease";
  return (
    <div style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", transition: move }}>
      <div className="min-h-0 overflow-hidden">
        <div style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(8px)", filter: on ? "blur(0px)" : "blur(3px)", transition: look }}>
          {children}
        </div>
      </div>
    </div>
  );
};

/* What You'll Leave Behind, open, writing itself. written: 1-3 the gifts
   one by one, 4 the remaining estate */
const SummaryLive = ({ written, pun, ready, still }: { written: number; pun: number; ready: boolean; still: boolean }) => {
  const label = "text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]";
  const cols = "grid grid-cols-[0.85fr_1.15fr] gap-x-5";
  return (
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
        {written >= 1 && (
          <Reveal still={still}>
            <p className="mb-2.5 text-[14px] font-semibold text-[#1F2933]">Gifts &amp; Bequests</p>
            <div className={`${cols} border-b border-[#E5E7EB] pb-2`}>
              <span className={label}>Recipient</span>
              <span className={label}>The Gift</span>
            </div>
          </Reveal>
        )}
        {SUMMARY_GIFTS.slice(0, Math.min(written, SUMMARY_GIFTS.length)).map((g) => (
          <Reveal key={g.to + g.item} still={still}>
            <div className={`${cols} border-b border-[#F0F2F4] py-2`}>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[#1F2933]">{g.to}</div>
                <div className="mt-0.5 text-[12.5px] text-[#9CA3AF]">{g.rel}</div>
              </div>
              <div className="min-w-0 text-[14px] leading-[1.5] text-[#4B5563]">{g.item}</div>
            </div>
          </Reveal>
        ))}
        {written >= 4 && (
          <Reveal still={still}>
            <p className="mb-2.5 mt-4 text-[14px] font-semibold text-[#1F2933]">The Remaining Estate</p>
            <div className="space-y-3">
              {SUMMARY_REST.map((r) => (
                <ShareBar key={r.name} name={r.name} percent={r.percent} still={still} />
              ))}
            </div>
          </Reveal>
        )}
        {/* The working mark stays until the last line is in, then folds away */}
        <Reveal show={!ready} still={still}>
          <WorkingRow pun={pun} />
        </Reveal>
      </div>
    </div>
  );
};

/* Chapter 3 (Aaron, Nov 24): the same as "Automate client check-ins" in
   the section above (KeepInTouchFilm.tsx, chapter 1, copied here so this
   tile can sit in its own frame). The client check-in as the attorney
   writes it, saved, folding into the month it fills, each client on their
   own day a year after they signed. It rests on the month. The month is an
   illustration: the product keeps each client's next date
   (staying-in-touch.tsx), not a calendar. January 2027 starts on a Friday */
const CHECKIN_TYPED = "It’s been a year since we signed your plan, so I’m checking in. Has anything changed, like a move, a new grandchild or a change in what you own?";
const MONTH = { name: "January 2027", lead: 5, days: 31 };
const CHECKINS = [
  { day: 4, name: "Elena Ruiz" },
  { day: 7, name: "Marcus Webb" },
  { day: 12, name: "Daniel Rosen" },
  { day: 13, name: "Priya Anand" },
  { day: 20, name: "Sam Whitfield" },
  { day: 22, name: "Olivia Grant" },
  { day: 26, name: "Grace Liu" },
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/* The month's bar, weekday row and week rows, in film pixels */
const CAL = { head: 64, week: 34, row: 98, rowCompact: 74 };
/* The waits in chapter 3's script */
const C3 = { read: 500, perChar: 18, after: 300, fold: 400, land: 650, chip: 230, hold: 2000 };
const ARIAL = "Arial, 'Segoe UI', sans-serif";
const RING_ON = "0 0 0 1px #309E96, 0 0 0 4px rgba(48,158,150,0.14)";
const RING_OFF = "0 0 0 0 rgba(48,158,150,0)";

/* A fill-in as the composer shows it: a quiet pill in place of the name */
const FillIn = ({ children }: { children: React.ReactNode }) => (
  <span className="mx-px inline-flex items-center rounded-md bg-[#E6F5F4] px-1.5 text-[13px] font-medium leading-[22px] text-[#0F7673]">{children}</span>
);

/* A drawer's top line: its name, and its button */
const Bar = ({ title, compact, children }: { title: string; compact: boolean; children?: React.ReactNode }) => (
  <div className={`flex items-center justify-between gap-3 border-b border-[#EEF0F2] ${compact ? "px-5 py-3.5" : "px-7 py-4"}`}>
    <span className="truncate text-[17px] font-semibold text-[#1F2933]">{title}</span>
    {children && <span className="flex flex-shrink-0 items-center gap-2">{children}</span>}
  </div>
);

/* Over an email: when it goes out on its own, its subject, who it's to */
const EmailHead = ({ when, subject, to, compact }: { when: string; subject: React.ReactNode; to: React.ReactNode; compact: boolean }) => (
  <div className={`border-b border-[#EEF0F2] ${compact ? "px-5 py-3" : "px-7 py-3.5"}`}>
    <p className="flex items-center gap-2 text-[13px] font-semibold text-[#0F7673]">
      <CalendarCheckIcon className="h-4 w-4 flex-shrink-0 text-[#309E96]" />
      {when}
    </p>
    <p className="mt-1.5 text-[14.5px] font-semibold leading-[24px] text-[#1F2933]">{subject}</p>
    <p className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-[12.5px] text-[#6B7280]">To {to}</p>
  </div>
);

/* The email as touch-email.ts lays it out: the logo (Willow's while the firm
   has none), the words, the button */
const mailPara = (compact: boolean): React.CSSProperties => ({ fontSize: compact ? 14 : 15, lineHeight: 1.7 });

/* The client check-in as the attorney writes it: the words typed in (the
   full text held underneath, so nothing below moves), then Save */
const ClientCheckIn = ({ typed, saved, tap, compact }: { typed: number; saved: boolean; tap: Tap; compact: boolean }) => {
  const writing = typed < CHECKIN_TYPED.length;
  const dirty = typed > 0 && !saved;
  return (
    <>
      <Bar title="Client check-in" compact={compact}>
        <span
          className="inline-flex h-[34px] items-center rounded-md px-[13px] text-[13.5px] font-semibold"
          style={{ background: dirty ? "#309E96" : "#F3F4F6", color: dirty ? "#FFFFFF" : "#9CA3AF", ...tapStyle(tap === "save"), transition: "background-color 200ms ease, color 200ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease" }}
        >
          Save
        </span>
      </Bar>
      <EmailHead
        compact={compact}
        when={compact ? "Sends automatically after 1 year" : "Sends automatically after 1 year, then once a year"}
        subject="Checking in: has anything changed?"
        to={<><FillIn>First name</FillIn><FillIn>Last name</FillIn></>}
      />
      <div className={compact ? "px-5 pb-6 pt-3.5" : "px-7 pb-8 pt-5"} style={{ fontFamily: ARIAL }}>
        <img src="/logo.png" alt="" className={compact ? "mb-3" : "mb-4"} style={{ height: compact ? 19 : 24, width: "auto" }} />
        <p className="mb-3 text-[#374151]" style={mailPara(compact)}>Hi <FillIn>First name</FillIn>,</p>
        <p className="relative -mx-1.5 mb-3 rounded-[4px] px-1.5 text-[#374151]" style={{ ...mailPara(compact), boxShadow: writing ? RING_ON : RING_OFF, transition: "box-shadow 180ms ease" }}>
          <span className="invisible">{CHECKIN_TYPED}</span>
          <span className="absolute inset-0 px-1.5">
            {CHECKIN_TYPED.slice(0, typed)}
            {writing && <span className="ml-px inline-block h-[15px] w-px translate-y-[2px] bg-[#1F2933]" />}
          </span>
        </p>
        <span className="mt-1 inline-block rounded-md bg-[#309E96] font-semibold text-white" style={{ padding: compact ? "10px 18px" : "11px 22px", fontSize: compact ? 14 : 15 }}>
          Let us know what’s changed
        </span>
      </div>
    </>
  );
};

/* Then the month the check-in fills, each client on their own day */
const CheckInMonth = ({ chips, still, compact }: { chips: number; still: boolean; compact: boolean }) => {
  const rowH = compact ? CAL.rowCompact : CAL.row;
  return (
    <>
      <div className={`flex items-center justify-between border-b border-[#EEF0F2] ${compact ? "px-5" : "px-7"}`} style={{ height: CAL.head }}>
        <span className="text-[17px] font-semibold text-[#1F2933]">Client check-ins</span>
        <span className="text-[14px] font-medium text-[#6B7280]">{MONTH.name}</span>
      </div>
      <div className="grid grid-cols-7 items-center border-b border-[#EEF0F2] text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]" style={{ height: CAL.week }}>
        {WEEKDAYS.map((d) => (
          <span key={d}>{compact ? d[0] : d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 42 }, (_, i) => {
          const d = i - MONTH.lead + 1;
          const at = CHECKINS.findIndex((c) => c.day === d);
          const on = at >= 0 && chips > at;
          return (
            <div
              key={i}
              className={`min-w-0 border-b border-[#F0F1F3] ${i % 7 === 6 ? "" : "border-r"} ${compact ? "px-1 pt-1" : "px-1.5 pt-1.5"}`}
              style={{ height: rowH, background: i % 7 === 0 || i % 7 === 6 ? "#FAFAFB" : "#FFFFFF" }}
            >
              {d >= 1 && d <= MONTH.days && <span className="block text-[12px] font-medium text-[#6B7280]">{d}</span>}
              {at >= 0 && (
                <span
                  className="mt-1 block truncate rounded-md bg-[#E6F5F4] font-medium text-[#0C7370]"
                  style={{
                    fontSize: compact ? 10.5 : 11.5,
                    padding: compact ? "2px 4px" : "3px 5px",
                    opacity: on ? 1 : 0,
                    transform: on ? "scale(1)" : "scale(0.85)",
                    transformOrigin: "left center",
                    transition: still ? "none" : "opacity 220ms ease, transform 300ms var(--ease-out)",
                  }}
                >
                  {compact ? CHECKINS[at].name.split(" ")[0] : CHECKINS[at].name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

/** How long each chapter runs at normal speed */
export const EASY_MS = [
  12910,
  7900,
  C3.read + CHECKIN_TYPED.length * C3.perChar + C3.after + 190 + C3.fold + C3.land + CHECKINS.length * C3.chip + C3.hold,
];

/* The check-in and the month, each a white card on the panel; the check-in
   folds from its top centre into the first client's day as the month rises
   behind it */
const CheckInPieces = ({ typed, saved, filed, chips, tap, still, compact, stage }: { typed: number; saved: boolean; filed: boolean; chips: number; tap: Tap; still: boolean; compact: boolean; stage: { w: number; h: number } }) => {
  const place = compact ? { left: 16, right: 16, top: 16 } : { left: 48, right: 48, top: 40 };
  const card = { left: place.left, right: place.right, top: place.top, bottom: -24 };
  const shadow = "0 2px 10px rgba(11,18,32,0.08), 0 1px 2px rgba(11,18,32,0.06)";
  const cell = CHECKINS[0].day - 1 + MONTH.lead;
  const colW = (stage.w - place.left - place.right) / 7;
  const x = place.left + colW * ((cell % 7) + 0.5);
  const y = place.top + CAL.head + CAL.week + (compact ? CAL.rowCompact : CAL.row) * (Math.floor(cell / 7) + 0.5);
  const s = 0.1;
  const h = stage.h + 24 - place.top;
  const fold = { x: x - stage.w / 2, y: y - place.top - (h * s) / 2 };
  return (
    <>
      <div
        className="absolute"
        style={{
          ...card,
          opacity: filed ? 1 : 0,
          transform: filed ? "translateY(0)" : "translateY(48px)",
          transition: still ? "none" : filed ? "opacity 320ms ease 160ms, transform 680ms var(--ease-out) 160ms" : "opacity 220ms ease, transform 320ms ease",
        }}
      >
        <div className="h-full overflow-hidden rounded-2xl bg-white text-left" style={{ boxShadow: shadow }}>
          <CheckInMonth chips={chips} still={still} compact={compact} />
        </div>
      </div>
      <div
        className="absolute"
        style={{
          ...card,
          transformOrigin: "50% 0",
          opacity: filed ? 0 : 1,
          transform: filed ? `translate(${fold.x}px, ${fold.y}px) scale(${s})` : "none",
          transition: still ? "none" : filed ? "transform 640ms var(--ease-in-out), opacity 220ms ease 440ms" : "opacity 320ms ease",
        }}
      >
        <div className="h-full overflow-hidden rounded-2xl bg-white text-left" style={{ boxShadow: shadow }}>
          <ClientCheckIn typed={typed} saved={saved} tap={tap} compact={compact} />
        </div>
      </div>
    </>
  );
};

const FILM_LABEL =
  "An attorney drops a client's signed estate plan into Willow, which reads it and files each document under the right person. Willow then reads the will and writes a plain-English summary of who gets what. The attorney writes one client check-in, and Willow puts every client on their own day in the month and sends it.";
const TILE_LABELS = [
  "An attorney drops a client's signed estate plan into Willow, which reads it, files each document under the right person, and fills in the clients' names, emails, phones and address before opening the client's record.",
  "A page of Daniel's will, each gift marked as Willow reads it, fades to the summary Willow writes from it: his home to Maria, the cottage to Emma, the sloop to his brother Jacob, and the rest of the estate to Emma and Leo in equal shares.",
  "The attorney writes one client check-in and saves it; it folds into the month, where each client gets their own day a year after they signed.",
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
  /* Chapter 2: what's marked in the will, what's written in the summary */
  const [hl, setHl] = useState(0);
  const [written, setWritten] = useState(0);
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
  /* Chapter 3: the check-in typed and saved, folded into the month, the clients on it */
  const [typed, setTyped] = useState(0);
  const [saved, setSaved] = useState(false);
  const [filed, setFiled] = useState(false);
  const [chips, setChips] = useState(0);
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

  /* The tab row scrolls in the narrow layout: keep the open tab in sight,
     moving only as far as it takes, so no tab is left cut in half */
  const openTab = "Estate Plan";
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>(`[data-tab="${openTab}"]`);
    if (!row || !tab) return;
    const over = tab.offsetLeft + tab.offsetWidth - row.clientWidth;
    row.scrollTo({ left: over > 0 ? over + 16 : 0, behavior: "smooth" });
  }, [openTab]);


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
      setHl(4);
      setWritten(4);
      setPun(0);
      setReady(true);
      setPaper(false);
      setScrollB(0);
      setTyped(CHECKIN_TYPED.length);
      setSaved(true);
      setFiled(true);
      setChips(CHECKINS.length);
      setBeat((["docs", "explain", "checkin"] as Beat[])[chapter]);
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
      /* 2. The will on its own, each gift marked; it fades to the summary,
         which writes itself */
      async () => {
        reset();
        setHl(0);
        setWritten(0);
        setPun(0);
        setReady(false);
        setPlace("hidden");
        setBeat("explain");
        setPaper(true);
        await wait(350);
        setHl(1);
        await wait(450);
        setHl(2);
        await wait(450);
        setHl(3);
        await wait(400);
        setHl(4);
        await wait(750);
        setPaper(false);
        await wait(800);
        setWritten(1);
        await wait(650);
        setWritten(2);
        await wait(650);
        setWritten(3);
        setPun(1);
        await wait(700);
        setWritten(4);
        /* The mark goes once the shares have counted up */
        await wait(1300);
        setReady(true);
        await wait(1400);
      },
      /* 3. The client check-in, written once and saved, folds into the
         month, which fills with each client's day */
      async () => {
        reset();
        setTyped(0);
        setSaved(false);
        setFiled(false);
        setChips(0);
        setPlace("hidden");
        setBeat("checkin");
        await wait(C3.read);
        for (let n = 1; n <= CHECKIN_TYPED.length; n++) {
          setTyped(n);
          await wait(C3.perChar);
        }
        await wait(C3.after);
        await tapOn("save", () => setSaved(true));
        await wait(C3.fold);
        setFiled(true);
        await wait(C3.land);
        for (let n = 1; n <= CHECKINS.length; n++) {
          setChips(n);
          await wait(C3.chip);
        }
        await wait(C3.hold);
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
  const inRecord = beat === "docs";
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

              {/* The summary on its own, writing itself */}
              <div className={`absolute inset-0 ${compact ? "px-4 pt-4" : "px-16 pt-10"}`} style={{ opacity: beat === "explain" ? 1 : 0, transition: "opacity 440ms ease" }}>
                {beat === "explain" && <SummaryLive written={written} pun={pun} ready={ready} still={still} />}
              </div>

              {/* The check-in, folding into the month */}
              <div className="absolute inset-0" style={{ opacity: beat === "checkin" ? 1 : 0, transition: "opacity 300ms ease" }}>
                {beat === "checkin" && <CheckInPieces typed={typed} saved={saved} filed={filed} chips={chips} tap={tap} still={still} compact={compact} stage={stage} />}
              </div>

              {/* The client */}
              <div className="absolute inset-0" style={{ opacity: inRecord ? 1 : 0, transition: "opacity 440ms ease" }}>
                <div className={`relative flex h-full flex-col ${compact ? "px-4 pt-6" : "px-16 pt-10"}`}>
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
                            transition: "color 200ms ease, border-color 200ms ease",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`${compact ? "mt-4" : "mt-6"} min-h-0 flex-1`}>
                    {(beat === "docs" || !inRecord) && <Appear key="docs"><TheirDocuments /></Appear>}
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
