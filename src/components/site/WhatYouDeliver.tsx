import React, { useEffect, useRef, useState } from "react";
import { WRAP } from "@/components/site/blocks";
import { LightHead } from "@/components/site/StayingAhead";
import { FloatStack } from "@/components/product/kit";
import { ProClientRowView, ProCoupleView } from "@/components/product/attorney-clients";
import { CheckIcon } from "@/components/product/willow-icons";
import {
  GoogleCalendarLogo,
  GoogleMeetLogo,
  MicrosoftTeamsLogo,
  OutlookLogo,
  ZoomLogo,
} from "@/components/product/attorney-booking";

/* Will it fit my practice? The film above shows what Willow does; these tiles
   answer the attorney's next question in the Harvey-like sizes Aaron prefers
   (a tall half-width tile, two small ones beside it, a wide one under them),
   each with a small piece of the real product:
     tall   Bring the clients you already have: the Clients list, Daniel and
            Maria first, running off the bottom (importing contacts is being
            built, Nov 24, and Aaron cleared claiming it)
     small  On your terms (one line, Aaron's ask): one real decision asked
            as a question, When a client says something has changed: They
            book directly or We call them (the check-in's Call after the
            check-in setting), as two white rows in the style of Harvey's
            Knowledge tile with choose-one circles; one gets clicked (a
            pulse, then the circle fills) as the tile comes into view
     small  Connect: the apps it connects to
     wide   Speak to clients in your own voice: a plan summary where the
            attorney types their own wording over one power, then Approve
            Summary presses itself (Aaron, Nov 24: animate the typing, no Done
            button). Summaries, check-in emails (Tailor: a
            personal note, subject and message), firm updates (Settings >
            Dashboard content) and the welcome note are all editable on main
            (Nov 24); the line names only those, not "anything". Willow
            learning the attorney's voice is not built, so the tile doesn't
            claim it */

const UI_SHADOW = "0 1px 2px rgba(16,24,40,0.05), 0 10px 24px -8px rgba(16,24,40,0.14)";
const PRODUCT_FONT = "Figtree, Inter, sans-serif";
const fadeOut = (from = 74) => `linear-gradient(to bottom, #000 ${from}%, transparent 100%)`;
const TILE = "flex flex-col overflow-hidden rounded-xl bg-[#EEF2F1]";

const TileTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[20px] font-medium leading-snug text-[#222222]" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
    {children}
  </h3>
);

const TileBody = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <p id={id} className="mt-2 max-w-md text-[15px] leading-relaxed text-gray-600">{children}</p>
);

/* A piece of the product running off the bottom of its tile. `fadeFrom`: where
   the fade starts, in percent of the height. `live`: it holds something a
   visitor can press, so it stays in the accessibility tree */
const Bleed = ({
  height,
  heightClass = "",
  fadeFrom,
  live = false,
  children,
}: {
  height?: number;
  heightClass?: string;
  fadeFrom?: number;
  live?: boolean;
  children: React.ReactNode;
}) => (
  <div
    aria-hidden={live ? undefined : true}
    className={`px-1 pt-1 ${heightClass}`}
    style={{ height, overflow: "clip", WebkitMaskImage: fadeOut(fadeFrom), maskImage: fadeOut(fadeFrom), fontFamily: PRODUCT_FONT }}
  >
    {children}
  </div>
);

/* The Clients list once a firm's clients are in: Daniel and Maria as a
   couple, then clients on their own, running off the bottom of the tile */
const ClientList = () => (
  <div className="mx-auto w-full max-w-[500px] text-left">
    <FloatStack>
      <ProCoupleView a={{ name: "Daniel Rosen", email: "daniel.rosen@gmail.com" }} b={{ name: "Maria Rosen", email: "maria.rosen@gmail.com" }} />
      <ProClientRowView c={{ name: "Elena Ruiz", email: "elena.ruiz@gmail.com" }} />
      <ProClientRowView c={{ name: "Marcus Webb", email: "marcus.webb@outlook.com" }} />
      <ProClientRowView c={{ name: "Jordan Lee", email: "jordan.lee@gmail.com" }} />
      <ProClientRowView c={{ name: "Priya Anand", email: "priya.anand@outlook.com" }} />
      <ProClientRowView c={{ name: "Grace Liu", email: "grace.liu@yahoo.com" }} />
    </FloatStack>
  </div>
);

