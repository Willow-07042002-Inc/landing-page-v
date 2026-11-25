import React, { useEffect, useRef, useState } from "react";
import { ScaledScreen, WIcon } from "@/components/product/kit";
import { ZoomLogo } from "@/components/product/attorney-booking";
import { CalendarCheckIcon, CheckIcon, ChevronDownIcon, NotificationIcon, UploadIcon } from "@/components/product/willow-icons";
import { Appear, FIGTREE, FillIn, MOVE, makeWait, tapStyle, useCompact, type FilmProps } from "@/components/site/film-kit";

/* "A practice families keep coming back to": four chapters, each one piece of
   the product set on a dark print. The piece rises in from below and runs off
   the bottom edge, with room left, right and above, so it reads as something
   placed in the frame rather than a screenshot of a whole screen.
   1. The client check-in email (touchpoints.ts DEFAULTS.maintenance_survey:
      its subject, button and yearly timing), its words typed in as the
      attorney writes them, then saved; it folds into a month that fills
      with each client's check-in on their own date.
   2. Dashboard content as Aaron designed it (Nov 24): an "Upload article"
      box over the firm's past posts, each small with its image on the left.
      The new article drops into the box, which opens downward to it, image
      on top and words under, pushing the past posts down and off the frame;
      then it's posted to clients' dashboards. In the product
      (dashboard-content.tsx) the attorney pastes the article's link, Willow
      reads its headline and blurb, and posts carry no image.
   3. Imagined, not on main (Aaron, Nov 24): a tax update arrives as a
      notification, in the style of the booked-meeting one (chapter 5). It
      opens, top to bottom, to the update, then the clients Willow suggests
      reaching out to (View clients, not opened), with the suggested email
      on the right, which the attorney sends to all of them.
   4. The yearly note to the executors and guardians a plan names
      (DEFAULTS.agent_checkin), a line typed onto it offering them a plan of
      their own, and saved.
   5. Maria, Daniel's executor, asks for access to his plan, and the firm
      meets first: the request opens (the way the hero's check-in card
      opens) to where it stands, the meeting she booked, her note, and who's
      invited, each with how they're related to Daniel and their role.
   Each chapter is its own sequence. The film plays them in order from where
   it's opened and stops on the last frame. People who prefer reduced motion
   see each chapter at rest. */

const WIDE = { w: 860, h: 680 };
const COMPACT = { w: 420, h: 640 };
type Place = { left: number; right: number; top: number };
const PLACE_WIDE: Place = { left: 64, right: 64, top: 52 };
const PLACE_COMPACT: Place = { left: 14, right: 14, top: 22 };
const LIFT = "0 24px 70px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.12)";
const ARIAL = "Arial, 'Segoe UI', sans-serif";
const MERRIWEATHER = "Merriweather, Georgia, serif";

/* Chapter 1: what the attorney writes, and the month it fills. Each client's
   check-in goes on their own date, a year after they signed, then yearly
   (cadence YEARLY). The month is an illustration: the product keeps each
   client's next date (staying-in-touch.tsx), not a calendar. The clients are
   the ones in the product screens; Daniel's lands on January 12, before he
   answers on January 20 in the hero. January 2027 starts on a Friday */
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

/* Chapter 2's article (the page's own placeholder headline) and the firm's
   earlier posts. Photos from Unsplash (free under the Unsplash License):
   omGSZqBXkqY, ik34RApLqXc, sUq45MwJuHs, 3HfGnyPfWqQ. pos keeps the faces
   in the crop */
const NEWS = { title: "What the new estate tax threshold means", body: "How it affects your plan, and whether you need to do anything.", date: "November 24, 2026", img: "/articles/advisor-meeting.jpg", pos: "50% 30%" };
const PAST = [
  { title: "How often you should update your estate plan", body: "Life changes, and your plan should too. Here’s when it’s worth a second look.", date: "October 20, 2026", img: "/articles/couple-outdoors.jpg", pos: "50% 15%" },
  { title: "Choosing the right executor", body: "What the role asks of someone, and how to pick the right person.", date: "September 22, 2026", img: "/articles/two-men-talking.jpg", pos: "50% 50%" },
  { title: "Why the way your home is titled matters", body: "How a deed fits with the rest of your estate plan.", date: "August 18, 2026", img: "/articles/house-keys.jpg", pos: "50% 50%" },
];

/* Chapter 3, imagined (no such feature on main; Aaron asked for it on the
   page, Nov 24): a New York estate tax update read against the firm's 48
   plans, the clients whose plans it may affect, and the email Willow
   suggests. No figures, so nothing here dates or misstates the law */
const LAW_PLANS = 48;
const AFFECTED = [
  { initials: "ER", name: "Elena Ruiz" },
  { initials: "DR", name: "Daniel Rosen" },
  { initials: "MW", name: "Marcus Webb" },
  { initials: "PA", name: "Priya Anand" },
  { initials: "OG", name: "Olivia Grant" },
];
const LAW_W = { wide: 780, compact: 392 };

/* Chapter 4: what the attorney types onto the executors' note */
const TEAM_TYPED = " And if you’d ever like a plan of your own, I’d be glad to help.";

