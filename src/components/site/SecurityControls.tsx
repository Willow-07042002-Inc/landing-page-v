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

const CONTROLS = [
  {
    title: "Protected sign-in",
    body: "Attorneys, clients and the people they name confirm each sign-in with a one-time code sent to their email, with the option to trust a device they use often.",
  },
  {
    title: "Encrypted and kept in the United States",
    body: "Information is encrypted as it travels and where it’s stored. Willow’s database, files and applications run on Supabase, on Amazon Web Services, and Vercel, in the United States.",
  },
  {
    title: "Access the client controls",
    body: "Only the client, their attorney and the people the client names can see a document, and only when the client says so. The rules are enforced in the database itself.",
  },
  {
    title: "Nothing released early",
    body: "Anything sealed until a passing stays sealed until the client’s attorney verifies it, usually from the death certificate.",
  },
  {
    title: "A record of every access",
    body: "Every view, download, share, release request and release decision is logged, and the record is kept for seven years.",
  },
  {
    title: "AI with firm limits",
    body: "AI reads a document only to draft a summary for you to review. Processing stays in the United States, nothing is used to train AI, and nothing from a connected email or calendar is ever sent to it.",
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