/* The grid's two scenes take turns, the choice first (Aaron: more time
   between the choice being made and the summary being edited). The choice
   books its turn as it comes into view; the summary books only when it is
   about to start, so when both come into view together the choice goes
   first and the summary waits until the circle has filled and the tile has
   sat still for a moment. Once the summary is playing, a choice that comes
   into view waits for it to finish */
const turn = { owner: "", until: 0 };
const turnWait = (owner: string) => (turn.owner && turn.owner !== owner ? Math.max(0, turn.until - performance.now()) : 0);
const takeTurn = (owner: string, delay: number, length: number) => {
  const start = delay + turnWait(owner);
  turn.owner = owner;
  turn.until = performance.now() + start + length;
  return start;
};
const giveUpTurn = (owner: string) => {
  if (turn.owner === owner) {
    turn.owner = "";
    turn.until = 0;
  }
};

/* A plan summary in the attorney's words, played as a short scene each time
   the tile comes into view: the review page's summary sits as it is, with
   only Approve Summary above it (attorney-review.tsx SummaryHead) and no
   edit box; then the attorney clicks into the real property power's meaning,
   the edit box opens with the old words selected, they type their own
   wording over it (the Keeping things easy film's edit, EasyFilm.tsx Rewrite
   and StepInBody), the box closes, and Approve Summary presses itself and
   reads Approved (Aaron: plain at first, then click in, retype, approve).
   With reduced motion it shows the end straight away. */
const POWERS = [
  { power: "Real property transactions", desc: null },
  { power: "Chattel and goods transactions", desc: "Buy, sell, or manage personal property, tangible goods, and safe deposit box contents" },
  { power: "Bond, share and commodity transactions", desc: "Buy, sell, or manage stocks, bonds, mutual funds, and other securities on your behalf" },
];
const POWER_KEEP = "Buy, sell, lease, mortgage, or manage ";
const POWER_BEFORE = "real estate including co-ops, condos, and land";
const POWER_AFTER = "your home and any other real estate";
const [POWER_CLICKED, POWER_REST] = [POWER_BEFORE.slice(0, POWER_BEFORE.indexOf(" ")), POWER_BEFORE.slice(POWER_BEFORE.indexOf(" "))];

type EditStage = "idle" | "click" | "select" | "typing" | "edited";

/* From the click into the words to Approved, then a rest before the
   choice tile may take its turn */
const CLICK_TO_SELECT = 320;
const SELECT_TO_TYPING = 650;
const PER_LETTER = 42;
const TYPED_TO_CLOSED = 700;
const CLOSED_TO_TAP = 1300;
const TAP_TO_APPROVED = 220;
const SUMMARY_TURN =
  CLICK_TO_SELECT + SELECT_TO_TYPING + PER_LETTER * POWER_AFTER.length + TYPED_TO_CLOSED + CLOSED_TO_TAP + TAP_TO_APPROVED + 1000;