/* Chapter 4: Maria's request. "You asked to meet first..." is the request
   popup's own line, and "Note from Maria" and "Meeting" its labels
   (reminders-bell.tsx). Who's invited follows the firm's access request
   setting "All fiduciaries": the person who asked, and the client's other
   executors, trustees and agents (access-meetings.ts). How each is related
   to Daniel is the client's family as the product holds it
   (attorney-client-panel.tsx) */
const MARIA_NOTE = "Daniel passed away last week. I’d like to go over his plan with you, and what I need to do as his executor.";
const INVITED = [
  { initials: "MR", name: "Maria Rosen", about: "Wife · Executor", asked: true },
  { initials: "ER", name: "Emma Rosen", about: "Daughter · Backup co-executor", asked: false },
  { initials: "LR", name: "Leo Rosen", about: "Son · Backup co-executor", asked: false },
];
const REQUEST_W = { wide: 760, compact: 392 };

/* The waits in each chapter's script, so its length is known up front */
const TAP = 190;
/* The month fills at Keeping things easy's pace (EasyFilm's C3 land and chip;
   Aaron, Nov 24) */
const C1 = { read: 900, perChar: 22, after: 350, fold: 450, land: 420, chip: 90, hold: 2400 };
const C2 = { rest: 900, carry: 950, over: 300, loading: 900, preview: 1700, hold: 2200 };
const CL = { read: 2000, open: 3600, sent: 2400 };
const C3 = { read: 1500, perChar: 32, after: 250, beforeSave: 450, hold: 1900 };
const C4 = { read: 2200, hold: 5600 };

export const KEEP_CHAPTERS = 5;
/** How long each chapter runs at normal speed */
export const KEEP_MS = [
  C1.read + CHECKIN_TYPED.length * C1.perChar + C1.after + TAP + C1.fold + C1.land + CHECKINS.length * C1.chip + C1.hold,
  C2.rest + C2.carry + C2.over + C2.loading + C2.preview + TAP + C2.hold,
  CL.read + TAP + CL.open + TAP + CL.sent,
  C3.read + TAP + TEAM_TYPED.length * C3.perChar + C3.after + C3.beforeSave + TAP + C3.hold,
  C4.read + TAP + C4.hold,
];

type Tap = "post" | "law" | "send" | "message" | "save" | "more" | null;
type Carry = "off" | "in" | "drop";
type Edit = "idle" | "typing" | "done";

/* The dark print the pieces are set on */
const Print = ({ size, children }: { size: { w: number; h: number }; children: React.ReactNode }) => (
  <div className="relative w-full overflow-hidden rounded-xl bg-[#062D2C] shadow-xl" style={{ aspectRatio: `${size.w} / ${size.h}` }}>
    <img src="/central-park.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
    <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.74)" }} />
    <ScaledScreen w={size.w} h={size.h}>{children}</ScaledScreen>
  </div>
);

/* Something rising in from below; it sinks away when it's done */
const Rise = ({ on, style, z, children }: { on: boolean; style: React.CSSProperties; z: number; children: React.ReactNode }) => (
  <div
    className="pointer-events-none absolute"
    style={{
      ...style,
      zIndex: z,
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0)" : "translateY(64px)",
      transition: on ? "opacity 320ms ease 120ms, transform 680ms var(--ease-out) 120ms" : "opacity 220ms ease, transform 320ms ease",
    }}
  >
    {children}
  </div>
);

/* A chapter's piece: white, lifted off the print, its bottom past the frame */
const Piece = ({ on, place, children }: { on: boolean; place: Place; children: React.ReactNode }) => (
  <Rise on={on} z={10} style={{ left: place.left, right: place.right, top: place.top, bottom: -48 }}>
    <div className="h-full overflow-hidden rounded-2xl bg-white text-left" style={{ boxShadow: LIFT, fontFamily: FIGTREE }}>
      {children}
    </div>
  </Rise>
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
const Mail = ({ compact, children }: { compact: boolean; children: React.ReactNode }) => (
  <div className={compact ? "px-5 pb-6 pt-3.5" : "px-7 pb-8 pt-5"} style={{ fontFamily: ARIAL }}>
    <img src="/logo.png" alt="" className={compact ? "mb-3" : "mb-4"} style={{ height: compact ? 19 : 24, width: "auto" }} />
    {children}
  </div>
);
const para = (compact: boolean): React.CSSProperties => ({ fontSize: compact ? 14 : 15, lineHeight: 1.7 });
const MailButton = ({ compact, children }: { compact: boolean; children: React.ReactNode }) => (
  <span className="mt-1 inline-block rounded-md bg-[#309E96] font-semibold text-white" style={{ padding: compact ? "10px 18px" : "11px 22px", fontSize: compact ? 14 : 15 }}>
    {children}
  </span>
);
const Role = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-md bg-[#F3F4F6] px-1.5 text-[12.5px] font-medium leading-[22px] text-[#374151]">{children}</span>
);
const RING_ON = "0 0 0 1px #309E96, 0 0 0 4px rgba(48,158,150,0.14)";
const RING_OFF = "0 0 0 0 rgba(48,158,150,0)";

/* 1. The client check-in as the attorney writes it: the words typed in
   (the full text held underneath, so nothing below moves), then Save */
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
      <Mail compact={compact}>
        <p className="mb-3 text-[#374151]" style={para(compact)}>Hi <FillIn>First name</FillIn>,</p>
        <p className="relative -mx-1.5 mb-3 rounded-[4px] px-1.5 text-[#374151]" style={{ ...para(compact), boxShadow: writing ? RING_ON : RING_OFF, transition: "box-shadow 180ms ease" }}>
          <span className="invisible">{CHECKIN_TYPED}</span>
          <span className="absolute inset-0 px-1.5">
            {CHECKIN_TYPED.slice(0, typed)}
            {writing && <span className="ml-px inline-block h-[15px] w-px translate-y-[2px] bg-[#1F2933]" />}
          </span>
        </p>
        <MailButton compact={compact}>Let us know what’s changed</MailButton>
      </Mail>
    </>
  );
};

