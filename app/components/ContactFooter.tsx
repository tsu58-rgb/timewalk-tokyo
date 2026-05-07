"use client";

import { useEffect, useState } from "react";

const FORM_BASE =
  "https://docs.google.com/forms/d/e/1FAIpQLSfF0kvO-NvprjxXR9BCY9mg5n9SbySzD4JkXQbdKKg4vBvh7Q/viewform?usp=pp_url&entry.1139397192=";

export default function ContactFooter() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <footer className="mt-8 text-center text-sm text-slate-400 pb-10">
      <a
        href={`${FORM_BASE}${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-400"
      >
        誤情報の指摘・スポット掲載依頼・お問い合わせ
      </a>
    </footer>
  );
}