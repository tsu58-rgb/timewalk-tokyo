"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UKIYOE_SPOTS_URL, parseUkiyoeCsv, type UkiyoeSpot } from "./data";

export default function UkiyoePage() {
  const [spots, setSpots] = useState<UkiyoeSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(UKIYOE_SPOTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.text();
      })
      .then((text) => setSpots(parseUkiyoeCsv(text)))
      .catch(() => setError("浮世絵データを取得できませんでした。スプレッドシートの共有または公開設定を確認してください。"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4">
      <div className="mx-auto max-w-5xl">
        <section className="mb-6 rounded-3xl border border-amber-300/40 bg-slate-900 p-6">
          <p className="mb-2 text-sm text-amber-300">TimeWalk 浮世絵</p>
          <h1 className="mb-3 text-3xl font-bold">浮世絵で歩く江戸・東京</h1>
          <p className="text-sm text-slate-300">
            浮世絵に描かれた場所を、現在の地図とあわせて楽しむページです。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-xl bg-amber-300 px-4 py-2 font-bold text-black" href="/ukiyoe/map">
              マップを見る
            </Link>
            <Link className="rounded-xl border border-amber-300 px-4 py-2 font-bold text-amber-100" href="/ukiyoe/game">
              ゲームで遊ぶ
            </Link>
          </div>
        </section>

        {loading && <p>読み込み中...</p>}
        {error && <p className="rounded-xl bg-red-900 p-4">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {spots.map((spot) => (
            <Link key={spot.id} href={`/ukiyoe/${spot.id}`} target="_blank" className="rounded-2xl border border-slate-700 bg-slate-900 p-4 hover:border-amber-300">
              {spot.thumbnailUrl && (
                <img src={spot.thumbnailUrl} alt={spot.title} className="mb-3 max-h-56 w-full object-contain rounded-xl bg-black" />
              )}
              <p className="text-xs text-amber-300">{spot.series} #{spot.seriesOrder}</p>
              <h2 className="text-xl font-bold">{spot.title}</h2>
              <p className="text-sm text-slate-300">{spot.artist} / {spot.placeName}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
