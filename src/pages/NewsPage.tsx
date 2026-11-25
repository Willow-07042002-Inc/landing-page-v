import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/site/NewsCard";
import { NEWS_ARTICLES } from "@/content/news";

/* News & writing — a simple dated list that grows one entry per article
   (content/news.ts, shared with the About page). Each item links out to the
   piece (or, later, to posts of our own). */
const NewsPage = () => (
  <div className="min-h-screen flex flex-col bg-[#F8FAFC]" style={{ color: "#222222" }}>
    <Navbar />

    <main className="flex-1">
      <section className="pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">News</div>
            <h1 className="font-heading text-[2rem] font-light text-[#222222] sm:text-4xl md:text-5xl lg:text-[3.25rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
              Willow in the news
            </h1>
            <p className="mt-5 text-base text-gray-500 sm:text-[17px] md:text-lg" style={{ lineHeight: 1.55, letterSpacing: "0.01em", textWrap: "pretty" }}>
              Coverage, announcements, and writing on where estate planning is headed.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {NEWS_ARTICLES.map((a) => (
              <NewsCard key={a.href} article={a} />
            ))}
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default NewsPage;
