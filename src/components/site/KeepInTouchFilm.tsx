import React, { useEffect, useRef, useState } from "react";
import { ProBellIcon, ScaledScreen, WIcon } from "@/components/product/kit";
import { ProReminder } from "@/components/product/attorney-dashboard";
import { CheckInSheet } from "@/components/product/client-app";
import { CalendarCheckIcon, CheckIcon, ChevronLeftIcon, UploadIcon, ViewIcon } from "@/components/product/willow-icons";
import { Appear, FIGTREE, FillIn, MOVE, makeWait, tapStyle, useCompact, type FilmProps } from "@/components/site/film-kit";

/* "A practice families keep coming back to": four chapters, each one piece of
   the product set on a dark print. The piece rises in from below and runs off
   the bottom edge, with room left, right and above, so it reads as something
   placed in the frame rather than a screenshot of a whole screen.
   1. The client check-in email (touchpoints.ts DEFAULTS.maintenance_survey),
      with fill-ins for the names. "Preview survey" opens the check-in
      conversation the client gets (the clients app's ChatSheet, which the
      attorney's survey preview shows, survey-preview.tsx) and steps to its
      second question.
   2. Dashboard content as Aaron designed it (Nov 24): an "Upload article"
      box over the firm's past posts, each small with its image on the left.
      The new article drops into the box, which opens downward to it, image
      on top and words under, pushing the past posts down and off the frame;
      then it's posted to clients' dashboards. In the product
      (dashboard-content.tsx) the attorney pastes the article's link, Willow
      reads its headline and blurb, and posts carry no image.
   3. The professional check-in to the client's financial advisor and
      accountant (DEFAULTS.maintenance_checkin), a sentence typed onto it and
      saved.
   4. The dashboard's Required actions: Maria, Daniel's executor, asks to meet
      about his plan; the attorney books the time in the access request popup
      (reminders-bell.tsx AccessRequestModal); the row moves through the
      product's own titles to "Release access to Daniel's plan?"
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

/* Chapter 2's article (the page's own placeholder headline) and the firm's
   earlier posts. The pictures are stand-ins until the photos are chosen */
const NEWS = { title: "What the new estate tax threshold means", body: "How it affects your plan, and whether you need to do anything.", date: "November 24, 2026", img: "/hudson-bridge.jpg" };
const PAST = [
  { title: "How often you should update your estate plan", body: "Life changes, and your plan should too. Here’s when it’s worth a second look.", date: "October 20, 2026", img: "/willow-street.jpg" },
  { title: "Choosing the right executor", body: "What the role asks of someone, and how to pick the right person.", date: "September 22, 2026", img: "/williamsburg.jpg" },
  { title: "Why the way your home is titled matters", body: "How a deed fits with the rest of your estate plan.", date: "August 18, 2026", img: "/florida-coast.jpg" },
];

/* Chapter 3: what the attorney types onto the advisors' check-in */
const TEAM_TYPED = " If anything changes on your side, I’d be glad to hear from you.";

