import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { WRAP } from "@/components/site/blocks";
import EasyFilm from "@/components/site/EasyFilm";

/* Keeping things easy: the admin Willow takes off the attorney, set out like
   "A practice families keep coming back to" (StayingAhead.tsx) but mirrored,
   the film on the left and the ruled list of chapters on the right, the open
   chapter's rule filling as it plays. On phones and tablets the list is a row
   above the film. Each chapter has an anchor; the parked pages in
   src/content/pages.tsx land on #dashboard and #plan-summaries. */

export const EASY_CHAPTERS: { id: string; also?: string[]; title: string; body: string }[] = [
  {
    id: "set-up",
    also: ["signed-plan", "dashboard"],
    title: "Drop in the signed plan",
    body: "Willow reads the documents you already signed, files each one under the right person, and pulls their email and phone from Outlook, so there’s nothing to retype.",
  },
  {
    id: "plan-summaries",
    title: "Explain the plan",
    body: "Willow drafts a plain-English summary of the plan. You review and approve it, and clients see nothing until you do.",
  },
  {
    id: "reaching-out",
    title: "Reach out on schedule",
    body: "Once the plan is approved, every check-in has a date on the client’s page, and Willow sends each one when it’s due. When an executor books a meeting from one, you see it there.",
  },
];

const chapterFor = (hash: string) => {
  const key = hash.replace("#", "");
  return EASY_CHAPTERS.findIndex((c) => c.id === key || c.also?.includes(key));
};

/* The open chapter's line fills as it plays */
const Fill = ({ ms }: { ms: number }) => {
  const [on, setOn] = useState(ms === 0);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <span className="absolute left-0 top-[-2px] h-0.5 bg-[#138F8B]" style={{ width: on ? "100%" : "0%", transition: on && ms ? `width ${ms}ms linear` : "none" }} />;
};

const KeepingThingsEasy = () => {
  const { hash } = useLocation();
  const [active, setActive] = useState(() => Math.max(0, chapterFor(hash)));
  const [replay, setReplay] = useState(0);
  const [run, setRun] = useState<{ id: number; ms: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
    if (focus) {
      tabRefs.current[i]?.focus({ preventScroll: true });
      rowRefs.current[i]?.focus({ preventScroll: true });
    }
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") open((active + 1) % EASY_CHAPTERS.length, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") open((active + EASY_CHAPTERS.length - 1) % EASY_CHAPTERS.length, true);
    else return;
    e.preventDefault();
  };

  const chapter = EASY_CHAPTERS[active];
  return (
    <section id="keeping-things-easy" className="scroll-mt-24 bg-[#F8FAFC] py-16 md:py-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
          You bring the signed plan.
          <span className="block italic text-[#138F8B]">We handle the rest.</span>
        </h2>

        <div className="relative mt-10 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,11fr)_minmax(0,5fr)] lg:items-start lg:gap-14">
          {EASY_CHAPTERS.flatMap((c) => [c.id, ...(c.also ?? [])]).map((id) => (
            <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
          ))}

          <div className="min-w-0 lg:order-2">
            {/* Phones and tablets: a row above the film */}
            <div className="lg:hidden">
              <div role="tablist" aria-label="What Willow takes off your plate" onKeyDown={onKey} className="relative flex gap-4 overflow-x-auto pt-0.5 [scrollbar-width:none]">
                {EASY_CHAPTERS.map((c, i) => (
                  <button
                    key={c.id}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    type="button"
                    role="tab"
                    id={`easy-tab-${c.id}`}
                    aria-selected={i === active}
                    aria-controls="easy-panel"
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
            <div role="tablist" aria-orientation="vertical" aria-label="What Willow takes off your plate" onKeyDown={onKey} className="hidden border-b-2 border-gray-200 lg:block">
              {EASY_CHAPTERS.map((c, i) => {
                const on = i === active;
                return (
                  <div key={c.id} className="relative border-t-2 border-gray-200">
                    {on && run && <Fill key={run.id} ms={run.ms} />}
                    <button
                      ref={(el) => { rowRefs.current[i] = el; }}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="easy-panel"
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

          <div id="easy-panel" role="tabpanel" aria-labelledby={`easy-tab-${chapter.id}`} className="min-w-0 lg:order-1">
            <EasyFilm
              chapter={active}
              replay={replay}
              onChapter={setActive}
              onStart={(ms) => setRun((r) => ({ id: (r?.id ?? 0) + 1, ms }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeepingThingsEasy;