const useRewriteScene = () => {
  const ref = useRef<HTMLDivElement>(null);
  const clickRing = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState<EditStage>("idle");
  const [typed, setTyped] = useState(0);
  const [tap, setTap] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("edited");
      setTyped(POWER_AFTER.length);
      setApproved(true);
      return;
    }
    let timers: number[] = [];
    let armed = true;
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const reset = () => {
      timers.forEach(clearTimeout);
      timers = [];
      giveUpTurn("summary");
      setStage("idle");
      setTyped(0);
      setTap(false);
      setApproved(false);
    };
    /* The summary sits unedited for a moment first, and longer while the
       choice tile is having its turn */
    const play = () => {
      reset();
      at(1100, begin);
    };
    const begin = () => {
      const wait = turnWait("summary");
      if (wait > 0) {
        at(wait, begin);
        return;
      }
      let t = takeTurn("summary", 0, SUMMARY_TURN);
      at(t, () => {
        setStage("click");
        clickRing.current?.animate(
          [
            { transform: "translate(-50%, -50%) scale(0.4)", opacity: 0.4 },
            { transform: "translate(-50%, -50%) scale(1.6)", opacity: 0 },
          ],
          { duration: 560, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        );
      });
      t += CLICK_TO_SELECT;
      at(t, () => setStage("select"));
      t += SELECT_TO_TYPING;
      at(t, () => setStage("typing"));
      for (let n = 1; n <= POWER_AFTER.length; n++) {
        t += PER_LETTER;
        at(t, () => setTyped(n));
      }
      /* The new words sit in their box for a moment, the box closes, and
         only after a beat does Approve press itself (Aaron: a longer pause
         between the edit and the approval) */
      t += TYPED_TO_CLOSED;
      at(t, () => setStage("edited"));
      t += CLOSED_TO_TAP;
      at(t, () => setTap(true));
      t += TAP_TO_APPROVED;
      at(t, () => {
        setTap(false);
        setApproved(true);
      });
    };
    /* Plays once the scene reaches the top three quarters of the screen;
       scrolling it away (below that line or off the top) sets it up to play
       again */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (armed) {
            armed = false;
            play();
          }
        } else {
          armed = true;
          reset();
        }
      },
      { rootMargin: "0px 0px -25% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      giveUpTurn("summary");
    };
  }, []);

  return { ref, clickRing, stage, typed, tap, approved };
};

