import React, { useRef, useState } from "react";
import { PageShell, PageHero, WRAP, usePageMeta, H3_CLS, H3_STYLE } from "@/components/site/blocks";
import { US_STATE_PATHS, US_VIEWBOX } from "@/content/usMapPaths";
import { LEGISLATION, LEG_ORDER, LEG_SOURCE, LEG_STATUS, legLine, type LegStatus } from "@/content/legislation";

/* Legislation by state: one map of where digital estate planning is law,
   redrawn from the LIVE Coalition's map in Willow's teals and type (Aaron,
   Nov 25). The darker the state, the further its law goes; stripes are bills
   still moving. Hover or tap a state for its line; the lists under the map
   say the same thing in words, for screen readers and for phones. The data
   and its source notes live in src/content/legislation.ts. */

const STRIPES = "repeating-linear-gradient(45deg, #4DB8B3 0 2px, #E6F5F4 2px 5px)";

const Swatch = ({ s }: { s: LegStatus }) => (
  <span
    aria-hidden
    className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-[3px]"
    style={{ background: s === "active" ? STRIPES : LEG_STATUS[s].fill }}
  />
);

const byStatus = (s: LegStatus) =>
  Object.entries(LEGISLATION)
    .filter(([, e]) => e.status === s)
    .sort(([, a], [, b]) => a.name.localeCompare(b.name));

/* The state under the pointer (or the last one tapped), and where to show
   its card, in the map box's own pixels */
type Pick = { abbr: string; x: number; y: number };

const LegislationMap = () => {
  const [pick, setPick] = useState<Pick | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const on = pick?.abbr ?? null;
  const e = on ? LEGISLATION[on] : null;
  const place = (abbr: string, ev: React.PointerEvent | React.MouseEvent) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPick({ abbr, x: ev.clientX - r.left, y: ev.clientY - r.top });
  };
  const boxW = boxRef.current?.offsetWidth ?? 1000;
  return (
    <div>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2.5">
        {LEG_ORDER.map((s) => (
          <li key={s} className="flex items-center gap-2 text-[14px] text-gray-600">
            <Swatch s={s} />
            {LEG_STATUS[s].label}
          </li>
        ))}
      </ul>

      <div ref={boxRef} className="relative mt-8">
        <svg
          viewBox={US_VIEWBOX}
          className="h-auto w-full"
          role="img"
          aria-label="Map of the United States showing which states have electronic wills laws, which also cover other estate documents, and which have bills in the 2026 session. The same information is listed below the map."
          onPointerLeave={(ev) => ev.pointerType === "mouse" && setPick(null)}
        >
          <defs>
            <pattern id="leg-active" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="5" height="5" fill="#E6F5F4" />
              <rect width="2" height="5" fill="#4DB8B3" />
            </pattern>
          </defs>
          {Object.entries(US_STATE_PATHS).map(([abbr, d]) => (
            <path
              key={abbr}
              d={d}
              fill={LEG_STATUS[LEGISLATION[abbr]?.status ?? "none"].fill}
              stroke="#FFFFFF"
              strokeWidth={0.75}
              strokeLinejoin="round"
              className="cursor-pointer"
              style={{ opacity: on && on !== abbr ? 0.45 : 1, transition: "opacity 150ms ease" }}
              onPointerMove={(ev) => ev.pointerType === "mouse" && place(abbr, ev)}
              onClick={(ev) => place(abbr, ev)}
            />
          ))}
          {on && <path d={US_STATE_PATHS[on]} fill="none" stroke="#222222" strokeWidth={1.5} strokeLinejoin="round" pointerEvents="none" />}
        </svg>

        {/* The state's card, just above the pointer, kept inside the box */}
        {e && pick && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute z-10 w-max max-w-[18rem] rounded-lg border border-gray-200 bg-white px-4 py-3 text-left shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            style={{
              left: Math.min(Math.max(pick.x, 150), boxW - 150),
              top: pick.y,
              transform: pick.y < 110 ? "translate(-50%, 18px)" : "translate(-50%, calc(-100% - 14px))",
            }}
          >
            <div className="text-[16px] font-medium text-[#222222]" style={H3_STYLE}>
              {e.name}
            </div>
            <div className="mt-1.5 flex items-start gap-2 text-[14px] leading-snug text-gray-600">
              <span className="mt-[3px]">
                <Swatch s={e.status} />
              </span>
              <span>
                {e.status !== "none" && <span className="block text-[#222222]">{LEG_STATUS[e.status].label}</span>}
                {legLine(e)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RegulatoryLibraryPage = () => {
  usePageMeta(
    "Legislation by State | Willow",
    "Where electronic wills and other digital estate planning laws stand in every state, and where bills are moving in 2026."
  );
  return (
    <PageShell>
      <PageHero
        eyebrow="Legislation by state"
        title="Where digital estate planning"
        accent="is already law."
        subtitle="The states that have passed electronic wills laws, the ones that also cover documents like powers of attorney, and where bills are moving in 2026."
        visualAspect="975 / 610"
        visual={<LegislationMap />}
      />

      <section className="bg-[#F8FAFC] pb-24 md:pb-32">
        <div className={`${WRAP} max-w-6xl lg:px-10`}>
          <div className="grid gap-12 border-t border-gray-200 pt-10 md:grid-cols-3 md:gap-10 md:pt-12">
            {(["both", "ewill", "active"] as const).map((s) => (
              <div key={s}>
                <h2 className={`flex items-center gap-2.5 ${H3_CLS} text-[#222222]`} style={H3_STYLE}>
                  <Swatch s={s} />
                  {LEG_STATUS[s].label}
                </h2>
                <ul className="mt-4">
                  {byStatus(s).map(([abbr, e]) => (
                    <li key={abbr} className="flex items-baseline justify-between gap-4 border-b border-gray-200 py-2.5 text-[15px]">
                      <span className="text-[#222222]">{e.name}</span>
                      <span className="text-right text-gray-500 tabular-nums">{e.year ?? e.bills ?? ""}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-gray-500">
            Source: the{" "}
            <a href={LEG_SOURCE.href} target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 underline-offset-2 hover:text-[#0C7370]">
              {LEG_SOURCE.name}
            </a>{" "}
            legislative map, updated {LEG_SOURCE.updated}. Years are each state&rsquo;s most recent law in this area. This page is general information, not legal advice.
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default RegulatoryLibraryPage;
