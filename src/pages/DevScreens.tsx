/* Dev only (/dev/screens): every recreated product screen at real size, for
   checking them against the product. Not routed in production builds. */
import React from "react";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";
import { AttorneyClientsScreen } from "@/components/product/attorney-clients";
import { ClientEstatePlanScreen } from "@/components/product/client-estate-plan";
import {
  ContactPanel,
  TeamPanel,
  TeamProfessionalPanel,
  StayingInTouchPanel,
  EmailsPanel,
  NotesPanel,
  EstatePlanSummaryPanel,
  EstatePlanSummaryApprovedPanel,
  ProSummaryAwaitingPill,
} from "@/components/product/attorney-client-panel";
import {
  SummaryReviewScreen,
  SummaryReviewScreenCropped,
  SUMMARY_REVIEW_HEIGHT,
  SUMMARY_REVIEW_CROP_HEIGHT,
  SendOrSkipDrawer,
  SEND_OR_SKIP_SIZE,
  ReleaseRequestModal,
  RELEASE_REQUEST_WIDTH,
  RELEASE_REQUEST_HEIGHTS,
} from "@/components/product/attorney-review";
import {
  BookingPageScreen,
  MeetingTypesSettingsScreen,
  IntegrationsSettingsScreen,
  LeadPanel,
  DashboardWithLeadPanelScreen,
} from "@/components/product/attorney-booking";

const Shot = ({ name, children, h = 855, w = 1440 }: { name: string; children: React.ReactNode; h?: number; w?: number }) => (
  <section data-shot={name} className="mb-16">
    <h2 className="mb-3 font-mono text-sm text-gray-500">{name}</h2>
    <div className="relative overflow-hidden border border-gray-300 bg-white" style={{ width: w, height: h }}>
      <ScaledScreen w={w} h={h}>{children}</ScaledScreen>
    </div>
  </section>
);

export const DEV_SHOTS: { name: string; el: React.ReactNode; h?: number; w?: number }[] = [
  { name: "dashboard", el: <AttorneyDashboardScreen /> },
  { name: "clients-documents", el: <AttorneyClientsScreen open /> },
  { name: "clients-closed", el: <AttorneyClientsScreen open={false} /> },
  { name: "panel-contact", el: <AttorneyClientsScreen open tab="Contact" panel={<ContactPanel />} /> },
  { name: "panel-team", el: <AttorneyClientsScreen open tab="Team" panel={<TeamPanel />} /> },
  { name: "panel-team-professional", el: <AttorneyClientsScreen open tab="Team" panel={<TeamProfessionalPanel />} /> },
  { name: "panel-staying-in-touch", el: <AttorneyClientsScreen open tab="Staying in touch" panel={<StayingInTouchPanel />} /> },
  { name: "panel-emails", el: <AttorneyClientsScreen open tab="Emails" panel={<EmailsPanel />} /> },
  { name: "panel-notes", el: <AttorneyClientsScreen open tab="Notes" panel={<NotesPanel />} /> },
  {
    name: "panel-summary-awaiting",
    el: <AttorneyClientsScreen open tab="Estate Plan" dots={["Estate Plan"]} headerPill={<ProSummaryAwaitingPill />} panel={<EstatePlanSummaryPanel />} />,
  },
  { name: "panel-summary-approved", el: <AttorneyClientsScreen open tab="Estate Plan" panel={<EstatePlanSummaryApprovedPanel />} /> },
  { name: "client-estate-plan-live-site", el: <ClientEstatePlanScreen /> },
  { name: "summary-review-full", el: <SummaryReviewScreen />, h: SUMMARY_REVIEW_HEIGHT },
  { name: "summary-review-crop", el: <SummaryReviewScreenCropped />, h: SUMMARY_REVIEW_CROP_HEIGHT },
  { name: "send-or-skip", el: <SendOrSkipDrawer />, w: SEND_OR_SKIP_SIZE.w, h: SEND_OR_SKIP_SIZE.h },
  { name: "release-request", el: <ReleaseRequestModal />, w: RELEASE_REQUEST_WIDTH, h: RELEASE_REQUEST_HEIGHTS.death },
  { name: "booking-time", el: <BookingPageScreen />, h: 900 },
  { name: "booking-about", el: <BookingPageScreen step="about" />, h: 900 },
  { name: "meeting-types", el: <MeetingTypesSettingsScreen /> },
  { name: "integrations", el: <IntegrationsSettingsScreen /> },
  { name: "integrations-calendars", el: <IntegrationsSettingsScreen page="calendars" /> },
  { name: "lead-panel", el: <LeadPanel />, w: 720, h: 791 },
  { name: "dashboard-lead-open", el: <DashboardWithLeadPanelScreen /> },
];

const DevScreens = () => (
  <div className="min-h-screen bg-[#EEF0F2] p-10">
    {DEV_SHOTS.map((s) => (
      <Shot key={s.name} name={s.name} h={s.h} w={s.w}>
        {s.el}
      </Shot>
    ))}
  </div>
);

export default DevScreens;
