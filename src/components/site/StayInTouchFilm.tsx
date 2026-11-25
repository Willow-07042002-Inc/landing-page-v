import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { WRAP } from "@/components/site/blocks";
import { ScaledScreen } from "@/components/product/kit";
import { FIGTREE, tapStyle, useCompact } from "@/components/site/film-kit";
import {
  CheckInParts,
  CaAnsweredTurn,
  CaPrimaryButton,
  CaQuietButton,
  CaMonthCalendar,
  CaSlotList,
} from "@/components/product/client-app";
import { CheckIcon, ChevronDownIcon, EditIcon, NotificationIcon, TrustIcon } from "@/components/product/willow-icons";

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
   2. Updates from your firm: a notification that the firm posted a tax
      update, alone on the print the way For attorneys sets its meeting
      and tax notifications, dropping open to the update, the clause of his
      trust it touches, Rachel's thoughts, and a way to book a meeting
      (imagined; see below).
   Buttons press themselves; nothing crosses the screen to click them. */

const { Eva, SERIF } = CheckInParts;

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
/* A closing line rather than the product's question ("Is there anything else
   on your mind before the meeting?"), so it's plain Willow handled the booking
   for the firm (Aaron, Nov 25). Booking puts it on Rachel's calendar, as the
   product's "while Rachel's calendar is updated" line says */
const CLOSE = "You’re all set. I’ve sent you the invite and put it on Rachel’s calendar.";

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
  event: 11900, // the invite, with its details a tap away
  end: 12700,
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

/* An answer to tap: a soft pill that wraps with the others, and once picked
   it fills teal as its check slides in. Imagined in place of the product's
   bordered tiles with a dot on the right (conversation.tsx Tile), which read
   as a form (Aaron, Nov 25) */
