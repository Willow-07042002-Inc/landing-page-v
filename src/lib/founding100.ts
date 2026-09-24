/* Shared shape of a Founding Partner sign-up.
   Imported by the browser (src/components/PartnerSignupPage.tsx) and by the
   nightly digest function (api/cron/founding-100-digest.ts), so this file must
   stay dependency-free — no Supabase client, no server-only imports. */

export const FOUNDING_100_FORM_TYPE = "founding_100";
export const NYSBA_FORM_TYPE = "nysba_2026";

/* Every surface that sells the Founding Partner offer, with the label the
   digest prints on a card so a lead can be traced back to where it came from.

   A page that records a form_type missing from this list still captures fine
   — the "Allow public insert" policy doesn't care — but the nightly digest
   queries exactly these types, so those leads would never reach anyone's
   inbox. Add the surface here when you add the page. */
export const SIGNUP_FORM_TYPES = [
  { type: FOUNDING_100_FORM_TYPE, label: "Founding 100" },
  { type: NYSBA_FORM_TYPE, label: "NY State Bar" },
] as const;

export type SignupFormType = (typeof SIGNUP_FORM_TYPES)[number]["type"];

export function signupSourceLabel(formType: string): string {
  return SIGNUP_FORM_TYPES.find((s) => s.type === formType)?.label ?? formType;
}

/* form_submissions has no columns for the firm details, so the three firm
   answers live in `message` on one readable line. formatFirmDetails and
   parseFirmDetails are the only two places that know this format — the digest
   splits on it to build its cards, and falls back to printing the raw message
   if the shape ever changes. */
export const FIRM_FIELDS = ["Firm", "Attorneys", "Estate plans/year"] as const;

export function formatFirmDetails(d: {
  firmName: string;
  attorneyCount: string;
  plansPerYear: string;
}): string {
  return [
    `Firm: ${d.firmName}`,
    `Attorneys: ${d.attorneyCount}`,
    `Estate plans/year: ${d.plansPerYear}`,
  ].join(" | ");
}

export function parseFirmDetails(message: string | null): string[] | null {
  if (!message) return null;
  const parts = message.split(" | ");
  if (parts.length !== FIRM_FIELDS.length) return null;
  return parts.map((part, i) => {
    const prefix = `${FIRM_FIELDS[i]}: `;
    return part.startsWith(prefix) ? part.slice(prefix.length) : part;
  });
}
