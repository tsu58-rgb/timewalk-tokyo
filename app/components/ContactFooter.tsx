"use client";

import { useSyncExternalStore } from "react";

const FORM_BASE =
  "https://docs.google.com/forms/d/e/1FAIpQLSfF0kvO-NvprjxXR9BCY9mg5n9SbySzD4JkXQbdKKg4vBvh7Q/viewform?usp=pp_url&entry.1139397192=";

const DEV_FORM_BASE =
  "https://docs.google.com/forms/d/e/1FAIpQLSdbW8OmzRNzo_1Xd4QdrJZVXmPnClBMpwR5-h-GJKqd8tesUg/viewform?usp=pp_url&entry.1139397192=";

function subscribeToUrlChange() {
  return () => {};
}

function getCurrentUrl() {
  return window.location.href;
}

function getServerUrl() {
  return "";
}

export default function ContactFooter() {
  const url = useSyncExternalStore(subscribeToUrlChange, getCurrentUrl, getServerUrl);
  const encodedUrl = encodeURIComponent(url);

  return (
    <footer className="mt-8 text-center text-sm text-slate-400 pb-10 space-y-3">
      <div>
        <a
          href={`${FORM_BASE}${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-400"
        >
          誤情報の指摘や要望等の問合せはこちら
        </a>
      </div>

      <div>
        <a
          href="https://timewalk.yuru-rekishi-sanpo.com/"
          className="underline text-blue-400"
        >
          TimeWalkについて
        </a>
      </div>

      <div>
        <a href="/games" className="underline text-blue-400">
          ゲーム
        </a>
      </div>

      <div className="mb-6">
        <a href="/kentei" className="underline text-blue-400">
          検定
        </a>
      </div>

      <div>
        <a
          href={`${DEV_FORM_BASE}${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-300 underline"
        >
          開発者用フォーム
        </a>
      </div>
    </footer>
  );
}
