"use client";

import { useState } from "react";

import SeichiMapLoader from "./SeichiMapLoader";
import type { Spot } from "@/types/timewalk";

export default function SeichiMapSection({
  spots,
  lang,
  label,
}: {
  spots: Spot[];
  lang: string;
  label: string;
}) {
  const [resetKey, setResetKey] = useState(0);
  const resetLabel =
    lang === "en"
      ? "Reset view"
      : lang === "zh-CN"
        ? "恢复显示"
        : lang === "zh-TW"
          ? "恢復顯示"
          : lang === "ko"
            ? "표시 초기화"
            : lang === "vn"
              ? "Đặt lại bản đồ"
              : "表示を戻す";

  return (
    <section className="mb-9">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-block border-4 border-black bg-[#ffd83d] px-5 py-2 text-xl font-black shadow-[4px_4px_0_#111]">
          {label}
        </div>
        <button
          type="button"
          onClick={() => setResetKey((value) => value + 1)}
          className="rounded-full border-3 border-black bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {resetLabel}
        </button>
      </div>
      <SeichiMapLoader spots={spots} lang={lang} resetKey={resetKey} />
    </section>
  );
}
