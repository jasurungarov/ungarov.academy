export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export const CONSENT_KEY = "ungarov-cookie-consent-v1";

export type AnalyticsConsent = "granted" | "denied";

type AnalyticsWindow = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const DEFAULT_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

let initialized = false;
let active = false;
let lastPage = "";
let previousPage = "";

function getAnalyticsWindow() {
  return window as unknown as AnalyticsWindow;
}

function isProduction() {
  return (
    typeof window !== "undefined" &&
    process.env.NODE_ENV === "production" &&
    window.location.hostname === "ungarovacademy.uz" &&
    /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)
  );
}

function isPublicPage(pathname: string) {
  return (
    /^\/(en|uz|ky|ru|tr)(\/(courses|blogs|instructors|contacts|consulting|agency|privacy-policy|reserved))?\/?$/.test(
      pathname,
    ) ||
    /^\/(en|uz|ky|ru|tr)\/course\/[a-f0-9]{24}\/?$/i.test(pathname) ||
    /^\/(en|uz|ky|ru|tr)\/blogs\/[a-z0-9_-]+\/?$/i.test(pathname)
  );
}

export function getStoredConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(CONSENT_KEY);

    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function storeConsent(consent: AnalyticsConsent) {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Consent remains available for the current session.
  }
}

function setDisabled(disabled: boolean) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) {
    return;
  }

  Reflect.set(window, `ga-disable-${GA_MEASUREMENT_ID}`, disabled);
}

export function pauseAnalytics() {
  setDisabled(true);
  active = false;
  lastPage = "";
}

export function revokeAnalytics() {
  if (typeof window === "undefined") return;

  pauseAnalytics();

  getAnalyticsWindow().gtag?.("consent", "update", DEFAULT_CONSENT);

  // Remove accessible Google Analytics cookies.
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();

    if (name === "_ga" || name.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; Path=/`;

      if (window.location.hostname === "ungarovacademy.uz") {
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=ungarovacademy.uz`;
      }
    }
  });
}

function getReferrer(): string {
  if (previousPage) return previousPage;

  try {
    const referrer = new URL(document.referrer);

    return referrer.origin !== window.location.origin
      ? `${referrer.origin}/`
      : "";
  } catch {
    return "";
  }
}

export function trackPageView(pathname: string) {
  if (!isProduction() || !isPublicPage(pathname)) {
    pauseAnalytics();
    return;
  }

  const pagePath = pathname.replace(/\/+$/, "");

  if (active && lastPage === pagePath) return;

  const analyticsWindow = getAnalyticsWindow();

  const pageData = {
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
    page_title: `Ungarov Academy | ${pagePath}`,
    page_referrer: getReferrer(),
  };

  if (!initialized) {
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];

    analyticsWindow.gtag = function (..._args: unknown[]) {
      analyticsWindow.dataLayer!.push(arguments);
    };

    const gtag = analyticsWindow.gtag;

    gtag("consent", "default", DEFAULT_CONSENT);

    gtag("consent", "update", {
      ...DEFAULT_CONSENT,
      analytics_storage: "granted",
    });

    gtag("js", new Date());

    gtag("set", pageData);

    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    setDisabled(false);

    const script = document.createElement("script");

    script.id = "ungarov-google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    document.head.appendChild(script);

    initialized = true;
  } else {
    analyticsWindow.gtag?.("set", pageData);

    setDisabled(false);

    if (!active) {
      analyticsWindow.gtag?.("consent", "update", {
        ...DEFAULT_CONSENT,
        analytics_storage: "granted",
      });
    }
  }

  active = true;

  analyticsWindow.gtag?.("event", "page_view", {
    ...pageData,
    send_to: GA_MEASUREMENT_ID,
  });

  lastPage = pagePath;
  previousPage = pageData.page_location;
}
