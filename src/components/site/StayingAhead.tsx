import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { WRAP } from "@/components/site/blocks";
import KeepInTouchFilm from "@/components/site/KeepInTouchFilm";
import type { FilmProps } from "@/components/site/film-kit";

/* A film of Willow at work beside its chapters, set out like harvey.ai's "how
   teams stay ahead": the headline top left, a ruled list of chapters beside
   the film, the open chapter's rule filling as it plays. The film moves from
   one chapter to the next by itself, and any chapter can be opened to watch
   from there. Below 1024px (phones held upright, tablets) the chapters stack
   instead, the way Keeping things easy's tiles do: each chapter's words, then
   its own film, which plays when it scrolls into view and rests on its last
   frame; tapping it plays it again (Aaron, Nov 24: scroll from one to the
   next, not a row that slides on by itself).
   Every chapter has an anchor, so the deeper pages parked in
   src/content/pages.tsx land on theirs. Here: staying in touch after
   signing. The admin (the signed plan in, and explained) is the next
   section, KeepingThingsEasy.tsx. */

export type Chapter = { id: string; also?: string[]; title: string; body: string };

/* After signing: who keeps coming back, and how Willow keeps them coming */
export const KEEP_CHAPTERS: Chapter[] = [
  {
    id: "check-ins",
    also: ["survey"],
    title: "Automate client check-ins",
    body: "Write your check-in emails once, in your own words. Choose how often they go out, and Willow handles it from there.",
  },
  {
    id: "firm-updates",
    title: "Share your firm’s content and updates",
    body: "Whether it’s a blog post, a tax update or anything else your clients would find useful, drop it into Willow. We’ll add it to their dashboard and email it to them, so you stay top of mind.",
  },
  {
    id: "law-changes",
    also: ["tax-updates", "legislation"],
    title: "Tell clients when the law changes",
    body: "When a tax or estate law changes, Willow reads it against every client’s plan and flags who it may affect. Look over the email it drafts, then send it to all of them at once.",
  },
  {
    id: "family",
    also: ["their-team", "their-people", "advisors", "executors"],
    title: "Turn their family into clients",
    body: "Every year, Willow writes to the family each plan names as executors and guardians, in your words, with a button to book time with you. When they want a plan of their own, you’re the attorney they already know.",
  },
  {
    id: "probate",
    also: ["when-it-matters", "booking"],
    title: "Be the firm the executors call",
    body: "Willow keeps you in touch with each executor from the day the plan is signed. When a client passes, they already know to come back to you. Their request to open the plan comes straight to your firm, and you meet them first.",
  },
];

/* The section headline: a light serif line, then an italic teal line */
export const LightHead = ({ title, accent }: { title: string; accent: string }) => (
  <div className="mx-auto max-w-4xl text-center">
    <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
      {title}
      <span className="block italic text-[#138F8B]">{accent}</span>
    </h2>
  </div>
);

/* The open chapter's line fills as it plays */
const Fill = ({ ms }: { ms: number }) => {
  const [on, setOn] = useState(ms === 0);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <span className="absolute left-0 top-[-2px] h-0.5 bg-[#138F8B]" style={{ width: on ? "100%" : "0%", transition: on && ms ? `width ${ms}ms linear` : "none" }} />;
};

