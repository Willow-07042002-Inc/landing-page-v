import React from "react";
import { Link } from "react-router-dom";
import { LegalShell, usePageMeta, H2, P, UL, LI, B } from "@/components/LegalPage";

/* Content source: Willow-Terms-of-Service.md (B2B rewrite), placeholders
   resolved per Aaron (Sept 2026): 90/60/30-day windows as drafted, 12-month
   fee liability cap, and all contact points route to Aaron directly. */

const PrivacyLink = () => (
  <Link to="/privacy" className="font-semibold text-[#128F8B] hover:text-[#0C7370]">
    Privacy Policy
  </Link>
);

const TOC = [
  { id: "who-we-are", label: "Who we are" },
  { id: "what-willow-does", label: "What Willow does" },
  { id: "what-willow-is-not", label: "What Willow is not" },
  { id: "your-data", label: "Your firm's and clients' data" },
  { id: "accounts", label: "Accounts, seats, and security" },
  { id: "beta", label: "Beta features and Design Partners" },
  { id: "payment", label: "Payment" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "termination", label: "Suspension and termination" },
  { id: "availability", label: "Availability and support" },
  { id: "ownership", label: "Ownership" },
  { id: "liability", label: "Liability" },
  { id: "privacy", label: "Privacy" },
  { id: "client-death", label: "When a client dies" },
  { id: "governing-law", label: "Governing law and disputes" },
  { id: "changes", label: "Changes to these Terms" },
  { id: "contact", label: "Getting in touch" },
];

