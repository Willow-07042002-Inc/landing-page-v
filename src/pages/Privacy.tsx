import React from "react";
import { Link } from "react-router-dom";
import { LegalShell, usePageMeta, H2, P, UL, LI, B, LegalTable } from "@/components/LegalPage";

/* Content source: Willow-Privacy-Policy.md (B2B rewrite). Remaining
   bracketed values are intentionally unresolved — pending legal review. */

const TOC = [
  { id: "why-this-exists", label: "Why this exists" },
  { id: "two-kinds-of-data", label: "Two kinds of data" },
  { id: "what-we-collect", label: "What we collect about your firm" },
  { id: "client-data", label: "What your firm puts in about clients" },
  { id: "how-we-use-data", label: "How we use data" },
  { id: "who-we-share-with", label: "Who we share it with" },
  { id: "firm-rights", label: "Your firm's privacy rights" },
  { id: "client-rights", label: "Your clients' privacy rights" },
  { id: "security", label: "How we keep information safe" },
  { id: "retention", label: "How long we keep data" },
  { id: "where-data-lives", label: "Where data lives" },
  { id: "changes", label: "Changes to this policy" },
  { id: "talk-to-us", label: "Talk to us" },
];

const Privacy = () => {
  usePageMeta(
    "Privacy Policy | Willow",
    "How Willow handles data for estate planning firms and their clients — what we collect, why, who we share it with, and the rights your firm and your clients have."
  );

  return (
    <LegalShell eyebrow="Legal" title="Willow's Privacy Promise" date="September 4, 2026" toc={TOC}>
      <H2 id="why-this-exists">Why this exists</H2>
      <P>
        Let's be real — privacy policies are usually written by lawyers for other lawyers. That's a strange thing for us to say, because
        lawyers are exactly who we build for. But you don't want to read one either.
      </P>
      <P>
        So here's the plain-English version. This page explains what we collect, why, who we share it with (spoiler: three vendors), and
        what rights you and your clients have. No dark patterns, no fine print tricks.
      </P>

      <H2 id="two-kinds-of-data">First, the most important thing: there are two kinds of data here</H2>
      <P>This distinction runs through the entire policy, so it's worth getting straight up front.</P>
      <P>
        <B>1. Data about your firm and your attorneys.</B> Your name, your firm's billing details, how your team uses the product. We
        decide what to do with this data, so we're responsible for it. In legal terms, we're the <em>controller</em>.
      </P>
      <P>
        <B>2. Data about your clients.</B> Everything your firm puts into Willow on a client's behalf — names, assets, beneficiaries,
        executors, guardians, the estate plan itself. <B>This is your firm's data, not ours.</B> You decide what goes in, how long it
        stays, and where it goes. We just hold it and process it on your instructions. In legal terms, you're the <em>controller</em> and
        we're the <em>processor</em>.
      </P>
      <P>
        That second category is the one your clients care about, and it's the one your ethical obligations attach to. We built Willow so
        you stay in control of it.
      </P>

      <H2 id="what-we-collect">What We Collect About Your Firm</H2>
      <LegalTable
        head={["What We Collect", "Why We Collect It"]}
        rows={[
          ["Attorney and staff names, work emails, phone numbers", "To create accounts, verify identity, and reach you when something needs attention"],
          ["Firm name, address, and jurisdiction(s) of practice", "To configure state-specific signing and document requirements"],
          ["Bar number and admission state", "To confirm you're licensed where you're using Willow"],
          ["Billing contact and payment info", "Processed securely by Stripe. We never see or store full card numbers"],
          ["How your team uses Willow", "To keep things running, improve features, and squash bugs"],
          ["Support conversations", "So we can actually help when you write in"],
        ]}
      />
      <P>We keep it lean. If we don't need it, we don't ask for it.</P>

      <H2 id="client-data">What Your Firm Puts In About Clients</H2>
      <P>
        When your firm uses Willow, you'll enter information about the people you represent. Typically that includes their name and
        contact details, date of birth, state of residence, assets and how they should be distributed, beneficiaries, executors,
        guardians, information about minor children, and the executed documents themselves.
      </P>
      <P>
        <B>We treat all of it as confidential and potentially privileged.</B>
      </P>
      <P>Here's what that means in practice:</P>
      <UL>
        <LI>
          <B>We don't decide what goes in.</B> Your firm does.
        </LI>
        <LI>
          <B>We don't use it for our own purposes.</B> Not for marketing, not for analytics we sell, not for anything other than running
          Willow for you.
        </LI>
        <LI>
          <B>We don't train AI models on it.</B> If we ever build a feature that would require using your client data to train or improve
          a model, we will ask your firm first and get a clear yes. Silence isn't consent.
        </LI>
        <LI>
          <B>Our staff can't browse it.</B> Access is restricted to the small number of people who need it to run the service or resolve
          a support ticket you've opened, and it's logged.
        </LI>
        <LI>
          <B>If your client contacts us directly</B> asking to see, change, or delete their data, we won't act on it. We'll refer them to
          your firm, because it's your relationship and your call.
        </LI>
      </UL>

      <H2 id="how-we-use-data">How We Use Data</H2>
      <P>
        We use firm data to run Willow: setting up accounts, processing payments, sending service notices, confirming it's really you,
        fixing bugs, improving the product, and staying compliant with the law.
      </P>
      <P>
        We use client data only to provide the service your firm asked for — generating documents, routing them for signature, storing
        them securely, and making them available to the people your firm authorizes.
      </P>
      <P>
        We may also send you product updates and occasional news about what we're building. You can turn those off anytime without losing
        any service notices you actually need.
      </P>
      <P>
        <B>We do not sell personal data.</B> Not your firm's, not your clients'. Some state privacy laws define "sale" and "targeted
        advertising" broadly and require us to tell you about them anyway, so: we don't do either. If that ever changes — it won't
        quietly — we'll notify you and give you a way to opt out first.
      </P>

      <H2 id="who-we-share-with">Who We Share It With</H2>
      <P>
        We use three vendors to deliver Willow. Each one is bound by contract to protect the data they handle and to use it only for the
        service they provide us.
      </P>
      <LegalTable
        head={["Vendor", "What they do", "What they touch"]}
        rows={[
          [<B>Supabase</B>, "Database and hosting", "Firm and client data, stored encrypted"],
          [<B>SignWell</B>, "Digital signature execution", "Documents routed for signing, and signer identity details"],
          [<B>Stripe</B>, "Payment processing", "Firm billing information only. No client data"],
        ]}
      />
      <P>
        We'll also share information when the law genuinely requires it — a valid subpoena, court order, or similar. If that happens and
        we're legally permitted to tell you, we will, so your firm can respond or object before we produce anything.
      </P>
      <P>If we ever bring on a new vendor that touches client data, we'll update this list and give you advance notice so you can raise concerns.</P>

      <H2 id="firm-rights">Your Firm's Privacy Rights</H2>
      <P>
        Depending on where your attorneys live, state privacy laws may give them rights over the personal data we hold about them. Those
        typically include the right to:
      </P>
      <UL>
        <LI>Access the personal data we have about them</LI>
        <LI>Correct anything inaccurate or outdated</LI>
        <LI>Delete it, unless we're legally required to keep it</LI>
        <LI>Download it and take it somewhere else</LI>
        <LI>Opt out of profiling, targeted advertising, and the sale of personal data — none of which we do</LI>
        <LI>Appeal if we deny a request</LI>
        <LI>Unsubscribe from product emails</LI>
      </UL>
      <P>
        You can handle most of this from your account settings, or email Aaron Burlacoff at{" "}
        <a href="mailto:aaronburlacoff@willow-inc.com" className="font-semibold text-[#128F8B] hover:text-[#0C7370]">
          aaronburlacoff@willow-inc.com
        </a>
        . We'll respond within 45 days, usually much sooner. We won't treat anyone differently for exercising these rights.
      </P>

      <H2 id="client-rights">Your Clients' Privacy Rights</H2>
      <P>Your clients have rights too — but their relationship is with your firm, not with us.</P>
      <P>
        So when a client wants to access, correct, delete, or export their information, they should go to your firm. If they come to us
        instead, we'll point them back to you.
      </P>
      <P>
        Where your firm needs our help responding, we'll give it. Willow includes tools to export or delete a client's records, and if
        you need something the product doesn't cover, write to us and we'll sort it out.
      </P>

      <H2 id="security">How We Keep Information Safe</H2>
      <P>
        We follow generally accepted industry standards — technical, physical, and administrative — to protect against loss, misuse, and
        unauthorized access. That includes encryption in transit and at rest, restricted and logged employee access, and regular review
        of our practices.
      </P>
      <P>
        Because no method of transmission or storage is perfectly secure, we can't promise absolute security. What we can promise is that
        if there's ever a breach affecting your firm's data, <B>we'll tell you promptly</B> and give you what you need to meet your own
        notification obligations to clients and regulators.
      </P>

      <H2 id="retention">How Long We Keep Data</H2>
      <P>
        <B>Client data:</B> as long as your firm wants it, and no longer. You control retention and deletion inside the product. If your
        subscription ends, see the export window in our{" "}
        <Link to="/terms" className="font-semibold text-[#128F8B] hover:text-[#0C7370]">
          Terms of Service
        </Link>{" "}
        — you'll have a defined period to get your files out before we delete them.
      </P>
      <P>
        <B>Firm data:</B> as long as needed to provide the service and meet legal, tax, and dispute-resolution requirements. Then we
        delete or anonymize it.
      </P>

      <H2 id="where-data-lives">Where Data Lives</H2>
      <P>
        Willow's infrastructure is hosted in the United States. If we ever store or process data outside the US, we'll update this policy
        and tell you before it happens.
      </P>

      <H2 id="changes">Changes to This Policy</H2>
      <P>
        If something material changes, we'll update this page and email your firm's admin contact. Minor edits — a typo, a clearer
        sentence — we'll just make.
      </P>

      <H2 id="talk-to-us">Talk to Us</H2>
      <P>Questions about any of this? Want to know exactly what we hold on a given client? Just curious how something works under the hood?</P>
      <P>
        <a href="mailto:aaronburlacoff@willow-inc.com" className="font-semibold text-[#128F8B] hover:text-[#0C7370]">
          aaronburlacoff@willow-inc.com
        </a>
      </P>
      <P>Willow is operated by 07042002 Inc., a Delaware corporation.</P>
    </LegalShell>
  );
};

export default Privacy;
