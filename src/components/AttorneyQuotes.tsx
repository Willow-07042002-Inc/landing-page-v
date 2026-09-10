import React from "react";

/* Two attorney quotes — the closing beat before the footer on every
   marketing page. Background inherits the page's ground. */
const QUOTES = [
  {
    quote:
      "This is something the industry has needed for a while. It's exciting to see a modern estate planning solution that respects and enhances the expertise of lawyers.",
    role: "Florida Estate Planning Attorney",
  },
  {
    quote:
      "What appeals to me about Willow's approach is the flexibility it offers — attorneys don't have to choose between jumping into the deep end or playing catch-up later.",
    role: "New York Estate Planning Attorney",
  },
];

const AttorneyQuotes = () => (
  <section className="py-12 md:py-16">
    <div className="container mx-auto max-w-5xl px-4 md:px-8">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        {QUOTES.map((r) => (
          <figure key={r.role} className="flex flex-col text-center">
            <blockquote className="font-heading text-base md:text-[17px] lg:text-lg leading-relaxed text-[#222222]" style={{ textWrap: "balance" }}>
              "{r.quote}"
            </blockquote>
            <figcaption className="mt-4 pt-3">
              <span className="mx-auto mb-3 block w-10 border-t border-gray-300" />
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">{r.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default AttorneyQuotes;
