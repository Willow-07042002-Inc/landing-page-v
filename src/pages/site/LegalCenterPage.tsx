import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageShell, WRAP, Eyebrow, TwoTone, usePageMeta } from "@/components/site/blocks";
import { DOCS, VERSION_DATE } from "@/pages/legal/legalDocs";
import { openCookieSettings } from "@/lib/consent";
import { SUPPORT_EMAIL } from "@/content/siteMap";

/* One page for every term and policy, grouped by who it's for. Served at
   /legal and at /terms, which the apps link to. The documents themselves stay
   on their own pages. */

type Item = { name: string; desc: string; to?: string; href?: string; onClick?: () => void };

const GROUPS: { title: string; lead: string; items: Item[] }[] = [
  {
    title: "For clients and the people they name",
    lead: "The terms for people who keep their plan in Willow, and for anyone they share it with.",
    items: [
      { name: DOCS.memberTerms.name, desc: DOCS.memberTerms.forWhom, to: DOCS.memberTerms.path },
      { name: DOCS.recipientTerms.name, desc: DOCS.recipientTerms.forWhom, to: DOCS.recipientTerms.path },
    ],
  },
  {
    title: "For law firms",
    lead: "The agreement a firm signs through its Order Form, and the data terms that come with it.",
    items: [
      { name: DOCS.firmAgreement.name, desc: "For law firms that use Willow. Firms accept it by signing an Order Form.", to: DOCS.firmAgreement.path },
      { name: "Data Processing Addendum", desc: "Exhibit A to the Firm Subscription Agreement.", to: "/firm-agreement#exhibit-a" },
    ],
  },
  {
    title: "Privacy",
    lead: "How information is collected, used, protected and shared, and with which providers.",
    items: [
      { name: DOCS.privacy.name, desc: DOCS.privacy.forWhom, to: DOCS.privacy.path },
      { name: DOCS.healthDataNotice.name, desc: DOCS.healthDataNotice.forWhom, to: DOCS.healthDataNotice.path },
      { name: "Subprocessors", desc: "The service providers that process data for Willow, and where.", to: "/subprocessors" },
      { name: "Connected services", desc: "The accounts an attorney can connect to Willow, and what each one accesses.", to: "/connections" },
      { name: "Cookie settings", desc: "Change what this website may store in your browser.", onClick: openCookieSettings },
    ],
  },
  {
    title: "Requests",
    lead: "Asking for a client's documents after a passing, or anything else.",
    items: [
      { name: "Requesting documents", desc: "How to ask for a Member's documents after their death, or whether a document is on file.", to: "/request-documents" },
      { name: "Contact us", desc: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
    ],
  },
];

const Row = ({ item }: { item: Item }) => {
  const inner = (
    <>
      <span className="min-w-0">
        <span className="block text-[17px] font-semibold text-[#222222] group-hover:text-[#0C7370]">{item.name}</span>
        <span className="mt-1 block text-[15px] leading-relaxed text-gray-600">{item.desc}</span>
      </span>
      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#0C7370]" />
    </>
  );
  const cls = "group flex w-full items-start justify-between gap-6 py-5 text-left";
  if (item.onClick)
    return (
      <button type="button" onClick={item.onClick} className={cls}>
        {inner}
      </button>
    );
  if (item.href)
    return (
      <a href={item.href} className={cls}>
        {inner}
      </a>
    );
  return (
    <Link to={item.to!} className={cls}>
      {inner}
    </Link>
  );
};

const LegalCenterPage = () => {
  usePageMeta(
    "Legal Center | Willow",
    "Willow's Member Terms, Recipient Terms, Firm Subscription Agreement, Privacy Policy, Consumer Health Data Notice, subprocessors and connected services, in one place."
  );
  return (
    <PageShell>
      {/* Set like every other page's hero (PageHero): centred, light serif with
          an italic teal line; no demo button here */}
      <section className="pb-14 pt-14 md:pb-20 md:pt-20">
        <div className={`${WRAP} enter flex flex-col items-center text-center`}>
          <div className="mb-5">
            <Eyebrow>Legal center</Eyebrow>
          </div>
          <h1 className="mb-5 max-w-4xl font-heading text-[2rem] font-light text-[#222222] sm:text-4xl md:text-5xl lg:text-[3.25rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
            <TwoTone lead="Every term and policy," accent="in one place." italic />
          </h1>
          <p className="max-w-2xl text-base text-gray-500 sm:text-[17px] md:text-lg" style={{ lineHeight: 1.55, letterSpacing: "0.01em" }}>
            Which terms apply depends on how you use Willow. Each document below is the current version, last updated {VERSION_DATE}. Earlier versions are available on request at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#0C7370] underline underline-offset-2">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
      <section className="pb-20 md:pb-28">
        <div className={`${WRAP} space-y-14`}>
          {GROUPS.map((g) => (
            <div key={g.title} className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-[1.45rem] font-bold leading-snug text-[#222222]">{g.title}</h2>
                <p className="mt-2 text-[15.5px] leading-relaxed text-gray-600">{g.lead}</p>
              </div>
              <div className="divide-y divide-gray-200 border-y border-gray-200">
                {g.items.map((it) => (
                  <Row key={it.name} item={it} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default LegalCenterPage;
