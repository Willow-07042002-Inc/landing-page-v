import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { USAMap, StateAbbreviations, USAStateAbbreviation } from "@mirawision/usa-map-react";

// States that have adopted electronic will legislation (UEWA or equivalent)
const ADOPTED_STATES: USAStateAbbreviation[] = [
  "AZ", // Arizona
  "CO", // Colorado
  "FL", // Florida
  "ID", // Idaho
  "IL", // Illinois
  "IN", // Indiana
  "MD", // Maryland
  "MN", // Minnesota
  "NV", // Nevada
  "ND", // North Dakota
  "UT", // Utah
  "VA", // Virginia
  "WA", // Washington
  "DC", // District of Columbia
];

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

const AvailabilityMap = () => {
  const [hoveredState, setHoveredState] = useState<USAStateAbbreviation | null>(null);

  const customStates = useMemo(() => {
    const settings: Record<string, any> = {};

    StateAbbreviations.forEach((state) => {
      const isAdopted = ADOPTED_STATES.includes(state);
      const isHovered = hoveredState === state;

      let fill: string;
      if (isAdopted && isHovered) {
        fill = "#087a76";
      } else if (isAdopted) {
        fill = "#0a9893";
      } else if (isHovered) {
        fill = "#f0f0f0";
      } else {
        fill = "#ffffff";
      }

      settings[state] = {
        fill,
        stroke: "#f8f8f8",
        label: { enabled: false },
        onHover: () => setHoveredState(state),
        onLeave: () => setHoveredState(null),
        tooltip: {
          enabled: true,
          render: () => (
            <div style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              fontSize: "14px",
            }}>
              <strong>{STATE_NAMES[state]}</strong>
              <br />
              <span style={{ color: isAdopted ? "#128f8b" : "#6b7280" }}>
                {isAdopted ? "Electronic wills recognized" : "Not yet adopted"}
              </span>
            </div>
          ),
        },
      };
    });

    return settings;
  }, [hoveredState]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f8f8" }}>
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-start px-4 pt-20 pb-16 mt-6">
        <div className="container max-w-5xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 mt-16">
            Electronic Will Legislation
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Willow operates in states where electronic wills are legally recognized.
            See which states have adopted legislation.
          </p>

          <div className="w-full max-w-4xl mx-auto mb-8" style={{ filter: "drop-shadow(0px 8px 6px rgba(0, 0, 0, 0.08))" }}>
            <USAMap customStates={customStates} />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#0a9893" }} />
              <span className="text-sm text-muted-foreground">Adopted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: "#ffffff" }} />
              <span className="text-sm text-muted-foreground">Not yet adopted</span>
            </div>
          </div>

          {/* Adopted states list */}
          <div className="max-w-2xl mx-auto text-left">
            <h2 className="text-lg font-medium mb-4 text-center">
              States with electronic will legislation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ADOPTED_STATES.map((abbr) => (
                <div
                  key={abbr}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-willow/5"
                >
                  <div className="w-2 h-2 rounded-full bg-willow" />
                  <span className="text-sm">{STATE_NAMES[abbr]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AvailabilityMap;