/* Chapter 4: the access request popup's times (the attorney's open hours) */
const DAYS = ["Tue, Dec 1", "Wed, Dec 2", "Thu, Dec 3", "Fri, Dec 4"];
const SLOTS = ["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];
const MEETING = `${DAYS[2]} · ${SLOTS[1]}`;
/* The row's titles as fetchDeathReminders writes them, for a request made by
   asking to meet: before a time is booked, before the meeting, after it */
const ACCESS_ROW = {
  asked: { title: "Maria Rosen asked to meet about Daniel’s plan", sub: "Reach out to Maria and book a time", cta: "Book a time" },
  booked: { title: "Upcoming meeting with Maria Rosen", sub: `${MEETING} · About Daniel’s plan`, cta: "View meeting" },
  met: { title: "You met Maria. Release access to Daniel’s plan?", sub: "Look over what Maria sent, then grant or deny access", cta: "Review request" },
};

/* The waits in each chapter's script, so its length is known up front */
const TAP = 190;
const C1 = { read: 2000, sheet: 1700, hold: 2300 };
const C2 = { rest: 900, carry: 950, over: 300, loading: 900, preview: 1700, hold: 2200 };
const C3 = { read: 1500, perChar: 32, after: 250, beforeSave: 450, hold: 1900 };
const C4 = { rest: 700, row: 1200, modal: 900, pick: 600, day: 350, slot: 450, booked: 1100, upcoming: 1300, hold: 2200 };

export const KEEP_CHAPTERS = 4;
/** How long each chapter runs at normal speed */
export const KEEP_MS = [
  C1.read + TAP + C1.sheet + TAP + C1.hold,
  C2.rest + C2.carry + C2.over + C2.loading + C2.preview + TAP + C2.hold,
  C3.read + TAP + TEAM_TYPED.length * C3.perChar + C3.after + C3.beforeSave + TAP + C3.hold,
  C4.rest + C4.row + TAP + C4.modal + TAP + C4.pick + TAP + C4.day + TAP + C4.slot + TAP + C4.booked + C4.upcoming + C4.hold,
];

type Tap = "preview" | "next" | "post" | "message" | "save" | "book" | "pick" | "day" | "slot" | "bookit" | null;
type Carry = "off" | "in" | "drop";
type Access = "none" | "asked" | "booked" | "met";
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

/* 1. The client check-in, and the button that previews its survey */
const ClientCheckIn = ({ tap, compact }: { tap: Tap; compact: boolean }) => (
  <>
    <Bar title="Client check-in" compact={compact}>
      <span className="inline-flex h-[34px] items-center gap-1.5 rounded-md border border-[#309E96] bg-white px-3.5 text-[13.5px] font-semibold text-[#0F7673]" style={tapStyle(tap === "preview")}>
        <ViewIcon className="h-4 w-4" />
        Preview survey
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
      <p className="mb-3 text-[#374151]" style={para(compact)}>
        It’s been a while since we finished your estate plan, and I wanted to check in. A plan works best when it keeps up with life: a move, a new grandchild, a change in what you own.
      </p>
      {!compact && (
        <p className="mb-3 text-[#374151]" style={para(compact)}>
          Once a year I ask every client the same short questions; it’s how we make sure your plan still says what you want it to.
        </p>
      )}
      <MailButton compact={compact}>Let us know what’s changed</MailButton>
    </Mail>
  </>
);

/* 2. Dashboard content: the "Upload article" field, a plain grey row (teal
   while the article is over it), which opens downward to the new article, loading first, then
   posted; under it the firm's past posts, small, pushed down as it opens.
   step: 0 waiting, 1 loading, 2 the article, 3 posted */
const PastPost = ({ a, compact, last }: { a: (typeof PAST)[number]; compact: boolean; last: boolean }) => (
  <div className={`flex items-center gap-4 py-3 ${last ? "" : "border-b border-[#F0F1F3]"}`}>
    <img src={a.img} alt="" className="flex-shrink-0 rounded-lg object-cover" style={{ width: compact ? 84 : 112, height: compact ? 60 : 72 }} />
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
                    <img src={NEWS.img} alt="" className="h-full w-full object-cover" />
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
    <img src={NEWS.img} alt="" className="block w-full object-cover" style={{ height: compact ? 92 : 116 }} />
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

/* 3. The professional check-in to the client's advisors, being written */
const TeamCheckIn = ({ edit, typed, saved, tap, compact }: { edit: Edit; typed: number; saved: boolean; tap: Tap; compact: boolean }) => {
  const dirty = edit !== "idle" && !saved;
  const ring = edit === "typing" || tap === "message";
  return (
    <>
      <Bar title="Professional check-in" compact={compact}>
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
        subject={<>Checking in from <FillIn>Your firm</FillIn> on behalf of <FillIn>Client’s name</FillIn></>}
        to={<><Role>Financial advisor</Role><Role>Accountant</Role></>}
      />
      <Mail compact={compact}>
        <p className="mb-3 text-[#374151]" style={para(compact)}>Hi <FillIn>First name</FillIn>,</p>
        <p className="-mx-1.5 mb-3 rounded-[4px] px-1.5 text-[#374151]" style={{ ...para(compact), boxShadow: ring ? RING_ON : RING_OFF, transition: "box-shadow 180ms ease" }}>
          I’m <FillIn>Your name</FillIn>, <FillIn>Client’s name</FillIn>’s estate planning attorney. You’re listed as their <FillIn>Role</FillIn>, so I wanted to make sure we’re in touch.
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

/* 4. The dashboard's Required actions (reminders-column.tsx), the access
   request arriving on top */
const AccessRow = ({ state, tap }: { state: Access; tap: Tap }) => {
  const row = ACCESS_ROW[state === "none" ? "asked" : state];
  return (
    <div style={{ display: "grid", gridTemplateRows: state === "none" ? "0fr" : "1fr", transition: "grid-template-rows 460ms cubic-bezier(0.77, 0, 0.175, 1)" }}>
      <div className="min-h-0 overflow-hidden">
        <div className="flex min-h-[84px] items-center border-b border-[#EEF0F2] bg-[#F0F9F9] px-5 py-4">
          <div className="flex w-full items-stretch gap-3.5">
            <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-[#7FC5BF]" />
            <Appear key={state} className="min-w-0 flex-1">
              <p className="font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{row.title}</p>
              <p className="mt-0.5 text-[13px] text-[#6B7280]">{row.sub}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded text-[13px] font-semibold text-[#309E96]" style={tapStyle(tap === "book" && state === "asked")}>
                {row.cta}
                <WIcon name="arrowRight" className="h-3.5 w-3.5" />
              </span>
            </Appear>
          </div>
        </div>
      </div>
    </div>
  );
};
const RequiredActions = ({ access, tap }: { access: Access; tap: Tap }) => (
  <>
    <div className="flex min-h-[57px] items-center gap-2.5 border-b border-[#EEF0F2] px-5 py-3.5">
      <ProBellIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />
      <h4 className="text-[15px] font-semibold text-[#1F2933]" style={{ fontFamily: FIGTREE }}>Required actions</h4>
      <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[12px] font-semibold text-[#6B7280]">{access === "none" ? 3 : 4}</span>
    </div>
    <AccessRow state={access} tap={tap} />
    <div className="divide-y divide-[#EEF0F2]">
      <ProReminder title="Marcus says something changed" sub="Have you moved, or bought or sold property?" cta="See what changed" />
      <ProReminder title="Elena Ruiz's summary is ready for review" cta="Review summary" />
      <ProReminder title="Sam says something changed" sub="Has your family dynamic changed?" cta="See what changed" />
    </div>
  </>
);

/* 4. The access request popup for a request made by asking to meet: who
   asked and why, where it stands, the meeting (booked here, from the
   attorney's open times), how to reach them, and the decision */
const AccessModal = ({ picking, day, slot, booked, tap, compact }: { picking: boolean; day: number; slot: number; booked: boolean; tap: Tap; compact: boolean }) => {
  const label = (text: string) => <p className="text-[12.5px] font-medium text-[#6B7280]">{text}</p>;
  return (
    <div className={`overflow-hidden rounded-2xl bg-white text-left text-[#1F2933] ${compact ? "p-6" : "p-7"}`} style={{ fontFamily: FIGTREE, boxShadow: LIFT }}>
      <div className="relative">
        <span aria-hidden className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center text-[18px] text-[#C4C9D0]">&times;</span>
        <div className="text-center">
          <h2 className="mx-auto font-semibold text-[#1F2933]" style={{ fontFamily: MERRIWEATHER, fontSize: 24, lineHeight: 1.3 }}>Access to Daniel’s plan</h2>
          <p className="mx-auto text-[#6B7280]" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8, textWrap: "balance" } as React.CSSProperties}>
            Maria Rosen, Daniel’s executor, let us know Daniel has passed away, and is asking for what Daniel held back until then.
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-[13px] text-[#9CA3AF]">
        {booked ? "You asked to meet first. Grant access once you’ve met Maria." : "Maria asked to meet. Reach out, then book the time you agree on."}
      </p>
      <p className="mt-2 text-center text-[13px] text-[#B45309]">
        Granting opens what Daniel held back for everyone Daniel shared it with: Maria Rosen, Emma Rosen, Leo Rosen. Each of them is emailed.
      </p>
      <div className="mt-6 space-y-5">
        <div className="border-b border-[#EEF0F2] pb-3">
          {label("Meeting")}
          {booked ? (
            <Appear className="mt-1 flex items-baseline justify-between gap-3">
              <p className="text-[14.5px] font-semibold text-[#1F2933]">{MEETING}</p>
              <span className="flex-shrink-0 text-[13px] font-medium text-[#128F8B]">Join</span>
            </Appear>
          ) : !picking ? (
            <span className="mt-1 inline-block rounded text-[14px] font-medium text-[#128F8B]" style={tapStyle(tap === "pick")}>Book a time with Maria</span>
          ) : (
            <Appear className="mt-2">
              <div className="flex gap-1.5">
                {DAYS.map((d, i) => (
                  <span
                    key={d}
                    className="flex-shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium"
                    style={{ background: i === day ? "#128F8B" : "#F3F4F6", color: i === day ? "#FFFFFF" : "#4B5563", ...tapStyle(tap === "day" && i === 2), transition: "background-color 160ms ease, color 160ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease" }}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {SLOTS.map((t, i) => (
                  <span
                    key={t}
                    className="rounded-[8px] border py-2 text-center text-[13px] font-medium"
                    style={{
                      borderColor: i === slot ? "#128F8B" : "#E5E7EB",
                      background: i === slot ? "#128F8B" : "#FFFFFF",
                      color: i === slot ? "#FFFFFF" : "#1F2933",
                      ...tapStyle(tap === "slot" && i === 1),
                      transition: "background-color 160ms ease, color 160ms ease, transform 180ms var(--ease-out), box-shadow 340ms ease",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <span className="rounded text-[14px] font-semibold text-[#128F8B]" style={{ opacity: slot >= 0 ? 1 : 0.4, ...tapStyle(tap === "bookit") }}>
                  {slot >= 0 ? `Book ${SLOTS[slot]}` : "Pick a time"}
                </span>
                <span className="text-[13.5px] font-medium text-[#6B7280]">Not now</span>
              </div>
            </Appear>
          )}
        </div>
        <div className="border-b border-[#EEF0F2] pb-3">
          {label("Reach Maria")}
          <p className="mt-1 text-[14px] text-[#1F2933]">maria.rosen@gmail.com</p>
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-1">
        <span className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#128F8B] text-[15px] font-semibold text-white">Grant access</span>
        <span className="flex h-10 w-full items-center justify-center text-[14px] font-medium text-[#6B7280]">Deny</span>
      </div>
    </div>
  );
};

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
  const [survey, setSurvey] = useState(false);
  const [step, setStep] = useState(0);
  const [news, setNews] = useState(0);
  const [over, setOver] = useState(false);
  const [carry, setCarry] = useState<Carry>("off");
  const [fieldAt, setFieldAt] = useState({ x: 0, y: 0 });
  const [teamEdit, setTeamEdit] = useState<Edit>("idle");
  const [teamTyped, setTeamTyped] = useState(0);
  const [saved, setSaved] = useState(false);
  const [access, setAccess] = useState<Access>("none");
  const [modal, setModal] = useState(false);
  const [picking, setPicking] = useState(false);
  const [day, setDay] = useState(-1);
  const [slot, setSlot] = useState(-1);
  const [booked, setBooked] = useState(false);

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
      setSurvey(c === 0);
      setStep(c === 0 ? 1 : 0);
      setNews(c === 1 ? 3 : 0);
      setOver(false);
      setCarry("off");
      setTeamEdit(c === 2 ? "done" : "idle");
      setTeamTyped(0);
      setSaved(c === 2);
      setAccess(c === 3 ? "met" : "none");
      setModal(false);
      setPicking(false);
      setDay(c === 3 ? 2 : -1);
      setSlot(c === 3 ? 1 : -1);
      setBooked(c === 3);
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
      /* 1. The client check-in, and a look at the survey it carries */
      async () => {
        await wait(C1.read);
        await tapOn("preview", () => setSurvey(true));
        await wait(C1.sheet);
        await tapOn("next", () => setStep(1));
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
      /* 3. A line of the attorney's own onto the advisors' check-in */
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
      /* 4. The executor asks to meet; the meeting comes before any access */
      async () => {
        await wait(C4.rest);
        setAccess("asked");
        await wait(C4.row);
        await tapOn("book", () => setModal(true));
        await wait(C4.modal);
        await tapOn("pick", () => {
          setPicking(true);
          setDay(0);
        });
        await wait(C4.pick);
        await tapOn("day", () => setDay(2));
        await wait(C4.day);
        await tapOn("slot", () => setSlot(1));
        await wait(C4.slot);
        await tapOn("bookit", () => {
          setBooked(true);
          setPicking(false);
        });
        await wait(C4.booked);
        setModal(false);
        setAccess("booked");
        await wait(C4.upcoming);
        setAccess("met");
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
  const sheetPlace: React.CSSProperties = compact ? { left: 10, right: 10, top: 16, bottom: -48 } : { left: (WIDE.w - 640) / 2, width: 640, top: 36, bottom: -48 };
  const modalPlace: React.CSSProperties = compact ? { left: 10, right: 10, top: 16 } : { left: (WIDE.w - 460) / 2, width: 460, top: 36 };
  const columnPlace: Place = compact ? PLACE_COMPACT : { left: (WIDE.w - 540) / 2, right: (WIDE.w - 540) / 2, top: 52 };
  const surveyOn = shown === 0 && survey;
  const modalOn = shown === 3 && modal;

  return (
    <div
      ref={frameRef}
      className="min-w-0"
      role="img"
      aria-label="Willow checks in with clients every year and previews the questions they're asked, posts the firm's articles to every client's dashboard, writes to the advisors on a client's team, and when an executor asks for what a client held back, sets up a meeting with the attorney before anything opens."
    >
      <Print size={size}>
        <div ref={rootRef} aria-hidden className="relative overflow-hidden" style={{ width: size.w, height: size.h }}>
          <Piece on={shown === 0} place={place}>
            <ClientCheckIn tap={tap} compact={compact} />
          </Piece>
          <Piece on={shown === 1} place={place}>
            <ArticleFeed step={news} over={over} tap={tap} compact={compact} dropRef={fieldRef} />
          </Piece>
          <Piece on={shown === 2} place={place}>
            <TeamCheckIn edit={teamEdit} typed={teamTyped} saved={saved} tap={tap} compact={compact} />
          </Piece>
          <Piece on={shown === 3} place={columnPlace}>
            <RequiredActions access={access} tap={tap} />
          </Piece>

          {/* 1. The survey preview, over the check-in on a dim backdrop, with
              the preview's arrows either side */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-black/40" style={{ opacity: surveyOn ? 1 : 0, transition: "opacity 260ms ease" }} />
          <Rise on={surveyOn} z={30} style={sheetPlace}>
            <CheckInSheet step={step} compact={compact} fill />
          </Rise>
          {!compact && (
            <div className="pointer-events-none absolute inset-x-0 z-30 flex justify-between" style={{ paddingLeft: (WIDE.w - 640) / 2 - 50, paddingRight: (WIDE.w - 640) / 2 - 50, top: 320, opacity: surveyOn ? 1 : 0, transition: "opacity 260ms ease 200ms" }}>
              <span className="flex h-7 w-7 items-center justify-center text-white" style={{ opacity: step === 0 ? 0.3 : 0.7 }}>
                <ChevronLeftIcon className="h-7 w-7" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ ...tapStyle(tap === "next"), color: "#FFFFFF", opacity: step === 0 ? 0.85 : 0.3 }}>
                <WIcon name="chevronRight" className="h-7 w-7" />
              </span>
            </div>
          )}

          {/* 2. The article, carried in from the right */}
          <div
            className="pointer-events-none absolute left-0 top-0 z-40"
            style={{ opacity: shown === 1 ? art.o : 0, transform: `translate(${art.x}px, ${art.y}px) translate(-50%, -50%) rotate(${art.r}deg) scale(${art.s})`, transition: art.t }}
          >
            <Article compact={compact} />
          </div>

          {/* 4. The access request popup, rising over the dashboard */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-black/40" style={{ opacity: modalOn ? 1 : 0, transition: "opacity 260ms ease" }} />
          <Rise on={modalOn} z={30} style={modalPlace}>
            <AccessModal picking={picking} day={day} slot={slot} booked={booked} tap={tap} compact={compact} />
          </Rise>
        </div>
      </Print>
    </div>
  );
};

export default KeepInTouchFilm;
