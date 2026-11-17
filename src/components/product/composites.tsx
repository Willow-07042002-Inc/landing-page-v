/* Product moments shown in context, on a 1440×855 canvas: a drawer or popup
   over the dashboard, layered exactly as the product layers them. */
import React from "react";
import { AttorneyDashboardScreen } from "./attorney-dashboard";
import { SendOrSkipDrawer, ReleaseRequestModal, RELEASE_REQUEST_WIDTH, RELEASE_REQUEST_HEIGHTS } from "./attorney-review";

/* slide-drawer.tsx: the dim covers the page below the top bar and right of
   the sidebar (bg-black/20); the drawer is 560px wide from the top bar down. */
export const DashboardWithSendOrSkip = () => (
  <div className="relative overflow-hidden" style={{ width: 1440, height: 855 }}>
    <AttorneyDashboardScreen />
    <div aria-hidden className="absolute bottom-0 left-[68px] right-0 top-16 bg-black/20" />
    <div className="absolute bottom-0 right-0 top-16 w-[560px] shadow-[-4px_0_24px_rgba(0,0,0,0.08)]">
      <SendOrSkipDrawer />
    </div>
  </div>
);

/* reminders-bell.tsx AccessRequestModal: centred over the whole window on
   bg-black/40 with a 2px blur */
export const DashboardWithReleaseRequest = () => (
  <div className="relative overflow-hidden" style={{ width: 1440, height: 855 }}>
    <AttorneyDashboardScreen />
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div style={{ width: RELEASE_REQUEST_WIDTH, height: RELEASE_REQUEST_HEIGHTS.death }}>
        <ReleaseRequestModal />
      </div>
    </div>
  </div>
);
