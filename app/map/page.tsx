"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import dynamic from "next/dynamic";

const SpotMap = dynamic(
  () => import("../components/SpotMap"),
  {
    ssr: false,
  }
);

const SPOTS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1242477641&single=true&output=csv";

type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  mode: string;
};

export default function MapPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  
  useEffect(() => {
    fetch(SPOTS_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const data = (parsed.data as any[])
          .map((row: any) => ({
            id: row.id || "",
            name: row.name || "",
            lat: Number(row.lat),
            lng: Number(row.lng),
            status: String(row.status || "").trim(),
            mode: row.mode || "",
          }))

          .filter(
            (s) =>
              s.status.toLowerCase() === "ready" &&
              Number.isFinite(s.lat) &&
              Number.isFinite(s.lng) &&
              !String(s.mode || "").includes("除外")
          );
        setSpots(data);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-white text-2xl font-bold mb-2">
          TimeWalk スポットマップ
        </h1>

        <p className="text-slate-300 text-sm mb-4">
          現在登録されている地点が表示されています。随時拡充していく予定です。
        </p>

        <SpotMap spots={spots} />
      </div>
    </main>
  );
}