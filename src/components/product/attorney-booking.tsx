import React, { useId } from "react";
import { FloatStack, MaskIcon, ProBellIcon, ProInitials, ProSidebar, ProTopBar, WIcon } from "./kit";
import { ProActiveClient, ProActiveCouple, ProColumn, ProReminder } from "./attorney-dashboard";

// ---- How new clients find the attorney, and how the attorney connects their
// apps, recreated from apps/professionals on origin/main (Nov 17 2026):
//   BookingPageScreen            app/book/[professionalId]/page.tsx, booking-flow.tsx,
//                                booking-parts.tsx, components/brand-select.tsx
//   MeetingTypesSettingsScreen   app/dashboard/settings/page.tsx, settings/settings-home.tsx,
//                                settings/meeting-types.tsx, meeting-types-data.ts,
//                                meeting-kit.tsx, shared.tsx, integration-brands.tsx
//   IntegrationsSettingsScreen   settings/integrations-tab.tsx, calendar-settings.tsx,
//                                conferencing-settings.tsx, email-settings.tsx, account-row.tsx,
//                                calendars-tab.tsx, menu.tsx, integration-logos.tsx, mail-logos.tsx
//                                (and the shapes behind app/api/integrations/*)
//   LeadPanel                    components/dashboard/leads-column.tsx, lead-detail-view.tsx
//   DashboardWithLeadPanelScreen dashboard-content.tsx + the above
// The dashboard shell (sidebar, top bar) is the kit's; mobile-back.tsx gives
// Settings its "All settings" chevron in the top bar. ----

const FIG = "Figtree, Inter, sans-serif";

/* The product's own icons, verbatim from packages/ui/icons/willow-solid (the
   kit's WIcon covers chevronRight, chevronDown, more) */
