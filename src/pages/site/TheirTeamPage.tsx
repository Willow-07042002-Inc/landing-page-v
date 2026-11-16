import React from "react";
import { PageShell, PageHero, PrintFrame, Faq, LinkCards, ClosingCta, WRAP, usePageMeta } from "@/components/site/blocks";
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
      title: "For trustees, what the trust pays and when.",
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
  <div className="sticky top-16 z-30 border-y border-gray-200 bg-[#FCFCFD]/95 backdrop-blur-md">
    <div className={`${WRAP} flex gap-1 overflow-x-auto py-2`}>
      {ROLES.map((r) => (
        <a
          key={r.id}
          href={`#${r.id}`}
          className="press whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          {r.label}
        </a>
      ))}
    </div>
  </div>
);

const RoleSection = ({ role }: { role: Role }) => (
  <section id={role.id} className={`scroll-mt-32 py-16 md:py-24 ${role.tint ? "bg-[#F1F6F6]" : ""}`}>
    <div className={WRAP}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
        <div>
          <div className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-[#0C7370]">{role.eyebrow}</div>
          <h2 className="mt-4 font-heading text-[1.9rem] font-bold leading-[1.18] text-[#14202B] md:text-[2.4rem]" style={{ textWrap: "balance" }}>
            {role.title}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-600">{role.lead}</p>
          <ol className="mt-8 space-y-6">
            {role.points.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-gray-300 pt-5">
                <span className="font-heading text-[1.35rem] font-bold leading-none text-[#128F8B]">{i + 1}</span>
                <span>
                  <span className="block text-[17px] font-semibold text-[#14202B]">{p.title}</span>
                  <span className="mt-1.5 block text-[15.5px] leading-relaxed text-gray-600">{p.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:sticky lg:top-36 lg:self-start">
          <PrintFrame print={role.print} width="92%" frameAspect="1 / 0.78">
            {role.visual}
          </PrintFrame>
        </div>
      </div>
      {role.extra && (
        <div className="mt-16 grid items-center gap-10 rounded-2xl border border-gray-200 bg-white p-6 md:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div>
            <h3 className="font-heading text-[1.5rem] font-bold leading-snug text-[#14202B]">{role.extra.title}</h3>
            <p className="mt-3 text-[16.5px] leading-relaxed text-gray-600">{role.extra.body}</p>
          </div>
          <PrintFrame print="self">{role.extra.visual}</PrintFrame>
        </div>
      )}
    </div>
  </section>
);

const TheirTeamPage = () => {
  usePageMeta(
    "For the People in the Plan | Willow",
    "Executors, trustees, guardians and agents each get their own Willow portal: everything released when it's ready, instructions included, and the family's attorney within reach."
  );
  return (
    <PageShell>
      <PageHero
        eyebrow="Solutions · Their team"
        title="Everyone your client names, ready when it's their turn."
        subtitle="Executors, trustees, guardians and agents each get their own portal. Everything waits there until it's needed, and the attorney who knows the family is one tap away."
        secondary={{ label: "See the client experience", to: "/for-clients" }}
        visual={
          <PrintFrame print="/central-park.jpg" width="86%" frameAspect="16 / 9">
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
        eyebrow="Keep exploring"
        title="Related"
        cards={["/for-clients", "/platform/sharing", "/platform/plan-summaries"].map((p) => ({ ...CARDS[p], to: p }))}
      />
      <ClosingCta />
    </PageShell>
  );
};

export default TheirTeamPage;
