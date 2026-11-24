import React, { useEffect, useRef, useState } from "react";
import { PrintFrame } from "@/components/site/blocks";
import { FloatStack, ScaledScreen, WIcon } from "@/components/product/kit";
import { CLIENT_PANEL_TABS, ProDocRow, ProDocSectionLabel } from "@/components/product/attorney-clients";
import { ChevronLeftIcon, CloseIcon, ViewIcon } from "@/components/product/willow-icons";

/* The product's "Upload their estate plan", played through once: the attorney's
   800px panel with the same spacing, type and colours as the real screens
   (add-client/setup-wizard.tsx, plan-documents.tsx, working-mark.tsx,
   packages/ui willow-popup-header.tsx, client-detail-view.tsx). Six PDFs go in,
   Willow reads what each one is and whose it is, they're filed under each
   person, and the account opens on the client's real Estate Plan tab. It stops
   there, which is also what people who prefer reduced motion see. */

const WIDE = { w: 800, h: 720 };
const COMPACT = { w: 420, h: 720 };

const DOCS = [
  { file: "Last Will of Daniel Rosen.pdf", kind: "Last Will & Testament", tag: "Last Will", head: "Last Will and Testament", of: "of Daniel Rosen" },
  { file: "Power of Attorney, Daniel.pdf", kind: "Power of Attorney", tag: "Power of Attorney", head: "Power of Attorney", of: "of Daniel Rosen" },
  { file: "Last Will of Maria Rosen.pdf", kind: "Last Will & Testament", tag: "Last Will", head: "Last Will and Testament", of: "of Maria Rosen" },
  { file: "Power of Attorney, Maria.pdf", kind: "Power of Attorney", tag: "Power of Attorney", head: "Power of Attorney", of: "of Maria Rosen" },
  { file: "Rosen Revocable Trust.pdf", kind: "Revocable Living Trust", tag: "Living Trust", head: "Revocable Trust Agreement", of: "The Rosen Family Trust" },
  { file: "Deed to the Rosen Trust.pdf", kind: "Deed", tag: "Deed", head: "Trust Transfer Deed", of: "to The Rosen Family Trust" },
];
/* plan-documents.tsx groups by who made each one; a deed sits under its trust */
const GROUPS: { label: string; rows: { doc: number; under?: number }[] }[] = [
  { label: "Daniel Rosen", rows: [{ doc: 0 }, { doc: 1 }] },
  { label: "Maria Rosen", rows: [{ doc: 2 }, { doc: 3 }] },
  { label: "Daniel Rosen and Maria Rosen", rows: [{ doc: 4, under: 5 }] },
];
const FAN = [-8, -5, -2, 2, 5, 8];

type Beat = "empty" | "carry" | "reading" | "filed" | "details" | "confirm" | "record";
type Point = { x: number; y: number };
type Cursor = Point & { shown: boolean; down: boolean };

const MOVE = "cubic-bezier(0.45, 0.05, 0.35, 1)";
const PRIMARY = "inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] bg-[#309E96] px-6 text-[15px] font-semibold text-white";
const QUIET = "inline-flex h-10 w-full items-center justify-center rounded-[10px] text-[14px] font-medium text-[#6B7280]";
const LABEL = "text-xs font-medium uppercase tracking-wide text-[#9CA3AF]";
const FIELD = "w-full border-b border-[#E5E7EB] py-2.5 text-[15px] leading-[22px] text-[#1F2933]";

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

const Progress = ({ step }: { step: 1 | 2 }) => (
  <div className="mb-6 mt-3">
    <p className="mb-2 text-[15px] font-semibold text-[#309E96]">
      {step} of 2<span className="font-medium text-[#9CA3AF]"> · {step === 1 ? "Their documents" : "Create their accounts"}</span>
    </p>
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF0F2]">
      <div className="h-full rounded-full bg-[#309E96]" style={{ width: step === 1 ? "50%" : "100%" }} />
    </div>
  </div>
);

