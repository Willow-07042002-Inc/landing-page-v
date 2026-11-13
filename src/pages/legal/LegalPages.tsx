import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LegalShell, usePageMeta, H2, P, UL, LI, B, LegalTable } from "@/components/LegalPage";
import { LegalMarkdown, docMeta } from "@/components/LegalMarkdown";
import { DOCS, FILL, VERSION_DATE, type LegalDoc } from "./legalDocs";

/* Willow's public legal pages. The documents themselves render from the
   drafter's Markdown (legalDocs.ts); the index, subprocessors, connections and
   request pages are written here and say only what the documents say. */

const LINK = "font-semibold text-[#128F8B] hover:text-[#0C7370] underline underline-offset-2";
const SUPPORT = "support@willow-inc.com";
const Mail = () => (
  <a href={`mailto:${SUPPORT}`} className={LINK}>
    {SUPPORT}
  </a>
);
const To = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className={LINK}>
    {children}
  </Link>
);

/** After a route change, scroll to #anchor once the long page has rendered. */
const useHashScroll = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(), 50);
    return () => window.clearTimeout(t);
  }, [hash]);
};

const PdfLink = ({ href, label = "Download PDF" }: { href: string; label?: string }) => (
  <p className="mb-8 text-center text-sm">
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {label}
    </a>
  </p>
);

const OtherDocs = ({ except }: { except: string[] }) => (
  <div className="mt-16 border-t border-gray-200 pt-8 text-sm">
    <div className="mb-3 font-semibold uppercase tracking-[0.1em] text-gray-400">Willow's legal documents</div>
    <ul className="space-y-1">
      {[DOCS.memberTerms, DOCS.recipientTerms, DOCS.firmAgreement, DOCS.privacy, DOCS.healthDataNotice]
        .filter((d) => !except.includes(d.path))
        .map((d) => (
          <li key={d.path}>
            <To to={d.path}>{d.name}</To>
          </li>
        ))}
      {!except.includes("/subprocessors") && (
        <li>
          <To to="/subprocessors">Subprocessors</To>
        </li>
      )}
      {!except.includes("/terms") && (
        <li>
          <To to="/terms">All terms and policies</To>
        </li>
      )}
    </ul>
  </div>
);

const DocumentPage = ({ doc }: { doc: LegalDoc }) => {
  const { title, version } = docMeta(doc.source);
  usePageMeta(`${title} | Willow`, doc.description);
  useHashScroll();
  return (
    <LegalShell eyebrow="Legal" title={title} date={version ?? VERSION_DATE}>
      <PdfLink href={doc.pdf} />
      <LegalMarkdown source={doc.source} fill={FILL} />
      <OtherDocs except={[doc.path]} />
    </LegalShell>
  );
};

export const MemberTermsPage = () => <DocumentPage doc={DOCS.memberTerms} />;
export const RecipientTermsPage = () => <DocumentPage doc={DOCS.recipientTerms} />;
export const PrivacyPage = () => <DocumentPage doc={DOCS.privacy} />;
export const HealthDataNoticePage = () => <DocumentPage doc={DOCS.healthDataNotice} />;

/** The Agreement and its Exhibit A on one page; /dpa lands on #exhibit-a. */
export const FirmAgreementPage = () => {
  const doc = DOCS.firmAgreement;
  const { title, version } = docMeta(doc.source);
  usePageMeta(`${title} | Willow`, doc.description);
  useHashScroll();
  return (
    <LegalShell eyebrow="Legal · For law firms" title={title} date={version ?? VERSION_DATE}>
      <p className="mb-2 text-center text-sm">
        <a href={doc.pdf} target="_blank" rel="noopener noreferrer" className={LINK}>
          Download the Agreement (PDF)
        </a>
        <span className="mx-2 text-gray-300">·</span>
        <a href={DOCS.dpa.pdf} target="_blank" rel="noopener noreferrer" className={LINK}>
          Download Exhibit A (PDF)
        </a>
      </p>
      <p className="mb-8 text-center text-sm text-gray-500">
        A firm accepts this Agreement by signing an Order Form with Willow. Exhibit A, the{" "}
        <a href="#exhibit-a" className={LINK}>
          Data Processing Addendum
        </a>
        , follows the Agreement below.
      </p>
      <LegalMarkdown source={doc.source} fill={FILL} />
      <LegalMarkdown source={DOCS.dpa.source} skipHeader={false} idPrefix="exhibit-a-" fill={FILL} />
      <OtherDocs except={[doc.path]} />
    </LegalShell>
  );
};

