"use client";

import dynamic from "next/dynamic";
import type { CoursePoint } from "../lib/courses";

type BackgroundSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

const CourseRouteMap = dynamic(() => import("./CourseRouteMap"), {
  ssr: false,
  loading: () => <div className="h-[340px] rounded-2xl bg-slate-800 p-4 text-sm text-slate-300">地図を読み込み中です。</div>,
});

export default function CourseRouteMapLoader({
  points,
  allSpots,
}: {
  points: CoursePoint[];
  allSpots: BackgroundSpot[];
}) {
  return <CourseRouteMap points={points} allSpots={allSpots} />;
}
