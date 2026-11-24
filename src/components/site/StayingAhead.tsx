import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { WRAP } from "@/components/site/blocks";
import ClientFilm from "@/components/site/ClientFilm";

/* One film of a client's life on Willow, with a row of chapters above it that
   doubles as its progress bar: the film moves from one to the next by itself,
   and any chapter can be opened to watch from there. Every chapter has an
   anchor, so the deeper pages parked in src/content/pages.tsx land on theirs. */

const CHAPTERS: { id: string; also?: string[]; title: string; body: string }[] = [
  {
    id: "set-up",
    also: ["signed-plan", "dashboard"],
    title: "Set up a client",
    body: "Draft and sign the way you always have. Then drop in the signed documents, and Willow files them under the right person and sets up their account.",
  },
  {
    id: "plan-summaries",
    title: "Explain the plan",
    body: "Willow drafts a plain-English summary of the plan. You review and approve it, and clients see nothing until you do.",
  },
  {
    id: "check-ins",
    also: ["booking"],
    title: "Check in every year",
    body: "Check-ins are lined up year after year for the client, their agents and their professionals. Each one waits for you to send or skip.",
  },
  {
    id: "their-people",
    also: ["when-it-matters"],
    title: "Reach their team",
    body: "Down the line, the people in the plan hear from you too. Executors, trustees and advisors get check-ins and can book time with you.",
  },
];

const chapterFor = (hash: string) => {
  const key = hash.replace("#", "");
  return CHAPTERS.findIndex((c) => c.id === key || c.also?.includes(key));
};

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

const StayingAhead = () => {
  const { hash } = useLocation();
  const [active, setActive] = useState(() => Math.max(0, chapterFor(hash)));
  const [replay, setReplay] = useState(0);
  const [run, setRun] = useState<{ id: number; ms: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const i = chapterFor(hash);
    if (i >= 0) setActive(i);
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
    if (focus) tabRefs.current[i]?.focus({ preventScroll: true });
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") open((active + 1) % CHAPTERS.length, true);
    else if (e.key === "ArrowLeft") open((active + CHAPTERS.length - 1) % CHAPTERS.length, true);
    else return;
    e.preventDefault();
  };

  const chapter = CHAPTERS[active];
  return (
    <section className="bg-[#F8FAFC] pb-16 md:pb-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <LightHead title="A practice families" accent="keep coming back to." />

        <div className="relative mt-10 md:mt-14">
          {CHAPTERS.flatMap((c) => [c.id, ...(c.also ?? [])]).map((id) => (
            <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
          ))}
          <div role="tablist" aria-label="A client's life on Willow" onKeyDown={onKey} className="relative flex gap-4 overflow-x-auto pt-0.5 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-3 lg:overflow-visible">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`chapter-tab-${c.id}`}
                aria-selected={i === active}
                aria-controls="chapter-panel"
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

          <div id="chapter-panel" role="tabpanel" aria-labelledby={`chapter-tab-${chapter.id}`}>
            <p key={chapter.id} className="mt-5 max-w-3xl text-[16px] leading-relaxed text-gray-600 md:min-h-[3.5rem] md:text-[17px]" style={{ textWrap: "pretty" }}>
              {chapter.body}
            </p>
            <div className="mt-5">
              <ClientFilm
                chapter={active}
                replay={replay}
                onChapter={setActive}
                onStart={(ms) => setRun((r) => ({ id: (r?.id ?? 0) + 1, ms }))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayingAhead;
