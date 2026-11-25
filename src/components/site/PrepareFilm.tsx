import React, { useEffect, useRef, useState } from "react";
import type { FilmProps } from "@/components/site/film-kit";
import type { Chapter } from "@/components/site/StayingAhead";
import { VignetteFrame } from "@/components/ProductVignettes";
import { CategoriesVignette, SectionShareVignette, ReleaseTimingVignette, RoleChangeVignette } from "@/components/ClientVignettes";

/* For clients' "Prepare their team", set out as For attorneys' "A practice
   families keep coming back to" (Aaron, Nov 25): the chapters ruled on the
   left, the client's own screen on the right on the light print. Each
   chapter's screen plays once when it opens, its rule fills, and the section
   moves to the next chapter on its own, stopping on the last. The words are
   the four blocks this section used to stack, said shorter. */

export const PREPARE_CHAPTERS: Chapter[] = [
  {
    id: "gather",
    title: "Gather what they’ll need",
    body: "Beyond the legal documents: accounts, insurance, passwords, the pediatrician’s number. Willow tells your clients what to gather and where it goes, so it’s waiting when someone has to step in.",
  },
  {
    id: "share",
    title: "Give each person what’s theirs",
    body: "An executor needs different things than a guardian. Willow suggests who should receive what, your client approves it, and everyone they’ve named gets their own portal.",
  },
  {
    id: "control",
    title: "They decide what opens, and when",
    body: "Clients put everything in place today and choose when each piece is released. The will stays sealed until you verify a passing; until then, the people they’ve named see only that something is waiting.",
  },
  {
    id: "stay-current",
    title: "Keep it up to date",
    body: "When you update a plan and responsibilities move, Willow proposes exactly what to change in what your client has already shared. They review it once and approve.",
  },
];

const SCREENS = [CategoriesVignette, SectionShareVignette, ReleaseTimingVignette, RoleChangeVignette];

/** How long each chapter stays open before the next one: the longest screen
    finishes at 3.9s, then it rests long enough to read */
const PREPARE_MS = 7000;

const PrepareFilm = ({ chapter, replay, onChapter, onStart, rewatch = false }: FilmProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
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

  useEffect(() => {
    if (!seen) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    onStart(reduced ? 0 : PREPARE_MS);
    if (rewatch || reduced || chapter >= SCREENS.length - 1) return;
    const t = window.setTimeout(() => onChapter(chapter + 1), PREPARE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, chapter, replay]);

  const Screen = SCREENS[chapter] ?? SCREENS[0];
  return (
    <div ref={ref}>
      <VignetteFrame>
        <Screen key={`${chapter}-${replay}`} />
      </VignetteFrame>
    </div>
  );
};

export default PrepareFilm;
