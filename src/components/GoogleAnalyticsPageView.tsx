import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Sends a page_view to GA4 on every route change (with full URL so traffic
 * source / UTM is attributed) and tracks link/button clicks.
 */
const GoogleAnalyticsPageView = () => {
  const { pathname } = useLocation();

  // Page view with full URL so GA can attribute traffic source (referrer, UTM)
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname]);

  // Click tracking: send GA event for link and button clicks
  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");
      const el = link ?? button;
      if (!el) return;

      const linkUrl = link?.href ?? "";
      const linkText =
        (el.getAttribute("data-ga-label") as string) ||
        (el.textContent?.trim().slice(0, 100) ?? "");
      const isOutbound =
        link && link.hostname && link.hostname !== window.location.hostname;

      window.gtag("event", "click", {
        link_url: linkUrl || undefined,
        link_text: linkText || undefined,
        outbound: isOutbound,
        page_path: pathname,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  return null;
};

export default GoogleAnalyticsPageView;