const ICON_PATHS = {
  chevronLeft:
    "M8.15 11.15 7.96 11.4 7.89 11.54 7.84 11.69 7.8 12 7.84 12.31 7.89 12.46 7.96 12.6 8.15 12.85 14.27 18.95 14.4 19.04 14.69 19.16 15 19.2 15.31 19.16 15.46 19.11 15.6 19.04 15.85 18.85 16.04 18.6 16.11 18.46 16.19 18.16 16.19 17.84 16.16 17.69 16.04 17.4 15.95 17.27 10.7 12 15.95 6.73 16.11 6.46 16.16 6.31 16.19 6.16 16.19 5.84 16.11 5.54 15.95 5.27 15.85 5.15 15.6 4.96 15.31 4.84 15.16 4.81 14.84 4.81 14.69 4.84 14.54 4.89 14.27 5.05Z",
  clock:
    "M20.87 8.33 20.31 7.2 19.62 6.16 18.79 5.21 17.84 4.38 16.8 3.69 15.67 3.13 14.48 2.73 13.25 2.48 12 2.4 10.75 2.48 9.52 2.73 8.33 3.13 7.2 3.69 6.16 4.38 5.21 5.21 4.38 6.16 3.69 7.2 3.13 8.33 2.73 9.52 2.48 10.75 2.4 12 2.48 13.25 2.73 14.48 3.13 15.67 3.69 16.8 4.38 17.84 5.21 18.79 6.16 19.62 7.2 20.31 8.33 20.87 9.52 21.27 10.75 21.52 12 21.6 13.25 21.52 14.48 21.27 15.67 20.87 16.8 20.31 17.84 19.62 18.79 18.79 19.62 17.84 20.31 16.8 20.87 15.67 21.27 14.48 21.52 13.25 21.6 12 21.52 10.75 21.27 9.52ZM18.47 14.68 18.06 15.5 17.55 16.26 16.95 16.95 16.26 17.55 15.5 18.06 14.68 18.47 13.81 18.76 12.91 18.94 12 19 11.09 18.94 10.19 18.76 9.32 18.47 8.5 18.06 7.74 17.55 7.05 16.95 6.45 16.26 5.94 15.5 5.53 14.68 5.24 13.81 5.06 12.91 5 12 5.06 11.09 5.24 10.19 5.53 9.32 5.94 8.5 6.45 7.74 7.05 7.05 7.74 6.45 8.5 5.94 9.32 5.53 10.19 5.24 11.09 5.06 12 5 12.91 5.06 13.81 5.24 14.68 5.53 15.5 5.94 16.26 6.45 16.95 7.05 17.55 7.74 18.06 8.5 18.47 9.32 18.76 10.19 18.94 11.09 19 12 18.94 12.91 18.76 13.81ZM18.73 12.44 18.84 12.33 18.91 12.21 18.95 12.07 18.95 11.93 18.88 11.72 18.79 11.61 18.67 11.52 18.54 11.47 18.4 11.45 17.4 11.45 17.26 11.47 17.12 11.52 17.01 11.61 16.92 11.72 16.87 11.86 16.85 12.07 16.92 12.28 17.07 12.44 17.26 12.53 17.4 12.55 18.4 12.55 18.61 12.51ZM9.83 7.29 9.56 7.17 9.37 7.15 9.18 7.18 9 7.27 8.79 7.47 8.7 7.64 8.65 7.83 8.66 8.03 8.77 8.3 10.67 11.31 10.55 11.61 10.5 12 10.51 12.2 10.61 12.57 10.81 12.91 10.94 13.06 11.09 13.19 11.43 13.39 11.61 13.45 12 13.5 12.2 13.49 12.57 13.39 12.91 13.19 13.06 13.06 13.19 12.91 13.39 12.57 13.45 12.39 13.5 12 13.45 11.61 13.38 11.42 15.73 9.14 15.8 9.02 15.84 8.88 15.85 8.74 15.81 8.6 15.69 8.42 15.52 8.3 15.38 8.26 15.24 8.25 15.03 8.32 14.92 8.41 12.62 10.64 12.39 10.55 12.2 10.51 11.94 10.5 10.03 7.5ZM11.52 6.88 11.61 6.99 11.72 7.08 11.86 7.13 12 7.15 12.14 7.13 12.33 7.04 12.44 6.93 12.51 6.81 12.55 6.6 12.55 5.53 12.51 5.39 12.44 5.27 12.33 5.16 12.21 5.09 12 5.05 11.79 5.09 11.61 5.21 11.49 5.39 11.45 5.6 11.45 6.6 11.47 6.74ZM11.56 18.73 11.67 18.84 11.79 18.91 11.93 18.95 12.07 18.95 12.28 18.88 12.39 18.79 12.48 18.67 12.53 18.54 12.55 18.4 12.55 17.4 12.53 17.26 12.48 17.12 12.39 17.01 12.28 16.92 12.14 16.87 11.93 16.85 11.72 16.92 11.56 17.07 11.47 17.26 11.45 17.4 11.45 18.4 11.49 18.61ZM6.93 12.44 7.08 12.28 7.13 12.14 7.15 12 7.13 11.86 7.08 11.72 6.99 11.61 6.88 11.52 6.74 11.47 6.6 11.45 5.6 11.45 5.46 11.47 5.32 11.52 5.21 11.61 5.12 11.72 5.07 11.86 5.05 12.07 5.12 12.28 5.27 12.44 5.46 12.53 5.6 12.55 6.6 12.55 6.81 12.51Z",
  calendarClock:
    "M21.8 15.01 21.5 14.4 21.13 13.83 20.68 13.32 20.17 12.87 19.6 12.5 18.99 12.2 18.35 11.98 17.68 11.84 17 11.8 16.32 11.84 15.65 11.98 15.01 12.2 14.4 12.5 13.83 12.87 13.32 13.32 12.87 13.83 12.5 14.4 12.2 15.01 11.98 15.65 11.84 16.32 11.8 17 11.84 17.68 11.98 18.35 12.2 18.99 12.5 19.6 12.87 20.17 13.32 20.68 13.83 21.13 14.4 21.5 15.01 21.8 15.65 22.02 16.32 22.16 17 22.2 17.68 22.16 18.35 22.02 18.99 21.8 19.6 21.5 20.17 21.13 20.68 20.68 21.13 20.17 21.5 19.6 21.8 18.99 22.02 18.35 22.16 17.68 22.2 17 22.16 16.32 22.02 15.65ZM16.37 14.23 16.44 14.07 16.54 13.94 16.68 13.84 16.92 13.76 17.17 13.77 17.32 13.84 17.46 13.94 17.56 14.08 17.63 14.23 17.65 14.4 17.65 16.95 19.35 18.06 19.54 18.23 19.64 18.47 19.64 18.72 19.54 18.95 19.37 19.14 19.22 19.21 19.05 19.25 18.88 19.24 18.72 19.19 16.65 17.84 16.52 17.74 16.43 17.61 16.37 17.46 16.35 17.3 16.35 14.4ZM17.79 7.38 17.55 7.8 17.24 8.15 16.86 8.44 16.45 8.64 15.99 8.77 15.6 8.8 15.21 8.77 14.75 8.64 14.34 8.44 14.08 8.26 13.85 8.04 13.56 7.66 13.36 7.25 13.23 6.79 13.2 6.47 13.2 4.6 10.8 4.6 10.8 6.4 10.77 6.79 10.7 7.09 10.59 7.38 10.35 7.8 10.04 8.15 9.8 8.35 9.54 8.51 9.25 8.64 8.95 8.73 8.64 8.79 8.4 8.8 8.01 8.77 7.71 8.7 7.42 8.59 7 8.35 6.76 8.15 6.54 7.92 6.36 7.66 6.21 7.38 6.07 6.95 6.01 6.64 6 4.6 5.09 4.62 4.78 4.68 4.48 4.78 4.2 4.92 3.94 5.1 3.7 5.3 3.5 5.54 3.32 5.8 3.18 6.08 3.08 6.38 3.02 6.69 3 7 3 19.1 3.02 19.41 3.08 19.72 3.18 20.02 3.32 20.3 3.5 20.56 3.7 20.8 3.94 21 4.2 21.18 4.48 21.32 4.78 21.42 5.09 21.48 5.4 21.5 12.45 21.5 11.88 20.83 11.42 20.13 11.12 19.52 10.84 18.73 10.67 17.91 10.6 17.08 10.65 16.24 10.84 15.27 11.06 14.62 11.42 13.87 11.88 13.17 12.19 12.8 11.5 12.8 11.34 12.78 11.2 12.72 11.02 12.57 10.92 12.36 10.9 12.2 10.9 11.2 10.95 10.97 11.02 10.83 11.13 10.72 11.27 10.65 11.42 10.61 12.5 10.6 12.73 10.65 12.87 10.72 12.98 10.83 13.08 11.04 13.1 11.2 13.1 11.93 13.87 11.42 14.62 11.06 15.27 10.84 16.24 10.65 16.92 10.6 17.76 10.65 18.73 10.84 19.52 11.12 20.27 11.5 21 12.01 21 7 20.98 6.69 20.92 6.38 20.82 6.08 20.68 5.8 20.5 5.54 20.3 5.3 20.06 5.1 19.8 4.92 19.52 4.78 19.22 4.68 18.91 4.62 18 4.6 17.99 6.64 17.93 6.95ZM8.2 15.28 8.32 15.38 8.42 15.5 8.49 15.72 8.49 16.88 8.45 17.03 8.38 17.17 8.2 17.32 8.06 17.38 7.9 17.4 6.82 17.39 6.67 17.35 6.53 17.28 6.42 17.17 6.35 17.03 6.3 16.8 6.31 15.72 6.35 15.57 6.42 15.43 6.6 15.28 6.82 15.21 7.9 15.2 8.06 15.22ZM8.32 10.78 8.45 10.97 8.5 11.2 8.49 12.28 8.42 12.5 8.32 12.62 8.13 12.75 7.9 12.8 6.82 12.79 6.6 12.72 6.48 12.62 6.35 12.43 6.3 12.2 6.31 11.12 6.38 10.9 6.48 10.78 6.67 10.65 6.9 10.6 7.98 10.61 8.2 10.68ZM14.47 2.95 14.34 3.26 14.3 3.6 14.3 6.4 14.34 6.74 14.4 6.9 14.57 7.19 14.81 7.43 14.95 7.53 15.1 7.6 15.43 7.69 15.6 7.7 15.94 7.66 16.25 7.53 16.52 7.32 16.73 7.05 16.86 6.74 16.9 6.4 16.9 3.6 16.86 3.26 16.73 2.95 16.52 2.68 16.25 2.47 15.94 2.34 15.77 2.31 15.43 2.31 15.1 2.4 14.81 2.57 14.57 2.81ZM7.37 2.81 7.2 3.1 7.14 3.26 7.1 3.6 7.1 6.4 7.14 6.74 7.2 6.9 7.37 7.19 7.61 7.43 7.75 7.53 8.06 7.66 8.23 7.69 8.4 7.7 8.74 7.66 9.05 7.53 9.32 7.32 9.53 7.05 9.66 6.74 9.7 6.4 9.7 3.6 9.66 3.26 9.6 3.1 9.43 2.81 9.19 2.57 8.9 2.4 8.57 2.31 8.23 2.31 7.9 2.4 7.61 2.57Z",
  video:
    "M17.02 9.34 16.94 9.42 16.9 9.57 16.9 14.43 16.92 14.54 16.99 14.64 17.05 14.69 20.15 16.45 20.26 16.48 20.42 16.46 20.51 16.4 20.56 16.33 20.6 16.18 20.6 7.82 20.58 7.7 20.51 7.6 20.42 7.54 20.3 7.52 20.19 7.54ZM4.7 7.5 4.34 7.55 4 7.69 3.85 7.79 3.59 8.05 3.49 8.2 3.35 8.54 3.31 8.72 3.31 15.28 3.35 15.46 3.49 15.8 3.59 15.95 3.85 16.21 4.16 16.39 4.34 16.45 4.7 16.5 14.3 16.5 14.66 16.45 14.84 16.39 15.15 16.21 15.41 15.95 15.51 15.8 15.65 15.46 15.7 15.1 15.7 8.9 15.65 8.54 15.51 8.2 15.41 8.05 15.15 7.79 15 7.69 14.66 7.55 14.3 7.5Z",
  phone:
    "M4.8 3 4.57 3.02 4.33 3.06 4.11 3.14 3.9 3.24 3.7 3.37 3.53 3.53 3.37 3.7 3.24 3.9 3.14 4.11 3.06 4.33 3.02 4.57 3 4.8 3 8.2 3.02 8.43 3.06 8.67 3.14 8.89 3.24 9.1 3.37 9.3 3.53 9.47 3.7 9.63 3.9 9.76 4.11 9.86 4.33 9.94 4.62 9.99 4.92 10.91 5.53 12.29 6.29 13.6 7.18 14.82 8.2 15.93 9.18 16.82 10.4 17.71 11.88 18.55 13.09 19.08 14.01 19.38 14.06 19.67 14.14 19.89 14.24 20.1 14.37 20.3 14.53 20.47 14.7 20.63 14.9 20.76 15.11 20.86 15.33 20.94 15.57 20.98 15.8 21 19.43 20.98 19.67 20.94 19.89 20.86 20.1 20.76 20.3 20.63 20.47 20.47 20.63 20.3 20.76 20.1 20.86 19.89 20.94 19.67 20.98 19.43 21 19.2 20.98 16.77 20.94 16.53 20.86 16.31 20.76 16.1 20.63 15.9 20.47 15.73 20.3 15.57 20.1 15.44 19.89 15.34 19.67 15.26 19.43 15.22 15.8 15.2 15.57 15.22 15.33 15.26 15.11 15.34 14.9 15.44 14.7 15.57 14.53 15.73 14.36 15.92 13.31 15.47 12.32 14.9 11.39 14.23 10.54 13.46 9.77 12.61 9.1 11.68 8.53 10.69 8.08 9.64 8.27 9.47 8.43 9.3 8.56 9.1 8.66 8.89 8.74 8.67 8.78 8.43 8.8 4.8 8.78 4.57 8.74 4.33 8.66 4.11 8.56 3.9 8.43 3.7 8.27 3.53 8.1 3.37 7.9 3.24 7.69 3.14 7.47 3.06 7.23 3.02 7 3Z",
  building:
    "M16.64 9.25 16.3 9.39 16.01 9.61 15.89 9.75 15.71 10.06 15.61 10.42 15.6 20.1 15.65 20.46 15.79 20.8 16.01 21.09 16.3 21.31 16.64 21.45 17 21.5 19.4 21.5 19.76 21.45 20.1 21.31 20.39 21.09 20.61 20.8 20.69 20.64 20.79 20.28 20.8 10.6 20.75 10.24 20.61 9.9 20.39 9.61 20.1 9.39 19.76 9.25 19.4 9.2 17 9.2ZM18.93 15.82 19.05 15.87 19.15 15.95 19.23 16.05 19.3 16.23 19.3 17.5 19.26 17.69 19.2 17.8 19.05 17.93 18.93 17.98 18.8 18 17.53 18 17.41 17.96 17.3 17.9 17.17 17.75 17.12 17.63 17.1 17.5 17.1 16.23 17.14 16.11 17.2 16 17.35 15.87 17.53 15.8 18.8 15.8ZM18.99 12.04 19.1 12.1 19.2 12.2 19.26 12.31 19.3 12.43 19.3 13.7 19.26 13.89 19.2 14 19.1 14.1 18.99 14.16 18.8 14.2 17.53 14.2 17.41 14.16 17.3 14.1 17.17 13.95 17.12 13.83 17.1 13.7 17.1 12.43 17.14 12.31 17.2 12.2 17.35 12.07 17.53 12 18.8 12ZM3.77 3.3 3.64 3.5 3.54 3.71 3.46 3.93 3.42 4.17 3.4 4.4 3.4 19.7 3.42 19.93 3.46 20.17 3.54 20.39 3.64 20.6 3.77 20.8 3.93 20.97 4.1 21.13 4.3 21.26 4.51 21.36 4.73 21.44 4.97 21.48 5.2 21.5 7.81 21.5 7.8 17.6 7.82 17.44 7.88 17.3 7.98 17.18 8.1 17.08 8.32 17.01 10.08 17.01 10.3 17.08 10.42 17.18 10.52 17.3 10.59 17.52 10.59 21.5 12.83 21.48 13.07 21.44 13.29 21.36 13.5 21.26 13.7 21.13 13.87 20.97 14.03 20.8 14.16 20.6 14.26 20.39 14.34 20.17 14.38 19.93 14.4 19.7 14.4 4.4 14.38 4.17 14.34 3.93 14.26 3.71 14.16 3.5 14.03 3.3 13.87 3.13 13.7 2.97 13.5 2.84 13.29 2.74 13.07 2.66 12.83 2.62 12.6 2.6 4.97 2.62 4.73 2.66 4.51 2.74 4.3 2.84 4.1 2.97 3.93 3.13ZM11.59 13.24 11.7 13.3 11.8 13.4 11.86 13.51 11.9 13.63 11.9 14.9 11.88 15.03 11.8 15.2 11.7 15.3 11.59 15.36 11.4 15.4 10.13 15.4 10.01 15.36 9.9 15.3 9.8 15.2 9.74 15.09 9.7 14.9 9.7 13.63 9.74 13.51 9.8 13.4 9.95 13.27 10.13 13.2 11.4 13.2ZM11.7 9.5 11.8 9.6 11.86 9.71 11.9 9.9 11.9 11.17 11.86 11.29 11.75 11.45 11.59 11.56 11.4 11.6 10.13 11.6 10.01 11.56 9.85 11.45 9.74 11.29 9.7 11.1 9.7 9.83 9.74 9.71 9.85 9.55 10.01 9.44 10.2 9.4 11.47 9.4 11.59 9.44ZM11.8 5.8 11.86 5.91 11.9 6.03 11.9 7.3 11.86 7.49 11.75 7.65 11.59 7.76 11.4 7.8 10.13 7.8 9.95 7.73 9.85 7.65 9.74 7.49 9.7 7.3 9.7 6.03 9.74 5.91 9.85 5.75 9.95 5.67 10.13 5.6 11.4 5.6 11.53 5.62 11.65 5.67ZM7.85 13.27 7.95 13.35 8.03 13.45 8.08 13.57 8.1 13.7 8.1 14.97 8.06 15.09 7.95 15.25 7.79 15.36 7.6 15.4 6.33 15.4 6.21 15.36 6.05 15.25 5.94 15.09 5.9 14.9 5.9 13.63 5.97 13.45 6.05 13.35 6.21 13.24 6.4 13.2 7.6 13.2 7.73 13.22ZM7.95 9.55 8.06 9.71 8.1 9.9 8.1 11.17 8.06 11.29 7.95 11.45 7.79 11.56 7.6 11.6 6.33 11.6 6.21 11.56 6.05 11.45 5.94 11.29 5.9 11.1 5.9 9.83 5.97 9.65 6.05 9.55 6.21 9.44 6.4 9.4 7.67 9.4 7.79 9.44ZM8.03 5.85 8.08 5.97 8.1 6.1 8.1 7.3 8.06 7.49 7.95 7.65 7.79 7.76 7.6 7.8 6.33 7.8 6.15 7.73 6.05 7.65 5.94 7.49 5.9 7.3 5.9 6.03 5.97 5.85 6.05 5.75 6.15 5.67 6.33 5.6 7.6 5.6 7.73 5.62 7.85 5.67 7.95 5.75Z",
} as const;

