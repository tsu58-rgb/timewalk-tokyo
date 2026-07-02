"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_PREFIX = "timewalk-scroll:";

function pageKey(pathname: string, search: string) {
  return `${STORAGE_PREFIX}${pathname}${search}`;
}

function saveCurrentPosition() {
  try {
    sessionStorage.setItem(
      pageKey(window.location.pathname, window.location.search),
      String(window.scrollY)
    );
  } catch {
    // Ignore storage failures such as private browsing restrictions.
  }
}

function isInternalUrl(value: string) {
  try {
    return new URL(value, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

export default function InternalNavigationManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.href;
      if (!href || !isInternalUrl(href)) return;

      saveCurrentPosition();

      if (anchor.target === "_blank") {
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
      }
    };

    const handlePageHide = () => saveCurrentPosition();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveCurrentPosition();
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let stored = 0;
    try {
      stored = Number(sessionStorage.getItem(pageKey(pathname, search)) || "0");
    } catch {
      stored = 0;
    }

    let frame1 = 0;
    let frame2 = 0;
    let timeoutId = 0;

    const restore = () => {
      window.scrollTo({ top: Number.isFinite(stored) ? stored : 0, left: 0, behavior: "auto" });
    };

    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(restore);
    });
    timeoutId = window.setTimeout(restore, 350);

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, search]);

  return null;
}
