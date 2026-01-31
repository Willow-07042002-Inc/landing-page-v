import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Sends a page_view to GA4 on every route change so you can see
 * pages in order within a session (e.g. Path exploration in GA4).
 */
const GoogleAnalyticsPageView = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return null;
};

export default GoogleAnalyticsPageView;
