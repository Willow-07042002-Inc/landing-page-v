import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { WRAP, PrintFrame } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { tapStyle, useCompact } from "@/components/site/film-kit";
import {
  CheckInParts,
  CaAnsweredTurn,
  CaPrimaryButton,
  CaQuietButton,
  CaMonthCalendar,
  CaSlotList,
  CheckInOver,
} from "@/components/product/client-app";

/* For clients, staying in touch: one film of the yearly check-in as Daniel
   lives it, beside the three steps it shows (Aaron, Nov 24: "I'm just filling
   out the survey, and then it should go 'we recommend', and then it shows the
   attorney's calendar"). The words are the product's own
   (apps/clients/components/dashboard/touch/LifeChangesConversation.tsx):
   nothing in his family changed, he bought property (the chalet the For
   attorneys hero has him tell Rachel about), so Eva offers a call with
   Rachel's open times in the thread, he picks one and books it.
   Buttons press themselves; nothing crosses the screen to click them. It
   plays once when it scrolls into view and rests on its last frame; a step
   on the left plays it from there, and tapping the film plays it again. */

const { Eva, Tile, CloseIcon, SERIF } = CheckInParts;

const Q1 = { q: "Has your family dynamic changed?", options: ["Got married", "Divorced or separated", "A birth or adoption", "A death in the family", "A new partner"] };
const Q2 = { q: "Have you moved, or bought or sold property?", options: ["Moved", "Bought or sold property", "Moved to another state"] };
const PICK = "Bought or sold property";
const OFFER =
  "Based on what’s happened, it would be great to schedule a call to go over how we can make sure your estate plan reflects this. Here are the times that work.";
const MONTH = { y: 2026, m: 12 };
const OPEN = ["2026-12-01", "2026-12-02", "2026-12-03", "2026-12-07", "2026-12-08", "2026-12-10"];
const DAY = "Tuesday, Dec 1";
const SLOTS = ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"];
const TIME = "10:00 AM";
const BOOKED = `Booked: ${DAY} at ${TIME} EST`;
const CLOSE = "I’ve sent an invite to your calendar. Is there anything else on your mind before the meeting?";

/* The beats, in ms from the start */
const T = {
  none: 1500, // "None of these" on the family question
  q2: 2100,
  pick: 3300, // "Bought or sold property"
  confirm: 4300, // "That's right"
  offer: 4900, // Eva recommends a call
  calendar: 6700, // Rachel's open times
  time: 8300, // 10:00 AM
  book: 9300, // "Book it"
  booking: 9550,
  booked: 10900,
  end: 11600,
};
const TAP = 260;
const pressed = (t: number, at: number) => t >= at && t < at + TAP;

export const STEPS = [
  {
    title: "Answer your yearly check-in",
    body: "Once a year, your attorney asks what’s changed since your plan was signed. Tap anything that has.",
    from: 0,
  },
  {
    title: "See what we recommend",
    body: "When something has changed, Willow suggests a call, so your attorney can make sure your plan still reflects your life.",
    from: T.offer,
  },
  {
    title: "Book time with your attorney",
    body: "Your attorney’s open times are right there in the conversation. Pick one, and the invite goes to your calendar.",
    from: T.calendar,
  },
];
const stepAt = (t: number) => (t >= T.calendar ? 2 : t >= T.offer ? 1 : 0);
const stepEnd = (i: number) => (i === 0 ? T.offer : i === 1 ? T.calendar : T.end);

/* Slides up into the thread once, as the product's chatIn does */
const Rise = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className={className} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(10px)", transition: "opacity 320ms ease, transform 420ms cubic-bezier(0.23,1,0.32,1)" }}>
      {children}
    </div>
  );
};

/* The sheet at time t: the thread keeps its newest turn in view, the way the
   conversation scrolls as it grows */
