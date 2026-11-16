import React from "react";
import { Check, ChevronRight, Clock, FileText, MapPin, Phone, Video, Eye, Download, Lock, Share2, Calendar, Mail, MessageSquare, Newspaper, ClipboardList, Unlock, ScrollText, Landmark, KeyRound, HeartPulse, Baby } from "lucide-react";
import { Scaled } from "@/components/ProductVignettes";

/* New product recreations for the platform pages, built the same way as the
   existing vignettes (fixed 900×560 design size, scaled to their frame) and
   drawn from what the apps really show today:
   - attorney surfaces: Figtree, #309E96 accents
   - client surfaces: Inter, #128F8B
   Names and firms are illustrative. */

const VW = 900;
const VH = 560;
const ATT = "Figtree, Inter, sans-serif";

const Stage = ({ font = ATT, bg = "#F0F2F5", children }: { font?: string; bg?: string; children: React.ReactNode }) => (
  <Scaled w={VW} h={VH}>
    <div className="flex h-full w-full flex-col text-left" style={{ fontFamily: font, height: VH, backgroundColor: bg }}>
      {children}
    </div>
  </Scaled>
);

const Avatar = ({ i, tone = "grey" }: { i: string; tone?: "grey" | "teal" }) => (
  <span
    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12.5px] font-semibold ring-1 ring-black/5 ${
      tone === "teal" ? "bg-[#F0F9F9] text-[#309E96]" : "bg-[#F3F4F6] text-[#9CA3AF]"
    }`}
  >
    {i}
  </span>
);

const Pill = ({ children, tone = "teal" }: { children: React.ReactNode; tone?: "teal" | "amber" | "grey" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
      tone === "amber" ? "bg-[#FEF3E2] text-[#9A5B0B]" : tone === "grey" ? "bg-[#F3F4F6] text-[#6B7280]" : "bg-[#E6F5F4] text-[#0C7370]"
    }`}
  >
    {children}
  </span>
);