const Icon = ({ name, className, style }: { name: keyof typeof ICON_PATHS; className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} style={style}>
    <path fillRule="evenodd" clipRule="evenodd" d={ICON_PATHS[name]} />
  </svg>
);

/* An id for a logo's clip path or gradient that no other copy on the page shares */
const useSvgId = (name: string) => `${name}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

/* ── Brand logos, verbatim from settings/integration-logos.tsx and mail-logos.tsx ── */

const GoogleCalendarLogo = ({ className }: { className?: string }) => {
  const clip = useSvgId("gcal-rounded");
  return (
    <svg className={className} viewBox="34 34 132 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <rect x="40" y="40" width="120" height="120" rx="16" ry="16" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="40" y="40" width="120" height="120" fill="#4285F4" />
        <rect x="136" y="40" width="24" height="120" fill="#34A853" />
        <rect x="40" y="136" width="120" height="24" fill="#FBBC04" />
        <rect x="136" y="40" width="24" height="24" fill="#1967D2" />
        <rect x="40" y="136" width="24" height="24" fill="#1967D2" />
        <rect x="136" y="136" width="24" height="24" fill="#EA4335" />
        <rect x="64" y="64" width="72" height="72" fill="#fff" />
        <text x="101" y="120" textAnchor="middle" fontFamily="'Google Sans','Product Sans',Arial,sans-serif" fontSize="52" fontWeight="700" fill="#4285F4">31</text>
      </g>
    </svg>
  );
};

const GoogleMeetLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 87.5 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
    <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z" />
    <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
    <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
    <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32z" />
    <path fill="#00ac47" d="M49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z" />
    <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.58V6c0-3.315-2.685-6-6-6z" />
  </svg>
);

const ZoomLogo = ({ className }: { className?: string }) => {
  const grad = useSvgId("zoom-grad");
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0B5CFF" />
          <stop offset="1" stopColor="#2D8CFF" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="12" fill={`url(#${grad})`} />
      <text x="24" y="30" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="15.5" fontWeight="700" letterSpacing="-0.5" fill="#fff">zoom</text>
    </svg>
  );
};

const GoogleContactsLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#4285F4" />
    <circle cx="12" cy="9.2" r="3.4" fill="#fff" />
    <path fill="#fff" d="M5.6 18.4c.9-3 3.4-4.6 6.4-4.6s5.5 1.6 6.4 4.6A9.6 9.6 0 0 1 12 21.6a9.6 9.6 0 0 1-6.4-3.2Z" />
  </svg>
);

/* Demo data shared by the screens below */
const ATTORNEY_EMAIL = "rachel@alvarezlaw.example";

/* ════════════════════════════════════════════════════════════════════════
   The public booking page
   ════════════════════════════════════════════════════════════════════════ */

/* booking-parts.tsx: the default teal when the firm sets no colour, white on
   it (readableOn), and the 8% tint (`${brand}14`) */
const BRAND = "#309E96";
const ON_BRAND = "#FFFFFF";
const BRAND_SOFT = `${BRAND}14`;
/* booking-flow.tsx FONT_MODERN: the heading's font unless the firm picks "classic" */
const FONT_MODERN = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const LINE_INPUT = "w-full border-0 border-b border-[#E5E7EB] bg-transparent px-0 py-2.5 text-[15px]";

/* An input as it rests: what was typed, or its placeholder */
const LineInput = ({ value, placeholder }: { value?: string; placeholder: string }) => (
  <div className={`${LINE_INPUT} ${value ? "text-[#1F2933]" : "text-[#9CA3AF]"}`}>{value || placeholder}</div>
);

const GroupLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2.5 text-[13px] font-medium text-[#4B5563]">{children}</p>
);

const Chip = ({ label, active = false }: { label: string; active?: boolean }) => (
  <span
    className="rounded-full border px-3.5 py-1.5 text-[13px] font-medium"
    style={active ? { borderColor: BRAND, backgroundColor: BRAND_SOFT, color: BRAND } : { borderColor: "#E5E7EB", color: "#6B7280" }}
  >
    {label}
  </span>
);

/* brand-select.tsx, closed */
const BrandSelect = ({ value, placeholder }: { value?: string; placeholder: string }) => (
  <div
    className={`flex w-full items-center justify-between border-0 border-b bg-transparent px-0 py-2.5 text-[15px] ${value ? "text-[#1F2933]" : "text-[#9CA3AF]"}`}
    style={{ borderBottomColor: "#E5E7EB" }}
  >
    <span>{value || placeholder}</span>
    <WIcon name="chevronDown" className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
  </div>
);

const ConfidentialNote = () => (
  <p className="mt-2 text-[12.5px] leading-relaxed text-[#9CA3AF]">Please don&apos;t include confidential details of your legal matter.</p>
);

/* booking-parts.tsx MonthCalendar: the open days tinted, the chosen one solid.
   March 2027: today is Monday the 8th, and the consultation books up to 21
   days ahead, so both arrows rest disabled. */
const OPEN_DAYS = new Set([8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29]);
const CHOSEN_DAY = 11;

