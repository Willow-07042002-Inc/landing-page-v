import React from "react";
import { ChevronDown } from "lucide-react";
import { ProSidebar, ProTopBar, WIcon, FloatStack, initialsOf } from "./kit";

// ---- Attorney Clients page with a client's panel open, recreated from
// apps/professionals (app/dashboard/clients/page.tsx, clients-list.tsx,
// client-card.tsx, client-detail-view.tsx, client-detail/spouse-link.tsx and
// client-detail/estate-plans-tab.tsx, as on the preview branch Nov 17) ----

export type ProClientRow = { name: string; email: string; pill?: "Pending invite" | "Summary awaiting approval" };

/* client-card.tsx ClientRow: teal initials, name, email, at most one pill, the arrow */
export const ProClientRowView = ({ c, indent = false }: { c: ProClientRow; indent?: boolean }) => (
  <div className={`flex w-full items-center justify-between gap-4 bg-white py-5 pr-8 ${indent ? "pl-[52px]" : "pl-8"}`}>
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F9F9] text-[#309E96] ring-1 ring-black/5">
        <span className="text-[13px] font-semibold">{initialsOf(c.name)}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{c.name}</span>
        <span className="mt-0.5 block truncate text-[#9CA3AF]" style={{ fontSize: 13 }}>{c.email}</span>
      </span>
    </div>
    <div className="flex flex-shrink-0 items-center gap-3">
      {c.pill === "Pending invite" && (
        <span className="inline-flex h-7 items-center whitespace-nowrap rounded-full bg-[#F3F4F6] px-3 text-[12.5px] font-medium text-[#6B7280]">Pending invite</span>
      )}
      {c.pill === "Summary awaiting approval" && (
        <span className="inline-flex h-7 items-center whitespace-nowrap rounded-full bg-[#FBF1E8] px-3 text-[12.5px] font-medium text-[#A9602C]">Summary awaiting approval</span>
      )}
      <WIcon name="chevronRight" className="h-4 w-4 text-[#9CA3AF]" />
    </div>
  </div>
);

/* client-card.tsx ClientCoupleCard: two linked clients (a joint account) as
   one card, tied by the grey rail in the avatars' gutter */
export const ProCoupleView = ({ a, b }: { a: ProClientRow; b: ProClientRow }) => (
  <div className="relative bg-white">
    <span aria-hidden className="pointer-events-none absolute bottom-7 left-[25px] top-7 w-1 rounded-full bg-[#D1D5DB]" />
    <ProClientRowView c={a} indent />
    <div className="ml-[52px] mr-8 h-px bg-[#F0F1F3]" />
    <ProClientRowView c={b} indent />
  </div>
);

/* estate-plans-tab.tsx DocumentRow: the bare document icon, label, detail line, ⋯ */
export const ProDocRow = ({ label, detail, nested = false }: { label: string; detail?: string; nested?: boolean }) => (
  <div className={nested ? "flex w-full items-center justify-between gap-4 py-1.5" : "flex w-full items-center justify-between gap-4 px-8 py-4"}>
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <WIcon name="document" className={`flex-shrink-0 text-[#309E96] ${nested ? "h-4 w-4" : "h-5 w-5"}`} />
      <div className="min-w-0 flex-1">
        <p className={nested ? "font-medium text-[#1F2933]" : "font-semibold text-[#1F2933]"} style={{ fontSize: nested ? 13.5 : 15 }}>{label}</p>
        {detail && <p className="mt-0.5 truncate text-[12.5px] text-[#9CA3AF]">{detail}</p>}
      </div>
    </div>
    <span className="rounded p-1.5 text-[#9CA3AF]">
      <WIcon name="more" className="h-4 w-4" />
    </span>
  </div>
);

export const ProDocSectionLabel = ({ label, action }: { label: string; action?: string }) => (
  <div className="mb-2 flex items-baseline justify-between gap-3">
    <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">{label}</p>
    {action && <span className="text-[13px] font-medium text-[#309E96]">{action}</span>}
  </div>
);

export const CLIENT_PANEL_TABS = ["Contact", "Estate Plan", "Team", "Staying in touch", "Notes", "Emails"];

/* The Clients page with Daniel Rosen's panel. `open` slides the panel in from
   the right and dims the list, exactly as the product does (transform and
   opacity, 300ms ease-out); closed, it is the plain list. */
