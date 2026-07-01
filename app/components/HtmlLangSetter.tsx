"use client";

import { useEffect } from "react";

export default function HtmlLangSetter({ lang }: { lang: string }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previous || "ja";
    };
  }, [lang]);

  return null;
}
