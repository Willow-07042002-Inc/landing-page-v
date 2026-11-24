import React, { useEffect, useRef, useState } from "react";
import { PrintFrame } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { CheckIcon, PoaIcon, PropertyIcon, SpinnerIcon, TrustIcon, UploadIcon, WillIcon } from "@/components/product/willow-icons";

/* The step after the hero: the attorney drops a signed plan in, Willow reads
   and sorts it, and the clients' account is there. A designed scene, staged on
   the product's "Upload their estate plan" flow: it reads what each PDF is and
   whose it is, groups them by person, and tucks a deed under its trust
   (read-plan-document.ts, household.ts, plan-documents.tsx). It plays once when
   it comes into view and stops on the account, which is also what people who
   prefer reduced motion see. */

const WIDE = { w: 720, h: 520 };
const COMPACT = { w: 400, h: 530 };
const PILE = { wide: { x: 604, y: 408 }, compact: { x: 318, y: 442 } };

const DOCS = [
  { name: "Last Will & Testament", Icon: WillIcon },
  { name: "Power of Attorney", Icon: PoaIcon },
  { name: "Last Will & Testament", Icon: WillIcon },
  { name: "Power of Attorney", Icon: PoaIcon },
  { name: "Revocable Living Trust", Icon: TrustIcon },
  { name: "Trust transfer deed", Icon: PropertyIcon, nested: true },
];
const GROUPS = [
  { label: "Daniel", docs: [0, 1] },
  { label: "Maria", docs: [2, 3] },
  { label: "Daniel and Maria", docs: [4, 5] },
];
const STAGES = ["Their documents", "Create their accounts"];
const FAN = [-9, -5, -2, 2, 5, 9];
const TILE = { w: 62, h: 80 };

type Beat = "rest" | "drag" | "reading" | "sorted" | "created";
type Point = { x: number; y: number };
type Cursor = Point & { shown: boolean; down: boolean };

const CARD_SHADOW = "0 24px 70px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.12)";
const MOVE = "cubic-bezier(0.45, 0.05, 0.35, 1)";

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

const Reveal = ({ on, delay, children }: { on: boolean; delay: number; children: React.ReactNode }) => (
  <div
    style={{
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0)" : "translateY(6px)",
      transition: on ? `opacity 260ms ease ${delay}ms, transform 360ms var(--ease-out) ${delay}ms` : "none",
    }}
  >
    {children}
  </div>
);

const Paper = ({ Icon }: { Icon: (p: { className?: string }) => React.ReactElement }) => (
  <div className="flex h-full w-full flex-col rounded-md border border-[#E5E7EB] bg-white p-2" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.16)" }}>
    <Icon className="h-5 w-5 text-[#128F8B]" />
    <span className="mt-2 h-[3px] w-full rounded-full bg-[#E5E7EB]" />
    <span className="mt-[5px] h-[3px] w-full rounded-full bg-[#E5E7EB]" />
    <span className="mt-[5px] h-[3px] w-3/5 rounded-full bg-[#E5E7EB]" />
  </div>
);

