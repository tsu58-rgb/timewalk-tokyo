"use client";

import dynamic from "next/dynamic";
import type { Spot } from "@/types/timewalk";

const SeichiMap = dynamic(() => import("./SeichiMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] border-4 border-black bg-white p-4 font-black shadow-[6px_6px_0_#111]">
      地図を読み込み中です。
    </div>
  ),
});

export default function SeichiMapLoader({ spots }: { spots: Spot[] }) {
  return <SeichiMap spots={spots} />;
}
