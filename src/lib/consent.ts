/*
 * Analytics consent for willow-inc.com (Privacy Policy 2.6(c)–(d), 5.8, 8.7).
 *
 * Google Analytics and Microsoft Clarity are optional and run only after the
 * visitor clicks Accept. Before that, neither script is on the page: no
 * request to Google or Microsoft, no cookies. Reject is as easy as Accept, the
 * footer's "Cookie settings" reopens the choice at any time, and a browser
 * Global Privacy Control signal counts as a decline (a later, explicit Accept
 * in Cookie settings still wins: it's the visitor's own choice).
 *
 * Withdrawing consent clears GA's and Clarity's first-party cookies, tells
 * Clarity, and reloads so neither script keeps running.
 *
 * Advertising stays off in the tag itself, whatever the dashboards say:
 * Google signals and ad personalization off, ad storage denied.
 */

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "willow_analytics_consent";
const GA_ID = "G-DTM6FLHNTM";
const CLARITY_ID = "va5mvqtza2";

/** Fired after GA and Clarity are on the page (the page-view tracker listens). */
export const ANALYTICS_READY_EVENT = "willow:analytics-ready";
/** Fired to open the cookie banner again (footer "Cookie settings"). */
export const OPEN_SETTINGS_EVENT = "willow:open-cookie-settings";

type Gtag = (...args: unknown[]) => void;
type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    clarity?: Clarity;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

let loaded = false;

export function analyticsLoaded(): boolean {
  return loaded;
}

/** The browser's Global Privacy Control signal is on. */
export function gpcEnabled(): boolean {
  return typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
}

/** The visitor's saved choice, or null if they haven't made one. Private mode etc. → null. */
export function storedConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** What applies right now: the saved choice, else a GPC decline, else no choice yet. */
export function effectiveConsent(): ConsentChoice | null {
  return storedConsent() ?? (gpcEnabled() ? "denied" : null);
}

/** On app start: load analytics only for a visitor who has already accepted. */
export function initAnalytics(): void {
  if (effectiveConsent() === "granted") loadAnalytics();
}

export function setConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Can't remember it (private mode): it still applies to this page view.
  }
  if (choice === "granted") {
    loadAnalytics();
    return;
  }
  if (loaded) {
    try {
      window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      window.clarity?.("consent", false);
    } catch {
      // Clarity not reachable: the cookies below and the reload still stop it.
    }
  }
  clearAnalyticsCookies();
  // The scripts can't be unloaded from a running page; a reload starts clean.
  if (loaded) window.location.reload();
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

function loadAnalytics(): void {
  if (loaded) return;
  loaded = true;

  // Google Analytics: measurement only. Page views are sent by
  // GoogleAnalyticsPageView (send_page_view off, so the first isn't counted twice).
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);

  // Microsoft Clarity (masking is set in the Clarity dashboard: Balanced, so
  // anything typed into a form is masked).
  const clarity: Clarity =
    window.clarity ||
    Object.assign(
      function clarityQueue(...args: unknown[]) {
        (clarity.q = clarity.q || []).push(args);
      },
      { q: [] as unknown[][] },
    );
  window.clarity = clarity;
  addScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });

  window.dispatchEvent(new Event(ANALYTICS_READY_EVENT));
}

function addScript(src: string): void {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** GA's and Clarity's first-party cookies, on this host and the parent domain. */
function clearAnalyticsCookies(): void {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_ga" || n.startsWith("_ga_") || n === "_gid" || n === "_gat" || n === "_clck" || n === "_clsk");
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains = new Set<string>(["", host, parts.length > 2 ? `.${parts.slice(-2).join(".")}` : `.${host}`]);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * A URL safe to send: path only, plus campaign tags (utm_*), never other query
 * parameters. A mailto:/tel: link is sent as just its scheme, never the address.
 */
export function scrubUrl(href: string): string {
  try {
    const u = new URL(href, window.location.origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return u.protocol;
    const keep = new URLSearchParams();
    u.searchParams.forEach((v, k) => {
      if (k.toLowerCase().startsWith("utm_")) keep.set(k, v);
    });
    const q = keep.toString();
    return `${u.origin}${u.pathname}${q ? `?${q}` : ""}`;
  } catch {
    return "";
  }
}
