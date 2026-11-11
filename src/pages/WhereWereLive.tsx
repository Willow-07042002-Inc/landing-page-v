import React from "react";
import { LegalShell, usePageMeta, H2, P } from "@/components/LegalPage";

/* The availability page the Member Terms ("Eligibility", 3.6) and the Firm
   Subscription Agreement (2.7, 4.1) point to. The list matches
   packages/types/availability.ts in willow-platform: every state plus DC,
   Washington closed. Change both together.

   "Signing coming soon": states with an electronic-wills law in force
   (Nov 2026), plus New York (signed Dec 2025, in force 2027). Signing inside
   Willow is not offered anywhere yet. */

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const CLOSED = new Set(["Washington"]);

const SIGNING_SOON = new Set([
  "Arizona", "Colorado", "District of Columbia", "Florida", "Idaho", "Illinois", "Indiana", "Kentucky",
  "Maryland", "Missouri", "Nevada", "New York", "North Dakota", "Utah",
]);

const OPEN = STATES.filter((s) => !CLOSED.has(s));

const WhereWereLive = () => {
  usePageMeta(
    "Where we're live | Willow",
    "The states where Willow is available, and where signing documents in Willow is coming soon."
  );

  return (
    <LegalShell eyebrow="Availability" title="Where we're live" date="November 11, 2026">
      <P>
        Willow is available to people who live in the states listed below. Firms can invite clients who live in any of them.
      </P>
      <P>Willow isn't available in Washington yet.</P>

      <H2 id="states">States where Willow is available</H2>
      <ul className="mb-6 border-t-2 border-[#222222]">
        {OPEN.map((s) => (
          <li key={s} className="flex items-baseline justify-between gap-4 border-b border-gray-200 px-1 py-3 text-[15px]">
            <span className="text-[#222222]">{s}</span>
            {SIGNING_SOON.has(s) && <span className="text-[13px] text-[#0C7370]">Signing coming soon</span>}
          </li>
        ))}
      </ul>
    </LegalShell>
  );
};

export default WhereWereLive;
