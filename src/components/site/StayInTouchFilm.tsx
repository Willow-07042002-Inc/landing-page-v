import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { WRAP } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { tapStyle, useCompact } from "@/components/site/film-kit";
import {
  CheckInParts,
  CaAnsweredTurn,
  CaPrimaryButton,
  CaQuietButton,
  CaMonthCalendar,
  CaSlotList,
  ClientFirmNewsScreen,
} from "@/components/product/client-app";
import { ChevronDownIcon, NotificationIcon } from "@/components/product/willow-icons";

/* For clients, staying in touch: two tiles set the way For attorneys' Keeping
   things easy sets its three (Aaron, Nov 25, 2026), each with its words above
   and its own short film below. Once the row is in view the films play one
   after another; the one playing grows a little and its rule fills. A tile
   not playing rests on its last frame, and clicking a tile plays it again.
   Below 1024px the tiles stack.
   1. Book time with your attorney: the check-in conversation alone, with no
      dashboard behind it. The words are the product's own
      (apps/clients/components/dashboard/touch/LifeChangesConversation.tsx):
      nothing in Daniel's family changed, he bought property (the chalet the
      For attorneys hero has him tell Rachel about), so Eva offers a call with
      Rachel's open times in the thread; he picks one and books it.
   2. Updates from your firm: a notification on his dashboard that the firm
      posted its yearly tax update, opening to the update, Rachel's thoughts
      on his plan, and a way to book a meeting (imagined; see below).
   Buttons press themselves; nothing crosses the screen to click them. */

const { Eva, Tile, SERIF } = CheckInParts;

/* ---- 1. The check-in ----------------------------------------------------- */

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
  calendar: 7000, // Rachel's open times
  time: 8600, // 10:00 AM
  book: 9600, // "Book it"
  booking: 9850,
  booked: 11200,
  end: 11900,
};
const TAP = 260;
const pressed = (t: number, at: number) => t >= at && t < at + TAP;

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

/* The conversation at time t, filling its tile. The thread keeps its newest
   turn in view, the way the conversation scrolls as it grows. `narrow`: a
   phone, where the tiles take one column and the times sit under the month */