const Choice = ({ label, selected = false, down = false, narrow }: { label: string; selected?: boolean; down?: boolean; narrow: boolean }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full ${narrow ? "h-[40px] px-4" : "h-[44px] px-[18px]"}`}
    style={{
      ...tapStyle(down),
      background: selected ? "#128F8B" : "#F0F4F4",
      color: selected ? "#FFFFFF" : "#1F2933",
      fontSize: narrow ? 14.5 : 15,
      fontWeight: 500,
      letterSpacing: "-0.005em",
      transition: "background-color 220ms ease, color 220ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease",
    }}
  >
    <span className="inline-flex overflow-hidden" style={{ width: selected ? 22 : 0, transition: "width 260ms var(--ease-out)" }}>
      <CheckIcon
        className="h-4 w-4 flex-shrink-0"
        style={{ opacity: selected ? 1 : 0, transform: selected ? "scale(1)" : "scale(0.6)", transition: "opacity 200ms ease 60ms, transform 260ms var(--ease-out) 60ms" }}
      />
    </span>
    {label}
  </span>
);

/* The meeting once it's booked, under Eva's last line: a calendar leaf with
   its month on a teal band and its day under it, the date and time beside
   it, and its details a tap away. No box around it, and no serifs on the
   date (Aaron, Nov 25).
   Imagined: the product's conversation ends on Eva's line, with no link to
   the event */
const EventCard = () => (
  <div className="ml-[60px] mt-6 flex items-center gap-4">
    <span
      className="w-[52px] flex-shrink-0 overflow-hidden rounded-[13px] bg-white text-center"
      style={{ boxShadow: "0 0 0 1px rgba(15,23,42,0.05), 0 1px 3px rgba(15,23,42,0.08), 0 10px 22px -10px rgba(15,23,42,0.28)" }}
    >
      <span className="block bg-[#128F8B] py-[4px] text-[10px] font-semibold uppercase leading-[12px] tracking-[0.14em] text-white">Dec</span>
      <span className="block pb-[9px] pt-[7px] text-[23px] font-medium leading-none text-[#1F2933]" style={{ letterSpacing: "-0.02em" }}>1</span>
    </span>
    <span className="min-w-0 leading-snug">
      <span className="block font-semibold text-[#1F2933]" style={{ fontSize: 15.5, letterSpacing: "-0.01em" }}>Tuesday, December 1</span>
      <span className="mt-0.5 block text-[#6B7280]" style={{ fontSize: 13.5 }}>{TIME} EST · with Rachel</span>
      <span className="mt-1.5 inline-flex items-center gap-0.5 font-semibold text-[#128F8B]" style={{ fontSize: 13.5 }}>
        See event details
        <ChevronDownIcon className="h-4 w-4 -rotate-90" />
      </span>
    </span>
  </div>
);

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
  const pad = narrow ? "px-6" : "px-12";
  /* The answers line up under Eva's words; on a phone they take the full width */
  const indent = narrow ? "" : "pl-[60px]";

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
      {/* Who's asking, set as a notification the way the firm's update is
          (FirmUpdate's header), with the product's pencil (willow-solid
          edit.svg) for a check-in to fill in rather than the bell (Aaron,
          Nov 25), then his attorney wanting to check in, and who she is. The product's header shows only the firm's name
          in serif; no × (Aaron, Nov 25) */}
      <div className={`flex-shrink-0 ${pad} ${narrow ? "pt-5" : "pt-8"}`}>
        <div className={`flex items-start gap-3.5 border-b border-[#EEF0F2] ${narrow ? "pb-3.5" : "pb-4"}`} style={{ fontFamily: FIGTREE }}>
          <EditIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#128F8B]" />
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-[#1F2933]" style={{ fontSize: narrow ? 15.5 : 16.5 }}>Your attorney wants to check in</p>
            <p className="mt-0.5 leading-snug text-[#6B7280]" style={{ fontSize: narrow ? 13.5 : 14 }}>Rachel Alvarez · Alvarez Family Law</p>
          </div>
        </div>
      </div>
      <div ref={boxRef} className={`relative min-h-0 flex-1 overflow-hidden ${pad}`}>
        {/* Earlier turns fade out under the header as the thread moves up */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />
        <div ref={bodyRef} className={narrow ? "pb-6 pt-3" : "pb-10 pt-5"} style={{ transform: `translateY(${shift}px)`, transition: "transform 520ms cubic-bezier(0.23,1,0.32,1)" }}>
          <CaAnsweredTurn q="Hi Daniel. Rachel at Alvarez Family Law asked me to check in on your plan." />

          {phase === "q1" && (
            <div>
              <Eva note="Tap anything that has.">{Q1.q}</Eva>
              <div className={`${narrow ? "mt-5" : "mt-6"} flex flex-wrap gap-2.5 ${indent}`}>
                {Q1.options.map((o) => <Choice key={o} label={o} narrow={narrow} />)}
              </div>
              <div className={`${narrow ? "mt-6" : "mt-8"} flex flex-wrap items-center gap-x-2 gap-y-1 ${indent}`}>
                <CaPrimaryButton disabled>That&rsquo;s right</CaPrimaryButton>
                <CaQuietButton style={{ ...tapStyle(pressed(t, T.none)), borderRadius: 12, color: pressed(t, T.none) ? "#1F2933" : undefined }}>None of these</CaQuietButton>
              </div>
            </div>
          )}

          {phase !== "q1" && <CaAnsweredTurn q={Q1.q} a="None of these" />}

          {phase === "q2" && (
            <Rise>
              <Eva note="Tap anything that has.">{Q2.q}</Eva>
              <div className={`${narrow ? "mt-5" : "mt-6"} flex flex-wrap gap-2.5 ${indent}`}>
                {Q2.options.map((o) => (
                  <Choice key={o} label={o} selected={o === PICK && picked} down={o === PICK && pressed(t, T.pick)} narrow={narrow} />
                ))}
              </div>
              <div className={`${narrow ? "mt-6" : "mt-8"} flex flex-wrap items-center gap-x-2 gap-y-1 ${indent}`}>
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
              {t >= T.event && (
                <Rise>
                  <EventCard />
                </Rise>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---- 2. The attorney's tax update, as a notification --------------------
   Imagined, not on main (Aaron, Nov 25): the clients app has no
   notifications. Set the way For attorneys sets its meeting and tax
   notifications (KeepInTouchFilm.tsx chapters 3 and 5): the card alone on
   the print, its title line, then it drops open, each part arriving just
   after the card has made room, the action at the foot.
   The update is IRS Revenue Ruling 2023-2 (March 29, 2023; Internal Revenue
   Bulletin 2023-16), chosen by Aaron after an outside review (Nov 25). Read
   from the ruling itself (irs.gov/pub/irs-drop/rr-23-02.pdf): A sets up an
   irrevocable trust, funds it with a completed gift, and keeps a power that
   makes A its owner for income tax (a grantor trust) but doesn't put its
   assets in A's gross estate. At A's death the assets get no basis
   adjustment under § 1014, because they weren't acquired or passed from a
   decedent under any part of § 1014(b); their basis stays what it was. The
   ruling's facts also have no note between A and the trust, and trust
   liabilities under basis. It doesn't reach assets that are in the gross
   estate (§ 1014(b)(9)), or trusts A can revoke or amend ((b)(2), (3)), and
   leaves Rev. Rul. 84-139 alone. So the card says "may not", the clause is
   one that only resembles the ruling's facts, and a note under it says the
   section alone doesn't show whether the trust is outside his estate. The
   trust, its section number and its words are made up for the film; the
   update's wording, the note under the clause and Rachel's thoughts follow
   the outside reviewer's revisions (Nov 25). Commentary: Journal of
   Accountancy, EY, BDO and The Tax Adviser on the ruling. */

const N = { in: 500, tap: 2000, open: 2250, mark: 3500, end: 10400 };
const ARTICLE = "The IRS clarified that certain assets transferred to irrevocable grantor trusts may not receive a “step-up” in tax basis when the grantor dies, if those assets aren’t included in the grantor’s taxable estate.";
const THOUGHTS =
  "One goal of this trust was to transfer assets outside your taxable estate while keeping grantor trust treatment for income tax. This IRS guidance raises an important point about the tax basis of those assets when you pass away. I’d like to review how the trust is structured and what it holds, to see whether our original strategy still makes sense. It doesn’t necessarily mean anything needs to change, but it’s worth a conversation.";
const MERRIWEATHER = "Merriweather, Georgia, serif";
const LIFT = "0 24px 70px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.12)";

const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">{children}</p>
);

/* Each part arrives just after the card has made room */
const Reveal = ({ open, i, children }: { open: boolean; i: number; children: React.ReactNode }) => (
  <div
    style={{
      opacity: open ? 1 : 0,
      transform: open ? "translateY(0)" : "translateY(8px)",
      transition: open ? `opacity 320ms ease ${220 + i * 120}ms, transform 420ms var(--ease-out) ${220 + i * 120}ms` : "none",
    }}
  >
    {children}
  </div>
);

/* The words the update touches, highlighted in once the clause is in view */
const Mark = ({ on, children }: { on: boolean; children: React.ReactNode }) => (
  <span
    className="rounded-[3px] text-[#0B1220]"
    style={{
      padding: "1px 2px",
      backgroundImage: "linear-gradient(rgba(18,143,139,0.17), rgba(18,143,139,0.17))",
      backgroundRepeat: "no-repeat",
      backgroundSize: on ? "100% 100%" : "0% 100%",
      transition: "background-size 700ms var(--ease-in-out)",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    }}
  >
    {children}
  </span>
);

const TaxUpdate = ({ t, narrow, inset }: { t: number; narrow: boolean; inset: number }) => {
  const shown = t >= N.in;
  const open = t >= N.open;
  const pad = narrow ? "px-5" : "px-7";
  return (
    <div className="absolute" style={{ left: inset, right: inset, top: narrow ? 26 : 31 }}>
      <div
        className="overflow-hidden rounded-2xl bg-white text-left"
        style={{
          boxShadow: LIFT,
          fontFamily: FIGTREE,
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 220ms ease-out, transform 560ms var(--ease-out)",
        }}
      >
        <div className={`flex items-start gap-3.5 ${pad} py-4`}>
          <NotificationIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#128F8B]" />
          <div className="min-w-0 flex-1">
            {/* The update is why she suggests a call (Aaron, Nov 25) */}
            <p className="font-semibold leading-snug text-[#1F2933]" style={{ fontSize: narrow ? 15.5 : 17 }}>Rachel recommended a check-in call</p>
            <p className="mt-0.5 leading-snug text-[#6B7280]" style={{ fontSize: narrow ? 13.5 : 14 }}>Based on a recent tax update · Alvarez Family Law</p>
            <span
              className="-mx-1.5 mt-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold text-[#0C7370]"
              style={{ fontSize: narrow ? 14 : 14.5, ...tapStyle(pressed(t, N.tap)) }}
            >
              See how this affects your plan
              <ChevronDownIcon className="h-4 w-4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 300ms var(--ease-out)" }} />
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 560ms var(--ease-in-out)" }}>
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-[#EEF0F2]">
              <div className={`space-y-4 py-4 ${pad}`}>
                <Reveal open={open} i={0}>
                  {/* The ruling itself, a tap away beside the label */}
                  <div className="flex items-center justify-between gap-3">
                    <Label>The update</Label>
                    <span className="inline-flex items-center gap-0.5 whitespace-nowrap font-semibold text-[#0C7370]" style={{ fontSize: 13 }}>
                      Rev. Rul. 2023-2
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="mt-2 text-[#1F2933]" style={{ fontSize: narrow ? 14 : 15, lineHeight: 1.5 }}>{ARTICLE}</p>
                </Reveal>
                <Reveal open={open} i={1}>
                  <Label>Where it touches your plan</Label>
                  <div className="mt-2.5 overflow-hidden rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5 border-b border-[#EEF0F2] bg-[#F8FAFC] px-4 py-2.5">
                      <TrustIcon className="h-4 w-4 flex-shrink-0 text-[#128F8B]" />
                      <span className="min-w-0 flex-1 font-medium text-[#1F2933]" style={{ fontSize: 13.5 }}>Irrevocable Living Trust</span>
                      <span className="flex-shrink-0 text-[#9CA3AF]" style={{ fontSize: 12.5 }}>Section 8.2</span>
                    </div>
                    <p className="px-4 pb-3 pt-3.5 text-[#4B5563]" style={{ fontFamily: MERRIWEATHER, fontSize: narrow ? 12.5 : 13.5, lineHeight: 1.85 }}>
                      <span className="font-bold text-[#1F2933]">Grantor Trust Status.</span> The property listed in Schedule A is given to this trust as a completed gift, and this trust may not be revoked.{" "}
                      <Mark on={t >= N.mark}>I intend this trust to be treated as a grantor trust for income tax purposes</Mark>.
                    </p>
                    <p className="border-t border-[#EEF0F2] px-4 py-2.5 text-[#6B7280]" style={{ fontSize: narrow ? 12 : 12.5, lineHeight: 1.45 }}>
                      Additional review is needed to determine whether this trust’s assets are included in your taxable estate.
                    </p>
                  </div>
                </Reveal>
                <Reveal open={open} i={2}>
                  <Label>Rachel’s thoughts</Label>
                  <p className="mt-2.5 rounded-xl bg-[#E6F5F4] px-4 py-3 font-medium text-[#1F2933]" style={{ fontSize: narrow ? 14 : 15, lineHeight: 1.5 }}>
                    &ldquo;{THOUGHTS}&rdquo;
                  </p>
                </Reveal>
              </div>
              <Reveal open={open} i={3}>
                {/* Just the button (Aaron, Nov 25) */}
                <div className={`border-t border-[#EEF0F2] ${pad} ${narrow ? "py-3" : "py-3.5"}`}>
                  <span className="flex h-[40px] w-full items-center justify-center rounded-md bg-[#309E96] text-[14.5px] font-semibold text-white">Schedule a meeting</span>
                </div>
                <p className={`bg-[#F8FAFC] ${pad} py-2.5 text-[#6B7280]`} style={{ fontSize: narrow ? 12 : 12.5, lineHeight: 1.45 }}>
                  This notification does not amend, replace, or change your existing estate planning documents.
                </p>
              </Reveal>
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
    title: "Clients book time with you",
    body: "A quick survey each year asks what’s changed. If something has, Willow makes it easy for them to find a time on your calendar for a conversation.",
    label: "Daniel answers his yearly check-in: he bought property, so Willow suggests a call, and he books a time on his attorney's calendar, with the event's details a tap away.",
    end: T.end + 1400,
  },
  {
    id: "firm-updates",
    title: "Updates from your firm",
    body: "When you post an update, like a change in tax law, clients see how it affects their plan and can book time with you to talk it through.",
    label: "A notification: Daniel's attorney recommends a check-in call, based on a tax update on IRS Revenue Ruling 2023-2. He opens it to the update, the section of his irrevocable trust it may touch, his attorney's thoughts, and a button to schedule a meeting. The notification doesn't change his documents.",
    end: N.end,
  },
];

/* The tile: a dark print with the product on it, running off the bottom edge
   with room either side (EasyFilm's FilmFrame, narrow). `bare`: no panel, the
   film draws on the print itself, in the whole frame's pixels */
const MAT = { l: 0.05, t: 0.05, r: 0.05 };
const frameOf = (size: { w: number; h: number }) => ({ w: size.w / (1 - MAT.l - MAT.r), h: size.h / (1 - MAT.t) });
const TileFrame = ({ size, bare = false, children }: { size: { w: number; h: number }; bare?: boolean; children: React.ReactNode }) => {
  const { w, h } = frameOf(size);
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#F8FAFC] shadow-xl" style={{ aspectRatio: `${w} / ${h}` }}>
      <img src="/central-park.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      {/* The client side's light wash (Aaron, Nov 25: attorneys dark, clients light) */}
      <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
      {bare ? (
        <ScaledScreen w={w} h={h}>{children}</ScaledScreen>
      ) : (
        <div
          className="absolute overflow-hidden rounded-t-lg bg-white"
          style={{ left: `${MAT.l * 100}%`, top: `${MAT.t * 100}%`, right: `${MAT.r * 100}%`, bottom: 0, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
        >
          <ScaledScreen w={size.w} h={size.h}>{children}</ScaledScreen>
        </div>
      )}
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
     conversation has room around it rather than filling the frame. On a
     phone the tiles stack, so the update's runs taller to hold the card
     once it's open */
  const size = narrow ? { w: 400, h: i === 1 ? 894 : 560 } : { w: 600, h: 810 };
  const frame = frameOf(size);
  return (
    <div role="img" aria-label={c.label}>
      {i === 0 ? (
        <TileFrame size={size}>
          <div key={epoch} aria-hidden style={{ width: size.w, height: size.h }}>
            <CheckIn t={Math.min(t, T.end)} narrow={narrow} />
          </div>
        </TileFrame>
      ) : (
        <TileFrame size={size} bare>
          <div key={epoch} aria-hidden className="relative" style={{ width: frame.w, height: frame.h }}>
            <TaxUpdate t={t} narrow={narrow} inset={MAT.l * frame.w} />
          </div>
        </TileFrame>
      )}
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
          Keep clients in touch
          <span className="block italic text-[#138F8B]">with the attorney who knows them best.</span>
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
