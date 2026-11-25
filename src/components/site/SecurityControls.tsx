import React, { useState } from "react";
import { Plus } from "lucide-react";
import { WRAP } from "@/components/site/blocks";

/* Security on the For attorneys page: the heading and line on the left, in
   this page's header style (light serif, an italic teal second line) and the
   hero's subheader style; ruled rows on the right in the homepage FAQ's type
   and spacing, each closed until clicked. The section keeps the same space
   above it as the tiles have above theirs. No label, icons or button. Willow holds no certifications, so
   the rows are its own commitments, each one the Security page already makes
   (checked against the product and the Privacy Policy, Nov 16, 2026). */

/* Six statements, in the order attorneys ask them (Aaron, Nov 25): the
   For attorneys section and the Security page's six commitments and FAQ,
   folded into one list. Each title is a plain statement, each line one
   sentence. Every claim is one the product or the Privacy Policy makes:
   per-item release (now, on incapacity, after a passing, or the client's own
   condition) is ReleaseSelector.tsx; meet-first is access-meeting.ts. */
const CONTROLS = [
  {
    title: "Clients control when their team sees their documents",
    body: "Everyone your client names gets their own account and knows where everything is, and your client can lock any part of the plan so it isn’t released too early.",
  },
  {
    title: "We never train AI on your clients’ data",
    body: "AI reads a plan only to draft the summary you approve, runs in the United States and never sees your email or calendar.",
  },
  {
    title: "Client data is encrypted, kept in the US and never sold",
    body: "Everyone signs in with a one-time code, and everything is encrypted as it travels and where it’s stored, on Supabase, Amazon Web Services and Vercel.",
  },
  {
    title: "Nothing locked is opened until you verify it",
    body: "Anything locked until a passing stays locked until you confirm it, usually from the death certificate, and you can choose to meet the family first.",
  },
  {
    title: "Every access is on record",
    body: "Every view, download, share and release decision is logged and kept for seven years.",
  },
  {
    title: "We only take what we need from your email and calendar",
    body: "Willow never reads the body of an email, and your connection is encrypted and kept on our servers only.",
  },
];

const SecurityControls = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="security" className="bg-[#F8FAFC] py-16 md:py-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-2/5 md:pr-6">
            <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
              Built for the most private
              <span className="block italic text-[#138F8B]">documents a family has.</span>
            </h2>
            <p className="mt-5 max-w-md text-base text-gray-500 sm:text-[17px] md:text-lg" style={{ lineHeight: 1.55, letterSpacing: "0.01em", textWrap: "pretty" }}>
              An estate plan holds a family’s finances, health and wishes. Willow is built so the right people see it at the right time, and no one else does.
            </p>
          </div>

          <ul className="border-t border-gray-200 md:w-3/5">
            {CONTROLS.map(({ title, body }, i) => {
              const on = open === i;
              return (
                <li key={title} className="border-b border-gray-200">
                  <button
                    type="button"
                    id={`security-row-${i}`}
                    aria-expanded={on}
                    aria-controls={`security-detail-${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-heading text-xl font-semibold text-[#222222] md:text-2xl" style={{ lineHeight: 1.25 }}>
                      {title}
                    </span>
                    <Plus
                      aria-hidden
                      strokeWidth={1.5}
                      className={`h-6 w-6 flex-shrink-0 transition-[transform,color] duration-200 ${on ? "text-gray-500" : "text-gray-400 group-hover:text-gray-600"}`}
                      style={{ transform: on ? "rotate(45deg)" : "none", transitionTimingFunction: "var(--ease-out)" }}
                    />
                  </button>
                  <div
                    id={`security-detail-${i}`}
                    role="region"
                    aria-labelledby={`security-row-${i}`}
                    style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", transition: "grid-template-rows 340ms var(--ease-in-out)" }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p
                        className="max-w-2xl pb-6 pr-8 text-[17px] leading-relaxed text-gray-600 md:text-lg"
                        style={{ opacity: on ? 1 : 0, transition: on ? "opacity 260ms ease 120ms" : "opacity 120ms ease", textWrap: "pretty" }}
                      >
                        {body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SecurityControls;