/** /terms: the index of every document (the apps' general footers link here). */
export const TermsIndexPage = () => {
  usePageMeta(
    "Terms and Policies | Willow",
    "Willow's Member Terms, Recipient Terms, Firm Subscription Agreement, Privacy Policy, Consumer Health Data Notice and subprocessors."
  );
  const rows: [LegalDoc | { path: string; name: string; forWhom: string }][] = [
    [DOCS.memberTerms],
    [DOCS.recipientTerms],
    [DOCS.firmAgreement],
    [DOCS.privacy],
    [DOCS.healthDataNotice],
    [{ path: "/subprocessors", name: "Subprocessors", forWhom: "The service providers that process data for Willow, and where." }],
    [{ path: "/connections", name: "Connected services", forWhom: "The accounts an attorney can connect to Willow, and what each one accesses." }],
    [{ path: "/request-documents", name: "Requesting documents", forWhom: "How to ask for a Member's documents after their death, or whether a document is on file." }],
  ];
  return (
    <LegalShell eyebrow="Legal" title="Terms and Policies" date={VERSION_DATE}>
      <P>
        Which terms apply depends on how you use Willow. Each document below is the current version. Earlier versions are available on
        request at <Mail />.
      </P>
      <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
        {rows.map(([d]) => (
          <div key={d.path} className="py-5">
            <To to={d.path}>{d.name}</To>
            <p className="mt-1 text-[15px] leading-relaxed">{d.forWhom}</p>
          </div>
        ))}
      </div>
      <P>
        <span className="mt-8 block">
          Questions about any of these documents can be sent to <Mail />.
        </span>
      </P>
    </LegalShell>
  );
};

/* ------------------------------------------------------------------------- */
/* Subprocessors (Privacy Policy 4.2(e), 5.4; DPA 2.4, 4.1–4.2; FSA 5.5).     */
/* The policy says this page is the current, authoritative list and controls  */
/* if the policy's table differs.                                             */
/* ------------------------------------------------------------------------- */

const SUBPROCESSORS: { provider: string; service: string; location: string; firmData: boolean }[] = [
  { provider: "Supabase, Inc. (on Amazon Web Services)", service: "Database, file storage, authentication", location: "United States", firmData: true },
  { provider: "Vercel, Inc.", service: "Application hosting, web analytics", location: "United States", firmData: true },
  {
    provider: "Anthropic, PBC",
    service: "AI document analysis and draft summaries (see below)",
    location: "United States and other locations where Anthropic operates",
    firmData: true,
  },
  { provider: "Google LLC (Google Workspace)", service: "Email delivery", location: "United States and other locations where Google operates", firmData: true },
  { provider: "Google LLC (Google Maps Platform)", service: "Address autocomplete", location: "United States and other locations where Google operates", firmData: true },
  {
    provider: "Stripe, Inc.",
    service: "Payment processing. Willow does not receive or store full card numbers",
    location: "United States",
    firmData: false,
  },
  {
    provider: "Google LLC (Google Analytics)",
    service: "Marketing website analytics, only with the visitor's consent and with advertising storage denied",
    location: "United States and other locations where Google operates",
    firmData: false,
  },
  {
    provider: "Microsoft Corporation (Microsoft Clarity)",
    service: "Marketing website analytics and session recordings, only with the visitor's consent and with advertising storage denied",
    location: "United States and other locations where Microsoft operates",
    firmData: false,
  },
  { provider: "Cal.com, Inc.", service: "Scheduling demonstrations booked on our marketing website", location: "United States", firmData: false },
];

