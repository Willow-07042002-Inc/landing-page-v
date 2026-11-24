import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { PrintFrame, WRAP } from "@/components/site/blocks";
import PlanDropStory from "@/components/site/PlanDropStory";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyClientsScreen } from "@/components/product/attorney-clients";
import { TeamPanel } from "@/components/product/attorney-client-panel";
import { BookingPageScreen } from "@/components/product/attorney-booking";
import { SummaryReviewScreenCropped, SUMMARY_REVIEW_CROP_HEIGHT } from "@/components/product/attorney-review";
import { DashboardWithReleaseRequest, DashboardWithSendOrSkip } from "@/components/product/composites";

/* What the attorney does with Willow, one task at a time: a ruled row of tasks
   across the top and the real product screen for the one that's open. Every
   task has an anchor, so the deeper pages parked in src/content/pages.tsx land
   on their part of this section. */

type Task = {
  id: string;
  also?: string[];
  title: string;
  body: string;
  print?: string;
  h?: number;
  visual: () => React.ReactNode;
};

const TASKS: Task[] = [
  {
    id: "set-up",
    also: ["signed-plan", "dashboard"],
    title: "Set up a client",
    body: "Draft and sign the way you always have. Then drop in the signed documents, and Willow files them under the right person and fills in their details.",
    visual: () => <PlanDropStory />,
  },
  {
    id: "plan-summaries",
    title: "Explain the plan",
    body: "Willow drafts a plain-English summary of the plan. You edit and approve it, and clients see nothing until you do.",
    print: "/florida-coast.jpg",
    h: SUMMARY_REVIEW_CROP_HEIGHT,
    visual: () => <SummaryReviewScreenCropped />,
  },
  {
    id: "check-ins",
    title: "Check in every year",
    body: "Willow prepares a check-in asking what's changed: a move, a new grandchild, a sale of the house. Each one waits for you to send or skip.",
    print: "/santa-monica.jpg",
    visual: () => <DashboardWithSendOrSkip />,
  },
  {
    id: "booking",
    title: "Book the next call",
    body: "When something changes, clients book time on your calendar, and the meeting link is already in place.",
    print: "/williamsburg.jpg",
    h: 900,
    visual: () => <BookingPageScreen email="daniel.rosen@gmail.com" />,
  },
  {
    id: "their-people",
    title: "Prepare their people",
    body: "The agents and professionals named in the plan get check-ins of their own and can book time with you.",
    print: "/willow-street.jpg",
    visual: () => <AttorneyClientsScreen open tab="Team" panel={<TeamPanel />} />,
  },
  {
    id: "when-it-matters",
    title: "Be there when it matters",
    body: "A family member tells you someone has passed and attaches the death certificate. You grant or deny access, and nothing opens until you do.",
    print: "/hudson-bridge.jpg",
    visual: () => <DashboardWithReleaseRequest />,
  },
];

const taskFor = (hash: string) => {
  const key = hash.replace("#", "");
  return TASKS.findIndex((t) => t.id === key || t.also?.includes(key));
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

const FadeIn = ({ children }: { children: React.ReactNode }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <div style={{ opacity: on ? 1 : 0, transition: "opacity 260ms ease" }}>{children}</div>;
};

const StayingAhead = () => {
  const { hash } = useLocation();
  const [active, setActive] = useState(() => Math.max(0, taskFor(hash)));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const i = taskFor(hash);
    if (i >= 0) setActive(i);
  }, [hash]);

  const open = (i: number, focus = false) => {
    setActive(i);
    const tab = tabRefs.current[i];
    if (!tab) return;
    if (focus) tab.focus({ preventScroll: true });
    const row = tab.parentElement;
    if (row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") open((active + 1) % TASKS.length, true);
    else if (e.key === "ArrowLeft") open((active + TASKS.length - 1) % TASKS.length, true);
    else return;
    e.preventDefault();
  };

  const task = TASKS[active];
  return (
    <section className="bg-[#F8FAFC] pb-16 md:pb-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <LightHead title="A practice families" accent="keep coming back to." />

        <div className="relative mt-10 md:mt-14">
          {TASKS.flatMap((t) => [t.id, ...(t.also ?? [])]).map((id) => (
            <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
          ))}
          <div role="tablist" aria-label="What you do with Willow" onKeyDown={onKey} className="relative flex gap-4 overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible">
            {TASKS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`task-tab-${t.id}`}
                aria-selected={i === active}
                aria-controls="task-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => open(i)}
                className={`flex-shrink-0 border-t-2 pb-2 pr-3 pt-3.5 text-left text-[15px] font-medium leading-snug transition-colors ${
                  i === active ? "border-[#138F8B] text-[#222222]" : "border-gray-200 text-gray-500 hover:text-[#222222]"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          <div id="task-panel" role="tabpanel" aria-labelledby={`task-tab-${task.id}`}>
            <FadeIn key={task.id}>
              <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-gray-600 md:min-h-[3.5rem] md:text-[17px]" style={{ textWrap: "pretty" }}>
                {task.body}
              </p>
              <div className="mt-5">
                {task.print ? (
                  <PrintFrame print={task.print} aspect="1440 / 855">
                    <ScaledScreen w={1440} h={task.h ?? 855}>{task.visual()}</ScaledScreen>
                  </PrintFrame>
                ) : (
                  task.visual()
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayingAhead;
