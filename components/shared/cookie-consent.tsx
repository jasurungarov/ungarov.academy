"use client";

import useTranslate from "@/hooks/use-translate";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleAnalytics from "./google-analytics";

import {
  CONSENT_KEY,
  GA_MEASUREMENT_ID,
  getStoredConsent,
  revokeAnalytics,
  storeConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";

export default function CookieConsent() {
  const t = useTranslate();
  const { lng } = useParams();

  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = getStoredConsent();

    setConsent(saved);
    setOpen(saved === null);
    setMounted(true);

    function handleStorage(event: StorageEvent) {
      if (event.key !== CONSENT_KEY && event.key !== null) {
        return;
      }

      const updated = getStoredConsent();

      if (updated !== "granted") {
        revokeAnalytics();
      }

      setConsent(updated);
      setOpen(updated === null);
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function handleConsent(value: AnalyticsConsent) {
    storeConsent(value);

    if (value === "denied") {
      revokeAnalytics();
    }

    setConsent(value);
    setOpen(false);
  }

  if (!mounted || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <GoogleAnalytics enabled={consent === "granted"} />

      {open ? (
        <section
          aria-label={t("cookieTitle")}
          className="fixed inset-x-0 bottom-0 z-[100] w-full border-t border-emerald-700/20 bg-white/95 shadow-xl backdrop-blur-xl dark:border-emerald-700/30 dark:bg-zinc-950/95">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2.5 px-3 py-2.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Cookie className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                <h2 className="font-space-grotesk text-sm font-semibold">
                  {t("cookieTitle")}
                </h2>
              </div>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {t("cookieDescription")}{" "}
                <Link
                  href={`/${lng}/privacy-policy`}
                  className="font-medium text-emerald-600 underline underline-offset-2 transition-colors hover:text-emerald-700 dark:text-emerald-400">
                  {t("privacyPolicy")}
                </Link>
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 lg:flex lg:w-auto lg:shrink-0">
              <button
                type="button"
                onClick={() => handleConsent("denied")}
                className="whitespace-nowrap rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium transition-colors hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800 lg:min-w-[120px]">
                {t("cookieReject")}
              </button>

              <button
                type="button"
                onClick={() => handleConsent("granted")}
                className="whitespace-nowrap rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-800 lg:min-w-[120px]">
                {t("cookieAccept")}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title={t("cookieSettings")}
          aria-label={t("cookieSettings")}
          className="fixed bottom-3 left-3 z-[90] flex size-9 items-center justify-center rounded-full border bg-white text-emerald-700 shadow-md transition-colors hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-emerald-400 dark:hover:bg-zinc-800">
          <Cookie className="size-4" />
        </button>
      )}
    </>
  );
}
