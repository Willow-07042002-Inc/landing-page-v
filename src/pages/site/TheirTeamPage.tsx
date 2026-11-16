import React from "react";
import { PageShell, PageHero, PrintFrame, Faq, LinkCards, ClosingCta, WRAP, usePageMeta, SectionHead, FeatureRow } from "@/components/site/blocks";
import { RecipientPortalVignette, GuardianChildrenVignette, AgentPortalVignette } from "@/components/site/vignettes";
import { TrustVignette } from "@/components/ClientVignettes";
import { CARDS } from "@/content/pages";

/* The people a client names (executors, trustees, guardians, agents) on one
   page, a section each. Every section makes the same three promises: their
   own portal, everything released when it's ready, and the attorney who knows
   the family within reach. */

type Role = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: { title: string; body: string }[];
  visual: React.ReactNode;
  print: string;
  extra?: { title: string; body: string; visual: React.ReactNode };
  tint?: boolean;
};

const ROLES: Role[] = [
  {
    id: "executors-trustees",
    label: "Executors & trustees",
    eyebrow: "Executors & trustees",
    title: "Everything they need to settle the estate, waiting for them.",
    lead: "The people who carry out the plan get their own portal. They can see today that something is waiting for them, and it all opens the moment it's needed.",
    points: [
      {
        title: "Their own portal",
        body: "Executors and trustees sign in to their own account and see only what the client chose to share with them.",
      },
      {
        title: "Released when it's ready, instructions included",
        body: "Once the attorney verifies the passing, the will, the trust and the client's own instructions open together: where everything is, who to call first, and what they wanted.",
      },
      {
        title: "The attorney who knows the family",
        body: "One tap books a meeting with the attorney who drafted the plan, so the estate starts with someone who already knows the people and the property.",
      },
    ],
    visual: <RecipientPortalVignette state="released" />,
    print: "/hudson-bridge.jpg",
    extra: {
      title: "What the trust pays, and when.",
      body: "A trustee sees the payout schedule in plain English: what can be spent along the way, and what each beneficiary receives at each age.",
      visual: <TrustVignette />,
    },
  },
  {
    id: "guardians",
    label: "Guardians",
    eyebrow: "Guardians",
    title: "Everything about the children, in one place.",
    lead: "Parents gather what a guardian would need, child by child, and share it now or once it's needed. On the hardest day, it's all there.",
    points: [
      {
        title: "Child by child",
        body: "Schools and education plans, doctors and health details, routines, and the people who matter in each child's life.",
      },
      {
        title: "In the parents' words",
        body: "Guidance on values, routines and wishes, written by the parents for the person who'll raise their children.",
      },
      {
        title: "Funds, pets and the attorney",
        body: "What's set aside for each child, who looks after the pets, and a direct line to the family's attorney.",
      },
    ],
    visual: <GuardianChildrenVignette />,
    print: "/santa-monica.jpg",
    tint: true,
  },
  {
    id: "agents",
    label: "Agents & health care proxies",
    eyebrow: "Agents & health care proxies",
    title: "Everything they need to act, in one place.",
    lead: "Agents under a power of attorney and health care proxies have their documents shared now, so they can step in the day they're needed.",
    points: [
      {
        title: "Every power, explained",
        body: "Banking, property, taxes and health care decisions, each with a line on what it means in practice.",
      },
      {
        title: "Their documents, ready",
        body: "The power of attorney and health care proxy, shared now and open in their portal whenever they need them.",
      },
      {
        title: "Who's next in line",
        body: "If they can't serve, they can see who steps in. And the family's attorney is a tap away.",
      },
    ],
    visual: <AgentPortalVignette />,
    print: "/golden-gate.jpg",
  },
];

const RoleNav = () => (
  <div className="sticky top-16 z-30 border-y border-gray-200 bg-[#F8FAFC]/95 backdrop-blur-md">
    <div className={`${WRAP} flex justify-start gap-7 overflow-x-auto md:justify-center`}>
      {ROLES.map((r) => (
        <a key={r.id} href={`#${r.id}`} className="whitespace-nowrap py-3.5 text-[15px] font-medium text-gray-500 transition-colors hover:text-[#138F8B]">
          {r.label}
        </a>
      ))}
    </div>
  </div>
);

const splitTitle = (t: string) => {
  const c = t.indexOf(", ");
  return c > 0 ? { title: t.slice(0, c + 1), accent: t.slice(c + 2) } : { title: t };
};

const RoleSection = ({ role }: { role: Role }) => {
  const head = splitTitle(role.title);
  return (
    <section id={role.id} className={`scroll-mt-32 py-16 md:py-24 ${role.tint ? "bg-white" : "bg-[#F8FAFC]"}`}>
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <div className="mb-12 md:mb-16">
          <SectionHead eyebrow={role.eyebrow} title={head.title} accent={head.accent} lead={role.lead} />
        </div>
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          <div className="w-full lg:w-[38.2%]">
            {role.points.map((p, i) => (
              <div key={p.title} className={`py-5 ${i === 0 ? "border-t-2 border-[#222222]" : "border-t border-gray-200"}`}>
                <h3 className="font-heading text-xl font-bold text-[#222222]" style={{ lineHeight: 1.35 }}>
                  {p.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600 lg:text-base">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-[61.8%]">
            <PrintFrame print={role.print}>{role.visual}</PrintFrame>
          </div>
        </div>
        {role.extra && (
          <div className="mt-16 md:mt-24">
            <FeatureRow
              flip
              r={{ eyebrow: "For trustees", title: role.extra.title, body: role.extra.body, visual: role.extra.visual, print: "self" }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

const TheirTeamPage = () => {
  usePageMeta(
    "For the People in the Plan | Willow",
    "Executors, trustees, guardians and agents each get their own Willow portal: everything released when it's ready, instructions included, and the family's attorney within reach."
  );
  return (
    <PageShell quotes>
      <PageHero
        eyebrow="Solutions · Their team"
        title="Everyone your client names,"
        accent="ready when it's their turn."
        subtitle="Executors, trustees, guardians and agents each get their own portal. Everything waits there until it's needed, and the attorney who knows the family is one tap away."
        secondary={{ label: "See the client experience", to: "/for-clients" }}
        visual={
          <PrintFrame print="/central-park.jpg" className="shadow-2xl">
            <RecipientPortalVignette state="sealed" />
          </PrintFrame>
        }
      />
      <RoleNav />
      {ROLES.map((r) => (
        <RoleSection key={r.id} role={r} />
      ))}
      <Faq
        items={[
          {
            q: "How does an executor get access?",
            a: "They let the attorney know from their portal. The attorney verifies the passing, usually from the death certificate, and everything the client sealed for them opens.",
          },
          {
            q: "What does someone see before then?",
            a: "That something is waiting for them, and who it's from. Not what it says.",
          },
          {
            q: "Can a client change who they've named?",
            a: "Any time. When an updated plan gives someone a new role, Willow proposes what to change in what's already been shared, and the client approves it.",
          },
          {
            q: "Does Willow file anything with the court?",
            a: "No. Willow keeps copies of the signed documents and explains them. The attorney guides the estate through probate.",
          },
        ]}
      />
      <LinkCards
        eyebrow="Related"
        title="Keep exploring."
        cards={["/for-clients", "/platform/sharing", "/platform/plan-summaries"].map((p) => ({ ...CARDS[p], to: p }))}
      />
      <ClosingCta shot={<RecipientPortalVignette state="sealed" />} title="Give the people in the plan a place to start." body="Book a demo and see the portal your clients' executors, guardians and agents receive, and how it brings them back to you." />
    </PageShell>
  );
};

export default TheirTeamPage;
