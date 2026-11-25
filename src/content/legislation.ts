/* Where digital estate planning law stands, state by state, for the
   Legislation by state map.

   Source: the LIVE Coalition's legislative map on livecoalition.com (a
   Flourish map, visualisation 28253348; its data last changed Sep 15, 2026;
   read Nov 25, 2026, at Aaron's request). Their three categories, in plain
   words:
     both    their "E-Will + Nontestamentary EP Document Laws": an electronic
             wills law, plus one for the other estate planning documents
             (powers of attorney, health care directives and the like)
     ewill   their "Have enacted E-Will Laws"
     active  their "Active 2026 campaigns": a bill in the 2026 session
   `year` is the year LIVE shows for the state, which tracks its most recent
   law in this area (Colorado: 2024, for its 2024 documents law; its wills law
   was 2021). LIVE gives no year for Minnesota. `bills` are the bill numbers
   behind LIVE's links for the states still in progress.

   Two corrections to LIVE's data (Nov 25, with proof): New Jersey's bill
   is S1336 (LIVE's own link is .../Bills/2026/S1500/1336_I1.HTM; S1500 is
   the folder, and S1500 itself is a sweepstakes bill). Virginia's HB 133
   failed: defeated 6-8 in the Senate Courts of Justice committee on Feb 25,
   2026 (lis.virginia.gov/bill-details/20261/HB133, "Status: Failed"), so
   Virginia has no law and no bill in progress.

   When LIVE updates their map, update this file to match. */

export type LegStatus = "both" | "ewill" | "active" | "none";

export const LEG_STATUS: Record<LegStatus, { label: string; fill: string }> = {
  both: { label: "Electronic wills and other estate documents", fill: "#0C7370" },
  ewill: { label: "Electronic wills", fill: "#4DB8B3" },
  active: { label: "Bill in progress, 2026", fill: "url(#leg-active)" },
  none: { label: "No law yet", fill: "#E3E8EE" },
};

/* The order the legend and the lists read in */
export const LEG_ORDER: LegStatus[] = ["both", "ewill", "active", "none"];

export const LEG_SOURCE = {
  name: "LIVE Coalition",
  href: "https://www.livecoalition.com/",
  updated: "September 15, 2026",
};

type Entry = { name: string; status: LegStatus; year?: string; bills?: string };

export const LEGISLATION: Record<string, Entry> = {
  AL: { name: "Alabama", status: "none" },
  AK: { name: "Alaska", status: "none" },
  AZ: { name: "Arizona", status: "ewill", year: "2018" },
  AR: { name: "Arkansas", status: "none" },
  CA: { name: "California", status: "none" },
  CO: { name: "Colorado", status: "both", year: "2024" },
  CT: { name: "Connecticut", status: "none" },
  DE: { name: "Delaware", status: "none" },
  DC: { name: "District of Columbia", status: "ewill", year: "2022" },
  FL: { name: "Florida", status: "ewill", year: "2019" },
  GA: { name: "Georgia", status: "none" },
  HI: { name: "Hawaii", status: "none" },
  ID: { name: "Idaho", status: "ewill", year: "2023" },
  IL: { name: "Illinois", status: "both", year: "2023" },
  IN: { name: "Indiana", status: "ewill", year: "2018" },
  IA: { name: "Iowa", status: "none" },
  KS: { name: "Kansas", status: "none" },
  KY: { name: "Kentucky", status: "both", year: "2026" },
  LA: { name: "Louisiana", status: "none" },
  ME: { name: "Maine", status: "none" },
  MD: { name: "Maryland", status: "ewill", year: "2021" },
  MA: { name: "Massachusetts", status: "none" },
  MI: { name: "Michigan", status: "active", bills: "HB 5659 and HB 5701" },
  MN: { name: "Minnesota", status: "both" },
  MS: { name: "Mississippi", status: "none" },
  MO: { name: "Missouri", status: "both", year: "2025" },
  MT: { name: "Montana", status: "none" },
  NE: { name: "Nebraska", status: "none" },
  NV: { name: "Nevada", status: "ewill", year: "2017" },
  NH: { name: "New Hampshire", status: "none" },
  NJ: { name: "New Jersey", status: "active", bills: "S1336" },
  NM: { name: "New Mexico", status: "none" },
  NY: { name: "New York", status: "ewill", year: "2025" },
  NC: { name: "North Carolina", status: "active" },
  ND: { name: "North Dakota", status: "both", year: "2025" },
  OH: { name: "Ohio", status: "none" },
  OK: { name: "Oklahoma", status: "both", year: "2024" },
  OR: { name: "Oregon", status: "none" },
  PA: { name: "Pennsylvania", status: "active", bills: "SB 1138" },
  RI: { name: "Rhode Island", status: "none" },
  SC: { name: "South Carolina", status: "none" },
  SD: { name: "South Dakota", status: "none" },
  TN: { name: "Tennessee", status: "none" },
  TX: { name: "Texas", status: "none" },
  UT: { name: "Utah", status: "both", year: "2026" },
  VT: { name: "Vermont", status: "none" },
  VA: { name: "Virginia", status: "none" },
  WA: { name: "Washington", status: "both", year: "2024" },
  WV: { name: "West Virginia", status: "none" },
  WI: { name: "Wisconsin", status: "none" },
  WY: { name: "Wyoming", status: "none" },
};

/* One line on a state, for the map's readout */
export const legLine = (e: Entry) =>
  e.status === "active"
    ? e.bills
      ? `${e.bills} in the 2026 session`
      : "A bill in the 2026 session"
    : e.status === "none"
      ? "No electronic wills law yet"
      : e.year
        ? `Most recent law ${e.year}`
        : "Law enacted";
