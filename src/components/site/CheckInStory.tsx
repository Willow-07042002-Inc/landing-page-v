import React, { useEffect, useRef, useState } from "react";
import { PrintFrame } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { ZoomLogo } from "@/components/product/attorney-booking";
import { CalendarCheckIcon, ChevronDownIcon, NotificationIcon, PoaIcon, PropertyIcon, TrustIcon, WillIcon } from "@/components/product/willow-icons";

/* The For attorneys hero, staged the way harvey.ai opens its law firms page: a
   small card on a dark print plays out, then opens into the whole matter.
   Daniel answers his yearly check-in and books a call, Rachel gets the
   notification, and "See more" brings down everything about the client. A
   designed scene rather than a screenshot, but every fact in it is one the
   product holds: the check-in questions are its defaults (touchpoints.ts) and
   the family is the one in the product screens. It plays once when it comes on
   screen and stops on the opened matter, which is also what people who prefer
   reduced motion see. */

const WIDE = { w: 1128, h: 670 };
const COMPACT = { w: 400, h: 640 };

const QUESTIONS = ["Has your family dynamic changed?", "Have you moved, or bought or sold property?", "Has what you own changed in a big way?"];
const NOTE = "We bought a chalet in Stowe, Vermont. Should the chalet go into our trust too?";

const PLAN = [
  { name: "Last Will & Testament", Icon: WillIcon },
  { name: "Revocable Living Trust", Icon: TrustIcon, detail: "Joint with Maria" },
  { name: "Trust transfer deed", Icon: PropertyIcon, detail: "Joint with Maria" },
  { name: "Power of Attorney", Icon: PoaIcon },
];
const PEOPLE = [
  { initials: "MR", name: "Maria Rosen", role: "Executor" },
  { initials: "ER", name: "Emma Rosen", role: "Backup executor" },
  { initials: "LR", name: "Leo Rosen", role: "Backup trustee" },
];

type Beat = "ask" | "notify" | "open";
type Cursor = { x: number; y: number; who: "Daniel" | "Rachel"; shown: boolean; down: boolean };

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

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">{children}</p>
);

/* Each part of the opened matter arrives just after the card has made room */
const Reveal = ({ open, i, children }: { open: boolean; i: number; children: React.ReactNode }) => (
  <div
    style={{
      opacity: open ? 1 : 0,
      transform: open ? "translateY(0)" : "translateY(8px)",
      transition: open ? `opacity 320ms ease ${220 + i * 70}ms, transform 420ms var(--ease-out) ${220 + i * 70}ms` : "none",
    }}
  >
    {children}
  </div>
);

const WhatChanged = () => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <Label>What changed</Label>
      <span className="text-[12.5px] text-[#9CA3AF]">January 20</span>
    </div>
    <div className="mt-3 rounded-xl bg-[#E6F5F4] px-4 py-3.5">
      <p className="text-[13px] text-[#0C7370]">{QUESTIONS[1]}</p>
      <p className="mt-1.5 text-[15px] font-medium leading-snug text-[#1F2933]">We bought a chalet in Stowe, Vermont.</p>
      <p className="mt-1 text-[14px] leading-snug text-[#374151]">&ldquo;Should the chalet go into our trust too?&rdquo;</p>
    </div>
  </div>
);

const ThePlan = () => (
  <div>
    <Label>Their plan</Label>
    <ul className="mt-2">
      {PLAN.map((d) => (
        <li key={d.name} className="flex items-center gap-3 border-b border-[#F0F1F3] py-[9px] last:border-0">
          <d.Icon className="h-[18px] w-[18px] flex-shrink-0 text-[#128F8B]" />
          <span className="flex-1 text-[14px] font-medium text-[#1F2933]">{d.name}</span>
          {d.detail && <span className="text-[12.5px] text-[#9CA3AF]">{d.detail}</span>}
        </li>
      ))}
    </ul>
  </div>
);