const MonthCalendar = () => {
  const y = 2027;
  const m = 3;
  const startWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] opacity-25">
          <Icon name="chevronLeft" className="h-4 w-4" />
        </span>
        <span className="text-[14px] font-semibold text-[#1F2933]">March 2027</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] opacity-25">
          <WIcon name="chevronRight" className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
          <div key={w} className="text-center text-[11px] font-medium text-[#9CA3AF]">{w}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`b${i}`} />;
          const avail = OPEN_DAYS.has(day);
          const selected = day === CHOSEN_DAY;
          return (
            <span
              key={day}
              className={`flex h-9 w-9 items-center justify-center justify-self-center rounded-full text-[13px] font-medium ${avail ? "" : "text-[#D1D5DB]"}`}
              style={selected ? { backgroundColor: BRAND, color: ON_BRAND } : avail ? { backgroundColor: BRAND_SOFT, color: BRAND } : undefined}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* booking-parts.tsx SlotPicker: the calendar beside the chosen day's times */
const THURSDAY_TIMES = ["9:00 AM", "9:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "3:00 PM", "4:00 PM"];
const CHOSEN_TIME = "2:30 PM";

const SlotPicker = () => (
  <div>
    <div className="grid grid-cols-2 gap-6">
      <MonthCalendar />
      <div className="border-l border-[#F3F4F6] pl-6">
        <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#1F2933]">
          <Icon name="clock" className="h-3.5 w-3.5" style={{ color: BRAND }} />
          Thu, Mar 11
        </p>
        <div className="mt-3 grid max-h-[208px] grid-cols-2 gap-2 overflow-hidden pr-1">
          {THURSDAY_TIMES.map((t) => (
            <span
              key={t}
              className={`rounded-lg border py-2 text-center text-[13px] font-medium ${t === CHOSEN_TIME ? "" : "border-[#E5E7EB] text-[#1F2933] hover:border-[#309E96] hover:text-[#309E96]"}`}
              style={t === CHOSEN_TIME ? { backgroundColor: BRAND, borderColor: BRAND, color: ON_BRAND } : undefined}
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[#9CA3AF]">Times shown in EST.</p>
      </div>
    </div>
  </div>
);

const BrandButton = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex h-11 items-center gap-2 rounded-[10px] px-6 text-[14px] font-semibold"
    style={{ backgroundColor: BRAND, color: ON_BRAND }}
  >
    {children}
  </span>
);

export type BookingPageStep = "about" | "situation" | "time";

/**
 * Rachel Alvarez's public booking page (/book/[professionalId]), as Jordan Lee
 * fills it in. The page books one meeting, the firm's Consultation (30 minutes,
 * Google Meet): the visitor never picks a meeting type. Its three steps are
 * About you, Your situation and Book your consultation; `step` picks which one
 * shows (the last, where the time is picked, by default).
 *
 * Canvas: 1440×900. The page centres its 560px card in the space under the
 * firm's 72px header, as the product does at desktop widths.
 */
export const BookingPageScreen = ({ step = "time" }: { step?: BookingPageStep }) => {
  const steps: BookingPageStep[] = ["about", "situation", "time"];
  return (
    <div className="flex w-full flex-col bg-[#F8FAFA] text-left" style={{ fontFamily: FIG, height: 900, colorScheme: "light" }}>
      {/* FirmHeader: no logo uploaded, so the firm's name as a wordmark in its colour */}
      <header className="flex h-[72px] flex-shrink-0 items-center justify-center border-b border-[#E5E7EB] bg-white px-6">
        <span className="text-[19px] font-bold tracking-tight" style={{ color: BRAND, letterSpacing: "-0.01em" }}>Alvarez Family Law</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-[820px]">
          <div className="mx-auto max-w-[560px]">
            <div className="mb-6 text-center">
              <h1 className="mx-auto max-w-[380px] text-[27px] font-bold leading-[1.2] tracking-tight text-[#1F2933]" style={{ fontFamily: FONT_MODERN }}>
                Consultation with Rachel
              </h1>
              <p className="mt-2 text-[13.5px] font-medium" style={{ color: BRAND }}>30 minutes · Google Meet</p>
              <p className="mx-auto mt-2.5 max-w-[440px] text-[14px] leading-relaxed text-[#6B7280]">
                Answer a few quick questions and we&apos;ll take it from here — no jargon, no homework, none of the usual legal headache.
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              {/* Step header: its name, and the dots (the current one long, in the brand colour) */}
              <div className="flex items-center justify-between border-b border-[#EEF0F2] px-8 py-3.5">
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]" style={{ fontFamily: FIG }}>
                  {step === "about" ? "About you" : step === "situation" ? "Your situation" : "Book your consultation"}
                </h2>
                <div className="flex items-center gap-1.5">
                  {steps.map((s) => (
                    <span key={s} className="h-1.5 rounded-full" style={{ width: step === s ? 18 : 6, backgroundColor: step === s ? BRAND : "#E5E7EB" }} />
                  ))}
                </div>
              </div>

              {step === "about" && (
                <div className="px-8 py-7">
                  <div className="flex flex-col gap-7">
                    <div>
                      <GroupLabel>Your name</GroupLabel>
                      <div className="grid grid-cols-2 gap-5">
                        <LineInput value="Jordan" placeholder="First name" />
                        <LineInput value="Lee" placeholder="Last name" />
                      </div>
                    </div>
                    <div>
                      <GroupLabel>Marital status</GroupLabel>
                      <BrandSelect value="Single" placeholder="Select your status" />
                    </div>
                  </div>
                </div>
              )}

              {step === "situation" && (
                <div className="px-8 py-7">
                  <div className="flex flex-col gap-7">
                    <div>
                      <GroupLabel>What would you like to do?</GroupLabel>
                      <div className="flex flex-wrap gap-2">
                        <Chip label="Start a new estate plan" active />
                        <Chip label="Update an existing plan" />
                      </div>
                    </div>
                    <div>
                      <GroupLabel>How many children?</GroupLabel>
                      <div className="flex flex-wrap gap-2">
                        {["No children", "One", "Two", "Three", "Four or more"].map((c) => (
                          <Chip key={c} label={c} active={c === "Two"} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <GroupLabel>Approximate estate value</GroupLabel>
                      <div className="flex flex-wrap gap-2">
                        {["Under $500K", "$500K–$1M", "$1M–$5M", "Over $5M"].map((v) => (
                          <Chip key={v} label={v} active={v === "$500K–$1M"} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <GroupLabel>Primary state of residence</GroupLabel>
                      <BrandSelect value="New York" placeholder="Select your state" />
                    </div>
                    <div>
                      <GroupLabel>Anything else? <span className="font-normal text-[#9CA3AF]">(optional)</span></GroupLabel>
                      <div className={`${LINE_INPUT} min-h-[44px] text-[#1F2933]`}>Afternoons are easiest for me.</div>
                      <ConfidentialNote />
                    </div>
                  </div>
                </div>
              )}

              {step === "time" && (
                <div className="px-8 py-7">
                  <div>
                    <GroupLabel>How can we reach you?</GroupLabel>
                    <div className="grid grid-cols-2 gap-5">
                      <LineInput value="jordan.lee@gmail.com" placeholder="Email address" />
                      <LineInput value="(212) 555-0147" placeholder="Phone (optional)" />
                    </div>
                  </div>
                  <div className="mt-6 border-t border-[#F3F4F6] pt-5">
                    <SlotPicker />
                  </div>
                </div>
              )}

              {/* Footer: Back (after the first step), then Continue or Confirm meeting */}
              <div className="px-8 pb-5 pt-1">
                <div className="flex items-center justify-between gap-4">
                  {step === "about" ? (
                    <span />
                  ) : (
                    <span className="inline-flex h-11 items-center gap-1.5 rounded-[10px] px-3 text-[14px] font-medium text-[#6B7280]">
                      <Icon name="chevronLeft" className="h-4 w-4" />
                      Back
                    </span>
                  )}
                  {step === "time" ? (
                    <BrandButton>Confirm meeting</BrandButton>
                  ) : (
                    <BrandButton>
                      Continue
                      <WIcon name="chevronRight" className="h-4 w-4" />
                    </BrandButton>
                  )}
                </div>
              </div>
            </div>

            {/* Footer: the only Willow mark on the firm's page */}
            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12px] text-[#B6BCC4]">
              Powered by
              <span className="text-[15px] text-[#9CA3AF]" style={{ fontFamily: "Pacifico, cursive" }}>Willow</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   Settings
   ════════════════════════════════════════════════════════════════════════ */

/* settings-home.tsx settingsGroups() and SETTINGS_PAGES: the list beside an open page */
const SETTINGS_GROUPS: { title: string; pages: string[] }[] = [
  { title: "Personal settings", pages: ["Profile", "Connections"] },
  { title: "Firm settings", pages: ["Firm details", "Branding", "Team", "Billing", "Firm history"] },
  { title: "Client experience", pages: ["Meeting types", "Availability", "Calendars", "Staying in touch", "Surveys", "Dashboard content", "Access requests"] },
];

const SettingsNav = ({ current }: { current: string }) => (
  <nav aria-label="Settings" className="w-[200px] flex-shrink-0 self-start">
    <div className="flex flex-col gap-5">
      {SETTINGS_GROUPS.map((g) => (
        <div key={g.title}>
          <p className="mb-1 truncate px-3 text-[12px] font-semibold text-[#1F2933]">{g.title}</p>
          {g.pages.map((p) => (
            <span
              key={p}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] ${p === current ? "font-semibold text-[#309E96]" : "text-[#6B7280] hover:text-[#309E96]"}`}
            >
              {p}
            </span>
          ))}
        </div>
      ))}
    </div>
  </nav>
);

/**
 * A Settings page inside the dashboard layout: the kit's sidebar (nothing in
 * it is active on /dashboard/settings) and top bar, with the top bar's
 * "All settings" chevron (mobile-back.tsx BackLink); then the page list on the
 * left and the page itself, its title line carrying its one action.
 */
const SettingsShell = ({
  current,
  description,
  action,
  children,
}: {
  current: string;
  description: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="relative flex h-full w-full overflow-hidden bg-[#F0F2F5] text-left" style={{ fontFamily: FIG, height: 855 }}>
    {/* sidebar.tsx marks Dashboard on /dashboard and Clients under /dashboard/clients: neither here */}
    <ProSidebar active={"settings" as never} />

    <div className="flex min-w-0 flex-1 flex-col">
      <div className="relative flex-shrink-0">
        <ProTopBar />
        <span aria-label="All settings" className="absolute left-6 top-3 z-40 flex h-10 w-10 items-center justify-center text-[#6B7280]">
          <Icon name="chevronLeft" className="h-6 w-6" />
        </span>
      </div>

      <div className="flex gap-10 px-16 py-12">
        <SettingsNav current={current} />
        <div className="min-w-0 max-w-[860px] flex-1">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[24px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.25, letterSpacing: "normal", fontFamily: FIG }}>
                {current}
              </h1>
              <p className="mt-1.5 text-[14px] text-[#6B7280]">{description}</p>
            </div>
            <div className="flex flex-shrink-0 items-center">{action}</div>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

/* shared.tsx: one list row for every Settings page */
const ROW_TITLE = "text-[14px] font-medium text-[#1F2933]";
const ROW_DETAIL = "mt-0.5 block text-[12.5px] text-[#9CA3AF]";
const ROW_LINE = "border-b border-[#F0F1F3] last:border-0";

/* shared.tsx StackSection inside the grey ground (meeting-kit.tsx OpenStack):
   white sections 6px apart, only the outer corners round */
const StackSection = ({
  title,
  position,
  children,
}: {
  title?: string;
  position: "only" | "first" | "middle" | "last";
  children: React.ReactNode;
}) => {
  const round = position === "only" ? "rounded-2xl" : position === "first" ? "rounded-t-2xl" : position === "last" ? "rounded-b-2xl" : "";
  return (
    <div className={`bg-white p-8 ${round}`}>
      {title && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]" style={{ fontFamily: FIG }}>{title}</h2>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

const OpenStack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5 rounded-2xl bg-[#F3F4F6]">{children}</div>
);

/* ── Meeting types ── */

type Place = "video" | "phone" | "in_person";
type Tool = "google_meet" | "zoom" | null;

/* integration-brands.tsx PlaceMark: the video tool's own logo; a line icon in
   a soft teal circle for a phone call or a room */
const PlaceMark = ({ place, tool }: { place: Place; tool: Tool }) => {
  if (place === "video" && tool) {
    const Logo = tool === "zoom" ? ZoomLogo : GoogleMeetLogo;
    return (
      <span className="flex flex-shrink-0">
        <Logo className="h-9 w-9" />
      </span>
    );
  }
  return (
    <span aria-hidden className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E7F5F3] text-[#128F8B]">
      <Icon name={place === "phone" ? "phone" : place === "in_person" ? "building" : "video"} className="h-[45%] w-[45%]" />
    </span>
  );
};

/* The four built-ins every firm has (Consultation, Check-in call, Agent
   meeting, Advisor meeting), then the firm's own. The quiet line is
   meeting-types-data.ts usesLine() and the schedule's name: the consultation
   is the public booking link's; the agent meeting is access requests' and the
   default agent check-in card's ("Everyone on the team"); the advisor meeting
   the default advisor check-in card's ("Financial advisor and accountant"). */
const MEETING_TYPES: { name: string; minutes: number; place: Place; tool: Tool; uses: string; schedule: string }[] = [
  { name: "Consultation", minutes: 30, place: "video", tool: "google_meet", uses: "Public booking link", schedule: "Standard business hours" },
  { name: "Check-in call", minutes: 30, place: "phone", tool: null, uses: "The client card", schedule: "Standard business hours" },
  { name: "Agent meeting", minutes: 30, place: "video", tool: "google_meet", uses: "Access requests, Everyone on the team card", schedule: "Standard business hours" },
  { name: "Advisor meeting", minutes: 30, place: "video", tool: "zoom", uses: "Financial advisor and accountant card", schedule: "Standard business hours" },
  { name: "Signing meeting", minutes: 60, place: "in_person", tool: null, uses: "Not used yet", schedule: "Office days" },
];

/**
 * Settings → Meeting types (/dashboard/settings?tab=meetings): one white box,
 * a row per type with where it happens, its length, where it's booked from and
 * its schedule; "New meeting type" on the title line. Canvas: 1440×855.
 */
export const MeetingTypesSettingsScreen = () => (
  <SettingsShell
    current="Meeting types"
    description="The meetings clients can book with you."
    action={<span className="flex-shrink-0 whitespace-nowrap text-[12px] font-medium leading-[18px] text-[#128F8B] hover:text-[#0F7673]">New meeting type</span>}
  >
    <OpenStack>
      <StackSection position="only">
        {MEETING_TYPES.map((t) => (
          <div key={t.name} className={`group flex w-full items-center gap-4 py-3.5 text-left ${ROW_LINE}`}>
            <PlaceMark place={t.place} tool={t.tool} />
            <span className="min-w-0 flex-1">
              <span className={`flex items-center gap-[5px] ${ROW_TITLE}`}>
                <span className="truncate">{t.name} · {t.minutes} minutes</span>
              </span>
              <span className={ROW_DETAIL}>{[t.uses, t.schedule].join(" · ")}</span>
            </span>
            <WIcon name="chevronRight" className="h-4 w-4 flex-shrink-0 text-[#C4C9D0] transition-colors group-hover:text-[#1F2933]" />
          </div>
        ))}
      </StackSection>
    </OpenStack>
  </SettingsShell>
);

/* ── Connections and Calendars ── */

/* account-row.tsx AccountRow: the brand mark, its name and address, and the ⋯ menu (Disconnect) */
const AccountRow = ({ Logo, name, detail }: { Logo: (p: { className?: string }) => React.ReactElement; name: string; detail: string }) => (
  <div className={`flex items-center justify-between gap-3 py-[8px] first:pt-0 last:pb-0 ${ROW_LINE}`}>
    <span className="flex min-w-0 items-center gap-3">
      <Logo className="h-9 w-9 flex-shrink-0" />
      <span className="min-w-0">
        <span className={`block ${ROW_TITLE}`}>{name}</span>
        <span className={`truncate ${ROW_DETAIL}`}>{detail}</span>
      </span>
    </span>
    <span className="flex flex-shrink-0 items-center gap-3">
      <span aria-label="Options" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280]">
        <WIcon name="more" className="h-4 w-4" />
      </span>
    </span>
  </div>
);

const ConnectionsPage = () => (
  <OpenStack>
    {/* calendar-settings.tsx: one row per connected calendar account */}
    <StackSection title="Calendar" position="first">
      <div>
        <div className="flex flex-col">
          <AccountRow Logo={GoogleCalendarLogo} name="Google Calendar" detail={ATTORNEY_EMAIL} />
        </div>
      </div>
    </StackSection>
    {/* conferencing-settings.tsx: Meet comes with the Google calendar; Zoom has its own login, and its note */}
    <StackSection title="Video conferencing" position="middle">
      <div>
        <div className="flex flex-col">
          <AccountRow Logo={GoogleMeetLogo} name="Google Meet" detail="Comes with your Google Calendar" />
          <AccountRow Logo={ZoomLogo} name="Zoom" detail={ATTORNEY_EMAIL} />
          <p className={`pt-[8px] ${ROW_DETAIL}`}>
            Meetings you create in Zoom outside Willow only affect your availability if they&apos;re on a calendar you&apos;ve connected.
          </p>
        </div>
      </div>
    </StackSection>
    {/* email-settings.tsx: read-only, so Willow can look people up */}
    <StackSection title="Email" position="last">
      <div>
        <div className="flex flex-col">
          <AccountRow Logo={GoogleContactsLogo} name="Google contacts" detail={ATTORNEY_EMAIL} />
        </div>
      </div>
    </StackSection>
  </OpenStack>
);

/* calendars-tab.tsx: the account's calendars. The one new meetings go to says
   "Adding events to"; a calendar a meeting type books into says so; every
   other one Willow can write to offers "Add events here". Colours are the
   calendars' own, as Google gives them. */
const GOOGLE_CALENDARS: { name: string; color: string; target?: boolean; lockedBy?: string; canWrite: boolean }[] = [
  { name: "Main calendar", color: "#4986E7", target: true, canWrite: true },
  { name: "Consultations", color: "#16A765", lockedBy: "Consultation", canWrite: true },
  { name: "Family", color: "#F691B2", canWrite: true },
  { name: "Holidays in United States", color: "#7BD148", canWrite: false },
];

const CalendarsPage = () => (
  <div>
    <OpenStack>
      <StackSection position="only">
        <div>
          <div className="flex items-center justify-between gap-[8px]">
            <p className="flex min-w-0 items-center gap-[8px]">
              <GoogleCalendarLogo className="h-9 w-9 flex-shrink-0" />
              <span className="min-w-0">
                <span className={`block ${ROW_TITLE}`}>Google Calendar</span>
                <span className={`truncate ${ROW_DETAIL}`}>{ATTORNEY_EMAIL}</span>
              </span>
            </p>
          </div>
          <div className="mt-[21px] border-t border-[#EEF0F2] pt-[13px]">
            <h3 className="text-[15px] font-semibold leading-[21px] text-[#1F2933]" style={{ fontFamily: FIG }}>Calendars</h3>
            <div className="mt-[5px] flex flex-col">
              {GOOGLE_CALENDARS.map((cal) => (
                <div key={cal.name} className="flex items-center gap-[8px] border-b border-[#F0F1F3] py-[8px] last:border-b-0">
                  <span aria-hidden className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: cal.color }} />
                  <span className="min-w-0 flex-1 truncate text-[15px] leading-[21px] text-[#1F2933]">{cal.name}</span>
                  {cal.target ? (
                    <span className="flex-shrink-0 rounded-md bg-[#E6F4F3] px-[5px] py-px text-[12px] font-medium leading-[18px] text-[#0F7673]">Adding events to</span>
                  ) : (
                    <>
                      {cal.lockedBy && <span className="flex-shrink-0 text-[12px] leading-[18px] text-[#9CA3AF]">{cal.lockedBy} books here</span>}
                      {cal.canWrite && (
                        <span className="flex-shrink-0 text-[12px] font-medium leading-[18px] text-[#128F8B] hover:text-[#0F7673]">Add events here</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </StackSection>
    </OpenStack>
  </div>
);

/* menu.tsx AddMenu / AddButton, closed: a quiet teal word on the title line */
const TitleAction = ({ label }: { label: string }) => (
  <span className="inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap text-[12px] font-medium leading-[18px] text-[#309E96] hover:text-[#0F7673]">{label}</span>
);

/**
 * Rachel's connected Google account in Settings. `page="connections"`
 * (default) is Settings → Connections: Google Calendar, then Google Meet
 * (which comes with it) and Zoom, then Google contacts for email, each with
 * its ⋯ menu; "Add" on the title line offers Google Calendar, Outlook
 * Calendar, Google Meet, Microsoft Teams, Zoom, Google contacts and Outlook.
 * `page="calendars"` is Settings → Calendars: that account's own calendars and
 * where new meetings are added. Canvas: 1440×855.
 */
export const IntegrationsSettingsScreen = ({ page = "connections" }: { page?: "connections" | "calendars" }) =>
  page === "calendars" ? (
    <SettingsShell current="Calendars" description="Where new meetings are added." action={<TitleAction label="Add a calendar" />}>
      <CalendarsPage />
    </SettingsShell>
  ) : (
    <SettingsShell current="Connections" description="Connect your calendar, video and email accounts." action={<TitleAction label="Add" />}>
      <ConnectionsPage />
    </SettingsShell>
  );

/* ════════════════════════════════════════════════════════════════════════
   A new lead
   ════════════════════════════════════════════════════════════════════════ */

/* lead-detail-view.tsx Row: label left, what they said right */
const LeadRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
    <span className="text-[13px] text-[#9CA3AF]">{label}</span>
    <span className="text-right text-[13.5px] font-medium text-[#1F2933]">{children}</span>
  </div>
);

/* What leads-column.tsx renders inside the panel: LeadDetailView for Jordan
   Lee, on Bookings, with the booking they made open. The intake lines are the
   ones the booking route writes from the form (Marital status, Children,
   Estate value, State of residence, then their note). */
const LeadDetail = () => (
  <div className="px-12 py-10">
    <div className="w-full">
      {/* Header: the name, then Convert to client / Dismiss lead */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.2, letterSpacing: "normal", fontFamily: FIG }}>Jordan Lee</h1>
          <p className="mt-1 text-[15px] text-[#6B7280]">Lead</p>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
          <span className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[#309E96] px-4 text-[13px] font-semibold text-white hover:bg-[#0F7673]">
            Convert to client
          </span>
          <span className="text-[12.5px] font-medium text-[#9CA3AF] hover:text-[#EF4444]">Dismiss lead</span>
        </div>
      </div>

      {/* Contact | Bookings (1) | Notes */}
      <div className="mb-5 border-b border-[#E5E7EB]">
        <nav className="flex" role="tablist">
          {["Contact", "Bookings (1)", "Notes"].map((t) => (
            <span
              key={t}
              className={`border-b-2 px-4 py-2.5 text-[13px] font-medium ${t === "Bookings (1)" ? "border-[#309E96] text-[#309E96]" : "border-transparent text-[#6B7280]"}`}
            >
              {t}
            </span>
          ))}
        </nav>
      </div>

      {/* BookingCard, open: the meeting and Join call (grey until five minutes before), then the intake */}
      <FloatStack>
        <div className="bg-white">
          <div className="flex cursor-pointer items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F0F9F9] text-[#309E96]">
                <Icon name="calendarClock" className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#1F2933]">Thursday, March 11</p>
                <p className="text-[12.5px] text-[#6B7280]">2:30 PM · 30 min</p>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <span className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[#F3F4F6] px-4 text-[13px] font-semibold text-[#9CA3AF] hover:bg-[#E5E7EB]">
                <Icon name="video" className="h-4 w-4" />
                Join call
              </span>
              <WIcon name="chevronDown" className="h-4 w-4 rotate-180 text-[#9CA3AF]" />
            </div>
          </div>
          <div className="border-t border-[#F3F4F6] px-4 pb-4 pt-3">
            <div className="flex flex-col gap-1">
              <LeadRow label="Looking to">Start a new estate plan</LeadRow>
              <LeadRow label="Marital status">Single</LeadRow>
              <LeadRow label="Children">Yes (2)</LeadRow>
              <LeadRow label="Estate value">$500K–$1M</LeadRow>
              <LeadRow label="State of residence">New York</LeadRow>
              <p className="py-1 text-[13.5px] leading-relaxed text-[#374151]">Afternoons are easiest for me.</p>
            </div>
            <p className="mt-3 text-[12px] text-[#9CA3AF]">Booked March 8, 2027.</p>
          </div>
        </div>
      </FloatStack>
    </div>
  </div>
);

/* leads-column.tsx: the panel slides in from the right under the top bar,
   720px wide (max-w-[720px]) on the page's grey, with a soft shadow on its
   left edge */
const PANEL_SHADOW = "-4px 0 24px rgba(0,0,0,0.08)";

/**
 * Jordan Lee's lead panel on its own, at its real size: 720 wide and, by
 * default, 791 tall (an 855px screen under the 64px top bar).
 */
export const LeadPanel = ({ height = 791 }: { height?: number }) => (
  <div className="w-[720px] overflow-hidden bg-[#F0F2F5] text-left" style={{ fontFamily: FIG, height, boxShadow: PANEL_SHADOW }}>
    <LeadDetail />
  </div>
);

/* leads-column.tsx: one lead, its next meeting at the right */
const LEADS = [
  { n: "Jordan Lee", m: "Start a new estate plan", t: "Thursday at 2:30 PM" },
  { n: "Amara Patel", m: "Update an existing plan", t: "Friday at 11:00 AM" },
  { n: "Chris Novak", m: "Start a new estate plan", t: "Monday at 9:15 AM" },
];

/**
 * The dashboard with Jordan Lee's panel open, as clicking his row in New
 * leads leaves it. The page dims under the panel (bg-black/20), except the New
 * leads column, which sits above the dim so another lead can be clicked
 * straight away. Canvas: 1440×855.
 */
export const DashboardWithLeadPanelScreen = () => (
  // The site's base styles set every h1–h6 in Merriweather; the product's
  // column titles (h4) are Figtree like everything else
  <div className="relative flex h-full w-full overflow-hidden bg-[#F0F2F5] text-left [&_h4]:[font-family:Figtree,Inter,sans-serif]" style={{ fontFamily: FIG, height: 855 }}>
    <ProSidebar active="dashboard" />

    <div className="flex min-w-0 flex-1 flex-col">
      <ProTopBar />

      <div className="mx-auto w-full max-w-[1400px] px-16 py-12">
        <h3 className="text-[40px] font-semibold text-[#1F2933]" style={{ lineHeight: 1.15, fontFamily: FIG }}>
          Good morning, Rachel.
        </h3>

        <div className="mt-8 grid grid-cols-3 gap-1.5">
          {/* relative z-10: above the dim */}
          <div className="relative z-10 grid">
            <ProColumn
              icon={<MaskIcon src="/mock/leads-icon.svg" color="#309E96" size={20} />}
              title="New leads"
              count={3}
              action="Copy link"
              rounding="rounded-l-2xl"
            >
              {LEADS.map((r) => (
                <div key={r.n} className="group flex min-h-[84px] w-full items-center justify-between gap-3 bg-white px-5 py-4 text-left">
                  <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    <ProInitials name={r.n} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#1F2933]" style={{ fontSize: 15 }}>{r.n}</p>
                      <p className="truncate text-[#9CA3AF]" style={{ fontSize: 13 }}>{r.m}</p>
                    </div>
                  </div>
                  <span className="flex flex-shrink-0 items-center whitespace-nowrap text-[12px] text-[#9CA3AF]">{r.t}</span>
                </div>
              ))}
            </ProColumn>
          </div>

          <ProColumn
            icon={<MaskIcon src="/mock/clients-icon.svg" color="#309E96" size={20} />}
            title="Active clients"
            count={10}
            action="Add"
            footer="View all 10 clients"
            rounding="rounded-none"
          >
            <ProActiveCouple a="Daniel Rosen" b="Maria Rosen" />
            <ProActiveClient name="Elena Ruiz" sub="Individual" />
            <ProActiveClient name="Marcus Webb" sub="Individual" />
            <ProActiveCouple a="Sam Whitfield" b="Olivia Grant" />
          </ProColumn>

          <ProColumn
            icon={<ProBellIcon className="h-5 w-5 flex-shrink-0 text-[#309E96]" />}
            title="Required actions"
            count={4}
            rounding="rounded-r-2xl"
          >
            <ProReminder title="Elena Ruiz's summary is ready for review" cta="Review summary" />
            <ProReminder title="Marcus says something changed" sub="Have you moved, or bought or sold property?" cta="See what changed" />
            <ProReminder title="Priya Anand's summary is ready for review" cta="Review summary" />
            <ProReminder title="Sam says something changed" sub="Has your family dynamic changed?" cta="See what changed" />
          </ProColumn>
        </div>
      </div>
    </div>

    {/* The dim, from the sidebar's edge and under the top bar */}
    <div aria-hidden className="pointer-events-none absolute bottom-0 left-[68px] right-0 top-16 z-[5] bg-black/20" />

    {/* The panel */}
    <div className="absolute bottom-0 right-0 top-16 z-50 w-[720px] overflow-hidden bg-[#F0F2F5]" style={{ boxShadow: PANEL_SHADOW }}>
      <LeadDetail />
    </div>
  </div>
);
