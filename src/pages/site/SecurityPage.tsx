import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero, PrintFrame, Faq, ClosingCta, SectionHead, WRAP, Eyebrow, usePageMeta, LinkCards } from "@/components/site/blocks";
import { VaultVignette } from "@/components/site/vignettes";
import { CARDS } from "@/content/pages";
import { SUPPORT_EMAIL } from "@/content/siteMap";

/* Security. Every claim here is one the product and the Privacy Policy
   already make (checked Nov 16, 2026). No certifications are claimed. */

const PILLARS = [
  {
    title: "Protected sign-in",
    body: "Attorneys, clients and the people they name confirm each sign-in with a one-time code sent to their email, with the option to trust a device they use often.",
  },
  {
    title: "Encrypted, in transit and at rest",
    body: "Information is encrypted as it travels and where it's stored. Calendar and email connection tokens are encrypted again and kept on our servers only.",
  },
  {
    title: "Access the client controls",
    body: "Access rules are enforced in the database itself. Only the client, their attorney and the people the client names can see a document, and only when the client says so.",
  },
  {
    title: "Nothing released early",
    body: "Anything sealed until a passing stays sealed until the client's attorney verifies it, usually from the death certificate.",
  },
  {
    title: "A record of every access",
    body: "Every view, download, share, release request and release decision is logged, and the record is kept for seven years.",
  },
  {
    title: "AI with firm limits",
    body: "AI reads a document only to draft a summary for the attorney's review. Processing stays in the United States, nothing is used to train AI, and nothing from a connected email or calendar is ever sent to it.",
  },
];

const SecurityPage = () => {
  usePageMeta(
    "Security | Willow",
    "How Willow protects estate plans and client information: protected sign-in, encryption, client-controlled access, a seven-year access record, US hosting and strict limits on AI."
  );
  return (
    <PageShell>
      <PageHero
        eyebrow="Security"
        title="Built for the most private documents a family has."
        subtitle="An estate plan holds a family's finances, health and wishes. Willow is built so the right people see it at the right time, and no one else does."
        secondary={{ label: "Read the Privacy Policy", to: "/privacy" }}
        visual={
          <PrintFrame print="/workshop.jpg" width="84%" frameAspect="16 / 9">
            <VaultVignette />
          </PrintFrame>
        }
      />

      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <SectionHead eyebrow="How we protect it" title="Six commitments, built into the product." />
          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="border-t-2 border-[#14202B] pt-5">
                <div className="text-[13px] font-semibold tabular-nums text-[#0C7370]">0{i + 1}</div>
                <h3 className="mt-2 font-heading text-[1.3rem] font-bold text-[#14202B]">{p.title}</h3>
                <p className="mt-3 text-[16.5px] leading-relaxed text-gray-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#064544] py-16 text-white md:py-20">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-3`}>
          {[
            { k: "Where it lives", v: "Hosted in the United States", b: "Willow's database, files and applications run on Supabase, on Amazon Web Services, and Vercel, in the United States." },
            { k: "Health information", v: "Its own notice and consent", b: "Health details a client adds are covered by a separate Consumer Health Data Notice and a separate consent. Never sold, never used for advertising." },
            { k: "The providers we use", v: "Listed in full", b: "Every service provider that handles information for Willow, what it does, and where.", link: { to: "/subprocessors", label: "See the subprocessors" } },
          ].map((x) => (
            <div key={x.k} className="border-t border-white/20 pt-5">
              <Eyebrow light>{x.k}</Eyebrow>
              <div className="mt-3 font-heading text-[1.35rem] font-bold">{x.v}</div>
              <p className="mt-2 text-[15.5px] leading-relaxed text-white/75">{x.b}</p>
              {x.link && (
                <Link to={x.link.to} className="mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-white/90 hover:text-white">
                  {x.link.label} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <Faq
        title="Security questions"
        items={[
          { q: "Who can see a client's documents?", a: "The client, their attorney, and the people the client chooses, each through their own account. Every view and download is recorded." },
          { q: "Does Willow use client documents to train AI?", a: "No. Documents are read only to draft a summary for the attorney to review, AI processing stays in the United States, and nothing is used to train AI models." },
          { q: "What does Willow access when I connect my email or calendar?", a: "Only what each feature needs, and never the body of an email. The Connected services page lists every permission and what Willow does with it." },
          { q: "Does Willow sell or advertise with client information?", a: "No. Willow doesn't sell client information or use it for advertising." },
          { q: "How do I raise a security question or concern?", a: `Write to ${SUPPORT_EMAIL}. Questions from your firm's IT or compliance team are welcome too.` },
        ]}
      />

      <LinkCards
        eyebrow="Read more"
        title="The details, in writing."
        cards={[
          { label: "Privacy Policy", desc: "How Willow collects, uses and protects personal information.", to: "/privacy", image: "/nyc-street.jpg", eyebrow: "Legal" },
          { label: "Connected services", desc: "Exactly what Willow can access in Google, Microsoft and Zoom.", to: "/connections", image: CARDS["/platform/integrations"].image, eyebrow: "Legal" },
          { label: "Legal center", desc: "Every term and policy in one place.", to: "/legal", image: "/willow-street.jpg", eyebrow: "Legal" },
        ]}
      />
      <ClosingCta />
    </PageShell>
  );
};

export default SecurityPage;