const PlanDropStory = () => {
  const compact = useCompact();
  const size = compact ? COMPACT : WIDE;
  const pile = compact ? PILE.compact : PILE.wide;
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const finished = useRef(false);

  const [beat, setBeat] = useState<Beat>("rest");
  const [dropAt, setDropAt] = useState<Point | null>(null);
  const [rowsAt, setRowsAt] = useState<Point[]>([]);
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0, shown: false, down: false });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || finished.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finished.current = true;
      setBeat("created");
      return;
    }

    const { w } = compact ? COMPACT : WIDE;
    const start = compact ? PILE.compact : PILE.wide;
    let run = 0;
    const wait = (ms: number, id: number) =>
      new Promise<void>((resolve, reject) => {
        window.setTimeout(() => (id === run ? resolve() : reject(new Error("stopped"))), ms);
      });
    /* Where an element's centre sits on the stage, before the stage is scaled */
    const at = (el: HTMLElement | null): Point => {
      const stage = stageRef.current;
      if (!el || !stage) return { x: 0, y: 0 };
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = s.width / w;
      return { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    };

    const play = async (id: number) => {
      setBeat("rest");
      setCursor({ x: start.x + 70, y: start.y + 60, shown: false, down: false });
      await wait(380, id);

      /* Rachel picks up the signed plan */
      setCursor((c) => ({ ...c, shown: true, x: start.x, y: start.y }));
      await wait(880, id);
      setCursor((c) => ({ ...c, down: true }));
      await wait(160, id);

      /* and drops it in */
      const drop = at(dropRef.current);
      setDropAt(drop);
      setBeat("drag");
      setCursor((c) => ({ ...c, ...drop }));
      await wait(880, id);
      setCursor((c) => ({ ...c, down: false }));
      setBeat("reading");
      await wait(1500, id);

      /* Each document goes to the person it belongs to */
      setRowsAt(rowRefs.current.map((el) => at(el)));
      setBeat("sorted");
      await wait(1250, id);
      setCursor((c) => ({ ...c, ...at(continueRef.current) }));
      await wait(880, id);
      setCursor((c) => ({ ...c, down: true }));
      await wait(140, id);
      finished.current = true;
      io.disconnect();
      setBeat("created");
      setCursor((c) => ({ ...c, down: false }));
      await wait(360, id);
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

  const uploading = beat === "rest" || beat === "drag" || beat === "reading";
  const sorted = beat === "sorted" || beat === "created";
  const created = beat === "created";
  const stage = created ? 1 : 0;
  const pad = compact ? "px-[22px]" : "px-7";
  const spread = compact ? 46 : 66;

  const tile = (i: number) => {
    const drop = dropAt ?? pile;
    const off = (i - 2.5) * 3;
    if (beat === "rest") return { x: pile.x + off, y: pile.y - off, r: FAN[i], s: 1, o: 1, t: "none" };
    if (beat === "drag") return { x: drop.x + off, y: drop.y - off, r: FAN[i], s: 1, o: 1, t: `transform 820ms ${MOVE}` };
    if (beat === "reading") return { x: drop.x + (i - 2.5) * spread, y: drop.y - 26, r: 0, s: 1, o: 1, t: "transform 420ms var(--ease-out)" };
    const to = rowsAt[i] ?? drop;
    const d = i * 70;
    return { x: to.x, y: to.y, r: 0, s: 0.28, o: 0, t: `transform 620ms var(--ease-in-out) ${d}ms, opacity 160ms ease ${d + 500}ms` };
  };

  return (
    <div
      ref={frameRef}
      className="min-w-0"
      role="img"
      aria-label="An attorney drops a client's signed estate plan into Willow. Willow reads the documents, sorts them under Daniel, Maria and both of them, and creates their account."
    >
      <PrintFrame print="self" aspect={`${size.w} / ${size.h}`} className="shadow-2xl">
        <ScaledScreen w={size.w} h={size.h}>
          <div ref={stageRef} aria-hidden className="relative overflow-hidden text-left" style={{ width: size.w, height: size.h, fontFamily: "Inter, sans-serif" }}>
            <img src="/central-park.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.74)" }} />

            <div
              className="absolute left-1/2 flex -translate-x-1/2 flex-col overflow-hidden rounded-2xl bg-white"
              style={{ top: compact ? 30 : 50, width: compact ? 364 : 620, height: compact ? 470 : 420, boxShadow: CARD_SHADOW }}
            >
              <div className={`${pad} pt-6`}>
                <h3 className="font-heading text-[20px] font-bold leading-snug text-[#1F2933]">Upload your client&rsquo;s estate plan</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {STAGES.map((s, i) => (
                    <div key={s}>
                      <div className="h-[3px] rounded-full" style={{ background: i <= stage ? "#128F8B" : "#E5E7EB", transition: "background-color 240ms ease" }} />
                      <p className="mt-1.5 text-[12px] font-medium" style={{ color: i === stage ? "#0C7370" : "#9CA3AF", transition: "color 240ms ease" }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-0 flex-1">
                {/* Drop them in */}
                <div className={`absolute inset-0 ${pad} pb-6 pt-3`} style={{ opacity: uploading ? 1 : 0, transition: "opacity 200ms ease" }}>
                  <div
                    ref={dropRef}
                    className="relative flex h-full flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed"
                    style={{
                      borderColor: beat === "drag" || beat === "reading" ? "#128F8B" : "#D1D5DB",
                      background: beat === "drag" || beat === "reading" ? "#E6F5F4" : "#FAFBFC",
                      transition: "background-color 180ms ease, border-color 180ms ease",
                    }}
                  >
                    <div className="flex flex-col items-center" style={{ opacity: beat === "rest" ? 1 : 0, transition: "opacity 160ms ease" }}>
                      <UploadIcon className="h-7 w-7 text-[#128F8B]" />
                      <p className="mt-3 text-[15px] font-medium text-[#1F2933]">Drop all their documents here.</p>
                    </div>
                    <div
                      className="absolute inset-x-0 flex items-center justify-center gap-2 text-[14px] font-medium text-[#0C7370]"
                      style={{ bottom: compact ? 72 : 52, opacity: beat === "reading" ? 1 : 0, transition: "opacity 180ms ease" }}
                    >
                      <SpinnerIcon className="h-4 w-4 animate-spin" />
                      Reading 6 documents&hellip;
                    </div>
                  </div>
                </div>

                {/* Sorted by person */}
                <div className={`absolute inset-0 flex flex-col ${pad} pb-6 pt-3`} style={{ opacity: beat === "sorted" ? 1 : 0, transition: "opacity 180ms ease" }}>
                  <div className={compact ? "flex-1" : "grid flex-1 grid-cols-2 content-start gap-x-8 gap-y-3.5"}>
                    {GROUPS.map((g, gi) => (
                      <div key={g.label} className={compact ? (gi > 0 ? "mt-2.5" : "") : gi === 2 ? "col-span-2 border-t border-[#F0F1F3] pt-3.5" : ""}>
                        <Reveal on={sorted} delay={g.docs[0] * 70 + 360}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">{g.label}</p>
                        </Reveal>
                        <ul className={!compact && gi === 2 ? "mt-1 grid grid-cols-2 gap-x-8" : "mt-1"}>
                          {g.docs.map((n) => {
                            const d = DOCS[n];
                            return (
                              <li key={n} className={compact && d.nested ? "pl-7" : ""}>
                                <Reveal on={sorted} delay={n * 70 + 480}>
                                  <div className="flex items-center gap-3 py-[6px]">
                                    <span ref={(el) => { rowRefs.current[n] = el; }} className="flex-shrink-0">
                                      <d.Icon className="block h-[18px] w-[18px] text-[#128F8B]" />
                                    </span>
                                    <span className="text-[14px] font-medium text-[#1F2933]">{d.name}</span>
                                  </div>
                                </Reveal>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Reveal on={sorted} delay={900}>
                    <div
                      ref={continueRef}
                      className="flex h-10 items-center justify-center rounded-lg bg-[#128F8B] text-[14.5px] font-medium text-white"
                      style={{ transform: cursor.down && beat === "sorted" ? "scale(0.98)" : "scale(1)", transition: "transform 140ms var(--ease-out)" }}
                    >
                      Create their accounts
                    </div>
                  </Reveal>
                </div>

                {/* Their account */}
                <div className={`absolute inset-0 flex flex-col ${pad} pb-6 pt-2`} style={{ opacity: created ? 1 : 0, transition: "opacity 220ms ease" }}>
                  <Reveal on={created} delay={80}>
                    <div className="flex items-center gap-2 text-[14px] font-medium text-[#0C7370]">
                      <CheckIcon className="h-4 w-4" />
                      Account created
                    </div>
                  </Reveal>
                  <Reveal on={created} delay={150}>
                    <div className="mt-3 flex items-center gap-3.5 rounded-xl bg-[#E6F5F4] px-4 py-3.5">
                      <div className="flex flex-shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[12.5px] font-semibold text-[#0C7370]">DR</span>
                        <span className="-ml-2.5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E6F5F4] bg-white text-[12.5px] font-semibold text-[#0C7370]">MR</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading text-[17px] font-bold leading-snug text-[#1F2933]">Daniel and Maria Rosen</p>
                        <p className="mt-0.5 text-[13px] text-[#4B5563]">Joint account</p>
                      </div>
                    </div>
                  </Reveal>
                  <div className="mt-3 flex-1">
                    {GROUPS.map((g, gi) => (
                      <Reveal key={g.label} on={created} delay={230 + gi * 70}>
                        <div className="flex items-center justify-between gap-3 border-b border-[#F0F1F3] py-[9px]">
                          <span className="text-[14px] font-medium text-[#1F2933]">{g.label}</span>
                          <span className="flex items-center gap-2">
                            {g.docs.map((n) => {
                              const D = DOCS[n].Icon;
                              return <D key={n} className="h-[17px] w-[17px] text-[#128F8B]" />;
                            })}
                            <span className="ml-1 text-[12.5px] text-[#6B7280]">2 documents</span>
                          </span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <Reveal on={created} delay={480}>
                    <div className="flex h-10 items-center justify-center rounded-lg bg-[#128F8B] text-[14.5px] font-medium text-white">Start their summary</div>
                  </Reveal>
                </div>
              </div>
            </div>

            {/* The signed plan */}
            {DOCS.map((d, i) => {
              const p = tile(i);
              return (
                <div
                  key={i}
                  className="pointer-events-none absolute left-0 top-0 z-[5]"
                  style={{
                    width: TILE.w,
                    height: TILE.h,
                    opacity: p.o,
                    transform: `translate(${p.x - TILE.w / 2}px, ${p.y - TILE.h / 2}px) rotate(${p.r}deg) scale(${p.s})`,
                    transition: p.t,
                  }}
                >
                  <Paper Icon={d.Icon} />
                </div>
              );
            })}

            {/* Rachel */}
            <div
              className="pointer-events-none absolute left-0 top-0 z-10"
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
