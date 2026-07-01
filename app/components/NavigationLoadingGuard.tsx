"use client";

import { type MouseEvent, type ReactNode, useEffect, useState } from "react";

export default function NavigationLoadingGuard({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reset = () => setLoading(false);
    window.addEventListener("pageshow", reset);
    window.addEventListener("popstate", reset);
    return () => {
      window.removeEventListener("pageshow", reset);
      window.removeEventListener("popstate", reset);
    };
  }, []);

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (loading || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target as HTMLElement;
    const anchor = target.closest("a");
    if (!anchor) return;
    if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;
    setLoading(true);
  }

  return (
    <div onClickCapture={handleClickCapture} aria-busy={loading}>
      {children}
      {loading && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="status"
          aria-live="assertive"
          aria-label="読み込み中"
        >
          <div className="flex min-w-48 flex-col items-center gap-4 border-4 border-black bg-white px-8 py-6 text-black shadow-[8px_8px_0_#ffd83d]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-[#ff4f9a]" />
            <p className="font-black">読み込み中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