const TheCall = () => (
  <div>
    <Label>Check-in call</Label>
    <div className="mt-2.5 flex items-center gap-3">
      <CalendarCheckIcon className="h-5 w-5 flex-shrink-0 text-[#128F8B]" />
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-medium text-[#1F2933]">Thursday, January 28</p>
        <p className="text-[13px] text-[#6B7280]">2:00 PM · 30 minutes</p>
      </div>
      <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#374151]">
        <ZoomLogo className="h-5 w-5" />
        Zoom
      </span>
    </div>
  </div>
);

const ThePeople = () => (
  <div>
    <Label>Their people</Label>
    <ul className="mt-2.5 space-y-2.5">
      {PEOPLE.map((p) => (
        <li key={p.name} className="flex items-center gap-3">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E6F5F4] text-[11px] font-semibold text-[#0C7370]">{p.initials}</span>
          <span className="flex-1 text-[14px] font-medium text-[#1F2933]">{p.name}</span>
          <span className="text-[12.5px] text-[#6B7280]">{p.role}</span>
        </li>
      ))}
    </ul>
  </div>
);

const NextCheckIn = () => (
  <div className="flex items-baseline justify-between gap-3 border-t border-[#F0F1F3] pt-4">
    <Label>Next check-in</Label>
    <span className="text-[14px] font-medium text-[#1F2933]">July 14</span>
  </div>
);

const CheckInStory = () => {
  const compact = useCompact();
  const size = compact ? COMPACT : WIDE;
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLSpanElement>(null);

  const [beat, setBeat] = useState<Beat>("ask");
  const [picked, setPicked] = useState(false);
  const [typed, setTyped] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0, who: "Daniel", shown: false, down: false });
  const finished = useRef(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || finished.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBeat("open");
      return;
    }

    let run = 0;
    const wait = (ms: number, id: number) =>
      new Promise<void>((resolve, reject) => {
        window.setTimeout(() => (id === run ? resolve() : reject(new Error("stopped"))), ms);
      });
    /* Where an element's centre sits on the stage, before the stage is scaled */
    const at = (el: HTMLElement | null) => {
      const stage = stageRef.current;
      if (!el || !stage) return { x: 0, y: 0 };
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = s.width / size.w;
      return { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    };
    const reset = () => {
      setBeat("ask");
      setPicked(false);
      setTyped(0);
      setPressed(false);
      setCursor((c) => ({ ...c, shown: false, down: false }));
    };
    const click = async (id: number, after: () => void) => {
      setCursor((c) => ({ ...c, down: true }));
      await wait(140, id);
      after();
      setCursor((c) => ({ ...c, down: false }));
    };

    const play = async (id: number) => {
      reset();
      await wait(700, id);

      /* Daniel answers */
      setCursor({ x: size.w * 0.74, y: size.h * 0.86, who: "Daniel", shown: false, down: false });
      await wait(80, id);
      setCursor((c) => ({ ...c, shown: true, ...at(rowRef.current) }));
      await wait(950, id);
      await click(id, () => setPicked(true));
      await wait(420, id);
      for (let n = 1; n <= NOTE.length; n++) {
        setTyped(n);
        await wait(NOTE[n - 1] === " " ? 42 : 24, id);
      }
      await wait(450, id);
      setCursor((c) => ({ ...c, ...at(bookRef.current) }));
      await wait(850, id);
      await click(id, () => setPressed(true));
      await wait(420, id);

      /* Rachel hears about it */
      setCursor((c) => ({ ...c, shown: false }));
      setBeat("notify");
      await wait(1250, id);
      setCursor({ x: size.w * 0.62, y: size.h * 0.62, who: "Rachel", shown: false, down: false });
      await wait(80, id);
      setCursor((c) => ({ ...c, shown: true, ...at(moreRef.current) }));
      await wait(950, id);
      await click(id, () => {
        finished.current = true; // from here on the matter stays open
        io.disconnect();
        setBeat("open");
      });
      await wait(360, id);
      setCursor((c) => ({ ...c, shown: false }));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        run += 1;
        if (entry.isIntersecting) play(run).catch(() => undefined);
      },
      { threshold: 0.35 }
    );
    io.observe(frame);
    return () => {
      run += 1;
      io.disconnect();
    };
  }, [compact, size.h, size.w]);

  const open = beat === "open";
  const askW = compact ? 352 : 540;
  const openW = compact ? 364 : 920;

  return (
    <div ref={frameRef} role="img" aria-label="A client answers a yearly check-in and books a call. The attorney gets a notification and opens the client's matter: what changed, the call, their plan and their people.">
      <PrintFrame print="self" aspect={`${size.w} / ${size.h}`} className="shadow-2xl">
        <ScaledScreen w={size.w} h={size.h}>
          <div ref={stageRef} aria-hidden className="relative overflow-hidden text-left" style={{ width: size.w, height: size.h, fontFamily: "Inter, sans-serif" }}>
            <img src="/nyc-skyline.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" decoding="async" />
            <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.74)" }} />

            <div className="absolute inset-0">
              {/* The client's check-in */}
              <div
                className="absolute left-1/2 top-1/2 rounded-2xl bg-white p-7"
                style={{
                  width: askW,
                  boxShadow: CARD_SHADOW,
                  opacity: beat === "ask" ? 1 : 0,
                  transform: `translate(-50%, -50%) scale(${beat === "ask" ? 1 : 0.96})`,
                  transition: "opacity 220ms ease, transform 300ms var(--ease-out)",
                }}
              >
                <p className="text-[13px] font-medium text-[#0C7370]">Alvarez Family Law is checking in</p>
                <h2 className="mt-1.5 font-heading text-[22px] font-bold leading-[1.3] text-[#1F2933]">Hi Daniel, has anything changed since your plan was last signed?</h2>
                <div className="mt-5 space-y-2">
                  {QUESTIONS.map((q, i) => {
                    const on = i === 1 && picked;
                    return (
                      <div
                        key={q}
                        ref={i === 1 ? rowRef : undefined}
                        className="flex items-center gap-3 rounded-lg border px-3.5 py-2.5"
                        style={{ background: on ? "#E6F5F4" : "#F3F4F6", borderColor: on ? "#128F8B" : "transparent", transition: "background-color 160ms ease, border-color 160ms ease" }}
                      >
                        <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white">
                          <span className="h-3 w-3 rounded-full bg-[#128F8B]" style={{ opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(0.6)", transition: "opacity 140ms ease, transform 180ms var(--ease-out)" }} />
                        </span>
                        <span className="text-[14px] font-medium leading-snug text-[#1F2933]">{q}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 h-[70px] rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-[14px] leading-[1.45] text-[#1F2933]">
                  {typed === 0 ? (
                    <span className="text-[#9CA3AF]">Tell Rachel what changed</span>
                  ) : (
                    <>
                      {NOTE.slice(0, typed)}
                      {typed < NOTE.length && <span className="ml-px inline-block h-[15px] w-px translate-y-[2px] bg-[#1F2933]" />}
                    </>
                  )}
                </div>
                <div
                  ref={bookRef}
                  className="mt-4 flex h-11 items-center justify-center rounded-lg text-[15px] font-medium text-white"
                  style={{
                    background: "#128F8B",
                    opacity: typed === NOTE.length ? 1 : 0.45,
                    transform: pressed ? "scale(0.98)" : "scale(1)",
                    transition: "opacity 200ms ease, transform 140ms var(--ease-out)",
                  }}
                >
                  Book a call with Rachel
                </div>
              </div>

              {/* The attorney's notification, which opens into the client's matter */}
              <div
                className="absolute left-1/2 overflow-hidden rounded-2xl bg-white"
                style={{
                  top: compact ? 51 : 102, // the opened card ends up centred on the print
                  width: open ? openW : askW,
                  boxShadow: CARD_SHADOW,
                  opacity: beat === "ask" ? 0 : 1,
                  transform: `translate(-50%, ${beat === "ask" ? -16 : 0}px)`,
                  transition: "width 540ms var(--ease-in-out), opacity 240ms ease, transform 380ms var(--ease-out)",
                }}
              >
                <div className="flex items-center gap-3.5 px-6 py-5">
                  <NotificationIcon className="h-5 w-5 flex-shrink-0 text-[#128F8B]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15.5px] font-semibold leading-snug text-[#1F2933]">Daniel Rosen booked a check-in call</p>
                    <p className="mt-0.5 text-[13.5px] leading-snug text-[#6B7280]">Something changed · Thursday, Jan 28</p>
                  </div>
                  <span ref={moreRef} className="flex flex-shrink-0 items-center gap-1 text-[14px] font-medium text-[#0C7370]">
                    {open ? "See less" : "See more"}
                    <ChevronDownIcon className="h-4 w-4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 300ms var(--ease-out)" }} />
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 560ms var(--ease-in-out)" }}>
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-[#EEF0F2]" style={{ width: openW }}>
                      {compact ? (
                        <div className="space-y-5 px-6 py-5">
                          <Reveal open={open} i={0}><WhatChanged /></Reveal>
                          <Reveal open={open} i={1}><TheCall /></Reveal>
                          <Reveal open={open} i={2}><ThePeople /></Reveal>
                        </div>
                      ) : (
                        <div className="grid grid-cols-[1.25fr_1fr]">
                          <div className="space-y-6 border-r border-[#EEF0F2] px-7 py-6">
                            <Reveal open={open} i={0}><WhatChanged /></Reveal>
                            <Reveal open={open} i={2}><ThePlan /></Reveal>
                          </div>
                          <div className="space-y-6 px-7 py-6">
                            <Reveal open={open} i={1}><TheCall /></Reveal>
                            <Reveal open={open} i={3}><ThePeople /></Reveal>
                            <Reveal open={open} i={4}><NextCheckIn /></Reveal>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Whoever is at the keyboard */}
              <div
                className="pointer-events-none absolute left-0 top-0 z-10"
                style={{
                  opacity: cursor.shown ? 1 : 0,
                  transform: `translate(${cursor.x}px, ${cursor.y}px)`,
                  transition: `transform 820ms ${MOVE}, opacity 200ms ease`,
                }}
              >
                <div style={{ transform: `scale(${cursor.down ? 0.84 : 1})`, transformOrigin: "2px 2px", transition: "transform 120ms var(--ease-out)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                    <path d="M5 3l14 8.5-6.5 1.5L10 19.5 5 3z" fill={cursor.who === "Daniel" ? "#1F2933" : "#128F8B"} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                  <span
                    className="absolute left-[18px] top-[19px] whitespace-nowrap rounded-md px-2 py-[3px] text-[12px] font-medium text-white"
                    style={{ background: cursor.who === "Daniel" ? "#1F2933" : "#128F8B", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}
                  >
                    {cursor.who === "Daniel" ? "Daniel · Client" : "Rachel · Attorney"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScaledScreen>
      </PrintFrame>
    </div>
  );
};

export default CheckInStory;