export const SubprocessorsPage = () => {
  usePageMeta("Subprocessors | Willow", "The service providers that process data for Willow, what each one does, and where.");
  return (
    <LegalShell eyebrow="Legal" title="Subprocessors" date={VERSION_DATE}>
      <P>
        These are the service providers that host, secure and operate Willow on our behalf. Each is bound by written obligations to
        protect the information, keep it confidential and use it only to provide services to Willow. This page is the current,
        authoritative list referred to in our <To to="/privacy#s5">Privacy Policy</To> and in the{" "}
        <To to="/firm-agreement#exhibit-a">Data Processing Addendum</To>.
      </P>
      <P>
        The last column shows which providers process <B>Firm Customer Data</B>: information a law firm uploads or manages about its
        clients through Willow. Providers used only for our marketing website, or only for Willow's own billing, do not.
      </P>
      <LegalTable
        head={["Provider", "Service", "Data location", "Firm Customer Data"]}
        rows={SUBPROCESSORS.map((s) => [s.provider, s.service, s.location, s.firmData ? "Yes" : "No"])}
      />
      <P>
        Accounts that an attorney chooses to connect, such as their own Google, Microsoft or Zoom account, are not Willow's
        subprocessors, even where the same company also provides services to Willow. They are described on our{" "}
        <To to="/connections">connected services</To> page.
      </P>

      <H2 id="ai">How our AI provider is configured</H2>
      <P>
        Willow uses Anthropic's commercial API to analyze estate planning documents and supporting files that an attorney uploads or
        manages, and to prepare draft summaries for the attorney's review. Our current configuration:
      </P>
      <UL>
        <LI>
          <B>No training.</B> Anthropic's terms with Willow prohibit it from using the content we send to train its models. Willow does
          not use documents to train AI models either.
        </LI>
        <LI>
          <B>Zero data retention.</B> Zero data retention is turned on for Willow's Anthropic organization. Under it, Anthropic does not
          store the content of our requests or its responses after returning the response, except where needed to comply with law or
          to address misuse, as Anthropic's terms allow.
        </LI>
        <LI>
          <B>Document files during analysis.</B> To analyze a document, Willow uploads the file to Anthropic's Files API for the
          duration of the analysis. Zero data retention does not cover files stored this way. Willow deletes each file as soon as its
          analysis finishes, and an hourly check deletes any file left behind, so a document is not kept by Anthropic beyond that.
        </LI>
        <LI>
          <B>No connected-account data.</B> Willow never sends calendar, contacts, email or meeting data from a connected account to
          Anthropic or any other AI provider.
        </LI>
      </UL>

      <H2 id="changes">Changes to this list</H2>
      <P>
        We update this page no later than the day a new provider begins processing Firm Customer Data, and we email each firm's billing
        attorney the same day. A firm may object within 15 days, as described in Section 4.2 of the Data Processing Addendum.
        Questions: <Mail />.
      </P>
      <OtherDocs except={["/subprocessors"]} />
    </LegalShell>
  );
};

/* ------------------------------------------------------------------------- */
/* Connected services (Privacy Policy 3; FSA 5.7). Wording from PP 3.2–3.7.  */
/* ------------------------------------------------------------------------- */

export const ConnectionsPage = () => {
  usePageMeta(
    "Connected services | Willow",
    "The accounts an attorney can connect to Willow (Google, Microsoft 365 and Zoom), what each one accesses, and what Willow stores."
  );
  return (
    <LegalShell eyebrow="Legal" title="Connected services" date={VERSION_DATE}>
      <P>
        Attorneys and their staff can choose to connect their own accounts to Willow. Connections are optional: each one is made only
        when you grant permission on the provider's own screen, and only the features you turn on use it. Members and recipients are
        never asked to connect an account. Willow never uses data from a connected account for advertising, never sends it to an AI
        provider and never uses it to train AI. The full rules are in Section 3 of our <To to="/privacy#s3">Privacy Policy</To>.
      </P>

      <H2 id="google">Google</H2>
      <P>Willow requests no Gmail permission and does not read Gmail.</P>
      <LegalTable
        head={["Permission", "What Willow does with it", "What Willow stores"]}
        rows={[
          ["Email address (email)", "Identifies which Google account is connected", "The connected account's email address"],
          [
            "Google Calendar, read (calendar.readonly)",
            "Checks when you are free or busy for your booking page. When you add a client, searches event titles and guest lists from up to three years back for the client's name, to suggest their email address",
            "Nothing from your calendars, other than an email address you choose to save to a client record",
          ],
          [
            "Google Calendar, events (calendar.events)",
            "Adds consultations booked through your Willow booking page to your calendar, with a Google Meet link if you choose one",
            "The ID of each event Willow created",
          ],
          [
            'Google Contacts, "Other contacts" (contacts.other.readonly)',
            "When you add a client, searches the people you have emailed for the client's name, to suggest their email address and phone number. Shown only to you",
            "Only an email address or phone number you choose to save to a client record",
          ],
        ]}
      />

      <H2 id="microsoft">Microsoft 365 and Outlook</H2>
      <LegalTable
        head={["Permission", "What Willow does with it"]}
        rows={[
          ["User.Read, openid, email, offline_access", "Signs you in, reads your basic profile and keeps the connection active"],
          [
            "Mail.ReadBasic",
            "Shows, on a client's record, your Outlook emails with that client from the last year (sender, recipients, subject and date only), and searches those details to suggest a new client's email address. Never the body or attachments",
          ],
          ["People.Read", "Searches the people you work and email with, including your Outlook contacts, to suggest a new client's email address and phone number"],
          [
            "Calendars.ReadWrite (separate calendar connection)",
            "Checks your free and busy times, adds consultations booked through Willow with a Teams link if you choose one, and searches event titles and guest lists to suggest a client's email address",
          ],
        ]}
      />
      <P>
        Message and calendar details are read live from Microsoft each time and never stored. Willow stores only the connection tokens,
        the connected account's email address, the IDs of events it created and any contact details you choose to save to a client
        record.
      </P>

      <H2 id="zoom">Zoom</H2>
      <P>
        Willow requests permission to read your basic Zoom profile (user:read) and to create meetings (meeting:write), only to create a
        Zoom link for a consultation booked through Willow. It stores your Zoom user ID, your Zoom account email and the join link of
        each meeting it creates, and never reads your Zoom meetings or recordings. Your availability comes only from the calendars you
        have connected. More in our <To to="/zoom">Zoom guide</To>.
      </P>

      <H2 id="disconnecting">Disconnecting</H2>
      <P>
        You can disconnect any account at any time in your connection settings in Willow, or by emailing <Mail />. Willow then stops
        accessing it, deletes the stored sign-in and, for Google and Zoom, asks the provider to cancel Willow's access. Microsoft does
        not let apps do this, so we tell you how to remove Willow from your Microsoft account yourself.
      </P>
      <OtherDocs except={["/connections"]} />
    </LegalShell>
  );
};

