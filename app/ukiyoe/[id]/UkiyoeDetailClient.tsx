"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UKIYOE_SPOTS_URL, accuracyLabel, parseUkiyoeCsv, splitTags, type UkiyoeSpot } from "../data";

export default function UkiyoeDetailClient({ id }: { id: string }) {
  const [spot, setSpot] = useState<UkiyoeSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetch(UKIYOE_SPOTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.text();
      })
      .then((text) => {
        const data = parseUkiyoeCsv(text);
        setSpot(data.find((item) => item.id === id) || null);
      })
      .catch(() => setError("浮世絵データを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-slate-950 p-4 text-white">読み込み中...</main>;
  }

  if (error) {
    return <main className="min-h-screen bg-slate-950 p-4 text-white">{error}</main>;
  }

  if (!spot) {
    return <main className="min-h-screen bg-slate-950 p-4 text-white">作品が見つかりません。</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-amber-300/30 bg-slate-900 p-5">
        <div className="mb-4 flex flex-wrap gap-3">
          <Link className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-bold text-amber-100" href="/ukiyoe">
            一覧へ
          </Link>
          <Link className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-bold text-amber-100" href="/ukiyoe/map">
            マップへ
          </Link>
          <a className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white" href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`} target="_blank" rel="noreferrer">
            Googleマップで開く
          </a>
        </div>

        <p className="text-sm text-amber-300">{spot.series} #{spot.seriesOrder}</p>
        <h1 className="mb-1 text-3xl font-bold">{spot.title}</h1>
        {spot.titleKana && <p className="mb-3 text-sm text-slate-400">{spot.titleKana}</p>}
        <p className="mb-4 text-sm text-slate-300">{spot.artist} / {spot.year || spot.period}</p>

        {spot.imageUrl && !imageError && (
          <img src={spot.imageUrl} alt={spot.title} onError={() => setImageError(true)} className="mb-5 max-h-[70vh] w-full rounded-2xl bg-black object-contain" />
        )}

        <section className="mb-4 rounded-2xl bg-white p-4 text-black">
          <h2 className="mb-2 font-bold">描かれた場所</h2>
          <p>{spot.placeName} {accuracyLabel(spot.accuracy)}</p>
          {spot.modernAddress && <p className="mt-1 text-sm text-slate-700">現在の目安：{spot.modernAddress}</p>}
        </section>

        {spot.description && (
          <section className="mb-4 rounded-2xl bg-white p-4 text-black">
            <h2 className="mb-2 font-bold">作品・場所の説明</h2>
            <p className="leading-7">{spot.description}</p>
          </section>
        )}

        {spot.highlight && (
          <section className="mb-4 rounded-2xl bg-amber-100 p-4 text-black">
            <h2 className="mb-2 font-bold">浮世絵の見どころ</h2>
            <p className="leading-7">{spot.highlight}</p>
          </section>
        )}

        {spot.modernNote && (
          <section className="mb-4 rounded-2xl bg-slate-800 p-4 text-white">
            <h2 className="mb-2 font-bold">現在の風景との違い</h2>
            <p className="leading-7 text-slate-200">{spot.modernNote}</p>
          </section>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {splitTags(spot.tags).map((tag) => (
            <span key={tag} className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-black">{tag}</span>
          ))}
        </div>

        <section className="rounded-2xl bg-slate-800 p-4 text-xs text-slate-300">
          <h2 className="mb-2 font-bold text-white">出典・利用条件</h2>
          <p>{spot.credit}</p>
          <p>{spot.license}</p>
          {spot.sourceUrl && <a className="mt-2 inline-block text-amber-300 underline" href={spot.sourceUrl} target="_blank" rel="noreferrer">出典ページを開く</a>}
        </section>
      </div>
    </main>
  );
}