const Title = ({ startOver }: { startOver: boolean }) => (
  <div className="flex items-baseline justify-between gap-4">
    <h3 className="text-[28px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: "Figtree, Inter, sans-serif" }}>
      Upload your client&apos;s estate plan
    </h3>
    <span className="flex-shrink-0 text-[13px] font-medium text-[#6B7280]" style={{ opacity: startOver ? 1 : 0, transition: "opacity 200ms ease" }}>
      Start over
    </span>
  </div>
);

const DropLine = ({ prompt, active }: { prompt: string; active?: boolean }) => (
  <div className="border-b py-3" style={{ borderColor: active ? "#309E96" : "#E5E7EB", transition: "border-color 160ms ease" }}>
    <div className="flex items-baseline justify-between gap-4">
      <p className="text-[14px] text-[#6B7280]">{prompt}</p>
      <span className="text-[14px] font-medium text-[#309E96]">Choose PDFs</span>
    </div>
  </div>
);

/* working-mark.tsx: the W, breathing, and a line of legal wordplay */
const WorkingMark = () => (
  <div className="flex flex-col items-center py-8 text-center">
    <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full bg-[#309E96] text-white" style={{ fontFamily: "Pacifico, cursive", fontSize: 18, lineHeight: 1, paddingTop: 2 }}>
      W
    </span>
    <p className="mt-3 text-[15px] font-semibold text-[#1F2933]">Reading the fine print&hellip;</p>
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

const DocGroups = ({ on, iconRefs }: { on: boolean; iconRefs?: React.MutableRefObject<(HTMLSpanElement | null)[]> }) => {
  const ref = (n: number) => (iconRefs ? (el: HTMLSpanElement | null) => { iconRefs.current[n] = el; } : undefined);
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

/* A signed PDF on its way in */
const Sheet = ({ d, scanning, scanned }: { d: (typeof DOCS)[number]; scanning: boolean; scanned: boolean }) => (
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
        transition: scanning ? "top 360ms linear" : "opacity 120ms ease",
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

const PlanDropStory = () => {
  const compact = useCompact();
  const size = compact ? COMPACT : WIDE;
  const pad = compact ? 24 : 32;
  const cardEmpty = pad * 2 + 46;
  const cardReading = pad * 2 + 135;
  const sheet = compact ? { w: 112, h: 146 } : { w: 104, h: 136 };

  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const finished = useRef(false);

  const [beat, setBeat] = useState<Beat>("empty");
  const [scan, setScan] = useState(-1);
  const [cardH, setCardH] = useState<number | null>(null);
  const [cardTop, setCardTop] = useState(0);
  const [dropAt, setDropAt] = useState<Point>({ x: 0, y: 0 });
  const [rowsAt, setRowsAt] = useState<Point[]>([]);
  const [scrollA, setScrollA] = useState(0);
  const [scrollB, setScrollB] = useState(0);
  const [pressed, setPressed] = useState<"continue" | "add" | "create" | null>(null);
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0, shown: false, down: false });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || finished.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finished.current = true;
      setBeat("record");
      return;
    }

    const { w, h } = compact ? COMPACT : WIDE;
    const space = compact ? 24 : 32;
    let run = 0;
    const wait = (ms: number, id: number) =>
      new Promise<void>((resolve, reject) => {
        window.setTimeout(() => (id === run ? resolve() : reject(new Error("stopped"))), ms);
      });
    /* An element's box on the stage, before the stage is scaled */
    const box = (el: HTMLElement | null) => {
      const stage = stageRef.current;
      if (!el || !stage) return { top: 0, bottom: 0, x: 0, y: 0 };
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = s.width / w;
      return { top: (r.top - s.top) / k, bottom: (r.bottom - s.top) / k, x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    };
    const click = async (id: number, name: "continue" | "add" | "create", after: () => void) => {
      setCursor((c) => ({ ...c, down: true }));
      setPressed(name);
      await wait(140, id);
      after();
      setPressed(null);
      setCursor((c) => ({ ...c, down: false }));
    };

    const play = async (id: number) => {
      setBeat("empty");
      setScan(-1);
      setCardH(space * 2 + 46);
      setScrollA(0);
      setScrollB(0);
      setPressed(null);
      setCursor({ x: w + 70, y: h - 30, shown: false, down: true });
      await wait(420, id);

      /* Rachel drags the signed plan onto the drop line */
      const card = box(cardRef.current);
      const drop = { x: w / 2, y: card.top + space + 23 };
      setCardTop(card.top);
      setDropAt(drop);
      setBeat("carry");
      setCursor((c) => ({ ...c, shown: true, x: drop.x + 30, y: drop.y + 40 }));
      await wait(960, id);

      /* Willow reads each one */
      setCursor((c) => ({ ...c, down: false }));
      setCardH(space * 2 + 135);
      setBeat("reading");
      await wait(160, id);
      setCursor((c) => ({ ...c, x: w - 70, y: h - 44 }));
      await wait(520, id);
      for (let n = 0; n < DOCS.length; n++) {
        setScan(n);
        await wait(210, id);
      }
      setScan(DOCS.length);
      await wait(320, id);

      /* and files it under the right person */
      setRowsAt(iconRefs.current.map((el) => { const b = box(el); return { x: b.x, y: b.y }; }));
      setCardH(innerRef.current?.offsetHeight ?? null);
      setBeat("filed");
      await wait(1320, id);

      const go = box(continueRef.current);
      const toGo = Math.max(0, go.bottom + 36 - h);
      setScrollA(toGo);
      setCursor((c) => ({ ...c, x: go.x, y: go.y - toGo }));
      await wait(880, id);
      await click(id, "continue", () => setBeat("details"));

      /* Their details, read from the documents */
      await wait(1250, id);
      const add = box(addRef.current);
      const toAdd = Math.max(0, add.bottom + 36 - h);
      setScrollB(toAdd);
      setCursor((c) => ({ ...c, x: add.x, y: add.y - toAdd }));
      await wait(1050, id);
      await click(id, "add", () => setBeat("confirm"));
      await wait(620, id);

      setCursor((c) => ({ ...c, ...(() => { const b = box(createRef.current); return { x: b.x, y: b.y }; })() }));
      await wait(860, id);
      await click(id, "create", () => {
        finished.current = true;
        io.disconnect();
        setBeat("record");
      });
      await wait(320, id);
      setCursor((c) => ({ ...c, shown: false }));
    };

    let playing = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        const go = entry.intersectionRatio >= 0.5 || (playing && entry.isIntersecting);
        if (go === playing) return;
        playing = go;
        run += 1;
        if (go) play(run).catch(() => undefined);
      },
      { threshold: [0, 0.5] }
    );
    io.observe(frame);
    return () => {
      run += 1;
      io.disconnect();
    };
  }, [compact]);

  const stepOne = beat === "empty" || beat === "carry" || beat === "reading" || beat === "filed";
  const stepTwo = beat === "details" || beat === "confirm";
  const filed = !(beat === "empty" || beat === "carry" || beat === "reading");
  const panel = compact ? "px-4 py-6" : "px-16 py-10";
  const section = compact ? "bg-white p-6" : "bg-white p-8";
  const press = (name: "continue" | "add" | "create"): React.CSSProperties => ({
    transform: pressed === name ? "scale(0.98)" : "scale(1)",
    transition: "transform 140ms var(--ease-out)",
  });

  const sheetAt = (i: number) => {
    const off = (i - 2.5) * 3;
    if (beat === "empty") return { x: size.w + 130 + off, y: size.h - 70 - off, r: FAN[i], s: 0.92, o: 1, t: "none" };
    if (beat === "carry") return { x: dropAt.x + off, y: dropAt.y - off, r: FAN[i], s: 0.92, o: 1, t: `transform 900ms ${MOVE}` };
    if (beat === "reading") {
      const cols = compact ? 3 : 6;
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x: size.w / 2 + (col - (cols - 1) / 2) * (sheet.w + 8),
        y: cardTop + cardReading + 20 + sheet.h / 2 + row * (sheet.h + 8),
        r: 0,
        s: 1,
        o: 1,
        t: `transform 560ms var(--ease-in-out) ${i * 30}ms`,
      };
    }
    const to = rowsAt[i] ?? dropAt;
    const d = i * 70;
    return { x: to.x, y: to.y, r: 0, s: 0.16, o: 0, t: `transform 620ms var(--ease-in-out) ${d}ms, opacity 140ms ease ${d + 500}ms` };
  };

  return (
    <div
      ref={frameRef}
      className="min-w-0"
      role="img"
      aria-label="An attorney drops a client's signed estate plan into Willow. Willow reads the six documents, files them under Daniel, Maria and both of them, fills in their details and opens their account."
    >
      <PrintFrame print="/central-park.jpg" aspect={`${size.w} / ${size.h}`}>
        <ScaledScreen w={size.w} h={size.h}>
          <div ref={stageRef} aria-hidden className="relative overflow-hidden bg-[#F0F2F5] text-left" style={{ width: size.w, height: size.h, fontFamily: "Figtree, Inter, sans-serif" }}>
            {/* 1 of 2 · Their documents */}
            <div
              className="absolute inset-x-0 top-0"
              style={{ opacity: stepOne ? 1 : 0, transform: `translateY(${-scrollA}px)`, transition: "opacity 200ms ease, transform 640ms var(--ease-in-out)" }}
            >
              <div className={panel}>
                <Title startOver={beat !== "empty"} />
                <Progress step={1} />
                <div
                  ref={cardRef}
                  className="relative overflow-hidden rounded-2xl bg-white"
                  style={{ height: cardH ?? cardEmpty, transition: "height 460ms var(--ease-in-out)" }}
                >
                  <div ref={innerRef} className={section}>
                    <div style={{ opacity: beat === "reading" ? 0 : 1, transition: "opacity 160ms ease" }}>
                      <DropLine prompt="Drop all their documents here." active={beat === "carry"} />
                    </div>
                    <div className="mt-2">
                      <DocGroups on={filed} iconRefs={iconRefs} />
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Fade on={filed} delay={880}>
                        <div ref={continueRef} className={PRIMARY} style={press("continue")}>Continue</div>
                      </Fade>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 top-0" style={{ paddingTop: pad, opacity: beat === "reading" ? 1 : 0, transition: "opacity 200ms ease" }}>
                    <WorkingMark />
                  </div>
                </div>
              </div>
            </div>

            {/* 2 of 2 · Create their accounts */}
            <div
              className="absolute inset-x-0 top-0"
              style={{ opacity: stepTwo ? 1 : 0, transform: `translateY(${-scrollB}px)`, transition: "opacity 220ms ease, transform 900ms var(--ease-in-out)" }}
            >
              <div className={panel}>
                <span className="mb-4 inline-flex items-center gap-2 text-[15px] font-medium text-[#6B7280]">
                  <ChevronLeftIcon className="h-4 w-4" />
                  Back to their documents
                </span>
                <Title startOver />
                <Progress step={2} />
                <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
                  <div className="flex flex-col gap-1.5">
                    {[
                      { n: 1, first: "Daniel", email: "daniel.rosen@gmail.com" },
                      { n: 2, first: "Maria", email: "maria.rosen@gmail.com" },
                    ].map((p) => (
                      <div key={p.n} className={section}>
                        <div className="mb-4 flex items-baseline justify-between gap-3">
                          <p className={LABEL}>Client {p.n}</p>
                          {p.n === 1 && <p className="text-[11.5px] text-[#9CA3AF]">* Required</p>}
                        </div>
                        <div className={`grid gap-6 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
                          <div className={FIELD}>{p.first}</div>
                          <div className={FIELD}>Rosen</div>
                          <div className={FIELD}>{p.email}</div>
                          <div className={`${FIELD} text-[#9CA3AF]`}>Phone</div>
                        </div>
                      </div>
                    ))}
                    <div className={section}>
                      <p className={`${LABEL} mb-4`}>
                        Their home address <span className="font-normal normal-case tracking-normal">(from their documents)</span>
                      </p>
                      <div className="space-y-4">
                        <div className={FIELD}>Berkeley Place</div>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                          <div className={FIELD}>Brooklyn</div>
                          <div className={FIELD}>11217</div>
                        </div>
                        <div className="block pt-2">
                          <span className={`${LABEL} mb-1 block`}>State of residence</span>
                          <div className={FIELD}>New York</div>
                        </div>
                      </div>
                    </div>
                    <div className={section}>
                      <p className={`${LABEL} mb-2`}>
                        Documents <span className="font-normal normal-case tracking-normal">(6)</span>
                      </p>
                      <DocGroups on />
                      <div className="mt-2">
                        <DropLine prompt="Add more documents." />
                      </div>
                    </div>
                    <div className={section}>
                      <div ref={addRef} className={PRIMARY} style={{ ...press("add"), width: "fit-content" }}>Add the couple</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The account, on the client's Estate Plan tab */}
            <div className="absolute inset-x-0 top-0" style={{ opacity: beat === "record" ? 1 : 0, transition: "opacity 260ms ease" }}>
              <div className={panel}>
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[26px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: "Figtree, Inter, sans-serif" }}>Daniel Rosen</h3>
                    <p className="mt-1 text-[15px] text-[#6B7280]">
                      Joint account: <span className="font-medium text-[#309E96]">Maria Rosen</span>
                    </p>
                  </div>
                  <span className="rounded p-1.5 text-[#9CA3AF]"><WIcon name="more" className="h-5 w-5" /></span>
                </div>
                <div className="overflow-hidden border-b border-[#E5E7EB]">
                  <div className="flex">
                    {CLIENT_PANEL_TABS.map((t) => (
                      <span key={t} className={`whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-medium ${t === "Estate Plan" ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-6 mt-6 border-b border-[#E5E7EB]">
                  <div className="flex">
                    <span className="whitespace-nowrap border-b-2 border-[#309E96] px-4 py-3 text-[13px] font-medium text-[#309E96]">Documents</span>
                    <span className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-[13px] font-medium text-[#6B7280]">Summary</span>
                  </div>
                </div>
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
              </div>
            </div>

            {/* Add the couple? */}
            <div
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4"
              style={{ opacity: beat === "confirm" ? 1 : 0, backdropFilter: "blur(2px)", transition: "opacity 200ms ease" }}
            >
              <div
                className="w-full max-w-[420px] rounded-2xl bg-white p-7"
                style={{
                  boxShadow: "0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
                  transform: beat === "confirm" ? "scale(1)" : "scale(0.97)",
                  transition: "transform 240ms var(--ease-out)",
                }}
              >
                <div className="text-center">
                  <h2 className="mx-auto font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: 24, lineHeight: 1.3, textWrap: "balance" }}>
                    Add Daniel Rosen and Maria Rosen?
                  </h2>
                  <p className="mx-auto text-[#6B7280]" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8, textWrap: "balance" }}>
                    Daniel and Maria will each get an email from you with a link to sign in, now or later from your client list.
                  </p>
                </div>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <div ref={createRef} className={`w-full ${PRIMARY}`} style={press("create")}>Create and send</div>
                  <div className={QUIET}>Create, send later</div>
                </div>
              </div>
            </div>

            {/* The signed plan */}
            {DOCS.map((d, i) => {
              const p = sheetAt(i);
              return (
                <div
                  key={d.file}
                  className="pointer-events-none absolute left-0 top-0 z-20"
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
              className="pointer-events-none absolute left-0 top-0 z-40"
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

export default PlanDropStory;
