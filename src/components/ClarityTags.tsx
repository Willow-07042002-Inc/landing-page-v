import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ANALYTICS_READY_EVENT, analyticsLoaded } from "@/lib/consent";

/**
 * Sets Microsoft Clarity custom tags on every route change so you can
 * filter sessions in the Clarity dashboard (e.g. by user_type, page_section).
 * Only once the visitor has accepted analytics (src/lib/consent.ts).
 */
const ClarityTags = () => {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(analyticsLoaded());

  useEffect(() => {
    if (ready) return;
    const onReady = () => setReady(true);
    window.addEventListener(ANALYTICS_READY_EVENT, onReady);
    return () => window.removeEventListener(ANALYTICS_READY_EVENT, onReady);
  }, [ready]);

  useEffect(() => {
    if (!ready || typeof window.clarity !== "function") return;

    // Tag the current page/section
    window.clarity("set", "page", pathname);

    // Tag user type for filtering (lawyer vs consumer)
    const consumerPaths = ["/clients"];
    const userType = consumerPaths.some((p) => pathname.startsWith(p))
      ? "consumer"
      : "lawyer";
    window.clarity("set", "user_type", userType);

    // Tag section names for easier filtering
    const section =
      pathname === "/"
        ? "home"
        : pathname === "/clients"
          ? "clients"
          : pathname === "/giveback"
            ? "giveback"
            : pathname === "/pitol"
              ? "founding_firms"
              : pathname === "/book" || pathname === "/request-access"
                ? "booking"
                : pathname === "/contact"
                  ? "contact"
                  : pathname === "/learn"
                    ? "learn"
                    : pathname === "/about-us"
                      ? "about_us"
                      : pathname.replace("/", "") || "home";
    window.clarity("set", "section", section);
  }, [pathname, ready]);

  return null;
};

export default ClarityTags;
