import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { WRAP } from "@/components/site/blocks";
import KeepInTouchFilm from "@/components/site/KeepInTouchFilm";
import type { FilmProps } from "@/components/site/film-kit";

/* A film of Willow at work beside its chapters, set out like harvey.ai's "how
   teams stay ahead": the headline top left, a ruled list of chapters beside
   the film, the open chapter's rule filling as it plays. (On phones and
   tablets the list is a row above the film.) The film moves from one chapter
   to the next by itself, and any chapter can be opened to watch from there.
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
    title: "Check in with clients every year",
    body: "Every year, Willow asks each client what’s changed since they signed. The email is in your words, and you can preview the questions before anything goes out.",
  },
  {
    id: "firm-updates",
    title: "Share your firm’s updates",
    body: "Add a link to anything your firm publishes, and it appears on every client’s dashboard, so you stay in view between check-ins.",
  },
  {
    id: "their-team",
    also: ["their-people", "advisors"],
    title: "Reach out to their team",
    body: "Write once to the advisors and executors in each plan. Willow keeps in touch with them every year, so you know them before they need you.",
  },
  {
    id: "probate",
    also: ["when-it-matters", "booking"],
    title: "Open the path to probate",
    body: "When a client passes, their executor comes to you for what was held back. You meet with them first, and nothing opens until you grant it.",
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const i = chapterFor(hash);
    if (i >= 0) setActive(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  /* On phones the row scrolls: keep the open chapter in sight */
  useEffect(() => {
    const tab = tabRefs.current[active];
    const row = tab?.parentElement;
    if (tab && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
  }, [active]);

  const open = (i: number, focus = false) => {
    setActive(i);
    setRun(null);
    setReplay((r) => r + 1);
    if (focus) {
      tabRefs.current[i]?.focus({ preventScroll: true });
      rowRefs.current[i]?.focus({ preventScroll: true });
    }
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

        <div className="relative mt-10 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,11fr)] lg:items-start lg:gap-14">
          {chapters.flatMap((c) => [c.id, ...(c.also ?? [])]).map((id) => (
            <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
          ))}

          <div className="min-w-0">
            {/* Phones and tablets: a row above the film */}
            <div className="lg:hidden">
              <div role="tablist" aria-label={label} onKeyDown={onKey} className="relative flex gap-4 overflow-x-auto pt-0.5 [scrollbar-width:none]">
                {chapters.map((c, i) => (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${name}-tab-${c.id}`}
                    aria-selected={i === active}
                    aria-controls={panel}
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => open(i)}
                    className={`relative flex-shrink-0 border-t-2 border-gray-200 pb-2 pr-3 pt-3.5 text-left text-[15px] font-medium leading-snug transition-colors ${
                      i === active ? "text-[#222222]" : "text-gray-500 hover:text-[#222222]"
                    }`}
                  >
                    {i < active && <span className="absolute left-0 top-[-2px] h-0.5 w-full bg-[#138F8B]" />}
                    {i === active && run && <Fill key={run.id} ms={run.ms} />}
                    {c.title}
                  </button>
                ))}
              </div>
              <p key={chapter.id} className="mt-4 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:min-h-[3.25rem]" style={{ textWrap: "pretty" }}>
                {chapter.body}
              </p>
            </div>

            {/* Desktop: the ruled list */}
            <div role="tablist" aria-orientation="vertical" aria-label={label} onKeyDown={onKey} className="hidden border-b-2 border-gray-200 lg:block">
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
      </div>
    </section>
  );
};

/* After signing: check-ins, the firm's updates, their team, the path to probate */
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