/* 1, then: the month the check-in fills, each client on their own day */
const CheckInMonth = ({ chips, compact }: { chips: number; compact: boolean }) => {
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
                    transition: "opacity 220ms ease, transform 300ms var(--ease-out)",
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

/* 2. Dashboard content: the "Upload article" field, a plain grey row (teal
   while the article is over it), which opens downward to the new article, loading first, then
   posted; under it the firm's past posts, small, pushed down as it opens.
   step: 0 waiting, 1 loading, 2 the article, 3 posted */
const PastPost = ({ a, compact, last }: { a: (typeof PAST)[number]; compact: boolean; last: boolean }) => (
  <div className={`flex items-center gap-4 py-3 ${last ? "" : "border-b border-[#F0F1F3]"}`}>
    <img src={a.img} alt="" className="flex-shrink-0 rounded-lg object-cover" style={{ width: compact ? 84 : 112, height: compact ? 60 : 72, objectPosition: a.pos }} />
    <span className="min-w-0 flex-1">
      <span className={`block text-[14px] font-medium leading-snug text-[#1F2933] ${compact ? "" : "truncate"}`}>{a.title}</span>
      {!compact && <span className="mt-0.5 block truncate text-[12.5px] text-[#6B7280]">{a.body}</span>}
      <span className="mt-1 block text-[12.5px] text-[#9CA3AF]">{a.date}</span>
    </span>
    <WIcon name="more" className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
  </div>
);
const ArticleFeed = ({ step, over, tap, compact, dropRef }: { step: number; over: boolean; tap: Tap; compact: boolean; dropRef: React.RefObject<HTMLDivElement> }) => {
  const open = step >= 1;
  const fold = (on: boolean): React.CSSProperties => ({ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", transition: "grid-template-rows 560ms cubic-bezier(0.77, 0, 0.175, 1)" });
  const bar = "rounded-full bg-[#EEF0F2]";
  return (
    <>
      <Bar title="Dashboard content" compact={compact} />
      <div className={compact ? "px-5 pt-5" : "px-7 pt-6"}>
        <div style={fold(!open)}>
          <div className="min-h-0 overflow-hidden">
            <div
              ref={dropRef}
              className="flex items-center justify-center gap-2.5 rounded-xl"
              style={{
                height: compact ? 64 : 72,
                background: over ? "#E6F5F4" : "#F3F4F6",
                color: over ? "#0F7673" : "#4B5563",
                transition: "background-color 200ms ease, color 200ms ease",
              }}
            >
              <UploadIcon className="h-[18px] w-[18px]" />
              <span className="text-[15px] font-medium">Upload article</span>
            </div>
          </div>
        </div>
        <div style={fold(open)}>
          <div className="min-h-0 overflow-hidden">
            <div className={`rounded-2xl border border-[#E5E7EB] bg-white ${compact ? "p-3.5" : "p-4"}`}>
              <div className="relative overflow-hidden rounded-xl bg-[#EEF0F2]" style={{ height: compact ? 150 : 196 }}>
                {step >= 2 && (
                  <Appear className="absolute inset-0">
                    <img src={NEWS.img} alt="" className="h-full w-full object-cover" style={{ objectPosition: NEWS.pos }} />
                  </Appear>
                )}
                {step === 1 && <div className="absolute inset-0 animate-pulse bg-[#E5E7EB]" />}
              </div>
              <div className="px-1 pt-4" style={{ minHeight: compact ? 104 : 92 }}>
                {step === 1 ? (
                  <div className="animate-pulse">
                    <div className={`${bar} h-2.5 w-24`} />
                    <div className={`${bar} mt-3 h-4 w-3/4`} />
                    <div className={`${bar} mt-3 h-3 w-full`} />
                  </div>
                ) : (
                  <Appear>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F7673]">Tax updates</p>
                    <p className="mt-1.5 font-semibold text-[#1F2933]" style={{ fontSize: compact ? 18 : 20, lineHeight: 1.3, fontFamily: MERRIWEATHER }}>{NEWS.title}</p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#4B5563]">{NEWS.body}</p>
                  </Appear>
                )}
              </div>
              <div className="mt-3 flex min-h-[44px] items-center px-1">
                {step === 2 && (
                  <Appear>
                    <span className="inline-flex h-11 items-center rounded-[10px] bg-[#128F8B] px-5 text-[15px] font-semibold text-white" style={tapStyle(tap === "post")}>
                      Post to clients’ dashboards
                    </span>
                  </Appear>
                )}
                {step === 3 && (
                  <Appear className="flex items-center gap-2 text-[15px] font-medium text-[#0F7673]">
                    <CheckIcon className="h-4 w-4" />
                    Posted to 48 clients’ dashboards
                  </Appear>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Posted</p>
        <div className="mt-1">
          {PAST.map((a, i) => (
            <PastPost key={a.title} a={a} compact={compact} last={i === PAST.length - 1} />
          ))}
        </div>
      </div>
    </>
  );
};

/* 2. The firm's article as it sits on the firm's own site */
const Article = ({ compact }: { compact: boolean }) => (
  <div className="overflow-hidden rounded-xl bg-white text-left" style={{ width: compact ? 232 : 280, boxShadow: "0 30px 70px rgba(0,0,0,0.42), 0 3px 10px rgba(0,0,0,0.16)", fontFamily: FIGTREE }}>
    <img src={NEWS.img} alt="" className="block w-full object-cover" style={{ height: compact ? 92 : 116, objectPosition: NEWS.pos }} />
    <div className="px-4 pb-4 pt-3">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#0F7673]">Tax updates</p>
      <p className="mt-1 text-[15px] font-semibold leading-snug text-[#1F2933]" style={{ fontFamily: MERRIWEATHER }}>{NEWS.title}</p>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 rounded-full bg-[#EEF0F2]" />
        <div className="h-1.5 w-11/12 rounded-full bg-[#EEF0F2]" />
        <div className="h-1.5 w-2/3 rounded-full bg-[#EEF0F2]" />
      </div>
    </div>
  </div>
);

/* 3. The update as a notification: its line, then "See more" opens it. Top
   to bottom: the update, then the clients to reach out to (View clients
   would list them; the film doesn't open it), and beside them on wide
   screens the suggested email as it would go out. Send at the foot. Each
   part arrives just after the card has made room */
const LawNotice = ({ open, sent, tap, compact }: { open: boolean; sent: boolean; tap: Tap; compact: boolean }) => {
  const n = AFFECTED.length;
  const update = (
    <div>
      <Label>The update</Label>
      <p className="mt-2 text-[#1F2933]" style={{ fontSize: compact ? 14 : 15, lineHeight: 1.5 }}>
        New York’s estate tax exemption changes on January 1. Willow read it against all {LAW_PLANS} {compact ? "plans" : "of your clients’ plans"}.
      </p>
    </div>
  );
  const viewClients = <span className="inline-flex h-[32px] flex-shrink-0 items-center rounded-md border border-[#309E96] px-3 text-[13px] font-semibold text-[#0F7673]">View clients</span>;
  const clients = (
    <div>
      <Label>We suggest reaching out to</Label>
      <div className="mt-2.5 flex items-center gap-3">
        <span className="flex flex-shrink-0">
          {AFFECTED.map((a, i) => (
            <span
              key={a.name}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F5F4] text-[11px] font-semibold text-[#0C7370]"
              style={{ marginLeft: i ? -8 : 0, boxShadow: "0 0 0 2px #FFFFFF" }}
            >
              {a.initials}
            </span>
          ))}
        </span>
        <span className="min-w-0 flex-1 leading-snug">
          <span className="block font-medium text-[#1F2933]" style={{ fontSize: compact ? 14 : 14.5 }}>{n} clients</span>
          <span className="block text-[#6B7280]" style={{ fontSize: compact ? 12.5 : 13 }}>{compact ? "may be affected" : "whose plans this may affect"}</span>
        </span>
        {compact && viewClients}
      </div>
      {!compact && <div className="mt-3">{viewClients}</div>}
    </div>
  );
  const email = (
    <div>
      <Label>Suggested email</Label>
      <div className="mt-2.5 overflow-hidden rounded-xl border border-[#E5E7EB]">
        <div className="border-b border-[#EEF0F2] px-4 py-2.5">
          <p className="text-[12.5px] text-[#6B7280]">To {n} clients</p>
          <p className="mt-0.5 font-semibold text-[#1F2933]" style={{ fontSize: compact ? 13.5 : 14 }}>New York’s estate tax is changing for 2027</p>
        </div>
        <div className="px-4 pb-4 pt-3" style={{ fontFamily: ARIAL }}>
          {!compact && <img src="/logo.png" alt="" className="mb-2.5" style={{ height: 18, width: "auto" }} />}
          <p className="text-[#374151]" style={{ fontSize: compact ? 13 : 13.5, lineHeight: 1.6 }}>Hi <FillIn>First name</FillIn>,</p>
          <p className="mt-2 text-[#374151]" style={{ fontSize: compact ? 13 : 13.5, lineHeight: 1.6 }}>
            New York’s estate tax exemption changes on January 1. I’ve looked at your plan, and it may affect you. I’d like to walk you through it.
          </p>
          {!compact && <span className="mt-3 inline-block rounded-md bg-[#309E96] px-3.5 py-2 text-[13px] font-semibold text-white">Book a meeting</span>}
        </div>
      </div>
    </div>
  );
  return (
    <div className="overflow-hidden rounded-2xl bg-white text-left" style={{ boxShadow: LIFT, fontFamily: FIGTREE }}>
      <div className={`flex items-center gap-3.5 ${compact ? "px-5 py-4" : "px-7 py-5"}`}>
        <NotificationIcon className="h-5 w-5 flex-shrink-0 text-[#128F8B]" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug text-[#1F2933]" style={{ fontSize: compact ? 15.5 : 17 }}>New York tax update: changes may affect {n} clients</p>
          <p className="mt-0.5 leading-snug text-[#6B7280]" style={{ fontSize: compact ? 13.5 : 14 }}>Suggested email ready</p>
        </div>
        <span className="flex flex-shrink-0 items-center gap-1 rounded px-1 font-medium text-[#0C7370]" style={{ fontSize: compact ? 14 : 14.5, ...tapStyle(tap === "law") }}>
          {open ? "See less" : "See more"}
          <ChevronDownIcon className="h-4 w-4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 300ms var(--ease-out)" }} />
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 560ms var(--ease-in-out)" }}>
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-[#EEF0F2]">
            {compact ? (
              <div className="space-y-3.5 px-5 py-4">
                <Reveal open={open} i={0}>{update}</Reveal>
                <Reveal open={open} i={1}>{clients}</Reveal>
                <Reveal open={open} i={2}>{email}</Reveal>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_1.15fr]">
                <div className="space-y-6 border-r border-[#EEF0F2] px-7 py-6">
                  <Reveal open={open} i={0}>{update}</Reveal>
                  <Reveal open={open} i={1}>{clients}</Reveal>
                </div>
                <div className="px-7 py-6">
                  <Reveal open={open} i={2}>{email}</Reveal>
                </div>
              </div>
            )}
            <Reveal open={open} i={3}>
              <div className={`flex items-center justify-end gap-4 border-t border-[#EEF0F2] ${compact ? "px-5 py-3" : "px-7 py-3.5"}`}>
                <span className="text-[13.5px] font-medium text-[#6B7280]">Edit email</span>
                <span
                  className="inline-flex h-[36px] items-center gap-1.5 rounded-md px-4 text-[14px] font-semibold"
                  style={{ background: sent ? "#E6F5F4" : "#309E96", color: sent ? "#0F7673" : "#FFFFFF", ...tapStyle(tap === "send"), transition: "background-color 200ms ease, color 200ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease" }}
                >
                  {sent && <CheckIcon className="h-4 w-4" />}
                  {sent ? `Sent to ${n} clients` : `Send to ${n} clients`}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 4. The yearly note to the executors and guardians a plan names (the
   product's "Note to executors & guardians" card, its default words), with a
   line typed on that offers them a plan of their own */
const TeamCheckIn = ({ edit, typed, saved, tap, compact }: { edit: Edit; typed: number; saved: boolean; tap: Tap; compact: boolean }) => {
  const dirty = edit !== "idle" && !saved;
  const ring = edit === "typing" || tap === "message";
  return (
    <>
      <Bar title="Note to executors & guardians" compact={compact}>
        <span
          className="inline-flex h-[34px] items-center rounded-md px-[13px] text-[13.5px] font-semibold"
          style={{ background: dirty ? "#309E96" : "#F3F4F6", color: dirty ? "#FFFFFF" : "#9CA3AF", ...tapStyle(tap === "save"), transition: "background-color 200ms ease, color 200ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease" }}
        >
          Save
        </span>
      </Bar>
      <EmailHead
        compact={compact}
        when={compact ? "Sends automatically after 1 month" : "Sends automatically after 1 month, then once a year"}
        subject={<>Checking in on <FillIn>Client’s name</FillIn>’s estate plan</>}
        to={<><Role>Executor</Role><Role>Guardian</Role>{!compact && <Role>Trustee</Role>}</>}
      />
      <Mail compact={compact}>
        <p className="mb-3 text-[#374151]" style={para(compact)}>Hi <FillIn>First name</FillIn>,</p>
        <p className="mb-3 text-[#374151]" style={para(compact)}>
          I’m <FillIn>Your name</FillIn>, <FillIn>Client’s name</FillIn>’s estate planning attorney. They’ve named you as <FillIn>Role</FillIn> in their plan, a real vote of confidence, and nothing you need to do today.
        </p>
        <p className="-mx-1.5 mb-3 rounded-[4px] px-1.5 text-[#374151]" style={{ ...para(compact), boxShadow: ring ? RING_ON : RING_OFF, transition: "box-shadow 180ms ease" }}>
          If you’d like to understand what the role involves, I’m happy to walk you through it.
          {edit === "typing" && (
            <>
              {TEAM_TYPED.slice(0, typed)}
              <span className="ml-px inline-block h-[15px] w-px translate-y-[2px] bg-[#1F2933]" />
            </>
          )}
          {edit === "done" && TEAM_TYPED}
        </p>
        <MailButton compact={compact}>Book a meeting</MailButton>
      </Mail>
    </>
  );
};

/* 4. The executor's request, in the hero's notification card: its title
   line, then "See more" opens it. Each part arrives just after the card has
   made room, the people last, one by one */
const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">{children}</p>
);
const Reveal = ({ open, i, children }: { open: boolean; i: number; children: React.ReactNode }) => (
  <div
    style={{
      opacity: open ? 1 : 0,
      transform: open ? "translateY(0)" : "translateY(8px)",
      transition: open ? `opacity 320ms ease ${220 + i * 110}ms, transform 420ms var(--ease-out) ${220 + i * 110}ms` : "none",
    }}
  >
    {children}
  </div>
);
const RequestMeeting = ({ compact }: { compact: boolean }) => (
  <div>
    <Label>Meeting</Label>
    <div className={`${compact ? "mt-2" : "mt-2.5"} flex items-center gap-3`}>
      <CalendarCheckIcon className="h-5 w-5 flex-shrink-0 text-[#128F8B]" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[#1F2933]" style={{ fontSize: compact ? 14.5 : 15.5 }}>Thursday, December 3</p>
        <p className="text-[#6B7280]" style={{ fontSize: compact ? 13 : 14 }}>10:00 AM · 30 minutes</p>
      </div>
      <span className="flex flex-shrink-0 items-center gap-1.5 font-medium text-[#374151]" style={{ fontSize: compact ? 13 : 14 }}>
        <ZoomLogo className="h-5 w-5" />
        Zoom
      </span>
    </div>
  </div>
);
const RequestNote = ({ compact }: { compact: boolean }) => (
  <div>
    <Label>Note from Maria</Label>
    <p className={`${compact ? "mt-2" : "mt-2.5"} rounded-xl bg-[#E6F5F4] px-4 py-3 font-medium text-[#1F2933]`} style={{ fontSize: compact ? 14.5 : 15.5, lineHeight: 1.45 }}>
      &ldquo;{MARIA_NOTE}&rdquo;
    </p>
  </div>
);
const RequestInvited = ({ open, compact, from }: { open: boolean; compact: boolean; from: number }) => (
  <div>
    <Label>Invited</Label>
    <div className={compact ? "mt-2 space-y-2" : "mt-2.5 space-y-3"}>
      {INVITED.map((p, i) => (
        <Reveal key={p.name} open={open} i={from + i}>
          <div className="flex items-center gap-3">
            <span className={`flex flex-shrink-0 items-center justify-center rounded-full bg-[#E6F5F4] text-[11px] font-semibold text-[#0C7370] ${compact ? "h-7 w-7" : "h-8 w-8"}`}>{p.initials}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-[#1F2933]" style={{ fontSize: compact ? 14 : 14.5 }}>{p.name}</span>
              <span className="block text-[#6B7280]" style={{ fontSize: compact ? 12.5 : 13 }}>{p.about}</span>
            </span>
            {p.asked ? (
              <span className="flex-shrink-0 text-[12.5px] text-[#9CA3AF]">Asked for access</span>
            ) : (
              <span className="flex flex-shrink-0 items-center gap-1 text-[13px] font-medium text-[#128F8B]">
                <CheckIcon className="h-3.5 w-3.5" />
                Invited
              </span>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);
const AccessRequest = ({ open, tap, compact }: { open: boolean; tap: Tap; compact: boolean }) => (
  <div className="overflow-hidden rounded-2xl bg-white text-left" style={{ boxShadow: LIFT, fontFamily: FIGTREE }}>
    <div className={`flex items-center gap-3.5 ${compact ? "px-5 py-4" : "px-7 py-5"}`}>
      <NotificationIcon className="h-5 w-5 flex-shrink-0 text-[#128F8B]" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug text-[#1F2933]" style={{ fontSize: compact ? 15.5 : 17 }}>Maria Rosen requested access to Daniel’s plan</p>
        <p className="mt-0.5 leading-snug text-[#6B7280]" style={{ fontSize: compact ? 13.5 : 14 }}>
          {compact ? "Daniel has passed away" : "Daniel has passed away · Meeting booked for Dec 3"}
        </p>
      </div>
      <span className="flex flex-shrink-0 items-center gap-1 rounded px-1 font-medium text-[#0C7370]" style={{ fontSize: compact ? 14 : 14.5, ...tapStyle(tap === "more") }}>
        {open ? "See less" : "See more"}
        <ChevronDownIcon className="h-4 w-4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 300ms var(--ease-out)" }} />
      </span>
    </div>
    <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 560ms var(--ease-in-out)" }}>
      <div className="min-h-0 overflow-hidden">
        <div className="border-t border-[#EEF0F2]">
          <Reveal open={open} i={0}>
            <p className={`border-b border-[#EEF0F2] bg-[#F8FAFC] text-[#4B5563] ${compact ? "px-5 py-2.5" : "px-7 py-3.5"}`} style={{ fontSize: compact ? 13.5 : 14.5, textWrap: "balance" } as React.CSSProperties}>
              You asked to meet first. Grant access once you’ve met Maria.
            </p>
          </Reveal>
          {compact ? (
            <div className="space-y-4 px-5 py-4">
              <Reveal open={open} i={1}><RequestMeeting compact /></Reveal>
              <Reveal open={open} i={2}><RequestNote compact /></Reveal>
              <RequestInvited open={open} compact from={3} />
            </div>
          ) : (
            <div className="grid grid-cols-[1.1fr_1fr]">
              <div className="space-y-6 border-r border-[#EEF0F2] px-7 py-6">
                <Reveal open={open} i={1}><RequestMeeting compact={false} /></Reveal>
                <Reveal open={open} i={2}><RequestNote compact={false} /></Reveal>
              </div>
              <div className="px-7 py-6">
                <RequestInvited open={open} compact={false} from={3} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const KeepInTouchFilm = ({ chapter, replay, onChapter, onStart, clock, rewatch = false }: FilmProps) => {
  const compact = useCompact();
  const size = compact ? COMPACT : WIDE;
  const place = compact ? PLACE_COMPACT : PLACE_WIDE;

  const frameRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const doneKey = useRef("");
  /* The chapters that have started playing, and the last click we've seen */
  const played = useRef(new Set<number>());
  const lastReplay = useRef(replay);
  const callbacks = useRef({ onChapter, onStart });
  callbacks.current = { onChapter, onStart };

  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(-1);
  const [tap, setTap] = useState<Tap>(null);
  const [checkTyped, setCheckTyped] = useState(0);
  const [checkSaved, setCheckSaved] = useState(false);
  const [filed, setFiled] = useState(false);
  const [chips, setChips] = useState(0);
  const [news, setNews] = useState(0);
  const [over, setOver] = useState(false);
  const [carry, setCarry] = useState<Carry>("off");
  const [fieldAt, setFieldAt] = useState({ x: 0, y: 0 });
  const [teamEdit, setTeamEdit] = useState<Edit>("idle");
  const [teamTyped, setTeamTyped] = useState(0);
  const [saved, setSaved] = useState(false);
  const [request, setRequest] = useState(false);
  const [lawOpen, setLawOpen] = useState(false);
  const [lawSent, setLawSent] = useState(false);

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

  useEffect(() => {
    /* Every chapter's pieces at their start (c = -1), or chapter c's at its
       last frame */
    const settle = (c: number) => {
      setTap(null);
      setCheckTyped(c === 0 ? CHECKIN_TYPED.length : 0);
      setCheckSaved(c === 0);
      setFiled(c === 0);
      setChips(c === 0 ? CHECKINS.length : 0);
      setNews(c === 1 ? 3 : 0);
      setOver(false);
      setCarry("off");
      setLawOpen(c === 2);
      setLawSent(c === 2);
      setTeamEdit(c === 3 ? "done" : "idle");
      setTeamTyped(0);
      setSaved(c === 3);
      setRequest(c === 4);
    };

    const key = `${chapter}:${replay}:${compact}`;
    /* A click on the chapter list (replay changes) */
    const clicked = replay !== lastReplay.current;
    lastReplay.current = replay;
    if (doneKey.current === key) return;

    /* A chapter already seen, opened again from the list, goes straight to its
       last frame and stays there. People who prefer reduced motion get every
       chapter that way */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || (clicked && !rewatch && played.current.has(chapter))) {
      doneKey.current = key;
      settle(chapter);
      setShown(chapter);
      callbacks.current.onStart(0);
      return;
    }
    if (!inView) return;
    played.current.add(chapter);

    const R = compact ? COMPACT : WIDE;
    let live = true;
    const wait = makeWait(clock, () => live);
    const tapOn = async (name: Exclude<Tap, null>, after: () => void) => {
      setTap(name);
      await wait(TAP);
      after();
      setTap(null);
    };
    /* Where an element sits, in the film's own coordinates */
    const centre = (el: Element | null) => {
      const r0 = rootRef.current;
      if (!el || !r0) return { x: R.w / 2, y: R.h / 2 };
      const s = r0.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = s.width / R.w;
      return { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    };

    const chapters: (() => Promise<void>)[] = [
      /* 1. The attorney writes the check-in and saves it; it folds into the
         month, which fills with each client's date */
      async () => {
        await wait(C1.read);
        for (let n = 1; n <= CHECKIN_TYPED.length; n++) {
          setCheckTyped(n);
          await wait(C1.perChar);
        }
        await wait(C1.after);
        await tapOn("save", () => setCheckSaved(true));
        await wait(C1.fold);
        setFiled(true);
        await wait(C1.land);
        for (let n = 1; n <= CHECKINS.length; n++) {
          setChips(n);
          await wait(C1.chip);
        }
        await wait(C1.hold);
      },
      /* 2. The firm's article goes onto every client's dashboard */
      async () => {
        await wait(C2.rest);
        setFieldAt(centre(fieldRef.current));
        setCarry("in");
        await wait(C2.carry);
        setOver(true);
        await wait(C2.over);
        setCarry("drop");
        setOver(false);
        setNews(1);
        await wait(C2.loading);
        setNews(2);
        await wait(C2.preview);
        await tapOn("post", () => setNews(3));
        await wait(C2.hold);
      },
      /* 3. The update arrives as a notification; it opens to who it may
         affect and the suggested email, sent to all of them */
      async () => {
        await wait(CL.read);
        await tapOn("law", () => setLawOpen(true));
        await wait(CL.open);
        await tapOn("send", () => setLawSent(true));
        await wait(CL.sent);
      },
      /* 4. A line of the attorney's own onto the executors' yearly note */
      async () => {
        await wait(C3.read);
        await tapOn("message", () => setTeamEdit("typing"));
        for (let n = 1; n <= TEAM_TYPED.length; n++) {
          setTeamTyped(n);
          await wait(C3.perChar);
        }
        await wait(C3.after);
        setTeamEdit("done");
        await wait(C3.beforeSave);
        await tapOn("save", () => setSaved(true));
        await wait(C3.hold);
      },
      /* 5. The executor's request arrives; it opens to the meeting she
         booked, her note, and everyone invited */
      async () => {
        await wait(C4.read);
        await tapOn("more", () => setRequest(true));
        await wait(C4.hold);
      },
    ];

    settle(-1);
    setShown(chapter);
    callbacks.current.onStart(KEEP_MS[chapter]);
    chapters[chapter]()
      .then(() => {
        if (!live) return;
        doneKey.current = key;
        if (chapter < KEEP_CHAPTERS - 1) callbacks.current.onChapter(chapter + 1);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [chapter, replay, inView, compact, clock, rewatch]);

  /* The article: off the right edge, carried over the link field, then into it */
  const art = (() => {
    if (carry === "off") return { x: size.w + 200, y: size.h * 0.7, r: 10, s: 1, o: 1, t: "none" };
    if (carry === "in") return { x: fieldAt.x + (compact ? 0 : 90), y: fieldAt.y - 6, r: -2, s: 0.94, o: 1, t: `transform 950ms ${MOVE}` };
    return { x: fieldAt.x, y: fieldAt.y, r: 0, s: 0.18, o: 0, t: "transform 380ms var(--ease-in-out), opacity 260ms ease 100ms" };
  })();
  /* The check-in folds from its top centre into the first client's day */
  const fold = (() => {
    const cell = CHECKINS[0].day - 1 + MONTH.lead;
    const colW = (size.w - place.left - place.right) / 7;
    const x = place.left + colW * ((cell % 7) + 0.5);
    const y = place.top + CAL.head + CAL.week + (compact ? CAL.rowCompact : CAL.row) * (Math.floor(cell / 7) + 0.5);
    const s = 0.1;
    const h = size.h + 48 - place.top;
    return { x: x - size.w / 2, y: y - place.top - (h * s) / 2, s };
  })();

  return (
    <div
      ref={frameRef}
      className="min-w-0"
      role="img"
      aria-label="Willow sends the check-in the attorney writes to every client once a year, each on their own date, posts the firm's articles to every client's dashboard, tells the attorney when a tax update may affect clients, suggests whom to reach out to and the email to send, writes every year to the executors and guardians each plan names, and when a client passes and the executor asks for access, shows the meeting she booked first, her note, and the family invited with her."
    >
      <Print size={size}>
        <div ref={rootRef} aria-hidden className="relative overflow-hidden" style={{ width: size.w, height: size.h }}>
          {/* 1. The month, rising behind the check-in as it folds in */}
          <Rise on={shown === 0 && filed} z={9} style={{ left: place.left, right: place.right, top: place.top, bottom: -48 }}>
            <div className="h-full overflow-hidden rounded-2xl bg-white text-left" style={{ boxShadow: LIFT, fontFamily: FIGTREE }}>
              <CheckInMonth chips={chips} compact={compact} />
            </div>
          </Rise>
          <div
            className="pointer-events-none absolute"
            style={{
              left: place.left,
              right: place.right,
              top: place.top,
              bottom: -48,
              zIndex: 11,
              transformOrigin: "50% 0",
              opacity: shown === 0 && !filed ? 1 : 0,
              transform: shown !== 0 ? "translateY(64px)" : filed ? `translate(${fold.x}px, ${fold.y}px) scale(${fold.s})` : "translateY(0)",
              transition:
                shown !== 0
                  ? "opacity 220ms ease, transform 320ms ease"
                  : filed
                    ? "transform 640ms var(--ease-in-out), opacity 220ms ease 440ms"
                    : "opacity 320ms ease 120ms, transform 680ms var(--ease-out) 120ms",
            }}
          >
            <div className="h-full overflow-hidden rounded-2xl bg-white text-left" style={{ boxShadow: LIFT, fontFamily: FIGTREE }}>
              <ClientCheckIn typed={checkTyped} saved={checkSaved} tap={tap} compact={compact} />
            </div>
          </div>
          <Piece on={shown === 1} place={place}>
            <ArticleFeed step={news} over={over} tap={tap} compact={compact} dropRef={fieldRef} />
          </Piece>
          {/* 3. The update, placed so it sits in the middle once opened */}
          <Rise on={shown === 2} z={10} style={{ left: 0, right: 0, top: compact ? 41 : 96 }}>
            <div className="mx-auto" style={{ width: compact ? LAW_W.compact : LAW_W.wide }}>
              <LawNotice open={lawOpen} sent={lawSent} tap={tap} compact={compact} />
            </div>
          </Rise>
          <Piece on={shown === 3} place={place}>
            <TeamCheckIn edit={teamEdit} typed={teamTyped} saved={saved} tap={tap} compact={compact} />
          </Piece>
          {/* 5. The request, placed so it sits in the middle once opened */}
          <Rise on={shown === 4} z={10} style={{ left: 0, right: 0, top: compact ? 40 : 141 }}>
            <div className="mx-auto" style={{ width: compact ? REQUEST_W.compact : REQUEST_W.wide }}>
              <AccessRequest open={request} tap={tap} compact={compact} />
            </div>
          </Rise>

          {/* 2. The article, carried in from the right */}
          <div
            className="pointer-events-none absolute left-0 top-0 z-40"
            style={{ opacity: shown === 1 ? art.o : 0, transform: `translate(${art.x}px, ${art.y}px) translate(-50%, -50%) rotate(${art.r}deg) scale(${art.s})`, transition: art.t }}
          >
            <Article compact={compact} />
          </div>

        </div>
      </Print>
    </div>
  );
};

export default KeepInTouchFilm;
