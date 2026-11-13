import memberTerms from "@/content/legal/member-terms.md?raw";
import recipientTerms from "@/content/legal/recipient-terms.md?raw";
import privacyPolicy from "@/content/legal/privacy-policy.md?raw";
import healthDataNotice from "@/content/legal/health-data-notice.md?raw";
import firmAgreement from "@/content/legal/firm-subscription-agreement.md?raw";
import dpa from "@/content/legal/data-processing-addendum.md?raw";

/* The published legal set. Source: the drafter's Markdown of November 13,
   2026 (~/willow/_planning/legal/2026-11-13/Markdown/), copied unchanged into
   src/content/legal/. To publish a new version: replace the .md and .pdf
   files, and update VERSION_DATE (and EFFECTIVE_DATE if the text still has
   the "to be set on publication" blank).

   The apps link to these same paths (willow-platform packages/types/legal.ts),
   so don't rename them without changing it there too.

   The Order Form is not published: it is signed per firm and states the price,
   and Willow publishes no prices. */

export const VERSION_DATE = "November 13, 2026";

/** Fills the Privacy Policy's and Health Data Notice's "[to be set on publication]" blanks. */
export const EFFECTIVE_DATE = "November 13, 2026";
const PUBLICATION_BLANK = "\\[to be set on publication\\]";
export const FILL = { [PUBLICATION_BLANK]: EFFECTIVE_DATE };

export interface LegalDoc {
  path: string;
  name: string;
  /** Who it is for, one line, for the /terms index. */
  forWhom: string;
  source: string;
  pdf: string;
  description: string;
}

export const DOCS = {
  memberTerms: {
    path: "/member-terms",
    name: "Member Terms",
    forWhom: "For people who keep their estate plan in Willow (Members).",
    source: memberTerms,
    pdf: "/legal/willow-member-terms-2026-11-13.pdf",
    description: "The agreement between Willow and the people who keep their estate planning documents in Willow.",
  },
  recipientTerms: {
    path: "/recipient-terms",
    name: "Recipient Terms",
    forWhom: "For people a Member shares documents with, and executors, agents and other fiduciaries who request them.",
    source: recipientTerms,
    pdf: "/legal/willow-recipient-terms-2026-11-13.pdf",
    description: "The short terms that apply when someone shares estate planning documents with you through Willow.",
  },
  firmAgreement: {
    path: "/firm-agreement",
    name: "Firm Subscription Agreement",
    forWhom: "For law firms that use Willow, with its Data Processing Addendum (Exhibit A). Firms accept it by signing an Order Form.",
    source: firmAgreement,
    pdf: "/legal/willow-firm-subscription-agreement-2026-11-13.pdf",
    description: "Willow's agreement with law firms, including Exhibit A, the Data Processing Addendum.",
  },
  dpa: {
    path: "/firm-agreement#exhibit-a",
    name: "Data Processing Addendum (Exhibit A)",
    forWhom: "Part of the Firm Subscription Agreement.",
    source: dpa,
    pdf: "/legal/willow-data-processing-addendum-2026-11-13.pdf",
    description: "How Willow processes firm client data.",
  },
  privacy: {
    path: "/privacy",
    name: "Privacy Policy",
    forWhom: "For everyone: Members, recipients, firms and website visitors.",
    source: privacyPolicy,
    pdf: "/legal/willow-privacy-policy-2026-11-13.pdf",
    description: "How Willow collects, uses, shares and protects personal information, and the choices and rights you have.",
  },
  healthDataNotice: {
    path: "/health-data-notice",
    name: "Consumer Health Data Notice",
    forWhom: "How Willow handles the health information in estate planning documents.",
    source: healthDataNotice,
    pdf: "/legal/willow-consumer-health-data-notice-2026-11-13.pdf",
    description: "How Willow handles consumer health data, such as the health information in a health care proxy or living will.",
  },
} satisfies Record<string, LegalDoc>;
