/* Willow's coverage, newest first: one source for the In the news page and
   the About page, so both show the same articles on the same cards
   (components/site/NewsCard). Each item links out to the piece. */

export type NewsArticle = {
  outlet: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
  image?: string;
  logo?: string;
  logoH?: number;
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    outlet: "Business Insider",
    logo: "/press-business-insider.svg",
    logoH: 20,
    date: "September 15, 2026",
    title: "$124 Trillion Is Changing Hands. Willow Announces Pilot to Prepare Estate-Planning Attorneys for the Next Generation",
    // The article's own description line
    excerpt:
      "Willow has announced a pilot program with five boutique trusts and estates firms as the company develops a digital platform designed around the evolving requirements of electronic estate planning.",
    href: "https://markets.businessinsider.com/news/currencies/124-trillion-is-changing-hands-willow-announces-pilot-to-prepare-estate-planning-attorneys-for-the-next-generation-1036548412",
    image: "/news/bi-product-full.jpg",
  },
  {
    outlet: "USA Today",
    logo: "/press-usa-today.svg",
    logoH: 15,
    date: "September 9, 2026",
    title: "Digital Estate Planning Arrived Six Years Ago. The Technology Is Finally Catching Up.",
    // The article's own opening lines
    excerpt:
      "A week after the funeral, the daughter calls her father's lawyer. Everyone in the family is certain there was a will. They remember the appointment. They remember him coming home and saying it was taken care of. But no one can find it.",
    href: "https://www.usatoday.com/press-release/story/42659/digital-estate-planning-arrived-six-years-ago-the-technology-is-finally-catching-up/",
    image: "/news/usatoday-digital-estate-planning.jpg",
  },
];
