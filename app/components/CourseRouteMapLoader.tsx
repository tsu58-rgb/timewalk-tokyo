"use client";

import dynamic from "next/dynamic";
import type { CoursePoint } from "../lib/courses";

const CourseRouteMap = dynamic(() => import("./CourseRouteMap"), {
  ssr: false,
  loading: () => <div className="h-[340px] rounded-2xl bg-slate-800 p-4 text-sm text-slate-300">地図を読み込み中です。</div>,
});

export default function CourseRouteMapLoader({ points }: { points: CoursePoint[] }) {
  return <CourseRouteMap points={points} />;
}