const Terms = () => {
  usePageMeta(
    "Terms of Service | Willow",
    "The agreement between Willow and the estate planning firms that use it — what the platform does, what stays the attorney's responsibility, and how data, payment, and termination work."
  );

  return (
    <LegalShell eyebrow="Legal" title="Terms of Service" date="September 4, 2026" toc={TOC}>
      <P>
        Welcome to Willow. We build software for estate attorneys — so your clients' plans don't end up signed, printed, and forgotten in
        a drawer.
      </P>
      <P>Below are the ground rules. We've kept them in plain English, because you already read enough of the other kind.</P>

      <H2 id="who-we-are">Who We Are</H2>
      <P>
        Willow is operated by <B>07042002 Inc.</B>, a Delaware corporation ("Willow," "we," "us," or "our").
      </P>
      <P>
        These Terms are an agreement between Willow and <B>your firm</B> — the law firm, professional corporation, or solo practice that
        signs up ("you," "your firm," or "Customer"). Not between Willow and your individual attorneys, and not between Willow and your
        clients.
      </P>
      <P>
        By creating an account or using Willow, you confirm you're authorized to bind your firm to these Terms. If you're not, don't
        accept them.
      </P>

      <H2 id="what-willow-does">What Willow Does</H2>
      <P>Willow is an end-to-end estate planning platform for attorneys. Depending on your plan, it includes:</P>
      <UL>
        <LI>
          <B>Document preparation</B> — building estate planning documents from the information your firm enters
        </LI>
        <LI>
          <B>Digital signing</B> — execution built for state-specific estate planning requirements, not generic e-signature
        </LI>
        <LI>
          <B>Notarization</B> — where your jurisdiction permits and your plan includes it
        </LI>
        <LI>
          <B>Secure storage</B> — signed documents held and retrievable
        </LI>
        <LI>
          <B>Family access</B> — controlled portals so the people who need a plan can find it
        </LI>
        <LI>
          <B>Probate recordkeeping</B> — organized records for when a plan is actually administered
        </LI>
      </UL>
      <P>
        The specific features, seats, and term available to your firm are set out in your <B>Order Form</B> or the plan you select at
        signup. If anything in an Order Form conflicts with these Terms, the Order Form wins.
      </P>

      <H2 id="what-willow-is-not">What Willow Is Not</H2>
      <P>This is the most important section in the document, so we're not burying it.</P>
      <P>
        <B>Willow does not practice law and does not give legal advice.</B> We are software. We don't have an attorney-client
        relationship with your clients — you do.
      </P>
      <P>Specifically:</P>
      <UL>
        <LI>
          <B>You are the attorney of record.</B> Every professional judgment belongs to you: whether a document is appropriate, whether
          it's valid, whether it reflects your client's intent, whether execution formalities were met.
        </LI>
        <LI>
          <B>Our templates and workflows are starting points, not opinions.</B> You are responsible for reviewing every document before
          your client signs it.
        </LI>
        <LI>
          <B>State law is your call.</B> Willow supports signing in all 50 states, and digital execution of estate planning documents is
          now legally recognized nationwide. But the requirements differ state to state and continue to evolve. Confirming that a given
          document, executed a given way, is valid in your jurisdiction is your professional responsibility, not ours.
        </LI>
        <LI>
          <B>We don't supervise your practice.</B> Your ethical obligations — competence, confidentiality, supervision, conflicts, file
          retention — are yours, and nothing in Willow changes them.
        </LI>
      </UL>
      <P>If your firm needs something Willow doesn't handle, handle it the way you always have.</P>

      <H2 id="your-data">Your Firm's Data and Your Clients' Data</H2>
      <P>
        <B>You own it.</B> All information your firm enters into Willow — client details, documents, executed instruments, records —
        belongs to your firm and your clients. Not to us.
      </P>
      <P>
        We hold it and process it on your instructions, as described in our <PrivacyLink />. We don't use it for our own purposes, we
        don't sell it, and we don't train AI models on it without asking your firm first and getting a clear yes.
      </P>
      <P>
        <B>You can get it out.</B> At any time during your subscription, you can export your firm's data in a usable format. If your
        subscription ends — for any reason, including if we terminate it — you'll have <B>90 days</B> to export everything before we
        delete it. We know client files carry retention obligations that outlast any vendor relationship, and we're not going to make
        that your problem.
      </P>
      <P>
        <B>Confidentiality.</B> We treat everything your firm puts in Willow as confidential and potentially privileged. Our access is
        restricted to what's needed to run the service or answer a support request you've opened, and it's logged. If someone serves us
        with a subpoena or court order for your client data and we're legally permitted to tell you, we will — so you can respond or
        object before we produce anything.
      </P>

      <H2 id="accounts">Accounts, Seats, and Security</H2>
      <UL>
        <LI>
          Accounts are for named individuals at your firm. <B>Don't share logins.</B> If you need another person to have access, add a
          seat.
        </LI>
        <LI>Your firm is responsible for what happens under its accounts, including what your attorneys and staff do.</LI>
        <LI>Designate an admin. They manage seats, permissions, and who can see what.</LI>
        <LI>Keep credentials secure and enable multi-factor authentication where we offer it.</LI>
        <LI>
          If you think an account is compromised, reach out to Aaron Burlacoff immediately at{" "}
          <a href="mailto:aaronburlacoff@willow-inc.com" className="font-semibold text-[#128F8B] hover:text-[#0C7370]">
            aaronburlacoff@willow-inc.com
          </a>
          .
        </LI>
        <LI>When someone leaves your firm, remove their access. We can help, but we won't know unless you tell us.</LI>
      </UL>

      <H2 id="beta">Beta Features and Design Partners</H2>
      <P>Parts of Willow are still in active development. We'll clearly mark anything that's beta.</P>
      <P>
        Beta features are provided as-is, may change or disappear, and shouldn't be relied on for anything you can't afford to have
        break. Please don't use a beta feature for a live client matter unless we've told you it's ready.
      </P>
      <P>
        If your firm is a <B>Design Partner</B>, your separate Design Partner Agreement governs pricing, feature access, feedback
        commitments, and term. Where it conflicts with these Terms, it controls.
      </P>
      <P>
        <B>Feedback.</B> If you tell us what's broken or what you wish Willow did, we can use that to improve the product without owing
        you anything. We'd rather you tell us than not.
      </P>

      <H2 id="payment">Payment</H2>
      <P>Pricing, billing frequency, seat counts, and term are set out in your Order Form or the plan you select at signup.</P>
      <UL>
        <LI>Fees are billed in advance and, unless your Order Form says otherwise, renew automatically for successive terms.</LI>
        <LI>To avoid renewal, give us notice before the current term ends — the required notice period is in your Order Form.</LI>
        <LI>
          We may change pricing for a renewal term with at least <B>60 days'</B> notice before your renewal date. Your current term's
          price doesn't change mid-term.
        </LI>
        <LI>Fees are non-refundable except where required by law.</LI>
        <LI>
          If an invoice goes unpaid, we'll tell you before we do anything about it. We won't cut off access to client files without
          warning and without giving you an export window.
        </LI>
        <LI>Fees don't include taxes; those are your firm's responsibility.</LI>
      </UL>

      <H2 id="acceptable-use">Acceptable Use</H2>
      <P>Don't use Willow to:</P>
      <UL>
        <LI>Practice law without a license, or let non-attorneys do work that requires one</LI>
        <LI>Enter information you know to be false, or prepare documents you know to be fraudulent</LI>
        <LI>Access data belonging to a firm or client you don't represent</LI>
        <LI>Reverse engineer, scrape, resell, or white-label the platform without our written agreement</LI>
        <LI>Do anything illegal, or anything that compromises the security of the platform or other firms</LI>
      </UL>

      <H2 id="termination">Suspension and Termination</H2>
      <P>
        <B>You can cancel</B> at the end of your term, per your Order Form. We'll give you your export window.
      </P>
      <P>
        <B>We can suspend or terminate</B> for material breach of these Terms, non-payment after notice, or activity we reasonably
        believe is fraudulent or a threat to the platform or other firms. Except in genuine emergencies, we'll give you notice and a
        chance to fix it first.
      </P>
      <P>Either way, your export window applies. We are not going to hold client files hostage.</P>

      <H2 id="availability">Availability and Support</H2>
      <P>
        We aim to keep Willow available and will give advance notice of planned maintenance when we can. Unplanned interruptions happen.
        If you need urgent access to a document during an outage, reach out to Aaron Burlacoff at{" "}
        <a href="mailto:aaronburlacoff@willow-inc.com" className="font-semibold text-[#128F8B] hover:text-[#0C7370]">
          aaronburlacoff@willow-inc.com
        </a>{" "}
        and we'll get it to you.
      </P>
      <P>Any uptime commitment or support response time specific to your firm will be in your Order Form.</P>

      <H2 id="ownership">Ownership</H2>
      <P>
        Willow owns the platform — the software, trademarks, logos, designs, and templates we provide. Your firm gets a non-exclusive,
        non-transferable right to use it during your subscription, for your firm's practice.
      </P>
      <P>Your firm owns your data, your client files, and any of your own templates or content you bring in.</P>

      <H2 id="liability">Liability</H2>
      <P>
        Willow is provided <B>"as is."</B> We don't warrant that it will be uninterrupted, error-free, or that any document produced
        through it will be valid in any jurisdiction — that determination is yours to make as the attorney.
      </P>
      <P>
        To the fullest extent the law allows, neither party is liable for indirect, incidental, or consequential damages, and our total
        liability is capped at <B>the fees your firm paid us in the 12 months before the claim</B>.
      </P>
      <P>These limits don't apply to either party's confidentiality obligations, or to anything the law says can't be limited.</P>
      <P>
        <B>Practically:</B> we're not liable for a document your firm prepared, reviewed, and had executed. You're the lawyer.
      </P>

      <H2 id="privacy">Privacy</H2>
      <P>
        How we handle data is covered in our <PrivacyLink />, which is part of these Terms.
      </P>

      <H2 id="client-death">When a Client Dies</H2>
      <P>A client's documents stay private and access-controlled. Willow doesn't independently release, publish, or notify anyone.</P>
      <P>
        Your firm controls who gets access and when — including executors and family members, through the access permissions your firm
        sets. If a document is filed for probate, it becomes a public court record under that court's procedures. That's the court's
        doing, not ours, and we can't change its status once filed.
      </P>

      <H2 id="governing-law">Governing Law and Disputes</H2>
      <P>
        These Terms are governed by <B>Delaware law</B>, without regard to conflict-of-laws rules. Disputes between your firm and Willow
        arising out of these Terms go to the state or federal courts in Delaware, and both parties consent to that.
      </P>
      <P>
        Separately: whether any particular estate planning document is valid is a question for the law of the relevant state and the
        courts there. That's between your client's estate and that jurisdiction — not something Delaware law or these Terms decide.
      </P>

      <H2 id="changes">Changes to These Terms</H2>
      <P>
        We may update these Terms. For material changes, we'll email your firm's admin contact at least <B>30 days</B> before they take
        effect. If you don't agree, you can cancel before they apply.
      </P>

      <H2 id="contact">Getting in Touch</H2>
      <P>
        Questions, problems, or something that doesn't make sense? For anything at all, reach out to Aaron Burlacoff directly at{" "}
        <a href="mailto:aaronburlacoff@willow-inc.com" className="font-semibold text-[#128F8B] hover:text-[#0C7370]">
          aaronburlacoff@willow-inc.com
        </a>
        .
      </P>
      <P>We're a small team and we read everything.</P>
    </LegalShell>
  );
};

export default Terms;
