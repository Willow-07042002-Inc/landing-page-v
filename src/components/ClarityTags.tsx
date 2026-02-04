import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Sets Microsoft Clarity custom tags on every route change so you can
 * filter sessions in the Clarity dashboard (e.g. by user_type, page_section).
 */
const ClarityTags = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window.clarity !== "function") return;

    // Tag the current page/section
    window.clarity("set", "page", pathname);

    // Tag user type for filtering (lawyer vs consumer)
    const lawyerPaths = ["/for-lawyers", "/book", "/request-access", "/pitol"];
    const userType = lawyerPaths.some((p) => pathname.startsWith(p))
      ? "lawyer"
      : "consumer";
    window.clarity("set", "user_type", userType);

    // Tag section names for easier filtering
    const section =
      pathname === "/"
        ? "home"
        : pathname === "/for-lawyers"
          ? "for_lawyers"
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
  }, [pathname]);

  return null;
};

export default ClarityTags;
