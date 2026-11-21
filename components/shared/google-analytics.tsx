"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  pauseAnalytics,
  trackAuthEvent,
  trackPageView,
  type AuthAnalyticsEvent,
} from "@/lib/analytics";

interface Props {
  enabled: boolean;
}

export default function GoogleAnalytics({ enabled }: Props) {
  const pathname = usePathname();

  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!enabled || !pathname) {
      pauseAnalytics();
      return;
    }

    // Existing page tracking
    trackPageView(pathname);

    // Wait for Clerk authentication to finish
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const url = new URL(window.location.href);

    const event = url.searchParams.get("auth_event");

    if (event !== "login" && event !== "sign_up") {
      return;
    }

    // Authentication redirects return to the home page
    const isHomePage = /^\/(en|uz|ru|tr|ky)\/?$/.test(pathname);

    if (!isHomePage) {
      return;
    }

    const sent = trackAuthEvent(event as AuthAnalyticsEvent);

    if (!sent) {
      return;
    }

    // Prevent the same event from being sent on refresh
    url.searchParams.delete("auth_event");

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [enabled, pathname, isLoaded, isSignedIn]);

  return null;
}