const SummaryEdit = () => {
  const { ref, clickRing, stage, typed, tap, approved } = useRewriteScene();
  const plain = stage === "idle" || stage === "click";
  const editing = stage === "select" || stage === "typing";
  return (
    <div ref={ref} aria-hidden className="text-left">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium text-white ${approved ? "bg-[#309E96]" : "bg-[#128F8B]"}`}
        style={{
          transform: tap ? "scale(0.96)" : "scale(1)",
          boxShadow: tap ? "0 0 0 6px rgba(48,158,150,0.22)" : "0 0 0 0 rgba(48,158,150,0)",
          transition: "transform 180ms var(--ease-out), box-shadow 340ms ease, background-color 200ms ease",
        }}
      >
        <CheckIcon className="h-4 w-4" />
        {approved ? "Approved" : "Approve Summary"}
      </span>
      <div className="mt-3 rounded-t-2xl bg-white px-4 pb-4 pt-4" style={{ boxShadow: UI_SHADOW }}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">Financial Agent powers</p>
        <div className="overflow-hidden rounded-xl" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div className="flex bg-[#128F8B] text-[12.5px] font-semibold text-white">
            <div className="w-[36%] flex-shrink-0 px-3.5 py-2.5">Power</div>
            <div className="min-w-0 flex-1 px-3.5 py-2.5">What this means</div>
          </div>
          {POWERS.map((w, i) => (
            <div key={w.power} className={`flex items-start border-b border-[#E5E7EB] last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}>
              <div className="w-[36%] flex-shrink-0 px-3.5 py-3 text-[13px] font-medium text-[#1F2933]">{w.power}</div>
              <div className="min-w-0 flex-1 px-3.5 py-3 text-[13px] leading-[1.5] text-[#6B7280]">
                {w.desc ?? (
                  <span
                    className="block rounded-[3px]"
                    style={{
                      color: plain ? undefined : "#1F2933",
                      boxShadow: editing ? "0 0 0 1px #309E96, 0 0 0 4px rgba(48,158,150,0.14)" : "0 0 0 0 rgba(48,158,150,0)",
                      transition: "box-shadow 180ms ease, color 180ms ease",
                    }}
                  >
                    {POWER_KEEP}
                    {plain && (
                      <>
                        {/* Where the click lands: a ring pulses out from the
                            word, then the edit box opens */}
                        <span className="relative">
                          {POWER_CLICKED}
                          <span
                            ref={clickRing}
                            className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 rounded-full bg-[#309E96] opacity-0"
                            style={{ transform: "translate(-50%, -50%)" }}
                          />
                        </span>
                        {POWER_REST}
                      </>
                    )}
                    {stage === "select" && <span className="bg-[#CDEBE8]">{POWER_BEFORE}</span>}
                    {stage === "typing" && (
                      <>
                        {POWER_AFTER.slice(0, typed)}
                        <span className="ml-px inline-block h-[13px] w-px translate-y-[2px] bg-[#1F2933]" />
                      </>
                    )}
                    {stage === "edited" && POWER_AFTER}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* One real decision, asked as a question: the client check-in's Call after
   the check-in (touchpoint-panel.tsx), which sets what a client's portal
   offers once they say something has changed. Its They book and We call
   them (the third, No call, left out to keep the tile simple) as rows in
   the Harvey Knowledge tile's style: each its own small white row, no icons,
   and the tile's own line asks the question (Aaron: no third line of text).
   Only one can be chosen, so each row has a circle, not a switch (Aaron:
   "you can't have both on at once"). When the tile comes into view nothing
   is chosen yet; then We call them is clicked: its row presses in, a ring
   pulses out of the circle and the circle fills. A visitor's click does the
   same. With reduced motion it starts already chosen */
const FOLLOW_UPS = ["They book directly", "We call them"] as const;
type FollowUp = (typeof FOLLOW_UPS)[number];

const FollowUpChoice = ({ labelledBy }: { labelledBy: string }) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const rows = useRef<Partial<Record<FollowUp, HTMLButtonElement | null>>>({});
  const rings = useRef<Partial<Record<FollowUp, HTMLSpanElement | null>>>({});
  const touched = useRef(false);
  const timer = useRef(0);
  const [value, setValue] = useState<FollowUp | null>(null);

  const choose = (label: FollowUp, pressed: boolean) => {
    setValue(label);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (pressed) {
      rows.current[label]?.animate([{ transform: "scale(1)" }, { transform: "scale(0.97)" }, { transform: "scale(1)" }], {
        duration: 320,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      });
    }
    rings.current[label]?.animate(
      [
        { transform: "scale(1)", opacity: 0.5 },
        { transform: "scale(2.6)", opacity: 0 },
      ],
      { duration: 620, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
  };

  /* The click plays each time the tile comes into view, until a visitor
     makes the choice themselves. It books its turn for the click and the
     still moment after it, so the summary edit beside it waits */
  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue("We call them");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (touched.current) return;
        window.clearTimeout(timer.current);
        if (entry.isIntersecting) {
          timer.current = window.setTimeout(() => choose("We call them", true), takeTurn("choice", 700, 1800));
        } else {
          giveUpTurn("choice");
          setValue(null);
        }
      },
      { rootMargin: "0px 0px -25% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
      giveUpTurn("choice");
    };
  }, []);

  return (
    <div ref={groupRef} role="radiogroup" aria-labelledby={labelledBy} className="space-y-1.5 text-left" style={{ fontFamily: PRODUCT_FONT }}>
      {FOLLOW_UPS.map((label) => {
        const on = label === value;
        return (
          <button
            key={label}
            ref={(node) => {
              rows.current[label] = node;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => {
              /* A visitor's own click ends the scene: the pending auto-click
                 never lands on top of it */
              touched.current = true;
              window.clearTimeout(timer.current);
              giveUpTurn("choice");
              if (!on) choose(label, false);
            }}
            className="flex w-full items-center gap-3 rounded-[10px] bg-white px-4 py-3.5 text-left transition-transform duration-150 active:scale-[0.98]"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.06), 0 0 0 1px rgba(16,24,40,0.04)", transitionTimingFunction: "var(--ease-out)" }}
          >
            <span aria-hidden className="relative flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center">
              <span
                ref={(node) => {
                  rings.current[label] = node;
                }}
                className="pointer-events-none absolute inset-0 rounded-full bg-[#309E96] opacity-0"
              />
              <span
                className={`absolute inset-0 rounded-full border-[1.5px] bg-white transition-colors duration-200 ${on ? "border-[#309E96]" : "border-[#C4C9D0]"}`}
              />
              <span
                className="relative h-2.5 w-2.5 rounded-full bg-[#309E96]"
                style={{
                  transform: on ? "scale(1)" : "scale(0)",
                  transition: on ? "transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1) 60ms" : "transform 160ms ease-out",
                }}
              />
            </span>
            <span className={`min-w-0 flex-1 text-[14.5px] transition-colors duration-200 ${on ? "font-medium text-[#1F2933]" : "text-[#4B5563]"}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

const GmailLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="52 42 88 66" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
    <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
    <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
    <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
    <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
  </svg>
);

type Logo = (p: { className?: string }) => React.ReactElement;
const CONNECTORS: { name: string; Logo: Logo }[] = [
  { name: "Google Calendar", Logo: GoogleCalendarLogo },
  { name: "Outlook", Logo: OutlookLogo },
  { name: "Gmail", Logo: GmailLogo },
  { name: "Google Meet", Logo: GoogleMeetLogo },
  { name: "Zoom", Logo: ZoomLogo },
  { name: "Microsoft Teams", Logo: MicrosoftTeamsLogo },
];

const WhatYouDeliver = () => (
  <section className="bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <LightHead title="Built to work with" accent="the practice you already run." />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-12 lg:grid-rows-[minmax(252px,auto)_minmax(252px,auto)]">
        <article className={`${TILE} px-6 pt-6 sm:col-span-2 lg:col-span-6 lg:row-span-2`}>
          <TileTitle>Bring the clients you already have</TileTitle>
          <TileBody>Import your firm&rsquo;s history and use Willow to rekindle client relationships that faded over the years.</TileBody>
          {/* The list fills the tile however tall the two rows beside it get */}
          <div className="relative mt-5 min-h-[385px] flex-1">
            <Bleed heightClass="absolute inset-0" fadeFrom={68}>
              <ClientList />
            </Bleed>
          </div>
        </article>

        <article className={`${TILE} px-6 pt-6 lg:col-span-3`}>
          <TileTitle>On your terms</TileTitle>
          <TileBody id="follow-up-question">Run your practice the way you do, and Willow matches your style.</TileBody>
          <div className="mt-auto pb-5 pt-4">
            <FollowUpChoice labelledBy="follow-up-question" />
          </div>
        </article>

        <article id="integrations" className={`${TILE} scroll-mt-24 p-6 lg:col-span-3`}>
          <TileTitle>Connect</TileTitle>
          <TileBody>Your calendar, video and contacts, connected once.</TileBody>
          <ul className="mt-auto grid grid-cols-3 gap-1.5 pt-4">
            {CONNECTORS.map(({ name, Logo }) => (
              <li key={name} title={name} className="flex h-10 items-center justify-center rounded-md bg-white">
                <Logo className="h-5 w-5 object-contain" />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Side by side where the tile is wide enough for the summary's
            table; between 1024 and 1200px it sits under the text instead */}
        <article className={`${TILE} gap-6 px-6 pt-6 sm:col-span-2 sm:flex-row lg:col-span-6 lg:flex-col lg:gap-4 min-[1200px]:flex-row min-[1200px]:gap-6`}>
          <div className="sm:w-[40%] sm:flex-shrink-0 sm:pb-6 lg:w-auto lg:pb-0 min-[1200px]:w-[35%] min-[1200px]:pb-6">
            <TileTitle>Speak to clients in your own voice</TileTitle>
            <TileBody>Edit any summary, check-in email or firm update your clients see, so every word sounds like it came from you.</TileBody>
          </div>
          <div className="min-w-0 flex-1 self-end lg:mt-auto lg:w-full lg:flex-none lg:self-stretch min-[1200px]:mt-0 min-[1200px]:w-auto min-[1200px]:flex-1 min-[1200px]:self-end">
            <Bleed heightClass="h-[228px] lg:h-[206px] min-[1200px]:h-[228px]" fadeFrom={82}>
              <SummaryEdit />
            </Bleed>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default WhatYouDeliver;
