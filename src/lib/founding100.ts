/* Shared shape of a Founding 100 sign-up.
   Imported by the browser (src/pages/Founding100.tsx) and by the nightly
   digest function (api/cron/founding-100-digest.ts), so this file must stay
   dependency-free — no Supabase client, no server-only imports. */

export const FOUNDING_100_FORM_TYPE = "founding_100";

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