export const AttorneyClientsScreen = ({
  open,
  tab = "Estate Plan",
  panel,
  headerPill,
  dots = [],
  panelScroll = 0,
}: {
  open: boolean;
  /** Which of the panel's tabs is open */
  tab?: string;
  /** What sits under the tabs; Estate Plan > Documents when not given */
  panel?: React.ReactNode;
  /** A pill beside the ⋯ in the header (client-detail-view.tsx), e.g. "Summary awaiting approval" */
  headerPill?: React.ReactNode;
  /** Tabs that carry the clay dot: "Estate Plan" (a summary to approve), "Team" (an access request) */
  dots?: string[];
  /** How far the client's panel is scrolled, in px: the window stays 855 tall */
  panelScroll?: number;
}) => {
  const motion = "300ms cubic-bezier(0, 0, 0.2, 1)";
  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#F0F2F5] text-left" style={{ fontFamily: "Figtree, Inter, sans-serif", height: 855 }}>
      <ProSidebar active="clients" />

      <div className="flex min-w-0 flex-1 flex-col">
        <ProTopBar />

        {/* Clients */}
        <div className="relative mx-auto w-full max-w-[1400px] px-16 py-12">
          <h3 className="text-[28px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: "Figtree, Inter, sans-serif" }}>Clients</h3>
          <div className="mt-8">
            <div className="flex h-10 items-center justify-between gap-3">
              <div className="relative min-w-0 max-w-md flex-1">
                <WIcon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E8E93]" />
                <div className="flex h-10 w-full items-center rounded-[10px] border border-[#E5E7EB] bg-[#F2F2F7] pl-10 pr-4 text-[15px] text-[#8E8E93]">Search clients</div>
              </div>
              <span className="inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-[#309E96] px-5 text-[15px] font-medium text-white">
                Add client
                <WIcon name="chevronDown" className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-6">
              <FloatStack>
                <ProCoupleView a={{ name: "Daniel Rosen", email: "daniel.rosen@gmail.com" }} b={{ name: "Maria Rosen", email: "maria.rosen@gmail.com" }} />
                <ProClientRowView c={{ name: "Elena Ruiz", email: "elena.ruiz@gmail.com", pill: "Summary awaiting approval" }} />
                <ProClientRowView c={{ name: "Marcus Webb", email: "marcus.webb@outlook.com" }} />
                <ProCoupleView a={{ name: "Sam Whitfield", email: "sam.whitfield@gmail.com" }} b={{ name: "Olivia Grant", email: "olivia.grant@gmail.com" }} />
                <ProClientRowView c={{ name: "Priya Anand", email: "priya.anand@outlook.com" }} />
                <ProClientRowView c={{ name: "Jordan Lee", email: "jordan.lee@gmail.com", pill: "Pending invite" }} />
                <ProClientRowView c={{ name: "Grace Liu", email: "grace.liu@yahoo.com" }} />
              </FloatStack>
            </div>
          </div>
        </div>
      </div>

      {/* The dim over the list while a client is open (bg-black/20) */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[68px] right-0 top-16 z-10 bg-black/20"
        style={{ opacity: open ? 1 : 0, transition: `opacity ${motion}` }}
      />

      {/* The client's panel: 800px wide, sliding in from the right */}
      <div
        className="absolute bottom-0 right-0 top-16 z-20 w-[800px] overflow-hidden bg-[#F0F2F5]"
        style={{
          boxShadow: open ? "-4px 0 24px rgba(0,0,0,0.08)" : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: `transform ${motion}, box-shadow ${motion}`,
        }}
      >
        <div className="px-16 py-10" style={{ marginTop: -panelScroll }}>
          {/* Header: the name, and the spouse their account is joined with */}
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[26px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, fontFamily: "Figtree, Inter, sans-serif" }}>Daniel Rosen</h3>
              <p className="mt-1 text-[15px] text-[#6B7280]">
                Joint account: <span className="font-medium text-[#309E96]">Maria Rosen</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {headerPill}
              <span className="rounded p-1.5 text-[#9CA3AF]">
                <WIcon name="more" className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Tabs, Estate Plan open */}
          <div className="border-b border-[#E5E7EB]">
            <div className="flex">
              {CLIENT_PANEL_TABS.map((t) => (
                <span
                  key={t}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-medium ${t === tab ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"}`}
                >
                  {t}
                  {dots.includes(t) && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C8782F]" />}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">{panel ?? <EstatePlanDocumentsPanel />}</div>
        </div>
      </div>
    </div>
  );
};

/* client-detail-view.tsx > Estate Plan > Documents: Daniel's own documents,
   then what he holds jointly with Maria (the trust and the deed funding it) */
export const EstatePlanDocumentsPanel = () => (
  <>
    {/* Documents · Summary */}
    <div className="mb-6 border-b border-[#E5E7EB]">
      <div className="flex">
        <span className="whitespace-nowrap border-b-2 border-[#309E96] px-4 py-3 text-[13px] font-medium text-[#309E96]">Documents</span>
        <span className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-[13px] font-medium text-[#6B7280]">Summary</span>
      </div>
    </div>

    <div className="space-y-6">
      <div>
        <ProDocSectionLabel label="Daniel's documents" action="Choose PDFs" />
        <FloatStack>
          <ProDocRow label="Last Will & Testament" detail="Simple will" />
          <ProDocRow label="Power of Attorney" detail="General — broad authority · Durable" />
          <ProDocRow label="Medical Proxy" />
        </FloatStack>
      </div>
      <div>
        <ProDocSectionLabel label="Joint with Maria" />
        <FloatStack>
          <div>
            <ProDocRow label="Revocable Living Trust" detail="Joint trust (married couple)" />
            <div className="px-8 pb-4">
              <div className="border-t border-[#E5E7EB]" />
              <div className="pl-8 pt-3">
                <ProDocRow nested label="Deed" detail="Trust transfer deed" />
              </div>
            </div>
          </div>
        </FloatStack>
      </div>
    </div>
  </>
);