const Sheet = ({ t, compact }: { t: number; compact: boolean }) => {
  const indent = compact ? "" : "pl-[60px]";
  const boxRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const phase = t >= T.booked ? "booked" : t >= T.offer ? "offer" : t >= T.q2 ? "q2" : "q1";
  const picked = t >= T.pick;
  const timePicked = t >= T.time;
  const showCalendar = t >= T.calendar;
  const booking = t >= T.booking && t < T.booked;

  useLayoutEffect(() => {
    const box = boxRef.current;
    const body = bodyRef.current;
    if (!box || !body) return;
    const measure = () => setShift(Math.min(0, box.clientHeight - body.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    return () => ro.disconnect();
  }, [phase, showCalendar, booking]);

  return (
    <div role="img" aria-label="Daniel's yearly check-in: he tells his attorney he bought property, Willow suggests a call, and he books a time on her calendar." className={`flex h-full w-full ${compact ? "" : "max-w-[640px]"} flex-col overflow-hidden rounded-2xl bg-white`} style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)", height: compact ? "100%" : 760 }}>
      <div className={`flex flex-shrink-0 items-center justify-between ${compact ? "px-5 py-4" : "px-8 py-5"}`}>
        <span className="truncate text-[#1F2933]" style={{ ...SERIF, fontSize: 16, fontWeight: 600 }}>Alvarez Family Law</span>
        <span className="p-1 text-[#9CA3AF]">
          <CloseIcon className="h-5 w-5" />
        </span>
      </div>
      <div ref={boxRef} className={`relative min-h-0 flex-1 overflow-hidden ${compact ? "px-5" : "px-8"}`}>
        <div ref={bodyRef} className="pb-6 pt-2" style={{ transform: `translateY(${shift}px)`, transition: "transform 520ms cubic-bezier(0.23,1,0.32,1)" }}>
          <CaAnsweredTurn q="Hi Daniel. Rachel at Alvarez Family Law asked me to check in on your plan." />

          {phase === "q1" && (
            <div>
              <Eva note="Tap anything that has.">{Q1.q}</Eva>
              <div className={`mt-8 grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"} ${indent}`}>
                {Q1.options.map((o) => <Tile key={o} label={o} />)}
              </div>
              <div className={`mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 ${indent}`}>
                <CaPrimaryButton disabled>That&rsquo;s right</CaPrimaryButton>
                <CaQuietButton style={{ ...tapStyle(pressed(t, T.none)), borderRadius: 12, color: pressed(t, T.none) ? "#1F2933" : undefined }}>None of these</CaQuietButton>
              </div>
            </div>
          )}

          {phase !== "q1" && <CaAnsweredTurn q={Q1.q} a="None of these" />}

          {phase === "q2" && (
            <Rise>
              <Eva note="Tap anything that has.">{Q2.q}</Eva>
              <div className={`mt-8 grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"} ${indent}`}>
                {Q2.options.map((o) => (
                  <div key={o} className="rounded-xl" style={o === PICK ? tapStyle(pressed(t, T.pick)) : undefined}>
                    <Tile label={o} selected={o === PICK && picked} />
                  </div>
                ))}
              </div>
              <div className={`mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 ${indent}`}>
                <CaPrimaryButton disabled={!picked} style={tapStyle(pressed(t, T.confirm))}>That&rsquo;s right</CaPrimaryButton>
                <CaQuietButton>None of these</CaQuietButton>
              </div>
            </Rise>
          )}

          {(phase === "offer" || phase === "booked") && <CaAnsweredTurn q={Q2.q} a={PICK} />}

          {phase === "offer" && (
            <Rise>
              <Eva>{OFFER}</Eva>
              {showCalendar && (
                <Rise>
                  <div className={`mt-8 ${indent}`}>
                    <div className={compact ? "grid gap-6" : "grid h-[310px] grid-cols-[300px_minmax(0,1fr)] gap-6"}>
                      <CaMonthCalendar month={MONTH} open={OPEN} selected={OPEN[0]} />
                      <div className={compact ? "" : "flex min-h-0 flex-col border-l border-gray-100 pl-6"}>
                        <CaSlotList heading={DAY} slots={SLOTS} selected={timePicked ? TIME : null} pressed={pressed(t, T.time) ? TIME : null} compact={compact} note="Times shown in EST." />
                      </div>
                    </div>
                  </div>
                  {booking && (
                    <p className={`mt-6 text-[14px] text-[#6B7280] ${indent}`}>Booking that for you — it takes a moment while Rachel&rsquo;s calendar is updated.</p>
                  )}
                  <div className={`mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 ${indent}`}>
                    <CaPrimaryButton disabled={!timePicked || booking} style={tapStyle(pressed(t, T.book))}>Book it</CaPrimaryButton>
                    <CaQuietButton>Not now</CaQuietButton>
                  </div>
                </Rise>
              )}
            </Rise>
          )}

          {phase === "booked" && (
            <>
              <CaAnsweredTurn q={OFFER} a={BOOKED} />
              <Rise>
                <Eva>{CLOSE}</Eva>
              </Rise>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* The clock: real time from a moving origin, so a throttled tab catches up
   instead of slowing down. Starts once half the film is in view */
const useFilmClock = (ref: React.RefObject<HTMLElement>) => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [t, setT] = useState(reduced ? T.end : 0);
  const origin = useRef<number | null>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && origin.current === null) {
          origin.current = Date.now();
          setRun((r) => r + 1);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, reduced]);

  useEffect(() => {
    if (!run || origin.current === null) return;
    const id = window.setInterval(() => {
      const now = Date.now() - (origin.current ?? Date.now());
      setT(Math.min(now, T.end));
      if (now >= T.end) window.clearInterval(id);
    }, 50);
    return () => window.clearInterval(id);
  }, [run]);

  const playFrom = (from: number) => {
    if (reduced) return;
    origin.current = Date.now() - from;
    setT(from);
    setRun((r) => r + 1);
  };
  return { t, playFrom };
};

const StayInTouchFilm = () => {
  const compact = useCompact();
  const ref = useRef<HTMLDivElement>(null);
  const { t, playFrom } = useFilmClock(ref);
  const active = stepAt(t);
  const size = compact ? { w: 400, h: 840 } : { w: 1000, h: 860 };

  return (
    <section className="bg-[#F8FAFC] pb-16 md:pb-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2 }}>
          Stay in touch with
          <span className="block italic text-[#138F8B]">the attorney who knows your plan.</span>
        </h2>

        <div className="mt-10 grid items-start gap-10 md:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,11fr)] lg:gap-14">
          {/* The three steps, ruled as For attorneys' chapters are: the open
              one's rule fills as the film plays it */}
          <div role="tablist" aria-label="Staying in touch with your attorney" className="border-b-2 border-gray-200">
            {STEPS.map((s, i) => {
              const on = i === active;
              const span = stepEnd(i) - s.from;
              const fill = i < active ? 1 : on ? Math.min(1, Math.max(0, (t - s.from) / span)) : 0;
              return (
                <div key={s.title} className="relative border-t-2 border-gray-200">
                  <span className="absolute left-0 top-[-2px] h-0.5 bg-[#138F8B]" style={{ width: `${(on ? fill : 0) * 100}%` }} />
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => playFrom(s.from)}
                    className={`block w-full py-5 text-left text-[20px] font-medium leading-snug transition-colors ${on ? "text-[#222222]" : "text-gray-500 hover:text-[#222222]"}`}
                    style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
                  >
                    {s.title}
                  </button>
                  <div style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", transition: "grid-template-rows 340ms cubic-bezier(0.77,0,0.175,1)" }}>
                    <div className="min-h-0 overflow-hidden">
                      <p className="pb-6 pr-4 text-[15px] leading-relaxed text-gray-600" style={{ opacity: on ? 1 : 0, transition: on ? "opacity 260ms ease 120ms" : "opacity 120ms ease", textWrap: "pretty" }}>
                        {s.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={ref} className="relative min-w-0">
            <PrintFrame print="/florida-coast.jpg" aspect={`${size.w} / ${size.h}`} className="shadow-2xl" dark>
              <ScaledScreen w={size.w} h={size.h}>
                {compact ? (
                  <div className="h-full w-full">
                    <Sheet t={t} compact />
                  </div>
                ) : (
                  <CheckInOver sheet={<Sheet t={t} compact={false} />} height={size.h} />
                )}
              </ScaledScreen>
            </PrintFrame>
            <button
              type="button"
              onClick={() => playFrom(0)}
              aria-label="Play the check-in again"
              className="absolute inset-0 z-10 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#138F8B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8FAFC]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayInTouchFilm;