/* ── Attorney dashboard: the Required actions column ── */
export const RequiredActionsVignette = () => {
  const rows = [
    { i: "DR", n: "Daniel Rosen", what: "Plan summary ready for your review", tag: <Pill>Approve summary</Pill> },
    { i: "MR", n: "Maria Rosen", what: "Asked to open Daniel's will", tag: <Pill tone="amber">Release request</Pill> },
    { i: "GL", n: "Grace Liu", what: "Annual check-in email, ready to send", tag: <Pill tone="grey">Approve or skip</Pill> },
    { i: "MW", n: "Marcus Webb", what: "Said something changed: a new grandchild", tag: <Pill>Book a call</Pill> },
    { i: "CR", n: "Claire Rosen", what: "Answered your question about the lake house", tag: <Pill tone="grey">New answer</Pill> },
  ];
  return (
    <Stage>
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-8">
        <span className="text-[15px] font-semibold text-[#1F2933]">Good morning, Rachel.</span>
        <span className="flex items-center gap-2 text-[12.5px] text-[#9CA3AF]">
          <Avatar i="RA" tone="teal" /> Alvarez Estate Planning
        </span>
      </div>
      <div className="flex flex-1 gap-4 p-7">
        <div className="w-[230px] flex-shrink-0 space-y-3">
          {[
            { t: "New leads", c: 3, s: "Booked from your page" },
            { t: "Active clients", c: 24, s: "Plans in progress" },
            { t: "Required actions", c: 5, s: "Waiting on you", on: true },
          ].map((k) => (
            <div key={k.t} className={`rounded-xl border bg-white px-4 py-3.5 ${k.on ? "border-[#309E96] ring-2 ring-[#309E96]/15" : "border-[#EEF0F2]"}`}>
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-semibold text-[#1F2933]">{k.t}</span>
                <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11.5px] font-semibold text-[#6B7280]">{k.c}</span>
              </div>
              <div className="mt-0.5 text-[12px] text-[#9CA3AF]">{k.s}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 2px 4px rgba(16,24,40,0.05), 0 18px 36px -12px rgba(16,24,40,0.18)" }}>
          <div className="flex items-center gap-2.5 border-b border-[#EEF0F2] px-5 py-3.5">
            <ClipboardList className="h-[18px] w-[18px] text-[#309E96]" />
            <span className="text-[15px] font-semibold text-[#1F2933]">Required actions</span>
            <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[12px] font-semibold text-[#6B7280]">5</span>
          </div>
          <div className="divide-y divide-[#EEF0F2]">
            {rows.map((r) => (
              <div key={r.n} className="flex min-h-[74px] items-center gap-3.5 px-5 py-3">
                <Avatar i={r.i} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-semibold text-[#1F2933]">{r.n}</span>
                  <span className="block truncate text-[13px] text-[#9CA3AF]">{r.what}</span>
                </span>
                {r.tag}
                <ChevronRight className="h-4 w-4 text-[#C4C9D0]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};

/* ── Attorney review of an AI-drafted summary ── */
export const SummaryReviewVignette = () => (
  <Stage>
    <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-[#E5E7EB] bg-white px-7">
      <span className="text-[13px] text-[#9CA3AF]">Daniel Rosen</span>
      <ChevronRight className="h-3.5 w-3.5 text-[#C4C9D0]" />
      <span className="text-[13px] font-semibold text-[#1F2933]">Last Will and Testament · Draft summary</span>
      <span className="ml-auto flex items-center gap-2">
        <span className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[13px] font-medium text-[#4B5563]">Edit</span>
        <span className="flex items-center gap-1.5 rounded-lg bg-[#309E96] px-3.5 py-1.5 text-[13px] font-semibold text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} /> Approve for client
        </span>
      </span>
    </div>
    <div className="grid flex-1 grid-cols-[1fr_1.15fr] gap-5 p-6">
      {/* The source document */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white px-7 py-6" style={{ fontFamily: "Georgia, serif" }}>
        <div className="text-center text-[13px] font-bold tracking-[0.08em] text-[#1F2933]">ARTICLE FOURTH</div>
        <p className="mt-4 text-[12.5px] leading-[1.75] text-[#4B5563]">
          I give my real property located at 14 Birchwood Lane, Lake George, New York,{" "}
          <span className="rounded bg-[#FEF3C7] px-0.5 text-[#1F2933]">to my daughter, EMMA ROSEN, free of any mortgage or lien</span>, and I direct my
          Executor to satisfy any such encumbrance from the residue of my estate prior to distribution.
        </p>
        <p className="mt-3 text-[12.5px] leading-[1.75] text-[#4B5563]">
          I give the sum of Twenty-Five Thousand Dollars ($25,000) to each child of my siblings who survives me, per stirpes.
        </p>
        <p className="mt-3 text-[12.5px] leading-[1.75] text-[#9CA3AF]">
          All estate, inheritance and similar taxes shall be paid from the residue of my estate without apportionment…
        </p>
        <div className="mt-5 text-center text-[13px] font-bold tracking-[0.08em] text-[#1F2933]">ARTICLE FIFTH</div>
        <p className="mt-3 text-[12.5px] leading-[1.75] text-[#9CA3AF]">
          I nominate my sister, CLAIRE ROSEN, as Executor of this Will. If she fails to qualify or ceases to act, I nominate JUN PARK…
        </p>
      </div>
      {/* The draft summary */}
      <div className="flex flex-col gap-2.5 [&>div]:py-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Gift</div>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div>
              <div className="text-[15.5px] font-semibold text-[#1F2933]">The lake house goes to Emma</div>
              <div className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">The mortgage is paid off first, so it arrives debt-free.</div>
            </div>
            <Pill>Matches Article Fourth</Pill>
          </div>
        </div>
        <div className="rounded-xl border border-[#F5D9A8] bg-[#FFFBF3] p-5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9A5B0B]">Suggested review</div>
            <Pill tone="amber">Check wording</Pill>
          </div>
          <div className="mt-1.5 text-[15.5px] font-semibold text-[#1F2933]">$25,000 to each niece and nephew</div>
          <div className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
            "Per stirpes" means a gift passes to their children if they die first. Confirm the plain-English wording before approving.
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Taxes</div>
          <div className="mt-1.5 text-[15.5px] font-semibold text-[#1F2933]">The estate pays the taxes, not the people receiving gifts</div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Executor</div>
          <div className="mt-1.5 text-[15.5px] font-semibold text-[#1F2933]">Claire Rosen, Daniel's sister</div>
          <div className="mt-1 text-[13px] text-[#6B7280]">Jun Park steps in if Claire can't serve.</div>
        </div>
      </div>
    </div>
  </Stage>
);

/* ── Public booking page ── */
export const BookingVignette = () => (
  <Stage font="Inter, sans-serif" bg="#FAFBFC">
    <div className="grid flex-1 grid-cols-[300px_1fr]">
      <div className="border-r border-[#EEF0F2] bg-white p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F5F4] text-[18px] font-semibold text-[#128F8B]">RA</span>
        <div className="mt-4 text-[13px] text-[#9CA3AF]">Alvarez Estate Planning</div>
        <div className="mt-0.5 text-[22px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
          Rachel Alvarez
        </div>
        <div className="mt-6 space-y-2.5">
          {[
            { Icon: Video, t: "Video consultation", s: "30 min", on: true },
            { Icon: Phone, t: "Phone call", s: "20 min" },
            { Icon: MapPin, t: "In person at the office", s: "45 min" },
          ].map(({ Icon, t, s, on }) => (
            <div key={t} className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 ${on ? "border-[#128F8B] bg-[#F0F9F9]" : "border-[#EEF0F2]"}`}>
              <Icon className={`h-[18px] w-[18px] ${on ? "text-[#128F8B]" : "text-[#9CA3AF]"}`} />
              <span className="flex-1">
                <span className="block text-[13.5px] font-semibold text-[#1F2933]">{t}</span>
                <span className="flex items-center gap-1 text-[12px] text-[#9CA3AF]">
                  <Clock className="h-3 w-3" /> {s}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-8">
        <div className="text-[18px] font-semibold text-[#1F2933]">Choose a time</div>
        <div className="mt-1 text-[13px] text-[#9CA3AF]">Times shown in Eastern Time</div>
        <div className="mt-6 grid grid-cols-5 gap-2">
          {["Mon 16", "Tue 17", "Wed 18", "Thu 19", "Fri 20"].map((d, i) => (
            <div key={d} className={`rounded-lg py-2 text-center text-[13px] font-semibold ${i === 3 ? "bg-[#128F8B] text-white" : "bg-white text-[#4B5563] ring-1 ring-[#EEF0F2]"}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {["9:00 AM", "9:30 AM", "11:00 AM", "1:30 PM", "2:30 PM", "4:00 PM"].map((t, i) => (
            <div key={t} className={`rounded-lg border py-3 text-center text-[14px] font-medium ${i === 4 ? "border-[#128F8B] bg-[#F0F9F9] text-[#0C7370]" : "border-[#E5E7EB] bg-white text-[#1F2933]"}`}>
              {t}
            </div>
          ))}
        </div>
        <div className="mt-7 rounded-xl bg-white p-4 ring-1 ring-[#EEF0F2]">
          <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">What would you like to discuss?</div>
          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-[#E6F5F4] px-3 py-1 text-[12.5px] font-semibold text-[#0C7370]">Start a new estate plan</span>
            <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[12.5px] font-medium text-[#6B7280]">Update an existing plan</span>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <span className="rounded-[10px] bg-[#128F8B] px-7 py-3 text-[14.5px] font-semibold text-white">Book Thursday at 2:30 PM</span>
        </div>
      </div>
    </div>
  </Stage>
);

/* ── Staying in touch: the yearly rhythm, with emails to approve or skip ── */
export const StayingInTouchVignette = () => {
  const rows = [
    { Icon: Mail, m: "January", t: "Annual check-in", s: "\"Has anything changed this year?\"", state: "Sent", tone: "grey" as const },
    { Icon: MessageSquare, m: "April", t: "Short survey", s: "New family members, a move, a new home", state: "Answered", tone: "teal" as const },
    { Icon: Newspaper, m: "July", t: "From your firm", s: "Your note on the new estate tax exemption", state: "Posted", tone: "grey" as const },
    { Icon: Calendar, m: "October", t: "Plan review invitation", s: "Ready to send to Daniel and Maria", state: "approve", tone: "amber" as const },
  ];
  return (
    <Stage>
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-[#E5E7EB] bg-white px-7">
        <Avatar i="DR" />
        <span className="text-[15px] font-semibold text-[#1F2933]">Daniel &amp; Maria Rosen</span>
        <span className="ml-4 flex gap-5 text-[13px] text-[#9CA3AF]">
          <span>Estate Plan</span>
          <span>Team</span>
          <span className="border-b-2 border-[#309E96] pb-[15px] pt-[17px] font-semibold text-[#1F2933]">Staying in touch</span>
          <span>Notes</span>
        </span>
      </div>
      <div className="flex-1 p-7">
        <div className="text-[13px] text-[#9CA3AF]">Plan approved March 4. Enrolled in your yearly plan for staying in touch.</div>
        <div className="mt-5 space-y-3">
          {rows.map(({ Icon, m, t, s, state, tone }) => (
            <div key={t} className="flex items-center gap-4 rounded-xl border border-[#EEF0F2] bg-white px-5 py-4">
              <span className="w-[74px] text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">{m}</span>
              <Icon className="h-[18px] w-[18px] text-[#309E96]" />
              <span className="flex-1">
                <span className="block text-[14.5px] font-semibold text-[#1F2933]">{t}</span>
                <span className="block text-[13px] text-[#9CA3AF]">{s}</span>
              </span>
              {state === "approve" ? (
                <span className="flex gap-2">
                  <span className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12.5px] font-medium text-[#6B7280]">Skip</span>
                  <span className="rounded-lg bg-[#309E96] px-3 py-1.5 text-[12.5px] font-semibold text-white">Approve &amp; send</span>
                </span>
              ) : (
                <Pill tone={tone}>{state}</Pill>
              )}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

/* ── Vault: documents, versions and the access record ── */
export const VaultVignette = () => (
  <Stage font="Inter, sans-serif" bg="#FAFBFC">
    <div className="grid flex-1 grid-cols-[1.1fr_1fr] gap-5 p-7">
      <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="border-b border-[#F0F1F3] px-5 py-4 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">Estate plan documents</div>
        {[
          { n: "Last Will and Testament", s: "Signed August 18, 2026", v: "Current" },
          { n: "Revocable Living Trust", s: "Restated August 18, 2026", v: "Current" },
          { n: "Power of Attorney", s: "Signed August 18, 2026", v: "Current" },
          { n: "Health Care Proxy", s: "Signed August 18, 2026", v: "Current" },
          { n: "HIPAA Authorization", s: "Signed August 18, 2026", v: "Current" },
          { n: "Deed, 14 Birchwood Lane", s: "Recorded September 2, 2026", v: "Current" },
          { n: "Last Will and Testament", s: "March 12, 2019 – August 18, 2026", v: "Past" },
        ].map((d, i) => (
          <div key={d.n + i} className="flex items-center gap-3 border-b border-[#F5F6F7] px-5 py-3.5 last:border-0">
            <FileText className={`h-[18px] w-[18px] ${d.v === "Past" ? "text-[#C4C9D0]" : "text-[#128F8B]"}`} />
            <span className="flex-1">
              <span className={`block text-[14px] font-medium ${d.v === "Past" ? "text-[#9CA3AF]" : "text-[#1F2933]"}`}>{d.n}</span>
              <span className="block text-[12px] text-[#9CA3AF]">{d.s}</span>
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${d.v === "Past" ? "bg-[#F3F4F6] text-[#9CA3AF]" : "bg-[#E6F5F4] text-[#0C7370]"}`}>{d.v}</span>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="border-b border-[#F0F1F3] px-5 py-4 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">Access record</div>
        {[
          { Icon: Share2, t: "Will shared with Claire Rosen", s: "When Daniel has passed · Oct 2" },
          { Icon: Eye, t: "Maria Rosen viewed the health care proxy", s: "Sep 28, 4:12 PM" },
          { Icon: Download, t: "Daniel downloaded the trust", s: "Sep 3, 10:47 AM" },
          { Icon: Lock, t: "Release request from Maria denied", s: "Aug 30 · by Rachel Alvarez" },
          { Icon: Share2, t: "Finance shared with Maria Rosen", s: "Now · Aug 21" },
          { Icon: Eye, t: "Rachel Alvarez approved the will summary", s: "Aug 20, 9:15 AM" },
          { Icon: Download, t: "Daniel downloaded the will", s: "Aug 19, 6:02 PM" },
        ].map(({ Icon, t, s }) => (
          <div key={t} className="flex items-start gap-3 border-b border-[#F5F6F7] px-5 py-3.5 last:border-0">
            <Icon className="mt-0.5 h-4 w-4 text-[#9CA3AF]" />
            <span>
              <span className="block text-[13.5px] font-medium text-[#1F2933]">{t}</span>
              <span className="block text-[12px] text-[#9CA3AF]">{s}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </Stage>
);

/* ── Settings › Connections ── */
export const ConnectionsVignette = () => (
  <Stage>
    <div className="flex h-14 flex-shrink-0 items-center border-b border-[#E5E7EB] bg-white px-7">
      <span className="text-[15px] font-semibold text-[#1F2933]">Settings</span>
      <span className="ml-6 flex gap-5 text-[13px] text-[#9CA3AF]">
        <span>Profile</span>
        <span className="border-b-2 border-[#309E96] pb-[15px] pt-[17px] font-semibold text-[#1F2933]">Connections</span>
        <span>Branding</span>
        <span>Meeting types</span>
        <span>Availability</span>
      </span>
    </div>
    <div className="flex-1 space-y-3 p-7">
      {[
        { n: "Google Workspace", s: "Calendar availability, new events and contact suggestions. No Gmail access.", on: true },
        { n: "Microsoft 365", s: "Outlook calendar, email headers on a client's record, and contact suggestions.", on: false },
        { n: "Zoom", s: "A meeting link for every video consultation booked through Willow.", on: true },
      ].map((c) => (
        <div key={c.n} className="flex items-center gap-4 rounded-xl border border-[#EEF0F2] bg-white px-5 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F3F4F6] text-[15px] font-bold text-[#6B7280]">{c.n[0]}</span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold text-[#1F2933]">{c.n}</span>
            <span className="block text-[13px] leading-snug text-[#9CA3AF]">{c.s}</span>
          </span>
          {c.on ? (
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0C7370]">
              <Check className="h-4 w-4" strokeWidth={3} /> Connected
            </span>
          ) : (
            <span className="rounded-lg border border-[#309E96] px-3.5 py-1.5 text-[13px] font-semibold text-[#309E96]">Connect</span>
          )}
        </div>
      ))}
      <div className="pt-2 text-[12.5px] text-[#9CA3AF]">Connections are optional. Disconnect any of them at any time.</div>
    </div>
  </Stage>
);

/* ── The signing ceremony screen (built; switched on state by state) ── */
export const SigningShot = () => (
  <div className="absolute inset-0">
    <img src="/lovable-uploads/Signing Product Shot.png" alt="Willow's signing ceremony" className="h-full w-full object-cover object-center" />
  </div>
);

/* ── The portal a named person signs in to (an executor here). Before the
      passing is verified everything sealed shows as waiting; once the
      attorney verifies it, the same list opens, instructions included. ── */
export const RecipientPortalVignette = ({ state = "sealed" }: { state?: "sealed" | "released" }) => {
  const released = state === "released";
  const rows = [
    { Icon: ScrollText, t: "Last Will and Testament", s: released ? "Signed August 18, 2026" : "Opens once Daniel's passing is verified", sealed: true },
    { Icon: ScrollText, t: "Revocable Living Trust", s: released ? "Restated August 18, 2026" : "Opens once Daniel's passing is verified", sealed: true },
    { Icon: FileText, t: "Daniel's instructions for you", s: "Where everything is, who to call first, his wishes", sealed: true },
    { Icon: Landmark, t: "Finance", s: "Accounts, insurance, property and bills", sealed: false },
    { Icon: KeyRound, t: "Digital life", s: "Accounts, password manager and recovery", sealed: true },
    { Icon: HeartPulse, t: "Final wishes", s: "Service, burial and the people to tell", sealed: true },
  ];
  return (
    <Stage font="Inter, sans-serif" bg="#FAFBFC">
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#EEF0F2] bg-white px-7">
        <span className="text-[15px] font-semibold text-[#128F8B] underline decoration-2 underline-offset-[6px]">Shared with you</span>
        <span className="text-right">
          <span className="block text-[13px] font-semibold text-[#1F2933]">Claire Rosen</span>
          <span className="block text-[11.5px] text-[#9CA3AF]">Executor for Daniel Rosen</span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[1.45fr_1fr] gap-5 p-7">
        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between border-b border-[#F0F1F3] px-5 py-4">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">From Daniel Rosen</span>
            {released ? (
              <span className="flex items-center gap-1 rounded-full bg-[#E6F5F4] px-2.5 py-0.5 text-[11px] font-semibold text-[#0C7370]">
                <Unlock className="h-3 w-3" /> Released Oct 3 by Rachel Alvarez
              </span>
            ) : (
              <span className="rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#6B7280]">5 waiting for you</span>
            )}
          </div>
          {rows.map(({ Icon, t, s, sealed }) => {
            const locked = sealed && !released;
            return (
              <div key={t} className="flex items-center gap-3.5 border-b border-[#F5F6F7] px-5 py-[13px] last:border-0">
                <Icon className={`h-[19px] w-[19px] ${locked ? "text-[#C4C9D0]" : "text-[#128F8B]"}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block text-[14.5px] font-medium ${locked ? "text-[#6B7280]" : "text-[#1F2933]"}`}>{t}</span>
                  <span className="block truncate text-[12.5px] text-[#9CA3AF]">{s}</span>
                </span>
                {locked ? (
                  <span className="flex items-center gap-1 text-[12px] font-medium text-[#9CA3AF]">
                    <Lock className="h-3.5 w-3.5" /> Sealed
                  </span>
                ) : (
                  <span className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-[12.5px] font-semibold text-[#128F8B]">Open</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">The family's attorney</div>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F5F4] text-[14px] font-semibold text-[#128F8B]">RA</span>
              <span>
                <span className="block text-[15px] font-semibold text-[#1F2933]">Rachel Alvarez</span>
                <span className="block text-[12.5px] text-[#9CA3AF]">Alvarez Estate Planning</span>
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 rounded-[10px] bg-[#128F8B] py-2.5 text-[14px] font-semibold text-white">
              <Calendar className="h-4 w-4" /> Book a meeting
            </div>
          </div>
          {released ? (
            <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">First steps</div>
              {["Find the original will", "Call Rachel to begin probate", "Notify the bank and insurer"].map((x, i) => (
                <div key={x} className="mt-2.5 flex items-center gap-2.5 text-[13.5px] text-[#1F2933]">
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full ${i === 0 ? "bg-[#128F8B]" : "border border-[#D1D5DB]"}`}>
                    {i === 0 && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </span>
                  {x}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D1D5DB] p-5">
              <div className="text-[14px] font-semibold text-[#1F2933]">When the time comes</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-[#6B7280]">Let Rachel know, and she'll release everything Daniel left for you.</div>
              <div className="mt-3 text-[13px] font-semibold text-[#128F8B]">Report a passing</div>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

/* ── The guardian's view of the Children section ── */
export const GuardianChildrenVignette = () => (
  <Stage font="Inter, sans-serif" bg="#FAFBFC">
    <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#EEF0F2] bg-white px-7">
      <span className="text-[15px] font-semibold text-[#128F8B] underline decoration-2 underline-offset-[6px]">Shared with you</span>
      <span className="text-right">
        <span className="block text-[13px] font-semibold text-[#1F2933]">Claire Rosen</span>
        <span className="block text-[11.5px] text-[#9CA3AF]">Guardian for Emma and Leo</span>
      </span>
    </div>
    <div className="grid flex-1 grid-cols-2 gap-5 p-7">
      {[
        { n: "Emma", age: "Age 9", items: ["Lincoln Elementary · IEP updated March 2026", "Dr. Patel, pediatrician", "Piano on Tuesdays, swim on Saturdays", "Allergic to tree nuts", "College fund: 529 plan, statements in Finance", "Lights out at 8:30, after one chapter"] },
        { n: "Leo", age: "Age 6", items: ["Speech therapy, Thursdays", "Dr. Patel, pediatrician", "Sleeps with the blue blanket", "Best friend: Sam, two doors down", "College fund: 529 plan, statements in Finance", "Biscuit the dog goes with Leo"] },
      ].map((c) => (
        <div key={c.n} className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-3 border-b border-[#F0F1F3] px-5 py-4">
            <Baby className="h-5 w-5 text-[#128F8B]" />
            <span className="text-[16px] font-semibold text-[#1F2933]">{c.n}</span>
            <span className="text-[12.5px] text-[#9CA3AF]">{c.age}</span>
          </div>
          <div className="px-5 py-3">
            {c.items.map((x) => (
              <div key={x} className="border-b border-[#F5F6F7] py-2.5 text-[13.5px] text-[#4B5563] last:border-0">
                {x}
              </div>
            ))}
          </div>
          <div className="mx-5 mb-5 rounded-xl bg-[#F0F9F9] px-4 py-3 text-[12.5px] leading-relaxed text-[#0C7370]">
            "Keep them at Lincoln if you can. Sunday dinners with their grandparents matter."
          </div>
        </div>
      ))}
    </div>
  </Stage>
);

/* ── The agent's view: one place to act under a power of attorney ── */
export const AgentPortalVignette = () => (
  <Stage font="Inter, sans-serif" bg="#FAFBFC">
    <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#EEF0F2] bg-white px-7">
      <span className="text-[15px] font-semibold text-[#128F8B] underline decoration-2 underline-offset-[6px]">Shared with you</span>
      <span className="text-right">
        <span className="block text-[13px] font-semibold text-[#1F2933]">Maria Rosen</span>
        <span className="block text-[11.5px] text-[#9CA3AF]">Agent and health care proxy for Daniel</span>
      </span>
    </div>
    <div className="grid flex-1 grid-cols-[1.3fr_1fr] gap-5 p-7">
      <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="border-b border-[#F0F1F3] px-5 py-4 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">What you can do</div>
        {[
          { t: "Banks & financial institutions", s: "Open and close accounts, deposits and withdrawals" },
          { t: "Real property", s: "Buy, sell, lease or manage property for Daniel" },
          { t: "Taxes", s: "Prepare, file and pay federal and state taxes" },
          { t: "Retirement accounts", s: "Manage and take required distributions" },
          { t: "Health care decisions", s: "Speak for Daniel if he can't speak for himself" },
        ].map((r) => (
          <div key={r.t} className="flex items-start gap-3 border-b border-[#F5F6F7] px-5 py-3.5 last:border-0">
            <Check className="mt-0.5 h-4 w-4 text-[#128F8B]" strokeWidth={2.5} />
            <span>
              <span className="block text-[14px] font-medium text-[#1F2933]">{r.t}</span>
              <span className="block text-[12.5px] text-[#9CA3AF]">{r.s}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">Your documents</div>
          {[
            { Icon: FileText, t: "Power of Attorney" },
            { Icon: HeartPulse, t: "Health Care Proxy" },
          ].map(({ Icon, t }) => (
            <div key={t} className="mt-3 flex items-center gap-2.5">
              <Icon className="h-[18px] w-[18px] text-[#128F8B]" />
              <span className="flex-1 text-[14px] font-medium text-[#1F2933]">{t}</span>
              <span className="rounded-lg border border-[#E5E7EB] px-2.5 py-0.5 text-[12px] font-semibold text-[#128F8B]">Open</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">If you can't serve</div>
          <div className="mt-2 text-[14px] font-medium text-[#1F2933]">Claire Rosen steps in</div>
          <div className="text-[12.5px] text-[#9CA3AF]">Daniel's sister, second in line</div>
        </div>
      </div>
    </div>
  </Stage>
);
