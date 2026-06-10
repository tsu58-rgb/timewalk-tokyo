"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UKIYOE_SPOTS_URL, parseUkiyoeCsv, type UkiyoeSpot } from "./data";

function matchesSearch(spot: UkiyoeSpot, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const target = [
    spot.series,
    spot.seriesOrder,
    spot.title,
    spot.titleKana,
    spot.artist,
    spot.placeName,
    spot.modernAddress,
    spot.tags,
  ]
    .join(" ")
    .toLowerCase();

  return target.includes(normalizedQuery);
}

export default function UkiyoePage() {
  const [spots, setSpots] = useState<UkiyoeSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState("");

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

  const seriesOptions = useMemo(() => {
    const map = new Map<string, string>();
    spots.forEach((spot) => {
      if (spot.seriesId && spot.series && !map.has(spot.seriesId)) {
        map.set(spot.seriesId, spot.series);
      }
    });
    return Array.from(map.entries()).map(([seriesId, series]) => ({ seriesId, series }));
  }, [spots]);

  const filteredSpots = useMemo(
    () =>
      spots.filter(
        (spot) =>
          (!selectedSeriesId || spot.seriesId === selectedSeriesId) &&
          matchesSearch(spot, query)
      ),
    [spots, selectedSeriesId, query]
  );

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto max-w-7xl">
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

        <section className="mb-5 rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-amber-100" htmlFor="ukiyoe-series">
                シリーズを選択
              </label>
              <select
                id="ukiyoe-series"
                value={selectedSeriesId}
                onChange={(event) => setSelectedSeriesId(event.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white"
              >
                <option value="">すべてのシリーズ</option>
                {seriesOptions.map((option) => (
                  <option key={option.seriesId} value={option.seriesId}>
                    {option.series}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-amber-100" htmlFor="ukiyoe-search">
                浮世絵を検索
              </label>
              <input
                id="ukiyoe-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="作品名・作者・場所・タグで検索"
                className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            表示中：{filteredSpots.length}件 / 全{spots.length}件
          </p>
        </section>

        {loading && <p>読み込み中...</p>}
        {error && <p className="rounded-xl bg-red-900 p-4">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredSpots.map((spot) => (
            <Link
              key={spot.id}
              href={`/ukiyoe/${spot.id}`}
              target="_blank"
              className="rounded-2xl border border-slate-700 bg-slate-900 p-4 hover:border-amber-300"
            >
              {spot.thumbnailUrl && (
                <img
                  src={spot.thumbnailUrl}
                  alt={spot.title}
                  className="mb-3 h-48 w-full rounded-xl bg-black object-contain"
                />
              )}
              <p className="text-xs text-amber-300">{spot.series} #{spot.seriesOrder}</p>
              <h2 className="text-lg font-bold leading-snug">{spot.title}</h2>
              <p className="text-sm text-slate-300">{spot.artist} / {spot.placeName}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