const WIDE = "(min-width: 1024px)";
const useWide = () => {
  const [wide, setWide] = useState(() => typeof window === "undefined" || window.matchMedia(WIDE).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
};

const noop = () => undefined;

/* Below 1024px: one chapter, its words above its own film. Its rule fills
   while the film plays; tapping the film plays it again */
const StackedChapter = ({ c, i, Film }: { c: Chapter; i: number; Film: React.ComponentType<FilmProps> }) => {
  const [replay, setReplay] = useState(0);
  const [run, setRun] = useState<{ id: number; ms: number } | null>(null);
  return (
    <div className="relative grid gap-5">
      {[c.id, ...(c.also ?? [])].map((id) => (
        <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
      ))}
      <div className="relative border-t-2 border-gray-200 pt-5">
        {run && <Fill key={run.id} ms={run.ms} />}
        <h3 className="text-[20px] font-medium leading-snug text-[#222222]" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
          {c.title}
        </h3>
        <p className="mt-2 max-w-[36rem] text-[15px] leading-relaxed text-gray-600" style={{ textWrap: "pretty" }}>
          {c.body}
        </p>
      </div>
      <div className="relative">
        <Film rewatch chapter={i} replay={replay} onChapter={noop} onStart={(ms) => setRun((r) => ({ id: (r?.id ?? 0) + 1, ms }))} />
        <button
          type="button"
          onClick={() => setReplay((r) => r + 1)}
          aria-label={`Play “${c.title}” again`}
          className="absolute inset-0 z-10 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#138F8B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8FAFC]"
        />
      </div>
    </div>
  );
};

const ChapterFilmSection = ({
  name,
  title,
  accent,
  label,
  chapters,
  Film,
}: {
  /** Keeps this section's ids apart from the other's */
  name: string;
  title: string;
  accent: string;
  label: string;
  chapters: Chapter[];
  Film: React.ComponentType<FilmProps>;
}) => {
  const { hash } = useLocation();
  const chapterFor = (h: string) => {
    const key = h.replace("#", "");
    return chapters.findIndex((c) => c.id === key || c.also?.includes(key));
  };
  const [active, setActive] = useState(() => Math.max(0, chapterFor(hash)));
  const [replay, setReplay] = useState(0);
  const [run, setRun] = useState<{ id: number; ms: number } | null>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wide = useWide();

  useEffect(() => {
    const i = chapterFor(hash);
    if (i >= 0) setActive(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const open = (i: number, focus = false) => {
    setActive(i);
    setRun(null);
    setReplay((r) => r + 1);
    if (focus) rowRefs.current[i]?.focus({ preventScroll: true });
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") open((active + 1) % chapters.length, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") open((active + chapters.length - 1) % chapters.length, true);
    else return;
    e.preventDefault();
  };

  const chapter = chapters[active];
  const panel = `${name}-panel`;
  return (
    <section className="bg-[#F8FAFC] pb-16 md:pb-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2 }}>
          {title}
          <span className="block italic text-[#138F8B]">{accent}</span>
        </h2>

        {!wide ? (
          /* Phones and tablets: the chapters stacked, one after another */
          <div aria-label={label} className="mt-10 grid gap-14 md:mt-12">
            {chapters.map((c, i) => (
              <StackedChapter key={c.id} c={c} i={i} Film={Film} />
            ))}
          </div>
        ) : (
        <div className="relative mt-12 grid grid-cols-[minmax(0,5fr)_minmax(0,11fr)] items-start gap-14">
          {chapters.flatMap((c) => [c.id, ...(c.also ?? [])]).map((id) => (
            <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
          ))}

          <div className="min-w-0">
            {/* The ruled list */}
            <div role="tablist" aria-orientation="vertical" aria-label={label} onKeyDown={onKey} className="border-b-2 border-gray-200">
              {chapters.map((c, i) => {
                const on = i === active;
                return (
                  <div key={c.id} className="relative border-t-2 border-gray-200">
                    {on && run && <Fill key={run.id} ms={run.ms} />}
                    <button
                      ref={(el) => {
                        rowRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${name}-tab-${c.id}`}
                      aria-selected={on}
                      aria-controls={panel}
                      tabIndex={on ? 0 : -1}
                      onClick={() => open(i)}
                      className={`block w-full py-5 text-left text-[20px] font-medium leading-snug transition-colors ${on ? "text-[#222222]" : "text-gray-500 hover:text-[#222222]"}`}
                      style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
                    >
                      {c.title}
                    </button>
                    <div style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", transition: "grid-template-rows 340ms var(--ease-in-out)" }}>
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-6 pr-4 text-[15px] leading-relaxed text-gray-600" style={{ opacity: on ? 1 : 0, transition: on ? "opacity 260ms ease 120ms" : "opacity 120ms ease", textWrap: "pretty" }}>
                          {c.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div id={panel} role="tabpanel" aria-labelledby={`${name}-tab-${chapter.id}`} className="min-w-0">
            <Film chapter={active} replay={replay} onChapter={setActive} onStart={(ms) => setRun((r) => ({ id: (r?.id ?? 0) + 1, ms }))} />
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

/* After signing: check-ins, the firm's content, law changes, the family, the executors' call */
const StayingAhead = () => (
  <ChapterFilmSection
    name="keep"
    title="A practice families"
    accent="keep coming back to."
    label="Staying in touch after signing"
    chapters={KEEP_CHAPTERS}
    Film={KeepInTouchFilm}
  />
);

export default StayingAhead;