/* ------------------------------------------------------------------------- */
/* Requesting documents (Member Terms 5.1–5.7; Recipient Terms 3;            */
/* Privacy Policy 2.1(e), 4.1(d), 5.3). Release fee amounts are deliberately */
/* not stated.                                                               */
/* ------------------------------------------------------------------------- */

export const RequestDocumentsPage = () => {
  usePageMeta(
    "Requesting documents | Willow",
    "How to request a Willow Member's documents after their death, or ask whether a document is on file."
  );
  return (
    <LegalShell eyebrow="Legal" title="Requesting documents" date={VERSION_DATE}>
      <P>
        Willow Members can choose to share estate planning documents with the people they name, either right away or locked until
        their death. This page explains how to ask for a Member's documents after they have died.
      </P>

      <H2 id="who">Who can request a release</H2>
      <UL>
        <LI>a person the Member chose to share documents with (a Designated Recipient);</LI>
        <LI>the executor named in the Member's most recent will on file; or</LI>
        <LI>a court-appointed fiduciary, such as a personal representative or administrator.</LI>
      </UL>

      <H2 id="how">How to request</H2>
      <P>
        <B>If something was already shared with you in Willow,</B> sign in and request the release from the shared item. Your request
        goes to the Member's attorney, or to Willow if no attorney is connected.
      </P>
      <P>
        <B>Otherwise,</B> email <Mail /> with your name and contact details, your relationship to the Member, the Member's full name,
        and any note you want to add. You can attach a copy of the death certificate.
      </P>

      <H2 id="proof">What proof is needed</H2>
      <P>
        The person verifying the request (the Member's attorney, or Willow if no attorney is connected) decides what proof is needed,
        which may include proof of your identity and of the death, such as a death certificate, letters testamentary or a court order.
        Letters or an order issued by a court take priority over the executor named in a will on file. Willow will not release anything on the
        basis of a death if it learns the Member is alive.
      </P>

      <H2 id="search">Asking whether a document is on file</H2>
      <P>
        A person with proof of a Member's death may ask Willow, at <Mail />, whether a will or other document is on file. We confirm
        only whether a document is on file and how to request a release, and, if the Member's law firm has agreed to be named, the
        firm's name and contact details. We never send a copy in response to a search request.
      </P>

      <H2 id="fees">Fees</H2>
      <P>
        People a Member shares with never pay to see what was shared with them. A search request, or a release request for an account
        whose plan has lapsed, may carry a reasonable fee. If a fee applies, you are told before your request is submitted.
      </P>
      <P>
        The full rules are in Section 5 of the <To to="/member-terms#s5">Member Terms</To> and in the{" "}
        <To to="/recipient-terms">Recipient Terms</To>. We handle the information you send as described in our{" "}
        <To to="/privacy">Privacy Policy</To>.
      </P>
      <OtherDocs except={["/request-documents"]} />
    </LegalShell>
  );
};
