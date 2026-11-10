import { useEffect } from "react";
import { scrubUrl, useAnalyticsReady } from "@/lib/consent";

/**
 * Records which links and buttons people click (the label and where it goes),
 * only once the visitor has accepted analytics (src/lib/consent.ts). Page views
 * are counted by Google itself, from an address consent.ts has already cleaned.
 * Link addresses are scrubbed to the path plus campaign tags and the site's own
 * parameters. Clicks inside the cookie banner aren't recorded.
 */
const GoogleAnalyticsPageView = () => {
  const ready = useAnalyticsReady();

  useEffect(() => {
    if (!ready || typeof window.gtag !== "function") return;
    const gtag = window.gtag;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-analytics-ignore]")) return;
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
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [ready]);

  return null;
};

export default GoogleAnalyticsPageView;
