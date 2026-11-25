import React from "react";
import type { NewsArticle } from "@/content/news";

/* One article as a card: its illustration, the outlet's logo and the date,
   the headline, its opening lines, and a link out. Used on the In the news
   page and the About page, so the two always match. */
const NewsCard = ({ article: a, headingLevel = 2 }: { article: NewsArticle; headingLevel?: 2 | 3 }) => {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <a
      href={a.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      {a.image && (
        <div className="overflow-hidden" style={{ aspectRatio: "16 / 8" }}>
          <img src={a.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        </div>
      )}
      <div className="p-7 md:p-9">
        <div className="flex items-center gap-3">
          {a.logo ? (
            <img src={a.logo} alt={a.outlet} style={{ height: a.logoH ?? 16 }} className="w-auto" />
          ) : (
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#0C7370]">{a.outlet}</span>
          )}
          <span className="text-[12px] font-medium text-gray-400">{a.date}</span>
        </div>
        <Heading className="mt-3 text-[20px] font-medium leading-snug text-[#222222]" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
          {a.title}
        </Heading>
        <p className="mt-3 text-[15px] text-gray-600" style={{ lineHeight: 1.6 }}>
          {a.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-[#128F8B]">
          Read the article
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </a>
  );
};

export default NewsCard;
