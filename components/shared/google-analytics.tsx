"use client";

import { pauseAnalytics, trackPageView } from "@/lib/analytics";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface Props {
  enabled: boolean;
}

export default function GoogleAnalytics({ enabled }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || !pathname) {
      pauseAnalytics();
      return;
    }

    trackPageView(pathname);
  }, [enabled, pathname]);

  return null;
}
