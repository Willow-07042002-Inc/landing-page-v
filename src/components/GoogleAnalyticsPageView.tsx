import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ANALYTICS_READY_EVENT, analyticsLoaded, scrubUrl } from "@/lib/consent";

/**
 * Sends a page_view to Google Analytics on every route change and records
 * link and button clicks, only once the visitor has accepted analytics
 * (src/lib/consent.ts). Addresses are scrubbed to the page path plus campaign
 * tags (utm_*): nothing else after a "?" is ever sent.
 */
const GoogleAnalyticsPageView = () => {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(analyticsLoaded());

  useEffect(() => {
    if (ready) return;
    const onReady = () => setReady(true);
    window.addEventListener(ANALYTICS_READY_EVENT, onReady);
    return () => window.removeEventListener(ANALYTICS_READY_EVENT, onReady);
  }, [ready]);

  // One page view per route, including the page they were on when they accepted.
  useEffect(() => {
    if (!ready || typeof window.gtag !== "function") return;
    const page_location = scrubUrl(window.location.href);
    // Every later event on this page (clicks, and anything GA measures on its
    // own) reports this scrubbed address, not the raw one in the address bar.
    window.gtag("set", { page_location });
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_title: document.title,
      page_location,
    });
  }, [pathname, ready]);

  // Which links and buttons people click: the label and where it goes.
  useEffect(() => {
    if (!ready || typeof window.gtag !== "function") return;
    const gtag = window.gtag;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");
      const el = link ?? button;
      if (!el) return;

      const linkText = el.getAttribute("data-ga-label") || el.textContent?.trim().slice(0, 100) || "";
      const isOutbound = !!link && !!link.hostname && link.hostname !== window.location.hostname;

      gtag("event", "click", {
        link_url: link?.href ? scrubUrl(link.href) || undefined : undefined,
        link_text: linkText || undefined,
        outbound: isOutbound,
        page_path: pathname,
        page_location: scrubUrl(window.location.href),
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, ready]);

  return null;
};

export default GoogleAnalyticsPageView;