const CheckIn = ({ t, narrow }: { t: number; narrow: boolean }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const phase = t >= T.booked ? "booked" : t >= T.offer ? "offer" : t >= T.q2 ? "q2" : "q1";
  const picked = t >= T.pick;
  const timePicked = t >= T.time;
  const showCalendar = t >= T.calendar;
  const booking = t >= T.booking && t < T.booked;
  const cols = narrow ? "grid-cols-1" : "grid-cols-2";
  const pad = narrow ? "px-6" : "px-12";

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
    <div className="flex h-full w-full flex-col overflow-hidden bg-white text-left" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      {/* The firm's name, as the sheet's header has it; no × (Aaron, Nov 25) */}
      <div className={`flex-shrink-0 ${pad} ${narrow ? "pb-2 pt-5" : "pb-3 pt-9"}`}>
        <span className="block truncate text-[#1F2933]" style={{ ...SERIF, fontSize: 16, fontWeight: 600 }}>Alvarez Family Law</span>
      </div>
      <div ref={boxRef} className={`relative min-h-0 flex-1 overflow-hidden ${pad}`}>
        {/* Earlier turns fade out under the header as the thread moves up */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />
        <div ref={bodyRef} className={narrow ? "pb-6 pt-3" : "pb-10 pt-5"} style={{ transform: `translateY(${shift}px)`, transition: "transform 520ms cubic-bezier(0.23,1,0.32,1)" }}>
          <CaAnsweredTurn q="Hi Daniel. Rachel at Alvarez Family Law asked me to check in on your plan." />

          {phase === "q1" && (
            <div>
              <Eva note="Tap anything that has.">{Q1.q}</Eva>
              <div className={`${narrow ? "mt-6" : "mt-7"} grid gap-3 ${cols}`}>
                {Q1.options.map((o) => <Tile key={o} label={o} />)}
              </div>
              <div className={`${narrow ? "mt-6" : "mt-8"} flex flex-wrap items-center gap-x-2 gap-y-1`}>
                <CaPrimaryButton disabled>That&rsquo;s right</CaPrimaryButton>
                <CaQuietButton style={{ ...tapStyle(pressed(t, T.none)), borderRadius: 12, color: pressed(t, T.none) ? "#1F2933" : undefined }}>None of these</CaQuietButton>
              </div>
            </div>
          )}

          {phase !== "q1" && <CaAnsweredTurn q={Q1.q} a="None of these" />}

          {phase === "q2" && (
            <Rise>
              <Eva note="Tap anything that has.">{Q2.q}</Eva>
              <div className={`${narrow ? "mt-6" : "mt-7"} grid gap-3 ${cols}`}>
                {Q2.options.map((o) => (
                  <div key={o} className="rounded-xl" style={o === PICK ? tapStyle(pressed(t, T.pick)) : undefined}>
                    <Tile label={o} selected={o === PICK && picked} />
                  </div>
                ))}
              </div>
              <div className={`${narrow ? "mt-6" : "mt-8"} flex flex-wrap items-center gap-x-2 gap-y-1`}>
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
                  <div className="mt-6">
                    <div className={narrow ? "grid gap-6" : "grid h-[300px] grid-cols-[280px_minmax(0,1fr)] gap-5"}>
                      <CaMonthCalendar month={MONTH} open={OPEN} selected={OPEN[0]} />
                      <div className={narrow ? "" : "flex min-h-0 flex-col border-l border-gray-100 pl-5"}>
                        <CaSlotList heading={DAY} slots={SLOTS} selected={timePicked ? TIME : null} pressed={pressed(t, T.time) ? TIME : null} compact={narrow} note="Times shown in EST." />
                      </div>
                    </div>
                  </div>
                  {booking && <p className="mt-5 text-[14px] text-[#6B7280]">Booking that for you — it takes a moment while Rachel&rsquo;s calendar is updated.</p>}
                  <div className={`${narrow ? "mt-6" : "mt-8"} flex flex-wrap items-center gap-x-2 gap-y-1`}>
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

/* ---- 2. The firm's update, as a notification ------------------------------
   Imagined, not on main (Aaron, Nov 25): the clients app has no
   notifications yet. On Daniel's dashboard a notification says his firm
   posted its yearly tax update; "See how this affects your plan" opens it,
   top to bottom, to the update (with the firm's full write-up a link away),
   Rachel's thoughts on his plan, and a way to book a meeting. The update is
   the one For attorneys shows reaching the attorney (KeepInTouchFilm.tsx
   chapter 3), with no figures, so nothing here dates or misstates the law. */

const N = { in: 500, tap: 2100, open: 2350, end: 8600 };
const LABEL: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" };

const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

/* Each part arrives just after the card has made room */
const Reveal = ({ open, i, children }: { open: boolean; i: number; children: React.ReactNode }) => (
  <div
    style={{
      opacity: open ? 1 : 0,
      transform: open ? "translateY(0)" : "translateY(8px)",
      transition: open ? `opacity 360ms ease ${220 + i * 160}ms, transform 480ms cubic-bezier(0.23,1,0.32,1) ${220 + i * 160}ms` : "none",
    }}
  >
    {children}
  </div>
);

const FirmUpdate = ({ t, narrow, height }: { t: number; narrow: boolean; height: number }) => {
  const shown = t >= N.in;
  const open = t >= N.open;
  const pad = narrow ? "px-5" : "px-6";
  const text: React.CSSProperties = { fontSize: narrow ? 14 : 14.5, lineHeight: 1.6 };
  return (
    <div className="relative h-full w-full text-left" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      {/* His dashboard, behind */}
      <ClientFirmNewsScreen open={false} compact articles={[]} height={height} />
      <div className="absolute inset-x-0 bottom-0 top-14 bg-black/25" style={{ opacity: open ? 1 : 0, transition: "opacity 400ms ease" }} />

      {/* The notification */}
      <div className={`absolute top-[72px] ${narrow ? "inset-x-3" : "inset-x-5"}`}>
        <div
          className="overflow-hidden rounded-2xl bg-white"
          style={{
            boxShadow: "0 14px 44px rgba(15,23,42,0.20), 0 2px 6px rgba(15,23,42,0.06)",
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(-14px)",
            transition: "opacity 160ms ease-out, transform 520ms cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <div className={`flex items-start gap-3.5 ${pad} pb-4 pt-5`}>
            <NotificationIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#128F8B]" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#1F2933]" style={{ fontSize: narrow ? 15 : 15.5, lineHeight: 1.4 }}>Alvarez Family Law posted its yearly tax update</p>
              <p className="mt-0.5 text-[#9CA3AF]" style={{ fontSize: 13 }}>Rachel Alvarez · Just now</p>
              <span
                className="-mx-1.5 mt-2.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold text-[#128F8B]"
                style={{ fontSize: 14, ...tapStyle(pressed(t, N.tap)) }}
              >
                See how this affects your plan
                <ChevronDownIcon className="h-4 w-4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 300ms cubic-bezier(0.23,1,0.32,1)" }} />
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 560ms var(--ease-in-out)" }}>
            <div className="min-h-0 overflow-hidden">
              <div className={`space-y-5 border-t border-[#EEF0F2] ${pad} py-5`}>
                <Reveal open={open} i={0}>
                  <p className="text-[#9CA3AF]" style={LABEL}>The update</p>
                  <p className="mt-1.5 text-[#1F2933]" style={text}>New York’s estate tax exemption changes on January 1.</p>
                  <span className="mt-2 inline-flex items-center gap-1 font-semibold text-[#128F8B]" style={{ fontSize: 14 }}>
                    Read the full update
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Reveal>
                <Reveal open={open} i={1}>
                  <p className="text-[#9CA3AF]" style={LABEL}>Rachel’s thoughts on your plan</p>
                  <p className="mt-2 border-l-2 border-[#3AB2AB] pl-3.5 text-[#374151]" style={text}>
                    Your plan was set up around today’s exemption. Nothing has to change yet, but it’s worth going over together before January.
                  </p>
                </Reveal>
                <Reveal open={open} i={2}>
                  <div className={`flex ${narrow ? "flex-col items-start gap-3" : "items-center gap-3.5"} rounded-xl bg-[#F4F8F8] p-4`}>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E6F5F4] text-[12px] font-semibold text-[#0C7370]">RA</span>
                      <span className="min-w-0 leading-snug">
                        <span className="block font-semibold text-[#1F2933]" style={{ fontSize: 14.5 }}>Talk it through with Rachel</span>
                        <span className="block text-[#6B7280]" style={{ fontSize: 13 }}>Your attorney at Alvarez Family Law</span>
                      </span>
                    </div>
                    <span className="inline-flex flex-shrink-0 items-center rounded-xl bg-[#128F8B] px-4 py-2.5 font-semibold text-white" style={{ fontSize: 14 }}>Book a meeting</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---- The row -------------------------------------------------------------- */

const CHAPTERS = [
  {
    id: "book-a-time",
    title: "Book time with your attorney",
    body: "A quick survey each year asks what’s changed. If something has, pick a time on your attorney’s calendar, right in the conversation.",
    label: "Daniel answers his yearly check-in: he bought property, so Willow suggests a call, and he books a time on his attorney's calendar.",
    end: T.end + 1400,
  },
  {
    id: "firm-updates",
    title: "Updates from your firm",
    body: "When your firm posts an update, like its yearly tax update, see how it affects your plan and book time to talk it through.",
    label: "A notification on Daniel's dashboard: his firm posted its yearly tax update. He opens it to the update, his attorney's thoughts on his plan, and a way to book a meeting.",
    end: N.end,
  },
];

/* The tile: a dark print with the product on it, running off the bottom edge
   with room either side (EasyFilm's FilmFrame, narrow) */
const MAT = { l: 0.05, t: 0.05, r: 0.05 };
const TileFrame = ({ size, children }: { size: { w: number; h: number }; children: React.ReactNode }) => {
  const w = size.w / (1 - MAT.l - MAT.r);
  const h = size.h / (1 - MAT.t);
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#062D2C] shadow-xl" style={{ aspectRatio: `${w} / ${h}` }}>
      <img src="/central-park.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.74)" }} />
      <div
        className="absolute overflow-hidden rounded-t-lg bg-white"
        style={{ left: `${MAT.l * 100}%`, top: `${MAT.t * 100}%`, right: `${MAT.r * 100}%`, bottom: 0, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
      >
        <ScaledScreen w={size.w} h={size.h}>{children}</ScaledScreen>
      </div>
    </div>
  );
};

/* A film's clock: from 0 while it's this tile's turn, else its last frame.
   Real time from an origin, so a throttled tab catches up instead of slowing */
const useTileClock = (end: number, go: boolean, run: number, onEnd: () => void) => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [t, setT] = useState(end);
  /* Bumped each time it starts, so the film starts fresh rather than
     animating back from its last frame */
  const [epoch, setEpoch] = useState(0);
  const done = useRef(onEnd);
  done.current = onEnd;
  useEffect(() => {
    if (!go) {
      setT(end);
      return;
    }
    if (reduced) {
      setT(end);
      done.current();
      return;
    }
    const origin = Date.now();
    setT(0);
    setEpoch((e) => e + 1);
    const id = window.setInterval(() => {
      const now = Date.now() - origin;
      setT(Math.min(now, end));
      if (now >= end) {
        window.clearInterval(id);
        done.current();
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [go, run, end, reduced]);
  return { t, epoch };
};

/* A tile's rule fills as its film plays */
const Fill = ({ ms }: { ms: number }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(id);
  }, []);
  return <span className="absolute left-0 top-[-2px] h-0.5 bg-[#138F8B]" style={{ width: on ? "100%" : "0%", transition: on ? `width ${ms}ms linear` : "none" }} />;
};

const GROW = 1.035;

const Film = ({ i, go, run, narrow, onEnd }: { i: number; go: boolean; run: number; narrow: boolean; onEnd: () => void }) => {
  const c = CHAPTERS[i];
  const { t, epoch } = useTileClock(c.end, go, run, onEnd);
  /* The wide tile is drawn a little smaller than life (about 0.85), so the
     conversation has room around it rather than filling the frame */
  const size = narrow ? { w: 400, h: 560 } : { w: 600, h: 725 };
  return (
    <div role="img" aria-label={c.label}>
      <TileFrame size={size}>
        <div key={epoch} aria-hidden style={{ width: size.w, height: size.h }}>
          {i === 0 ? (
            <CheckIn t={Math.min(t, T.end)} narrow={narrow} />
          ) : (
            <FirmUpdate t={t} narrow={narrow} height={size.h} />
          )}
        </div>
      </TileFrame>
    </div>
  );
};

const StayInTouchFilm = () => {
  const narrow = useCompact();
  const rowRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  /* Whose turn it is to play; the rest hold on their last frame */
  const [turn, setTurn] = useState<number | null>(0);
  const [runs, setRuns] = useState(() => CHAPTERS.map(() => 0));
  const [played, setPlayed] = useState(() => CHAPTERS.map(() => false));
  /* Still in the first pass through the row: each tile hands on to the next */
  const auto = useRef(true);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const play = (i: number) => {
    auto.current = false;
    setPlayed((p) => p.map((v, k) => (k === i ? false : v)));
    setRuns((r) => r.map((v, k) => (k === i ? v + 1 : v)));
    setTurn(i);
  };

  const ended = useCallback((i: number) => {
    setPlayed((p) => p.map((v, k) => (k === i ? true : v)));
    setTurn((t) => (t !== i ? t : auto.current && i < CHAPTERS.length - 1 ? i + 1 : null));
  }, []);

  return (
    <section id="stay-in-touch" className="scroll-mt-24 bg-[#F8FAFC] pb-16 md:pb-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
          Stay in touch with
          <span className="block italic text-[#138F8B]">the attorney who knows your plan.</span>
        </h2>

        <div ref={rowRef} className="relative mt-10 grid gap-14 md:mt-12 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-6">
          {CHAPTERS.map((c, i) => {
            const go = seen && turn === i;
            const playing = go && !played[i];
            const quiet = seen && turn !== null && turn !== i && !played[turn];
            return (
              <div key={c.id} id={c.id} className="group relative grid scroll-mt-24 gap-5 lg:row-span-2 lg:grid-rows-subgrid lg:gap-y-6">
                <div className="relative border-t-2 border-gray-200 pt-5">
                  {playing ? <Fill key={runs[i]} ms={c.end} /> : played[i] && <span className="absolute left-0 top-[-2px] h-0.5 w-full bg-[#138F8B]" />}
                  <h3
                    className="text-[20px] font-medium leading-snug"
                    style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em", color: quiet ? "#6B7280" : "#222222", transition: "color 300ms ease" }}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-2 max-w-[30rem] text-[15px] leading-relaxed text-gray-600" style={{ textWrap: "pretty" }}>
                    {c.body}
                  </p>
                </div>

                {/* The tile: lifts on hover, grows while it plays */}
                <div className="max-w-[560px] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <div
                    className="rounded-xl"
                    style={{
                      transform: playing ? `scale(${GROW})` : "scale(1)",
                      boxShadow: playing ? "0 28px 60px -24px rgba(6,45,44,0.55)" : "0 0 0 0 rgba(6,45,44,0)",
                      transition: "transform 700ms var(--ease-in-out), box-shadow 700ms ease",
                    }}
                  >
                    <Film i={i} go={go} run={runs[i]} narrow={narrow} onEnd={() => ended(i)} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => play(i)}
                  aria-label={`Play “${c.title}” again`}
                  className="absolute -inset-2 z-10 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#138F8B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8FAFC]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StayInTouchFilm;
